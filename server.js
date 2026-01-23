// server.js
require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

// === SECURITY: require SESSION_SECRET in prod, use default in dev ===
const isProdEnv = process.env.NODE_ENV === "production";
const isLocal = process.env.PUBLIC_BASE_URL.includes("localhost");

if (isProdEnv && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is required in production");

}
// Default secret for development only - DO NOT use in production!
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = "dev_secret_key_CHANGE_THIS_IN_PRODUCTION_12345";
  console.warn(
    "⚠️  Using default SESSION_SECRET - OK for development, NOT for production!"
  );
}
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "CHANGE_ME";
const RECHECK_TTL_MS = 60 * 1000; // 1 мин достаточно
const recheckCache = new Map();

const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const insightsTickCache = new Map(); // key -> rowsByObject
const NOWPAYMENTS_BASE_URL =
  process.env.NOWPAYMENTS_BASE_URL || "https://api.nowpayments.io/v1";
const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

const PRO_PRICE_USD = Number(process.env.PRO_PRICE_USD || 10);
const PRO_PERIOD_DAYS = Number(process.env.PRO_PERIOD_DAYS || 30);

const PAY_CURRENCIES = ["USDTTRC20", "USDTBSC", "BTC"];

const accountTimezoneCache = new Map(); // accountId -> { tz, expiresAt }
const META_CONCURRENCY_LIMIT = 15;
const META_MIN_DELAY_MS = 100;

async function metaValidateToken(accessToken) {
  const token = decryptToken(accessToken) || accessToken;

  try {
    const r = await metaRequest(() =>
      axios.get(`https://graph.facebook.com/${META_API_VERSION}/me`, {
        params: { fields: "id,name", access_token: token },
        timeout: 15000,
      })
    );

    const id = r.data?.id;
    if (id) return { ok: true, fb_user_id: id, name: r.data?.name || null };

    return { ok: false, reason: "META_ERROR", message: "No id in response" };
  } catch (e) {
    const err = e?.response?.data?.error || {};
    const code = err?.code;
    const subcode = err?.error_subcode;

    if (code === 190) {
      return {
        ok: false,
        reason: "TOKEN_INVALID",
        code,
        subcode,
        message: err?.message || "Invalid token",
      };
    }

    return {
      ok: false,
      reason: "META_ERROR",
      code,
      subcode,
      message: err?.message || e.message,
    };
  }
}

let metaActiveRequests = 0;
let lastMetaRequestAt = 0;
const metaQueue = [];

async function metaRequest(fn, opts = {}) {
  const { maxRetries = 5 } = opts;

  if (metaActiveRequests >= META_CONCURRENCY_LIMIT) {
    await new Promise((resolve) => metaQueue.push(resolve));
  }

  metaActiveRequests++;

  try {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const now = Date.now();
      const wait = META_MIN_DELAY_MS - (now - lastMetaRequestAt);
      if (wait > 0) {
        await new Promise((r) => setTimeout(r, wait));
      }

      // ✅ резервируем слот заранее, чтобы параллельные запросы не улетали пачкой

      try {
        lastMetaRequestAt = Date.now();

        const resp = await fn();
        return resp;
      } catch (e) {
        const status = e.response?.status;

        if (status === 429 && attempt < maxRetries) {
          const retryAfter = Number(e.response?.headers?.["retry-after"]) || 2;
          await new Promise((r) => setTimeout(r, retryAfter * 1000));
          continue;
        }

        throw e;
      }
    }

    // Теоретически сюда не дойдём
    throw new Error("metaRequest: exhausted retries");
  } finally {
    metaActiveRequests--;
    if (metaQueue.length) metaQueue.shift()();
  }
}

const axios = require("axios");

const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const ENC_ALGO = "aes-256-cbc";
const ENC_KEY = crypto
  .createHash("sha256")
  .update(process.env.TOKEN_ENCRYPTION_KEY || "dev_token_key")
  .digest(); // 32 bytes
function encryptToken(text) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ENC_ALGO, ENC_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}
function decryptToken(enc) {
  if (!enc || typeof enc !== "string") return null;

  const s = enc.trim();

  // Дешифруем ТОЛЬКО если это реально наш формат ivHex:dataHex
  // (иначе Meta токен с ":" мы ошибочно "ломаем")
  const looksEncrypted = /^[0-9a-f]{32}:[0-9a-f]+$/i.test(s);
  if (!looksEncrypted) return s;

  const [ivHex, dataHex] = s.split(":");
  if (!ivHex || !dataHex) return s;

  try {
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(dataHex, "hex");
    const decipher = crypto.createDecipheriv(ENC_ALGO, ENC_KEY, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString("utf8");
  } catch (e) {
    // fallback: не валим кампании из-за "непонятного" формата
    return s;
  }
}

const db = require("./db");
// ---- SAFETY: reset stuck rules on server start ----
db.run(`
  UPDATE rules
  SET is_running = 0
`);

const app = express();
const mailerTest = makeMailer();
if (mailerTest) {
  mailerTest.transporter.verify((err) => {
    if (err) {
      console.error("❌ SMTP ERROR:", err);
    } else {
      console.log("✅ SMTP READY");
    }
  });
} else {
  console.log("⚠️ SMTP not configured, emails will be logged to console");
}
const PORT = process.env.PORT || 3000;
const META_APP_ID = process.env.META_APP_ID;
const META_APP_SECRET = process.env.META_APP_SECRET;
const META_API_VERSION = process.env.META_API_VERSION || "v24.0";
const META_REDIRECT_URI = process.env.META_REDIRECT_URI;

const SYSTEM_USER_TOKEN = process.env.SYSTEM_USER_TOKEN || null;
app.use((req, res, next) => {
  if (req.originalUrl === "/api/billing/nowpayments/webhook") return next();
  return bodyParser.json()(req, res, next);
});

app.use(bodyParser.urlencoded({ extended: true }));

// как часто тикает шедулер (по умолчанию раз в минуту)
const SCHEDULER_INTERVAL_MS = parseInt(
  process.env.SCHEDULER_INTERVAL_MS || "60000",
  10
);

// ----- middlewares -----
app.use(cookieParser());

function verifyNowpaymentsSig(rawBody, sigHeader) {
  if (!NOWPAYMENTS_IPN_SECRET) return true; // можно сделать strict позже
  if (!sigHeader) return false;
  const h = crypto
    .createHmac("sha512", NOWPAYMENTS_IPN_SECRET)
    .update(rawBody)
    .digest("hex");
  return h === sigHeader;
}

app.post(
  "/api/billing/nowpayments/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const sig = req.header("x-nowpayments-sig");
      const raw = req.body; // Buffer
      const okSig = verifyNowpaymentsSig(raw, sig);

      if (!okSig) {
        return res.status(401).send("bad signature");
      }

      const body = JSON.parse(raw.toString("utf8") || "{}");

      const provider_payment_id = String(body.payment_id || "");
      if (!provider_payment_id) return res.status(400).send("no payment_id");

      const payment_status = String(body.payment_status || "").toLowerCase();
      const txid = body.txid ? String(body.txid) : null;

      // найдём invoice по provider_payment_id
      const inv = await new Promise((resolve) => {
        db.get(
          `SELECT * FROM invoices WHERE provider='nowpayments' AND provider_payment_id=?`,
          [provider_payment_id],
          (err, row) => resolve(row || null)
        );
      });

      if (!inv) return res.status(404).send("invoice not found");

      // сохраняем payment лог (idempotent)
      const now = Date.now();
      await new Promise((resolve) => {
        db.run(
          `INSERT OR IGNORE INTO payments 
     (invoice_id, app_user_id, provider, provider_payment_id, payment_status, pay_currency, price_amount, pay_amount, actually_paid, txid, raw_json, created_at)
     VALUES (?, ?, 'nowpayments', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            inv.id,
            inv.app_user_id,
            provider_payment_id,
            payment_status,
            inv.pay_currency,
            Number(body.price_amount || inv.price_amount || 0),
            Number(body.pay_amount || 0),
            Number(body.actually_paid || body.pay_amount || 0),
            txid,
            JSON.stringify(body),
            now,
          ],
          () => resolve()
        );
      });
      // обновим invoice статус
      await runAsync(
        `UPDATE invoices
         SET payment_status=?, pay_amount_received=?, updated_at=? WHERE id=?`,
        [
          payment_status,
          Number(body.actually_paid || body.pay_amount || 0),
          now,
          inv.id,
        ]
      );

      // Если paid/finished/confirmed — активируем PRO
      if (
        payment_status === "finished" ||
        payment_status === "confirmed" ||
        payment_status === "paid"
      ) {
        const proEndsAt = now + PRO_PERIOD_DAYS * 24 * 60 * 60 * 1000;

        await runAsync(
          `UPDATE app_users
           SET plan='pro',
               pro_ends_at=?,
               updated_at=?
           WHERE id=?`,
          [proEndsAt, now, inv.app_user_id]
        );

        await runAsync(
          `UPDATE invoices SET paid_at=?, updated_at=? WHERE id=?`,
          [now, now, inv.id]
        );
      }

      return res.status(200).send("ok");
    } catch (e) {
      console.error("[NOWPAY] webhook error", e);
      return res.status(500).send("error");
    }
  }
);
const isProd = process.env.NODE_ENV === "production";

app.set("trust proxy", 1);
app.use(
  session({
    name: "rulez.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd && !isLocal, // ❌ only secure in real prod (HTTPS)
      sameSite: isProd && !isLocal ? "none" : "lax", // ❌ none in prod, lax locally
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  })
);
app.get("/admin", (req, res) => {
  // просто отдаём файл, доступ контролируем API логином
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin === 1) return next();
  return res.status(401).json({ error: "ADMIN_NOT_AUTH" });
}

app.post("/api/admin/login", (req, res) => {
  const login = String(req.body?.login || "");
  const pass = String(req.body?.pass || "");
  console.log("[ADMIN LOGIN] body=", req.body);
  console.log(
    "[ADMIN LOGIN] login=",
    JSON.stringify(login),
    "pass=",
    JSON.stringify(pass)
  );
  console.log(
    "[ADMIN LOGIN] envLogin=",
    JSON.stringify(ADMIN_LOGIN),
    "envPass=",
    JSON.stringify(ADMIN_PASS)
  );

  if (login === ADMIN_LOGIN && pass === ADMIN_PASS) {
    req.session.isAdmin = 1;
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false });
});

let __adminCreaSyncRunning = false;

async function adminCreaSetState(patch) {
  const cur = await getAsync(`SELECT * FROM admin_sync_state WHERE id=1`, []);
  const next = { ...(cur || {}), ...(patch || {}) };
  await runAsync(
    `UPDATE admin_sync_state SET status=?, last_sync_at=?, progress_total=?, progress_done=?, last_error=? WHERE id=1`,
    [
      next.status,
      next.last_sync_at,
      next.progress_total,
      next.progress_done,
      next.last_error,
    ]
  );
}

async function adminGetAllConnAccounts() {
  // берем то, что уже есть в твоей БД, без опроса Meta
  const rows = await allAsync(`
    SELECT
      fc.id AS conn_id,
      fc.access_token AS access_token,
      aua.ad_account_id AS ad_account_id
    FROM fb_connections fc
    JOIN app_user_ad_accounts aua ON aua.app_user_id = fc.app_user_id
    WHERE fc.status='active'
  `);
  // сгруппировать по conn_id
  const byConn = new Map();
  for (const r of rows || []) {
    const cid = r.conn_id;
    if (!byConn.has(cid))
      byConn.set(cid, {
        conn_id: cid,
        access_token: r.access_token,
        accounts: [],
      });
    const obj = byConn.get(cid);
    if (r.ad_account_id && !obj.accounts.includes(r.ad_account_id))
      obj.accounts.push(r.ad_account_id);
  }
  return Array.from(byConn.values());
}

async function adminSyncCreatives({ since, until }) {
  if (__adminCreaSyncRunning) return;
  __adminCreaSyncRunning = true;

  try {
    await adminCreaSetState({
      status: "running",
      last_sync_at: Date.now(),
      progress_total: 0,
      progress_done: 0,
      last_error: "",
    });

    const conns = await adminGetAllConnAccounts();
    const total = conns.reduce((sum, c) => sum + (c.accounts?.length || 0), 0);
    await adminCreaSetState({ progress_total: total, progress_done: 0 });
    // IMPORTANT: чтобы метрики не раздувались при повторном sync
    await runAsync(
      `DELETE FROM admin_creative_stats_daily WHERE day BETWEEN ? AND ?`,
      [since, until]
    );

    let done = 0;

    // concurrency = 1 (самый безопасный)
    for (const c of conns) {
      const accessToken = decryptToken(c.access_token);
      if (!accessToken) {
        done += c.accounts?.length || 0;
        await adminCreaSetState({ progress_done: done });
        continue;
      }

      const cards = await buildAdminCardsAssetLink({
        accessToken,
        accountIds: c.accounts || [],
        since,
        until,
      });

      // сохранить в БД: admin_creatives + daily stats
      for (const card of cards) {
        const now = Date.now();
        const type =
          card.asset_type === "video"
            ? "video"
            : card.asset_type === "image"
            ? "image"
            : "unknown";

        await runAsync(
          `INSERT OR IGNORE INTO admin_creatives(
     asset_key, link_url, type,
     media_url, media_url_full,
     thumb_url, created_at,
     video_id, src_conn_id
   )
   VALUES(?,?,?,?,?,?,?,?,?)`,
          [
            card.asset_key,
            card.link_url,
            type,
            card.media_url || "",
            card.media_url_full || "",
            card.thumbnail_url || "",
            now,
            card._video_id || "",
            Number(c.conn_id || 0),
          ]
        );

        // обновим media/thumb если появилось
        await runAsync(
          `UPDATE admin_creatives
   SET media_url=?,
       media_url_full=?,
       thumb_url=?,
       type=?,
       video_id=?,
       src_conn_id=?
   WHERE asset_key=? AND link_url=?`,
          [
            card.media_url || "",
            card.media_url_full || "",
            card.thumbnail_url || "",
            type,
            card._video_id || "",
            Number(c.conn_id || 0),
            card.asset_key,
            card.link_url,
          ]
        );

        const daily = card.daily || {};
        for (const day of Object.keys(daily)) {
          const m = daily[day] || {};
          await runAsync(
            `INSERT INTO admin_creative_stats_daily(day, asset_key, link_url, spend, impressions, unique_clicks, leads, registrations, purchases, app_purchases)
             VALUES(?,?,?,?,?,?,?,?,?,?)
             ON CONFLICT(day, asset_key, link_url) DO UPDATE SET
               spend = spend + excluded.spend,
               impressions = impressions + excluded.impressions,
               unique_clicks = unique_clicks + excluded.unique_clicks,
               leads = leads + excluded.leads,
               registrations = registrations + excluded.registrations,
               purchases = purchases + excluded.purchases,
               app_purchases = app_purchases + excluded.app_purchases
            `,
            [
              day,
              card.asset_key,
              card.link_url,
              Number(m.spend || 0),
              Number(m.impressions || 0),
              Number(m.unique_clicks || 0),
              Number(m.leads || 0),
              Number(m.registrations || 0),
              Number(m.purchases || 0),
              Number(m.app_purchases || 0),
            ]
          );
        }
      }

      done += c.accounts?.length || 0;
      await adminCreaSetState({ progress_done: done });
    }

    await adminCreaSetState({ status: "idle", last_sync_at: Date.now() });
  } catch (e) {
    await adminCreaSetState({
      status: "error",
      last_error: String(e?.message || e),
    });
    console.error("[ADMIN CREA SYNC] error", e);
  } finally {
    __adminCreaSyncRunning = false;
  }
}

// старт синка (последние N дней)
app.post("/api/admin/creatives/sync_start", requireAdmin, async (req, res) => {
  const days = Math.max(1, Math.min(60, parseInt(req.body?.days || "14", 10)));
  const until = new Date();
  const since = new Date(Date.now() - days * 86400000);

  const fmt = (d) => d.toISOString().slice(0, 10);
  const sinceStr = fmt(since);
  const untilStr = fmt(until);

  // запустить в фоне
  adminSyncCreatives({ since: sinceStr, until: untilStr });
  return res.json({ ok: true, since: sinceStr, until: untilStr, days });
});

app.get("/api/admin/creatives/sync_status", requireAdmin, async (req, res) => {
  const st = await getAsync(`SELECT * FROM admin_sync_state WHERE id=1`, []);
  return res.json({ ok: true, state: st || {} });
});

// поиск карточек по датам + фильтрам
app.get("/api/admin/creatives/search", requireAdmin, async (req, res) => {
  try {
    const from = safeStr(req.query.from); // YYYY-MM-DD
    const to = safeStr(req.query.to);
    const minSpend = Number(req.query.min_spend || 0);
    const minPurch = Number(req.query.min_purchases || 0);
    const minAppPurch = Number(req.query.min_app_purchases || 0);
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.max(
      12,
      Math.min(500, parseInt(req.query.limit || "48", 10))
    );

    const offset = (page - 1) * limit;

    const rows = await allAsync(
      `
SELECT
  c.asset_key, c.link_url, c.type,
  c.media_url, c.media_url_full, c.thumb_url,
  c.video_id, c.src_conn_id,

        SUM(s.spend) AS spend,
        SUM(s.impressions) AS impressions,
        SUM(s.unique_clicks) AS unique_clicks,
        SUM(s.leads) AS leads,
        SUM(s.registrations) AS registrations,
        SUM(s.purchases) AS purchases,
        SUM(s.app_purchases) AS app_purchases
      FROM admin_creatives c
      JOIN admin_creative_stats_daily s
        ON s.asset_key=c.asset_key AND s.link_url=c.link_url
      WHERE s.day BETWEEN ? AND ?
      GROUP BY c.asset_key, c.link_url
      HAVING
        SUM(s.spend) >= ?
        AND SUM(s.purchases) >= ?
        AND SUM(s.app_purchases) >= ?
      ORDER BY spend DESC
      LIMIT ? OFFSET ?
      `,
      [from, to, minSpend, minPurch, minAppPurch, limit, offset]
    );

    const items = (rows || []).map((r) => {
      const base = {
        spend: Number(r.spend || 0),
        impressions: Number(r.impressions || 0),
        unique_clicks: Number(r.unique_clicks || 0),
        leads: Number(r.leads || 0),
        registrations: Number(r.registrations || 0),
        purchases: Number(r.purchases || 0),
        app_purchases: Number(r.app_purchases || 0),
      };
      return {
        asset_key: r.asset_key,
        media_url_full: r.media_url_full,
        link_url: r.link_url,
        type: r.type,
        media_url: r.media_url,
        thumb_url: r.thumb_url,
        metrics: { ...base, ...calcDerived(base) },
      };
    });
    // refresh video source (Meta video source is временный)
    for (const it of items) {
      if (it.type !== "video") continue;
      if (!it.video_id || !it.src_conn_id) continue;

      try {
        const row = await getAsync(
          `SELECT access_token FROM fb_connections WHERE id=?`,
          [it.src_conn_id]
        );
        const accessToken = decryptToken(row?.access_token || "");
        if (!accessToken) continue;

        const vmeta = await fetchVideoMeta(it.video_id, accessToken);
        if (vmeta?.source) {
          it.media_url_full = vmeta.source;
          it.media_url = vmeta.source;
        }
        if (vmeta?.thumb && !it.thumb_url) it.thumb_url = vmeta.thumb;
      } catch (e) {
        // молча пропускаем — пусть хотя бы постер будет
      }
    }
    return res.json({ ok: true, items, page, limit });
  } catch (e) {
    console.error("[ADMIN CREA SEARCH] error", e);
    return res
      .status(500)
      .json({ ok: false, error: "ADMIN_CREA_SEARCH_FAILED" });
  }
});

app.post("/api/admin/logout", (req, res) => {
  try {
    req.session.isAdmin = 0;
  } catch (e) {}
  res.json({ ok: true });
});

app.get("/api/admin/overview", requireAdmin, async (req, res) => {
  try {
    // dates: YYYY-MM-DD
    const from = String(req.query.from || "");
    const to = String(req.query.to || "");

    const fromMs = from ? Date.parse(from + "T00:00:00Z") : 0;
    const toMs = to ? Date.parse(to + "T23:59:59Z") : Date.now();

    const users = await allAsync(
      `
  SELECT
    u.email,
    u.plan,
    u.created_at,
    u.trial_started_at,
    (
      SELECT MIN(i.paid_at)
      FROM invoices i
      WHERE i.app_user_id = u.id
        AND i.payment_status = 'finished'
        AND i.paid_at IS NOT NULL
    ) AS pro_activated_at
  FROM app_users u
  WHERE
    (u.created_at BETWEEN ? AND ?)
    OR (u.trial_started_at BETWEEN ? AND ?)
    OR (
      (
        SELECT MIN(i2.paid_at)
        FROM invoices i2
        WHERE i2.app_user_id = u.id
          AND i2.payment_status = 'finished'
          AND i2.paid_at IS NOT NULL
      ) BETWEEN ? AND ?
    )
  ORDER BY u.created_at DESC
  LIMIT 2000
`,
      [fromMs, toMs, fromMs, toMs, fromMs, toMs]
    );

    const signups = await getAsync(
      `SELECT COUNT(*) as c FROM app_users WHERE created_at BETWEEN ? AND ?`,
      [fromMs, toMs]
    );

    const trials = await getAsync(
      `SELECT COUNT(*) as c FROM app_users WHERE trial_started_at BETWEEN ? AND ?`,
      [fromMs, toMs]
    );

    const pros = await getAsync(
      `SELECT COUNT(*) as c FROM invoices WHERE payment_status='finished' AND paid_at BETWEEN ? AND ?`,
      [fromMs, toMs]
    );

    const uniqVisits = await getAsync(
      `SELECT COUNT(DISTINCT anon_id) as c FROM site_events WHERE event='visit' AND created_at BETWEEN ? AND ?`,
      [fromMs, toMs]
    );

    res.json({
      ok: true,
      totals: {
        signups: signups?.c || 0,
        trials: trials?.c || 0,
        pros: pros?.c || 0,
        unique_visits: uniqVisits?.c || 0,
      },
      users,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: "ADMIN_OVERVIEW_FAILED" });
  }
});
// ---------- API: public site tracking ----------
app.post("/api/public/track", async (req, res) => {
  try {
    const event = String(req.body?.event || "").toLowerCase();
    const anon_id = String(req.body?.anon_id || "");

    if (!anon_id || anon_id.length < 8) return res.json({ ok: false });
    if (event !== "visit" && event !== "click") return res.json({ ok: false });

    const now = Date.now();
    const ip = (
      req.headers["x-forwarded-for"] ||
      req.socket?.remoteAddress ||
      ""
    )
      .toString()
      .slice(0, 200);
    const ua = (req.headers["user-agent"] || "").toString().slice(0, 300);

    await runAsync(
      `INSERT INTO site_events(event, anon_id, ip, ua, created_at) VALUES(?,?,?,?,?)`,
      [event, anon_id, ip, ua, now]
    );

    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false });
  }
});

// ===== Force plan selection for trial_pending =====
app.use("/api", async (req, res, next) => {
  try {
    // если нет SaaS-сессии — не мешаем: auth endpoints сами вернут 401 где нужно
    const appUserId = req.session?.appUserId;
    if (!appUserId) return next();

    // эти маршруты должны быть доступны, чтобы юзер мог выбрать тариф / оплатить / посмотреть свой план
    const p = req.path || "";
    const allow =
      p.startsWith("/auth/") ||
      p === "/app/me" ||
      p === "/app/select-plan" ||
      p === "/app/start-trial" ||
      p.startsWith("/billing/");

    if (allow) return next();

    const u = await getAppUserById(appUserId);
    if (u && u.plan === "trial_pending") {
      return res.status(402).json({
        error: "PLAN_SELECT_REQUIRED",
        code: "PLAN_SELECT_REQUIRED",
      });
    }

    return next();
  } catch (e) {
    return next();
  }
});

// статика
app.use(express.static(path.join(__dirname, "public"), { index: false }));

// ---------- helpers (DB) ----------
function safeStr(v) {
  return typeof v === "string" ? v : "";
}

function extractLinkFromCreative(cr) {
  if (!cr) return "";
  const oss = cr.object_story_spec || {};
  const link1 = safeStr(oss?.link_data?.link);
  if (link1) return link1;

  const link2 = safeStr(oss?.video_data?.call_to_action?.value?.link);
  if (link2) return link2;

  const link3 = safeStr(oss?.template_data?.link);
  if (link3) return link3;

  const afs = cr.asset_feed_spec || {};
  const link4 = safeStr(afs?.link_urls?.[0]?.website_url);
  if (link4) return link4;

  return "";
}

function normLink(link) {
  const s = safeStr(link).trim();
  return s || "(no_link)";
}

function calcDerived(m) {
  const spend = Number(m.spend || 0);
  const impressions = Number(m.impressions || 0);
  const uniq = Number(m.unique_clicks || 0);
  const leads = Number(m.leads || 0);
  const regs = Number(m.registrations || 0);
  const purchases = Number(m.purchases || 0);
  const appPurch = Number(m.app_purchases || 0);

  return {
    ucpc: uniq > 0 ? spend / uniq : 0,
    cpl: leads > 0 ? spend / leads : 0,
    cpr: regs > 0 ? spend / regs : 0,
    cpa: purchases > 0 ? spend / purchases : 0,
    cap: appPurch > 0 ? spend / appPurch : 0,
    ctr: impressions > 0 ? (uniq / impressions) * 100 : 0,
    leads_per_purchase: purchases > 0 ? leads / purchases : 0,
  };
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

app.get("/paywall.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "paywall.html"));
});

async function pauseAllRulesForAppUser(appUserId) {
  // ставим paused всем правилам, которые не paused
  await runAsync(
    `UPDATE rules
     SET status='paused'
     WHERE app_user_id=? AND status!='paused'`,
    [appUserId]
  );
}

// ===== SaaS helpers (email auth) =====
function normEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function nowMs() {
  return Date.now();
}

function genCode6() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function getAppUserByEmail(email) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM app_users WHERE email = ?",
      [normEmail(email)],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

function getAppUserById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM app_users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function makeMailer() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM || user;

  if (!host || !user || !pass) return null;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  return { transporter, from };
}

async function sendEmail(to, subject, text) {
  const mailer = makeMailer();
  if (!mailer) {
    console.log("[EMAIL STUB]", { to, subject, text });
    return;
  }
  await mailer.transporter.sendMail({
    from: mailer.from,
    to,
    subject,
    text,
  });
}
async function ensureTrialActivated(appUserId) {
  const u = await getAppUserById(appUserId);
  if (!u) return null;

  // если уже активирован — ничего не делаем
  if (u.trial_started_at && u.trial_ends_at) return u;

  // если уже был trial и закончился — не активируем снова
  if (u.trial_used) return u;

  const t = nowMs();
  const ends = t + 5 * 24 * 60 * 60 * 1000; // +5 дней

  await runAsync(
    `UPDATE app_users
     SET plan = 'trial',
         trial_used = 1,
         trial_started_at = ?,
         trial_ends_at = ?,
         updated_at = ?
     WHERE id = ?`,
    [t, ends, t, appUserId]
  );

  return await getAppUserById(appUserId);
}

function isExpiredTrial(u) {
  if (!u) return true;
  if (u.plan === "paid") return false;
  if (u.plan !== "trial") return u.plan === "expired";
  if (!u.trial_ends_at) return false;
  return nowMs() > u.trial_ends_at;
}

async function requirePlanAccess(req, res, next) {
  if (!req.session?.appUserId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const u = await getAppUserById(req.session.appUserId);
  if (!u) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const now = Date.now();

  // auto-expire TRIAL
  if (u.plan === "trial" && u.trial_ends_at && now > u.trial_ends_at) {
    await runAsync(
      `UPDATE app_users SET plan='expired', updated_at=? WHERE id=?`,
      [now, u.id]
    );
    u.plan = "expired";
  }

  // auto-expire PRO
  if (u.plan === "pro" && u.pro_ends_at && now > u.pro_ends_at) {
    await runAsync(
      `UPDATE app_users SET plan='expired', updated_at=? WHERE id=?`,
      [now, u.id]
    );
    u.plan = "expired";
  }

  // ❗ ВАЖНО:
  // expired ЗДЕСЬ НЕ БЛОКИРУЕМ
  // блокировка — только в конкретных API (rules / creatives / etc)
  req.appUser = u;

  next();
}

function requireAppAuth(req, res, next) {
  if (req.session && req.session.appUserId) {
    return next();
  }
  return res.status(401).json({ error: "Not authenticated" });
}

// ===== SaaS Auth API =====

// register -> create app_user + send verify code
app.post("/api/auth/register", async (req, res) => {
  const email = normEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!email || !email.includes("@"))
    return res.status(400).json({ error: "Bad email" });

  if (password.length < 8)
    return res.status(400).json({ error: "Password min 8 chars" });

  const existing = await getAppUserByEmail(email);
  if (existing)
    return res.status(400).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const t = nowMs();

  const ins = await runAsync(
    `INSERT INTO app_users (email, password_hash, plan, trial_used, created_at, updated_at)
     VALUES (?, ?, 'trial_pending', 0, ?, ?)`,
    [email, hash, t, t]
  );

  const code = genCode6();
  const expires = t + 30 * 60 * 1000;

  await runAsync(
    `INSERT INTO email_verifications (user_id, code, expires_at, used_at, created_at)
     VALUES (?, ?, ?, NULL, ?)`,
    [ins.lastID, code, expires, t]
  );

  await sendEmail(
    email,
    "Rulez.vip — код подтверждения",
    `Ваш код: ${code}\nДействует 30 минут.`
  );

  res.json({ ok: true, message: "Код отправлен на почту" });
});

app.post("/api/app/start-trial", requireAppAuth, async (req, res) => {
  const u = await ensureTrialActivated(req.session.appUserId);
  if (!u) return res.status(401).json({ error: "Not authenticated" });

  if (u.plan === "expired")
    return res.status(402).json({ error: "Plan expired" });

  res.json({
    ok: true,
    plan: u.plan,
    trial_started_at: u.trial_started_at,
    trial_ends_at: u.trial_ends_at,
  });
});

app.post("/api/app/select-plan", requireAppAuth, async (req, res) => {
  const { plan } = req.body;
  const appUserId = req.session.appUserId;

  if (!["trial", "pro"].includes(plan)) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  if (plan === "trial") {
    const u = await ensureTrialActivated(appUserId);

    if (u.plan === "expired") {
      return res.status(402).json({ error: "Trial already used" });
    }

    return res.json({
      ok: true,
      plan: u.plan,
      trial_started_at: u.trial_started_at,
      trial_ends_at: u.trial_ends_at,
    });
  }

  // === PRO ===
  return res.json({ ok: true, open_payment: true });
});

// ===== Billing: get invoice status (for polling) =====
app.get("/api/billing/invoice/:id", requireAppAuth, async (req, res) => {
  const appUserId = req.session.appUserId;
  const id = Number(req.params.id);

  if (!Number.isFinite(id))
    return res.status(400).json({ error: "Bad invoice id" });

  const inv = await new Promise((resolve) => {
    db.get(
      `SELECT id, app_user_id, plan, price_amount, price_currency, pay_currency,
              provider, provider_payment_id, pay_address, pay_amount, pay_amount_received,
              payment_status, invoice_url, expires_at, created_at, updated_at, paid_at
       FROM invoices
       WHERE id = ? AND app_user_id = ?`,
      [id, appUserId],
      (err, row) => resolve(row || null)
    );
  });

  if (!inv) return res.status(404).json({ error: "Invoice not found" });

  res.json({ ok: true, invoice: inv });
});

app.post(
  "/api/billing/create_pro_invoice",
  requireAppAuth,
  async (req, res) => {
    const appUserId = req.session.appUserId;
    const u = await getAppUserById(appUserId);
    if (!u) return res.status(401).json({ error: "Not authenticated" });

    const pay_currency = String(req.body?.pay_currency || "")
      .trim()
      .toUpperCase();
    if (!PAY_CURRENCIES.includes(pay_currency)) {
      return res.status(400).json({ error: "Invalid pay_currency" });
    }

    if (!NOWPAYMENTS_API_KEY) {
      return res.status(500).json({ error: "NOWPAYMENTS_API_KEY missing" });
    }

    const now = Date.now();
    const expiresAt = now + 3 * 60 * 60 * 1000; // 3 hours

    // 1) создаём invoice в БД (pending)
    const inv = await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO invoices
       (app_user_id, plan, price_amount, price_currency, pay_currency, provider, payment_status, expires_at, created_at, updated_at)
       VALUES (?, 'pro', ?, 'usd', ?, 'nowpayments', 'pending', ?, ?, ?)`,
        [appUserId, PRO_PRICE_USD, pay_currency, expiresAt, now, now],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });

    // 2) создаём payment у NOWPayments
    // NOTE: названия полей NOWPayments могут отличаться — но базовая идея такая:
    // price_amount: USD amount, price_currency: 'usd', pay_currency: выбранная крипта
    const payload = {
      price_amount: PRO_PRICE_USD,
      price_currency: "usd",
      pay_currency,
      order_id: `inv_${inv.id}`,
      order_description: `Rulez PRO ${PRO_PERIOD_DAYS} days`,
      ipn_callback_url: `${
        process.env.PUBLIC_BASE_URL || "https://rulez.vip"
      }/api/billing/nowpayments/webhook`,
      success_url: `${process.env.PUBLIC_BASE_URL || "https://rulez.vip"}/app`,
      cancel_url: `${process.env.PUBLIC_BASE_URL || "https://rulez.vip"}/app`,
    };

    let r;
    try {
      r = await axios.post(`${NOWPAYMENTS_BASE_URL}/payment`, payload, {
        headers: {
          "x-api-key": NOWPAYMENTS_API_KEY,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error(
        "[NOWPAY] create payment failed",
        e.response?.data || e.message
      );
      return res.status(500).json({ error: "Failed to create payment" });
    }

    const p = r.data || {};

    // 3) сохраняем provider поля в invoice
    await runAsync(
      `UPDATE invoices
     SET provider_payment_id=?, pay_address=?, pay_amount=?, updated_at=?
     WHERE id=?`,
      [
        String(p.payment_id || ""),
        String(p.pay_address || ""),
        Number(p.pay_amount || 0),
        Date.now(),
        inv.id,
      ]
    );

    res.json({
      ok: true,
      invoice: {
        id: inv.id,
        pay_currency,
        price_amount: PRO_PRICE_USD,
        pay_address: p.pay_address,
        pay_amount: p.pay_amount,
        expires_at: expiresAt,
        provider_payment_id: p.payment_id,
      },
    });
  }
);

// verify email by code
app.post("/api/auth/verify", async (req, res) => {
  const email = normEmail(req.body?.email);
  const code = String(req.body?.code || "").trim();
  if (!email || !code)
    return res.status(400).json({ error: "Missing email/code" });

  const user = await getAppUserByEmail(email);
  if (!user) return res.status(404).json({ error: "User not found" });

  const row = await getAsync(
    `SELECT * FROM email_verifications
     WHERE user_id = ? AND code = ? AND used_at IS NULL
     ORDER BY id DESC LIMIT 1`,
    [user.id, code]
  );

  if (!row) return res.status(400).json({ error: "Bad code" });
  if (nowMs() > row.expires_at)
    return res.status(400).json({ error: "Code expired" });

  const t = nowMs();
  await runAsync(`UPDATE email_verifications SET used_at = ? WHERE id = ?`, [
    t,
    row.id,
  ]);
  await runAsync(
    `UPDATE app_users SET email_verified_at = COALESCE(email_verified_at, ?), updated_at = ? WHERE id = ?`,
    [t, t, user.id]
  );

  res.json({ ok: true, message: "Email подтвержден. Теперь можно войти." });
});

// login
app.post("/api/auth/login", async (req, res) => {
  const email = normEmail(req.body?.email);
  const password = String(req.body?.password || "");
  if (!email || !password)
    return res.status(400).json({ error: "Missing email/password" });

  const user = await getAppUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  if (!user.email_verified_at)
    return res.status(403).json({ error: "Email not verified" });

  const ok = await bcrypt.compare(password, user.password_hash || "");
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  req.session.appUserId = user.id;

  req.session.save(() => {
    res.json({ ok: true, message: "OK" });
  });
});
// logout
app.post("/api/auth/logout", (req, res) => {
  delete req.session.appUserId;
  res.json({ ok: true });
});

// reset request
app.post("/api/auth/reset/request", async (req, res) => {
  const email = normEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: "Missing email" });

  const user = await getAppUserByEmail(email);
  // не палим существование
  if (!user)
    return res.json({
      ok: true,
      message: "Если email существует — код отправлен.",
    });

  const code = genCode6();
  const t = nowMs();
  const expires = t + 30 * 60 * 1000;

  await runAsync(
    `INSERT INTO password_resets (user_id, code, expires_at, used_at, created_at)
     VALUES (?, ?, ?, NULL, ?)`,
    [user.id, code, expires, t]
  );

  await sendEmail(
    email,
    "Rulez.vip — восстановление пароля",
    `Код: ${code}\nДействует 30 минут.`
  );
  res.json({ ok: true, message: "Если email существует — код отправлен." });
});

// reset confirm
app.post("/api/auth/reset/confirm", async (req, res) => {
  const email = normEmail(req.body?.email);
  const code = String(req.body?.code || "").trim();
  const newPass = String(req.body?.new_password || "");
  if (!email || !code || newPass.length < 8)
    return res.status(400).json({ error: "Bad request" });

  const user = await getAppUserByEmail(email);
  if (!user) return res.status(400).json({ error: "Bad code" });

  const row = await getAsync(
    `SELECT * FROM password_resets
     WHERE user_id = ? AND code = ? AND used_at IS NULL
     ORDER BY id DESC LIMIT 1`,
    [user.id, code]
  );
  if (!row) return res.status(400).json({ error: "Bad code" });
  if (nowMs() > row.expires_at)
    return res.status(400).json({ error: "Code expired" });

  const hash = await bcrypt.hash(newPass, 10);
  const t = nowMs();

  await runAsync(`UPDATE password_resets SET used_at = ? WHERE id = ?`, [
    t,
    row.id,
  ]);
  await runAsync(
    `UPDATE app_users SET password_hash = ?, updated_at = ? WHERE id = ?`,
    [hash, t, user.id]
  );

  res.json({ ok: true, message: "Пароль обновлен." });
});

// SaaS me
// SaaS me
app.get("/api/app/me", requireAppAuth, async (req, res) => {
  let u = await getAppUserById(req.session.appUserId);
  if (!u) return res.status(401).json({ error: "Not authenticated" });

  const now = nowMs();

  // === auto-expire TRIAL ===
  if (u.plan === "trial" && u.trial_ends_at && now > u.trial_ends_at) {
    await runAsync(
      `UPDATE app_users SET plan='expired', updated_at=? WHERE id=?`,
      [now, u.id]
    );
    u = await getAppUserById(u.id);
  }

  // === auto-expire PRO ===
  if (u.plan === "pro" && u.pro_ends_at && now > u.pro_ends_at) {
    await runAsync(
      `UPDATE app_users SET plan='expired', updated_at=? WHERE id=?`,
      [now, u.id]
    );
    u = await getAppUserById(u.id);
  }

  const isTrial = u.plan === "trial" || u.plan === "trial_pending";
  const isPro = u.plan === "pro";

  const expired =
    u.plan === "expired" ||
    (isTrial && u.trial_ends_at && now > u.trial_ends_at) ||
    (isPro && u.pro_ends_at && now > u.pro_ends_at);
  // === auto-pause all rules on EXPIRED ===
  if (expired) {
    try {
      await pauseAllRulesForAppUser(u.id);
    } catch (e) {
      console.error("[EXPIRED] pauseAllRulesForAppUser failed", e);
    }
  }
  const limits = expired
    ? { max_connections: 0, max_ad_accounts: 0 }
    : isTrial
    ? { max_connections: 2, max_ad_accounts: 6 }
    : isPro
    ? { max_connections: 5, max_ad_accounts: 50 }
    : { max_connections: 0, max_ad_accounts: 0 };

  const DAY = 24 * 60 * 60 * 1000;
  let daysLeft = null;

  if (u.plan === "trial" && u.trial_ends_at) {
    daysLeft = Math.max(0, Math.ceil((u.trial_ends_at - now) / DAY));
  }

  if (u.plan === "pro" && u.pro_ends_at) {
    daysLeft = Math.max(0, Math.ceil((u.pro_ends_at - now) / DAY));
  }

  const usage = await new Promise((resolve) => {
    db.get(
      `SELECT
         (SELECT COUNT(*) FROM fb_connections WHERE app_user_id=? AND status='active') AS active_connections,
         (SELECT COUNT(*) FROM app_user_ad_accounts WHERE app_user_id=?) AS linked_ad_accounts`,
      [u.id, u.id],
      (err, row) =>
        resolve(row || { active_connections: 0, linked_ad_accounts: 0 })
    );
  });

  return res.json({
    id: u.id,
    email: u.email,
    plan: expired ? "expired" : u.plan,

    trial_started_at: u.trial_started_at,
    trial_ends_at: u.trial_ends_at,
    pro_ends_at: u.pro_ends_at,

    trial_used: !!u.trial_used,
    email_verified_at: u.email_verified_at,

    daysLeft,
    expired,

    limits,
    usage,
  });
});

// redirect alias
app.get("/api/me", requireAppAuth, (req, res) => {
  return res.redirect(307, "/api/app/me");
});

async function createFbConnectionWithLimits({
  appUserId,
  fbUser,
  accessToken,
  appUserPlan,
}) {
  // === ANTIFRAUD: farm reuse only for PRO ===
  const prev = await getAsync(
    `SELECT app_user_id FROM fb_connections WHERE fb_user_id = ?`,
    [fbUser.id]
  );

  if (prev && prev.app_user_id !== appUserId) {
    if (appUserPlan !== "pro") {
      const err = new Error("FB account already used. PRO required.");
      err.code = "FARM_REUSE_PRO_ONLY";
      throw err;
    }
  }

  const now = Date.now();
  const limits = getLimitsByPlan(appUserPlan);
  // проверка лимита
  const cntRow = await getAsync(
    `SELECT COUNT(*) as cnt
     FROM fb_connections
     WHERE app_user_id = ? AND status = 'active'`,
    [appUserId]
  );

  if (cntRow.cnt >= limits.max_connections) {
    const err = new Error("Plan limit reached");
    err.code = "PLAN_LIMIT";
    throw err;
  }

  // insert с обработкой UNIQUE по fb_user_id
  try {
    await runAsync(
      `INSERT INTO fb_connections (
        app_user_id,
        fb_user_id,
        name,
        access_token,
        status,
        created_at,
        updated_at
      ) VALUES (?,?,?,?,?,?,?)`,
      [appUserId, fbUser.id, fbUser.name, accessToken, "active", now, now]
    );
  } catch (e) {
    const msg = String((e && e.message) || "");
    // если уже есть такая фарма — просто обновляем токен и статус
    if (
      e.code === "SQLITE_CONSTRAINT" &&
      msg.includes("fb_connections.fb_user_id")
    ) {
      await runAsync(
        `UPDATE fb_connections
         SET name = ?, access_token = ?, status = 'active', updated_at = ?
         WHERE fb_user_id = ? AND app_user_id = ?`,
        [fbUser.name, accessToken, now, fbUser.id, appUserId]
      );
      return;
    }
    throw e;
  }
}

function getLimitsByPlan(plan) {
  // trial_pending считаем как нормальный trial
  if (plan === "trial_pending") {
    plan = "trial";
  }

  switch (plan) {
    case "pro":
      return {
        max_connections: 5, // соц-аккаунты
        max_ad_accounts: 50, // ad accounts
      };

    case "trial":
      return {
        max_connections: 2,
        max_ad_accounts: 6,
      };

    default:
      return {
        max_connections: 0,
        max_ad_accounts: 0,
      };
  }
}

// ===== SaaS: FB connections list =====

app.post("/api/connections/recheck", requireAppAuth, async (req, res) => {
  const appUserId = req.session.appUserId;

  try {
    const rows = await allAsync(
      `SELECT id, status, access_token
       FROM fb_connections
       WHERE app_user_id = ?
       ORDER BY id DESC`,
      [appUserId]
    );

    const results = [];

    for (const c of rows || []) {
      // ✅ красный только если вручную отрубили
      if (c.status === "disconnected") {
        results.push({ id: c.id, ok: true, ui_status: "disconnected" });
        continue;
      }

      // ✅ любые другие не-active статусы считаем "нужно переподключить"
      if (c.status !== "active") {
        results.push({ id: c.id, ok: true, ui_status: "reconnect_required" });
        continue;
      }

      const token = decryptToken(c.access_token);
      if (!token) {
        results.push({ id: c.id, ok: true, ui_status: "reconnect_required" });
        continue;
      }

      try {
        await metaRequest(() =>
          axios.get(`https://graph.facebook.com/${META_API_VERSION}/me`, {
            params: { access_token: token, fields: "id" },
            timeout: 15000,
          })
        );

        results.push({ id: c.id, ok: true, ui_status: "active" });
      } catch (e) {
        const err = e?.response?.data?.error || {};
        const code = err?.code;
        const sub = err?.error_subcode;
        const msg = String(err?.message || e.message || "").toLowerCase();

        // ✅ token умер / отозван
        const expired =
          code === 190 || sub === 463 || sub === 467 || sub === 458;

        // ✅ нет прав / missing permissions (часто твой кейс: (#200) + текст про permissions)
        const perm =
          code === 200 ||
          msg.includes("permission") ||
          msg.includes("permissions") ||
          msg.includes("ads_management") ||
          msg.includes("ads_read") ||
          msg.includes("requires") ||
          msg.includes("missing");

        // ✅ почти всё, что мешает работе — делаем Need Reconnect
        if (expired || perm) {
          await runAsync(
            `UPDATE fb_connections
             SET status='reconnect_required', access_token=NULL, updated_at=?
             WHERE id=? AND app_user_id=?`,
            [Date.now(), c.id, appUserId]
          );

          results.push({ id: c.id, ok: true, ui_status: "reconnect_required" });
        } else {
          // оставляем как unknown (если реально какая-то редкая ошибка сети/Meta)
          results.push({
            id: c.id,
            ok: false,
            ui_status: "unknown",
            error: err?.message || e.message,
          });
        }
      }
    }

    return res.json({ ok: true, results });
  } catch (e) {
    console.error("[connections recheck] error", e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

app.get("/api/connections", requireAppAuth, (req, res) => {
  const appUserId = req.session.appUserId;

  db.all(
    `
    SELECT
      id,
      fb_user_id,
      name,
      status,
      access_token,
      created_at,
      updated_at
    FROM fb_connections
    WHERE app_user_id = ?
    ORDER BY id DESC
    `,
    [appUserId],
    (err, rows) => {
      if (err) {
        console.error("[connections] list error:", err);
        return res.status(500).json({ error: "Failed to load connections" });
      }

      const connections = (rows || []).map((c) => {
        let ui_status = "unknown";

        if (c.status === "disconnected") {
          ui_status = "disconnected";
        } else if (c.status === "reconnect_required") {
          ui_status = "reconnect_required";
        } else if (c.status === "active") {
          ui_status = c.access_token ? "active" : "reconnect_required";
        } else {
          // любые старые/мусорные статусы считаем как "надо переподключить"
          ui_status = "reconnect_required";
        }

        return {
          id: c.id,
          fb_user_id: c.fb_user_id,
          name: c.name,
          status: c.status,
          ui_status,
          updated_at: c.updated_at,
        };
      });

      const selectedId = req.session.selectedConnectionId || null;

      res.json({
        connections,
        selected_connection_id: selectedId,
      });
    }
  );
});

app.delete("/api/connections/:id", requireAppAuth, async (req, res) => {
  const appUserId = req.session.appUserId;
  const connId = Number(req.params.id);

  if (!connId) {
    return res.status(400).json({ error: "Invalid connection id" });
  }

  try {
    const result = await runAsync(
      `DELETE FROM fb_connections
       WHERE id = ? AND app_user_id = ?`,
      [connId, appUserId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Connection not found" });
    }

    res.json({ ok: true });
  } catch (e) {
    console.error("delete connection error", e);
    res.status(500).json({ error: "Failed to delete connection" });
  }
});

// выбрать активную фарму (FB connection) для текущего SaaS-пользователя
app.post("/api/connections/select", requireAppAuth, (req, res) => {
  const appUserId = req.session.appUserId;
  const rawId = req.body && req.body.connection_id;
  const connId = Number(rawId);

  if (!connId) {
    return res.status(400).json({ error: "connection_id required" });
  }

  db.get(
    `SELECT id, status
     FROM fb_connections
     WHERE id = ? AND app_user_id = ?`,
    [connId, appUserId],
    (err, row) => {
      if (err) {
        console.error("[connections/select] db.get error:", err);
        return res.status(500).json({ error: "DB error" });
      }
      if (!row) {
        return res.status(404).json({ error: "Connection not found" });
      }
      if (row.status !== "active") {
        return res.status(400).json({ error: "Connection not active" });
      }

      req.session.selectedConnectionId = row.id;
      req.session.save(() => {
        res.json({ ok: true, selected_connection_id: row.id });
      });
    }
  );
});
// отключить (разлогинить) Facebook connection
app.post("/api/connections/:id/logout", requireAppAuth, (req, res) => {
  const appUserId = req.session.appUserId;
  const connId = Number(req.params.id);

  if (!connId) {
    return res.status(400).json({ error: "Invalid connection id" });
  }

  db.run(
    `
UPDATE fb_connections
  SET status='disconnected', access_token=NULL, updated_at=?
  WHERE id=? AND app_user_id=?
    `,
    [Date.now(), connId, appUserId],
    function (err) {
      if (err) {
        console.error("[connections/logout] db error:", err);
        return res.status(500).json({ error: "DB error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Connection not found" });
      }

      res.json({ ok: true });
    }
  );
});

// ---------- OAuth ----------

// старт логина
app.get("/auth/login", async (req, res) => {
  try {
    if (!req.session.appUserId) return res.redirect("/");

    const u = await getAppUserById(req.session.appUserId);
    if (!u) return res.redirect("/");

    const now = Date.now();

    // вычисляем expired так же, как в /api/app/me
    const isTrial = u.plan === "trial" || u.plan === "trial_pending";
    const isPro = u.plan === "pro";
    const expired =
      u.plan === "expired" ||
      (isTrial && u.trial_ends_at && now > u.trial_ends_at) ||
      (isPro && u.pro_ends_at && now > u.pro_ends_at);

    if (expired) {
      return res.redirect("/paywall.html?reason=plan_expired");
    }

    // лимит соц-аккаунтов по плану
    const limits = getLimitsByPlan(u.plan);
    const row = await getAsync(
      `SELECT COUNT(*) AS cnt
       FROM fb_connections
       WHERE app_user_id = ? AND status = 'active'`,
      [u.id]
    );

    const state = uuidv4();
    req.session.oauthState = state;
    req.session.oauthAppUserId = req.session.appUserId;

    req.session.save(() => {
      const scopes = [
        "ads_management",
        "ads_read",
        "business_management",
        "email",
      ].join(",");

      const authUrl =
        `https://www.facebook.com/${META_API_VERSION}/dialog/oauth` +
        `?client_id=${encodeURIComponent(META_APP_ID)}` +
        `&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}` +
        `&scope=${encodeURIComponent(scopes)}` +
        `&response_type=code` +
        `&state=${encodeURIComponent(state)}`;

      res.redirect(authUrl);
    });
  } catch (e) {
    console.error("auth/login error:", e);
    return res.status(500).send("Auth error");
  }
});

// callback: берём short-lived токен и обмениваем на long-lived
// callback: берём short-lived токен и обмениваем на long-lived
app.get("/auth/callback", async (req, res) => {
  const { code, state, error } = req.query;

  if (error) return res.send(`<h1>Auth error</h1><p>${error}</p>`);
  if (!state || state !== req.session.oauthState)
    return res.status(400).send("Invalid OAuth state");
  if (!code) return res.send("<h1>No code provided</h1>");

  try {
    // ✅ TOKEN (через metaRequest + timeout)
    const tokenResp = await metaRequest(
      () =>
        axios.get(
          `https://graph.facebook.com/${META_API_VERSION}/oauth/access_token`,
          {
            params: {
              client_id: META_APP_ID,
              client_secret: META_APP_SECRET,
              redirect_uri: META_REDIRECT_URI,
              code,
            },
            timeout: 15000,
          }
        ),
      { maxRetries: 2 } // сеть может моргнуть — 1-2 ретрая ок
    );

    const accessToken = tokenResp.data?.access_token;
    if (!accessToken) throw new Error("No access_token in tokenResp");

    // ✅ ME (через metaRequest + timeout)
    const meResp = await metaRequest(
      () =>
        axios.get(`https://graph.facebook.com/${META_API_VERSION}/me`, {
          params: { access_token: accessToken, fields: "id,name,email" },
          timeout: 15000,
        }),
      { maxRetries: 2 }
    );

    const fbUser = meResp.data;

    const appUserId = req.session.oauthAppUserId || req.session.appUserId;
    if (!appUserId) return res.status(401).send("No SaaS session");

    const appUser = await getAppUserById(appUserId);
    req.session.appUserId = appUserId;
    req.session.oauthAppUserId = null;

    if (!appUser) return res.status(401).send("No SaaS user");

    const planForLimits =
      appUser.plan === "trial_pending" ? "trial" : appUser.plan || "trial";

    try {
      await createFbConnectionWithLimits({
        appUserId,
        fbUser,
        accessToken,
        appUserPlan: planForLimits,
      });
    } catch (e) {
      if (e.code === "PLAN_LIMIT") {
        return req.session.save(() => res.redirect("/app?error=plan_limit"));
      }
      throw e;
    }

    return req.session.save(() => res.redirect("/app"));
  } catch (e) {
    console.error("Auth callback error:", e?.response?.data || e.message || e);

    if (e && e.code === "FARM_REUSE_PRO_ONLY") {
      return req.session.save(() =>
        res.redirect("/paywall.html?reason=farm_reuse_pro")
      );
    }

    // 👉 ВАЖНО: если это сетевой таймаут — покажем понятную страницу
    const msg = String(e?.message || "").toLowerCase();
    if (
      msg.includes("etimedout") ||
      msg.includes("enetunreach") ||
      msg.includes("econnreset")
    ) {
      return res
        .status(502)
        .send(
          "Meta connection error (network timeout). Try again in 1-2 minutes."
        );
    }

    return res.status(500).send("Auth error");
  }
});

// logout
app.post("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

// ---------- API: ad accounts / campaigns ----------

// ad accounts (активные, + кэш в БД)
app.post("/api/adaccounts_multi", requireAppAuth, async (req, res) => {
  // ===== ПРОВЕРКА ПЛАНА =====
  const u = await getAppUserById(req.session.appUserId);
  if (!u) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (u.plan === "expired") {
    return res.status(403).json({
      error: "Plan expired",
      code: "PLAN_EXPIRED",
    });
  }

  const appUser = await getAsync("SELECT plan FROM app_users WHERE id = ?", [
    req.session.appUserId,
  ]);

  const appUserId = req.session.appUserId;
  const { connection_ids } = req.body || {};

  if (!Array.isArray(connection_ids) || connection_ids.length === 0) {
    return res.status(400).json({ error: "connection_ids required" });
  }

  const connIds = connection_ids
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);
  const limits = getLimitsByPlan(u.plan);

  if (connIds.length > limits.max_connections) {
    return res.status(403).json({
      error: "Plan limit: too many social accounts",
    });
  }

  // load connections + tokens
  const conns = await new Promise((resolve, reject) => {
    db.all(
      `SELECT id, access_token, status, name, fb_user_id
       FROM fb_connections
       WHERE app_user_id = ? AND id IN (${connIds.map(() => "?").join(",")})`,
      [appUserId, ...connIds],
      (err, rows) => (err ? reject(err) : resolve(rows || []))
    );
  });

  const active = conns.filter((c) => c.status === "active" && c.access_token);
  if (!active.length) return res.json({ accounts: [] });

  const map = new Map(); // act_id -> account object

  for (const c of active) {
    const token = decryptToken(c.access_token);
    if (!token) continue;

    try {
      const r = await metaRequest(() =>
        axios.get(
          `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts`,
          {
            params: {
              access_token: token,
              fields: "id,name,account_status,currency",
              limit: 500,
            },
            timeout: 20000,
          }
        )
      );

      const list = r.data?.data || [];
      for (const a of list) {
        const act = normalizeActId(a.id);
        if (!act) continue;

        if (!map.has(act)) {
          map.set(act, {
            id: act,
            name: a.name || act,
            currency: a.currency || null,
            account_status: a.account_status ?? null,
          });
        }
      }
    } catch (e) {
      console.log(
        "[adaccounts_multi] skip conn",
        c.id,
        e?.response?.data?.error?.message || e.message
      );
      continue;
    }
  }
  try {
    const now = Date.now();
    for (const a of [...map.values()]) {
      const act = a.id;
      if (!act) continue;
      db.run(
        `INSERT INTO app_user_ad_accounts (app_user_id, ad_account_id, first_seen_at, last_seen_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(app_user_id, ad_account_id)
       DO UPDATE SET last_seen_at=excluded.last_seen_at`,
        [appUserId, act, now, now]
      );
    }
  } catch (e) {
    console.error("[adaccounts_multi] persist error", e);
  }

  //if (map.size > limits.max_ad_accounts) {
  //return res.status(403).json({
  //  error: 'Plan limit: too many ad accounts'
  // });
  //}

  res.json({ accounts: [...map.values()] });
});

// ---------- creatives helpers ----------
// Goal: build "asset cards" (creative) aggregated across many ads, with summed metrics and playable MP4 for videos.

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function normalizeActId(id) {
  if (!id) return null;
  let s = String(id).trim();

  // act_act_123 -> act_123
  s = s.replace(/^act_act_/, "act_");

  // already act_123
  if (/^act_\d+$/.test(s)) return s;

  // digits -> act_123
  if (/^\d+$/.test(s)) return `act_${s}`;

  // any string containing act_<digits>
  const m = s.match(/act_(\d+)/);
  if (m) return `act_${m[1]}`;

  return null;
}

function safeJsonParse(s, def) {
  try {
    return JSON.parse(s);
  } catch {
    return def;
  }
}

// Build metrics from a Meta Insights row (ad-level)
function buildMetricsFromInsightRow(row) {
  const spend = safeNumber(row.spend, 0);
  const impressions = safeNumber(row.impressions, 0);
  const uniqueClicks = safeNumber(row.unique_clicks, 0);

  const leads = getActionCount(row.actions, "lead");
  const registrations = getActionCount(row.actions, "complete_registration");
  const purchases = getActionCount(row.actions, "purchase");
  const installs = getActionCount(row.actions, "mobile_app_install");
  const appPurchases = getActionCount(row.actions, "mobile_app_purchase");
  // derived will be re-computed on aggregate too, but keep base counters here
  return {
    spend,
    impressions,
    unique_clicks: uniqueClicks,
    leads,
    registrations,
    purchases,
    installs,
    app_purchases: appPurchases,
  };
}

function sumMetrics(a, b) {
  const out = { ...(a || {}) };
  const src = b || {};
  const keys = [
    "spend",
    "impressions",
    "unique_clicks",
    "leads",
    "registrations",
    "purchases",
    "installs",
    "app_purchases",
  ];

  keys.forEach((k) => {
    out[k] = safeNumber(out[k], 0) + safeNumber(src[k], 0);
  });
  return out;
}

function finalizeDerivedMetrics(m) {
  const spend = safeNumber(m.spend, 0);
  const impressions = safeNumber(m.impressions, 0);
  const uniq = safeNumber(m.unique_clicks, 0);

  const leads = safeNumber(m.leads, 0);
  const registrations = safeNumber(m.registrations, 0);
  const purchases = safeNumber(m.purchases, 0);
  const installs = safeNumber(m.installs, 0);
  const appPurchases = safeNumber(m.app_purchases, 0);

  const ucpc = uniq > 0 ? spend / uniq : 0;
  const cpl = leads > 0 ? spend / leads : 0;

  const cpa = purchases > 0 ? spend / purchases : 0;
  const cpr = registrations > 0 ? spend / registrations : 0;
  const cap = appPurchases > 0 ? spend / appPurchases : 0;

  const cpm = impressions > 0 ? spend / (impressions / 1000) : 0;
  const cpi = installs > 0 ? spend / installs : 0;

  const leadsPerPurchase = purchases > 0 ? leads / purchases : 0;
  const ctr = impressions > 0 ? (uniq / impressions) * 100 : 0;

  return {
    ...m,

    // важно: чтобы UI/условия могли читать installs/app_purchases напрямую
    installs,
    app_purchases: appPurchases,

    ucpc,
    cpl,
    cpa,
    cpr,
    cap,
    cpm,
    cpi,

    leads_per_purchase: leadsPerPurchase,
    ctr,
  };
}

// Fetch ad-level insights for the whole account for a period (single pagination loop)
// Fetch ad-level insights for the whole account for a period (single pagination loop)
async function fetchAdInsightsMap(accountId, accessToken, since, until) {
  const act = normalizeActId(accountId);

  const level = "ad";
  const trObj = { since, until };

  let url = `https://graph.facebook.com/${META_API_VERSION}/${act}/insights`;
  const byAdId = {};

  const params = {
    access_token: accessToken,
    level,
    time_range: JSON.stringify(trObj), // ✅ строкой
    fields: "ad_id,spend,impressions,unique_clicks,actions",
    limit: 500,
  };

  // ✅ безопасный лог (без rows)
  console.log(
    "[insights start]",
    act,
    "level",
    level,
    "tr",
    JSON.stringify(trObj),
    "token_head",
    (accessToken || "").slice(0, 6)
  );

  while (true) {
    let resp;
    try {
      resp = await metaRequest(() => axios.get(url, { params }));
    } catch (e) {
      const msg = e?.response?.data?.error?.message || e.message;
      const code = e?.response?.data?.error?.code;
      const sub = e?.response?.data?.error?.error_subcode;
      const trace = e?.response?.headers?.["x-fb-trace-id"];
      console.warn(
        "[insights skip]",
        act,
        "code=",
        code,
        "sub=",
        sub,
        "msg=",
        msg,
        "trace=",
        trace
      );
      return {}; // ✅ не валим весь крео, просто без метрик для этого act
    }

    const rows = resp.data?.data || [];
    console.log("[insights page]", act, "rows", rows.length);

    for (const r of rows) {
      const adId = r.ad_id;
      if (!adId) continue;
      byAdId[adId] = buildMetricsFromInsightRow(r);
    }

    const next = resp.data?.paging?.next;
    if (!next) break;

    url = next;
    for (const k of Object.keys(params)) delete params[k]; // как и было — ок
  }

  return byAdId;
}

async function fetchAdInsightsDailyMap(accountId, accessToken, since, until) {
  const act = normalizeActId(accountId);
  const url = `https://graph.facebook.com/${META_API_VERSION}/${act}/insights`;

  const params = {
    access_token: accessToken,
    level: "ad",
    time_range: JSON.stringify({ since, until }),
    time_increment: 1,
    fields: "ad_id,date_start,spend,impressions,unique_clicks,actions",
    limit: 500,
  };

  const out = {}; // out[day][ad_id] = metrics

  let next = url;
  while (next) {
    let resp;
    try {
      resp = await metaRequest(() => axios.get(next, { params }));
    } catch (e) {
      console.warn(
        "[admin insights daily skip]",
        act,
        e?.response?.data || e.message
      );
      return {}; // не валим весь синк
    }

    const rows = resp.data?.data || [];
    for (const row of rows) {
      const day = safeStr(row.date_start) || "";
      const adId = safeStr(row.ad_id);
      if (!day || !adId) continue;

      // actions
      const getAction = (actions, type) => {
        const a = Array.isArray(actions)
          ? actions.find((x) => x?.action_type === type)
          : null;
        return a ? Number(a.value || 0) : 0;
      };

      const m = {
        spend: Number(row.spend || 0),
        impressions: Number(row.impressions || 0),
        unique_clicks: Number(row.unique_clicks || 0),
        leads: getAction(row.actions, "lead"),
        registrations: getAction(row.actions, "complete_registration"),
        purchases: getAction(row.actions, "purchase"),
        app_purchases: getAction(row.actions, "mobile_app_purchase"),
      };

      out[day] = out[day] || {};
      const prev = out[day][adId] || {
        spend: 0,
        impressions: 0,
        unique_clicks: 0,
        leads: 0,
        registrations: 0,
        purchases: 0,
        app_purchases: 0,
      };
      out[day][adId] = {
        spend: prev.spend + m.spend,
        impressions: prev.impressions + m.impressions,
        unique_clicks: prev.unique_clicks + m.unique_clicks,
        leads: prev.leads + m.leads,
        registrations: prev.registrations + m.registrations,
        purchases: prev.purchases + m.purchases,
        app_purchases: prev.app_purchases + m.app_purchases,
      };
    }

    next = resp.data?.paging?.next || null;
  }

  return out;
}

// Fetch ad objects with embedded creative by IDs (batch by 50 via ?ids=)
async function fetchAdsCreativesByIds(adIds, accessToken) {
  const result = [];
  const chunks = chunkArray(adIds, 50);

  for (const idsChunk of chunks) {
    const ids = idsChunk.join(",");
    const url = `https://graph.facebook.com/${META_API_VERSION}/`;

    const resp = await metaRequest(() =>
      axios.get(url, {
        params: {
          access_token: accessToken,
          ids,
          fields:
            "id,account_id,creative{id,name,thumbnail_url,object_story_spec,asset_feed_spec}",
        },
      })
    );

    const data = resp.data || {};
    for (const adId of Object.keys(data)) {
      const adObj = data[adId];
      if (adObj && adObj.creative && adObj.creative.id) {
        result.push(adObj);
      }
    }
  }

  return result;
}

function md5short(s, len = 30) {
  return crypto
    .createHash("md5")
    .update(String(s || ""))
    .digest("hex")
    .slice(0, len);
}

// returns { type, key, video_id, image_hash, image_url }
function detectCreativeType(creative) {
  if (!creative)
    return {
      type: "unknown",
      key: "unknown",
      video_id: null,
      image_hash: null,
      image_url: null,
    };

  const oss = creative.object_story_spec || {};
  const afs = creative.asset_feed_spec || {};

  // VIDEO
  const vid =
    oss.video_data?.video_id ||
    oss.video_data?.id ||
    afs.videos?.[0]?.video_id ||
    null;

  if (vid) {
    return {
      type: "video",
      key: `v:${String(vid)}`,
      video_id: String(vid),
      image_hash: null,
      image_url: null,
    };
  }

  // IMAGE (prefer image_hash for FB full-quality)
  const imgHash =
    oss.link_data?.image_hash ||
    afs.images?.[0]?.hash ||
    creative.image_hash ||
    null;

  if (imgHash) {
    return {
      type: "image",
      key: `h:${String(imgHash).slice(0, 72)}`,
      video_id: null,
      image_hash: String(imgHash),
      image_url: null,
    };
  }

  // IMAGE fallback: URL/picture if no hash
  const pic =
    oss.link_data?.picture ||
    oss.link_data?.image_url ||
    creative.thumbnail_url ||
    null;

  if (pic) {
    // stable key from URL so we don't lose creatives
    return {
      type: "image",
      key: `u:${md5short(pic)}`,
      video_id: null,
      image_hash: null,
      image_url: String(pic),
    };
  }

  // DCO / fallback
  if (creative.id) {
    return {
      type: "dco",
      key: `c:${String(creative.id)}`,
      video_id: null,
      image_hash: null,
      image_url: null,
    };
  }

  return {
    type: "unknown",
    key: "unknown",
    video_id: null,
    image_hash: null,
    image_url: null,
  };
}

function extractCreativeMediaHint(creative) {
  const t = detectCreativeType(creative);
  const oss = creative?.object_story_spec || {};

  if (t.type === "video") {
    const vid = oss.video_data?.video_id || oss.video_data?.id || null;
    const thumb = creative?.thumbnail_url || null;
    return { type: "video", video_id: vid, image_url: null, thumb };
  }

  if (t.type === "image") {
    const pic =
      oss.link_data?.picture ||
      oss.link_data?.image_url ||
      creative?.thumbnail_url ||
      null;
    const thumb = creative?.thumbnail_url || pic || null;
    return { type: "image", video_id: null, image_url: pic, thumb };
  }

  return {
    type: t.type || "unknown",
    video_id: null,
    image_url: creative?.thumbnail_url || null,
    thumb: creative?.thumbnail_url || null,
  };
}

// Simple in-memory caches to avoid duplicate requests under load (10-20 concurrent users).
const CREATIVES_CACHE_TTL_MS = parseInt(
  process.env.CREATIVES_CACHE_TTL_MS || "300000",
  10
); // 5 min
const creativesJobCache = new Map(); // key -> { ts, data }
const creativesInFlight = new Map(); // key -> Promise

const VIDEO_SOURCE_TTL_MS = 24 * 60 * 60 * 1000;
const videoSourceCache = new Map(); // video_id -> { ts, source }

function stableKey(userId, accountIds, since, until) {
  const ids = [...(accountIds || [])].sort().join(",");
  return `${userId}::${ids}::${since}::${until}`;
}

async function getVideoSourceCached(videoId, accessToken) {
  if (!videoId) return null;
  const cached = videoSourceCache.get(videoId);
  const now = Date.now();
  if (cached && now - cached.ts < VIDEO_SOURCE_TTL_MS)
    return cached.source || null;

  try {
    const resp = await metaRequest(() =>
      axios.get(`https://graph.facebook.com/${META_API_VERSION}/${videoId}`, {
        params: { access_token: accessToken, fields: "source" },
        timeout: 20000,
      })
    );

    const source = resp.data?.source || null;
    videoSourceCache.set(videoId, { ts: now, source });
    return source;
  } catch (e) {
    // don't spam retries
    videoSourceCache.set(videoId, { ts: now, source: null });
    return null;
  }
}
const VIDEO_META_TTL_MS = 24 * 60 * 60 * 1000;
const videoMetaCache = new Map(); // video_id -> { ts, meta:{source,name,thumb} }

const IMAGE_META_TTL_MS = 24 * 60 * 60 * 1000;
const imageMetaCache = new Map(); // `${accountId}:${hash}` -> { ts, meta:{name,url} }

function extractAssetFromCreative(creative) {
  const c = creative || {};
  const oss = c.object_story_spec || {};
  const afs = c.asset_feed_spec || {};

  // Try video first
  let videoId =
    oss?.video_data?.video_id ||
    oss?.link_data?.video_id ||
    (Array.isArray(afs?.videos) && afs.videos[0]?.video_id) ||
    null;

  if (videoId) {
    return {
      type: "video",
      key: `video:${videoId}`,
      video_id: String(videoId),
    };
  }

  // Then image hash
  let imageHash =
    oss?.link_data?.image_hash ||
    oss?.photo_data?.image_hash ||
    c.image_hash ||
    (Array.isArray(afs?.images) &&
      (afs.images[0]?.hash || afs.images[0]?.image_hash)) ||
    null;

  if (imageHash) {
    return {
      type: "image",
      key: `image:${imageHash}`,
      image_hash: String(imageHash),
    };
  }

  return {
    type: c.object_type || "unknown",
    key: `creative:${c.id || "unknown"}`,
  };
}

async function fetchVideoMeta(videoId, accessToken) {
  if (!videoId) return null;
  const cached = videoMetaCache.get(videoId);
  const now = Date.now();
  if (cached && now - cached.ts < VIDEO_META_TTL_MS) return cached.meta;

  const resp = await metaRequest(() =>
    axios.get(`https://graph.facebook.com/${META_API_VERSION}/${videoId}`, {
      params: {
        access_token: accessToken,
        fields: "source,title,thumbnails.limit(1){uri}",
      },
      timeout: 20000,
    })
  );

  const meta = {
    source: resp.data?.source || null,
    // In Ads Manager media library the displayed "original filename" for videos
    // usually matches the video title.
    name: resp.data?.title || null,
    thumb: resp.data?.thumbnails?.data?.[0]?.uri || null,
  };

  videoMetaCache.set(videoId, { ts: now, meta });
  return meta;
}

async function fetchImageMeta(accountId, imageHash, accessToken) {
  if (!accountId || !imageHash) return null;
  // IMPORTANT:
  // UI passes account IDs from /me/adaccounts as `act_<NUM>`.
  // If we blindly prefix again, we get `act_act_<NUM>` and /adimages lookup fails.
  const actId = normalizeActId(String(accountId));
  const key = `${actId}:${imageHash}`;
  const cached = imageMetaCache.get(key);
  const now = Date.now();
  if (cached && now - cached.ts < IMAGE_META_TTL_MS) return cached.meta;

  const resp = await metaRequest(() =>
    axios.get(
      `https://graph.facebook.com/${META_API_VERSION}/${actId}/adimages`,
      {
        params: {
          access_token: accessToken,
          fields: "hash,name,url",
          hashes: JSON.stringify([String(imageHash)]),
          limit: 1,
        },
        timeout: 20000,
      }
    )
  );

  const row = (resp.data?.data || [])[0] || null;
  const meta = {
    name: row?.name || null,
    url: row?.url || null,
  };

  imageMetaCache.set(key, { ts: now, meta });
  return meta;
}

async function buildCreativesAssetCards({
  userId,
  accessToken,
  accountIds,
  since,
  until,
}) {
  // One card = one underlying asset (video_id or image_hash).
  // Fallback: creative.id when we can't identify the asset.
  const cardsByAsset = new Map();

  for (const accountId of accountIds) {
    // 1) insights (ad -> metrics)
    const adMetrics = await fetchAdInsightsMap(
      accountId,
      accessToken,
      since,
      until
    );
    const adIds = Object.keys(adMetrics || {});
    if (!adIds.length) continue;

    // 2) ads -> creative
    const ads = await fetchAdsCreativesByIds(adIds, accessToken);

    for (const ad of ads) {
      const adId = ad?.id;
      const c = ad?.creative;
      if (!adId || !c?.id) continue;

      const m = adMetrics[adId];
      if (!m) continue;

      const asset = extractAssetFromCreative(c);
      const assetKey = asset.key || `creative:${c.id}`;
      const existing = cardsByAsset.get(assetKey);

      if (!existing) {
        cardsByAsset.set(assetKey, {
          asset_key: assetKey,
          asset_type: asset.type || "unknown",
          // store raw ids to resolve name/media later
          _video_id: asset.video_id || null,
          _image_hash: asset.image_hash || null,
          _first_account_id: accountId,

          _account_ids: [accountId],
          id: c.id, // keep for debugging
          name: c.name || null, // will be overwritten with original media filename/name when possible
          object_type: asset.type || c.object_type || null,
          thumbnail_url: c.thumbnail_url || null,
          media_url: null,

          metrics: {
            spend: 0,
            impressions: 0,
            clicks: 0,
            unique_clicks: 0,
            leads: 0,
            registrations: 0,
            purchases: 0,
          },
        });
      }

      const card = cardsByAsset.get(assetKey);

      if (
        Array.isArray(card._account_ids) &&
        !card._account_ids.includes(accountId)
      )
        card._account_ids.push(accountId);
      // Keep best thumb we can
      if (!card.thumbnail_url && c.thumbnail_url)
        card.thumbnail_url = c.thumbnail_url;

      // Sum raw metrics (ad-level)
      card.metrics.spend += Number(m.spend || 0);
      card.metrics.impressions += Number(m.impressions || 0);
      card.metrics.clicks += Number(m.clicks || 0);
      card.metrics.unique_clicks += Number(m.unique_clicks || 0);
      card.metrics.leads += Number(m.leads || 0);
      card.metrics.registrations += Number(m.registrations || 0);
      card.metrics.purchases += Number(m.purchases || 0);
    }
  }

  // Resolve media URL + ORIGINAL uploaded filename/name for each asset
  const out = [];
  for (const card of cardsByAsset.values()) {
    try {
      if (card.asset_type === "video" && card._video_id) {
        const vmeta = await fetchVideoMeta(card._video_id, accessToken);
        if (vmeta?.name) card.name = vmeta.name;
        if (vmeta?.source) card.media_url = vmeta.source;
        if (vmeta?.thumb && !card.thumbnail_url)
          card.thumbnail_url = vmeta.thumb;
        card.object_type = "video";
      } else if (card.asset_type === "image" && card._image_hash) {
        // Try resolve from the account that referenced it first; if not found, try other accounts that also referenced this asset.
        let imeta = await fetchImageMeta(
          card._first_account_id,
          card._image_hash,
          accessToken
        );

        if (!imeta?.name && !imeta?.url && Array.isArray(card._account_ids)) {
          for (const accId of card._account_ids) {
            if (!accId || accId === card._first_account_id) continue;
            const tmp = await fetchImageMeta(
              accId,
              card._image_hash,
              accessToken
            );
            if (tmp?.name || tmp?.url) {
              imeta = tmp;
              break;
            }
          }
        }

        if (imeta?.name) card.name = imeta.name; // original uploaded filename in Media Library
        if (imeta?.url) card.media_url = imeta.url;
        card.object_type = "image";
      }
    } catch (e) {
      // If resolving fails, we still return aggregated metrics with whatever we have (thumb, creative name).
      // This should not crash the whole response.
      console.warn(
        "asset resolve failed:",
        card.asset_key,
        e.response?.data || e.message
      );
    }

    // Fallback media_url: creative thumbnail if nothing else
    if (!card.media_url) {
      card.media_url = card.thumbnail_url || null;
    }

    const base = card.metrics || {};
    out.push({
      id: card.asset_key,
      name: card.name || card.asset_key,
      object_type: card.object_type || "unknown",
      thumbnail_url: card.thumbnail_url || null,
      media_url: card.media_url || null,
      metrics_base: {
        spend: Number(base.spend || 0),
        impressions: Number(base.impressions || 0),
        unique_clicks: Number(base.unique_clicks || 0),
        leads: Number(base.leads || 0),
        registrations: Number(base.registrations || 0),
        purchases: Number(base.purchases || 0),
      },
      metrics: finalizeDerivedMetrics(base),
    });
  }

  return out;
}
async function buildAdminCardsAssetLink({
  accessToken,
  accountIds,
  since,
  until,
}) {
  // key = asset_key + '||' + link_url
  const cards = new Map();

  for (const accountId of accountIds) {
    const dailyByAd = await fetchAdInsightsDailyMap(
      accountId,
      accessToken,
      since,
      until
    );
    const days = Object.keys(dailyByAd || {});
    if (!days.length) continue;

    // собрать все ad_id за период
    const adIdSet = new Set();
    for (const d of days) {
      for (const adId of Object.keys(dailyByAd[d] || {})) adIdSet.add(adId);
    }
    const adIds = Array.from(adIdSet);
    if (!adIds.length) continue;

    const ads = await fetchAdsCreativesByIds(adIds, accessToken); // уже тянет object_story_spec/asset_feed_spec

    // index ad_id -> creative
    const adToCreative = new Map();
    for (const ad of ads) adToCreative.set(String(ad.id), ad.creative || null);

    // для каждого дня пишем метрики в пары (asset+link)
    for (const day of days) {
      const dayMap = dailyByAd[day] || {};
      for (const adId of Object.keys(dayMap)) {
        const cr = adToCreative.get(String(adId));
        if (!cr) continue;

        const asset = detectCreativeType(cr); // у тебя уже есть: image_hash/video_id/fallback
        const assetKey = asset.key || "unknown";
        const linkUrl = normLink(extractLinkFromCreative(cr));

        const pairKey = `${assetKey}||${linkUrl}`;

        let card = cards.get(pairKey);
        if (!card) {
          card = {
            asset_key: assetKey,
            link_url: linkUrl,
            asset_type: asset.type || "unknown",
            _video_id: asset.video_id || null,
            _image_hash: asset.image_hash || null,
            _first_account_id: accountId,
            _account_ids: [accountId],
            thumbnail_url: cr.thumbnail_url || null,
            media_url: null,
            daily: {}, // daily[day] = metrics
          };
          // if we have direct image url fallback (no hash) — treat as full
          if (asset.type === "image" && asset.image_url) {
            if (!card.media_url_full) card.media_url_full = asset.image_url;
            if (!card.media_url) card.media_url = asset.image_url;
            if (!card.thumbnail_url) card.thumbnail_url = asset.image_url;
          }

          cards.set(pairKey, card);
        } else {
          if (!card._account_ids.includes(accountId))
            card._account_ids.push(accountId);
        }

        if (!card.thumbnail_url && cr.thumbnail_url)
          card.thumbnail_url = cr.thumbnail_url;

        const m = dayMap[adId] || {};
        const prev = card.daily[day] || {
          spend: 0,
          impressions: 0,
          unique_clicks: 0,
          leads: 0,
          registrations: 0,
          purchases: 0,
          app_purchases: 0,
        };
        card.daily[day] = {
          spend: prev.spend + Number(m.spend || 0),
          impressions: prev.impressions + Number(m.impressions || 0),
          unique_clicks: prev.unique_clicks + Number(m.unique_clicks || 0),
          leads: prev.leads + Number(m.leads || 0),
          registrations: prev.registrations + Number(m.registrations || 0),
          purchases: prev.purchases + Number(m.purchases || 0),
          app_purchases: prev.app_purchases + Number(m.app_purchases || 0),
        };
      }
    }
  }

  // resolve media_url (как у тебя в обычном крео)
  const out = [];
  for (const card of cards.values()) {
    try {
      if (card.asset_type === "video" && card._video_id) {
        const vmeta = await fetchVideoMeta(card._video_id, accessToken);
        if (vmeta?.source) card.media_url_full = vmeta.source; // mp4
        if (!card.media_url && vmeta?.source) card.media_url = vmeta.source; // fallback
        if (vmeta?.thumb && !card.thumbnail_url)
          card.thumbnail_url = vmeta.thumb;
      } else if (card.asset_type === "image" && card._image_hash) {
        let imeta = await fetchImageMeta(
          card._first_account_id,
          card._image_hash,
          accessToken
        );
        if (
          !imeta?.url &&
          Array.isArray(card._account_ids) &&
          card._account_ids.length > 1
        ) {
          for (const acc of card._account_ids) {
            const tmp = await fetchImageMeta(
              acc,
              card._image_hash,
              accessToken
            );
            if (tmp?.url) {
              imeta = tmp;
              break;
            }
          }
        }
        if (imeta?.url) card.media_url_full = imeta.url;
        if (!card.media_url && imeta?.url) card.media_url = imeta.url;
      }
    } catch (e) {
      console.warn(
        "[admin resolve failed]",
        card.asset_key,
        e?.response?.data || e.message
      );
    }
    out.push(card);
  }

  return out;
}

// ---------- API: creatives (asset cards) ----------
// POST /api/creatives/load_multi
// body: { connection_ids: [..], account_ids: [..], since, until }
app.post("/api/creatives/load_multi", requireAppAuth, async (req, res) => {
  const u = await getAppUserById(req.session.appUserId);
  if (!u) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (u.plan === "expired") {
    return res.status(403).json({
      error: "Plan expired",
      code: "PLAN_EXPIRED",
    });
  }
  const { connection_ids, account_ids, since, until } = req.body || {};
  const appUserId = req.session.appUserId;

  if (!Array.isArray(connection_ids) || connection_ids.length === 0) {
    return res.status(400).json({ error: "connection_ids required" });
  }
  if (!Array.isArray(account_ids) || account_ids.length === 0) {
    return res.status(400).json({ error: "account_ids required" });
  }
  if (!since || !until) {
    return res.status(400).json({ error: "since and until required" });
  }

  const connIds = connection_ids
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);
  const accIds = account_ids
    .map(String)
    .map((s) => s.trim())
    .filter(Boolean);

  const key = `multi::${appUserId}::${connIds
    .slice()
    .sort()
    .join(",")}::${accIds.slice().sort().join(",")}::${since}::${until}`;
  const now = Date.now();

  // cache hit
  const cached = creativesJobCache.get(key);
  if (cached && now - cached.ts < CREATIVES_CACHE_TTL_MS) {
    return res.json({ ok: true, cached: true, creatives: cached.data });
  }

  // если уже есть job в полёте — переиспользуем
  let job = creativesInFlight.get(key);
  if (!job) {
    job = (async () => {
      // грузим коннекты с токенами для этого app_user
      const conns = await new Promise((resolve, reject) => {
        db.all(
          `SELECT id, access_token, status
           FROM fb_connections
           WHERE app_user_id = ? AND id IN (${connIds
             .map(() => "?")
             .join(",")})`,
          [appUserId, ...connIds],
          (err, rows) => (err ? reject(err) : resolve(rows || []))
        );
      });

      const activeConns = conns.filter(
        (c) => c.status === "active" && c.access_token
      );
      if (!activeConns.length) return [];

      const perConn = [];
      for (const c of activeConns) {
        try {
          const accessToken = decryptToken(c.access_token);
          if (!accessToken) {
            console.warn("[CREA] invalid token for conn", c.id);
            perConn.push([]);
            continue;
          }

          const data = await buildCreativesAssetCards({
            accessToken,
            accountIds: accIds,
            since,
            until,
          });

          perConn.push(Array.isArray(data) ? data : []);
        } catch (e) {
          console.error("[CREA] buildCreativesAssetCards failed", e);
          perConn.push([]);
        }
      }

      // 2) агрегация по id ассета
      const byId = new Map();

      for (const list of perConn) {
        for (const item of list) {
          const id = item.id;
          if (!id) continue;

          const prev = byId.get(id);
          if (!prev) {
            byId.set(id, {
              ...item,
              metrics_base: item.metrics_base || {
                spend: Number(item.metrics?.spend || 0),
                impressions: Number(item.metrics?.impressions || 0),
                unique_clicks: Number(item.metrics?.unique_clicks || 0),
                leads: Number(item.metrics?.leads || 0),
                registrations: Number(item.metrics?.registrations || 0),
                purchases: Number(item.metrics?.purchases || 0),
              },
            });
          } else {
            if (!prev.name && item.name) prev.name = item.name;
            if (!prev.media_url && item.media_url)
              prev.media_url = item.media_url;
            if (!prev.thumbnail_url && item.thumbnail_url)
              prev.thumbnail_url = item.thumbnail_url;
            if (prev.object_type === "unknown" && item.object_type)
              prev.object_type = item.object_type;

            const a = prev.metrics_base || {};
            const b = item.metrics_base || {
              spend: Number(item.metrics?.spend || 0),
              impressions: Number(item.metrics?.impressions || 0),
              unique_clicks: Number(item.metrics?.unique_clicks || 0),
              leads: Number(item.metrics?.leads || 0),
              registrations: Number(item.metrics?.registrations || 0),
              purchases: Number(item.metrics?.purchases || 0),
            };

            prev.metrics_base = {
              spend: Number(a.spend || 0) + Number(b.spend || 0),
              impressions:
                Number(a.impressions || 0) + Number(b.impressions || 0),
              unique_clicks:
                Number(a.unique_clicks || 0) + Number(b.unique_clicks || 0),
              leads: Number(a.leads || 0) + Number(b.leads || 0),
              registrations:
                Number(a.registrations || 0) + Number(b.registrations || 0),
              purchases: Number(a.purchases || 0) + Number(b.purchases || 0),
            };
          }
        }
      }

      // 3) финализация метрик
      const out = [];
      for (const v of byId.values()) {
        v.metrics = finalizeDerivedMetrics(v.metrics_base || {});
        out.push(v);
      }

      creativesJobCache.set(key, { ts: now, data: out });
      return out;
    })();

    creativesInFlight.set(key, job);
  }

  try {
    const data = await job;
    res.json({ ok: true, cached: false, creatives: data });
  } catch (e) {
    console.error("creatives load_multi error:", e.response?.data || e.message);
    res.status(500).json({ error: "Failed to load creatives" });
  } finally {
    creativesInFlight.delete(key);
  }
});

// Backward compatibility (old endpoints)
// /api/creatives/sync and /api/creatives are left as-is in earlier versions.

// campaigns by account (заодно кэшируем + считаем "по-настоящему активные" кампании)
app.get("/api/campaigns", requireAppAuth, async (req, res) => {
  const { account_id } = req.query;
  if (!account_id)
    return res.status(400).json({ error: "account_id required" });
  const u = await getAppUserById(req.session.appUserId);
  if (!u) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (u.plan === "expired") {
    return res.status(403).json({
      error: "Plan expired",
      code: "PLAN_EXPIRED",
    });
  }
  try {
    const appUserId = req.session.appUserId;
    const acctNode = normalizeActId(account_id);
    if (!acctNode) return res.status(400).json({ error: "Bad account_id" });

    // берём все активные farm для этого email
    const conns = await new Promise((resolve, reject) => {
      db.all(
        `SELECT id, access_token
     FROM fb_connections
     WHERE app_user_id = ? AND status='active' AND access_token IS NOT NULL`,
        [appUserId],
        (err, rows) => (err ? reject(err) : resolve(rows || []))
      );
    });

    let campaigns = null;
    let adsets = null;
    let ads = null;
    let lastErr = null;

    // пробуем токены по очереди, пока какой-то не получит доступ к account_id

    for (const c of conns) {
      try {
        const accessToken = decryptToken(c.access_token);
        if (!accessToken) {
          lastErr = new Error(`empty/invalid token for conn ${c.id}`);
          continue;
        }
        const [campaignResp, adsetsResp, adsResp] = await Promise.all([
          metaRequest(() =>
            axios.get(
              `https://graph.facebook.com/${META_API_VERSION}/${acctNode}/campaigns`,
              {
                timeout: 20000,
                params: {
                  access_token: accessToken,
                  fields: "id,name,status,effective_status",
                  limit: 500,
                },
              }
            )
          ),
          metaRequest(() =>
            axios.get(
              `https://graph.facebook.com/${META_API_VERSION}/${acctNode}/adsets`,
              {
                timeout: 20000,
                params: {
                  access_token: accessToken,
                  fields: "id,campaign_id,status,effective_status",
                  limit: 500,
                },
              }
            )
          ),
          metaRequest(() =>
            axios.get(
              `https://graph.facebook.com/${META_API_VERSION}/${acctNode}/ads`,
              {
                timeout: 20000,
                params: {
                  access_token: accessToken,
                  fields:
                    "id,adset_id,campaign_id,name,status,effective_status",
                  limit: 500,
                },
              }
            )
          ),
        ]);

        campaigns = campaignResp.data?.data || [];
        adsets = adsetsResp.data?.data || [];
        ads = adsResp.data?.data || [];
        // чтобы выйти из цикла и продолжить текущий handler
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    // если ни один токен не сработал
    if (!campaigns) {
      const data = lastErr?.response?.data;
      console.error("[campaigns] no connection had access", {
        msg: data?.error?.message || lastErr?.message,
        code: data?.error?.code,
        sub: data?.error?.error_subcode,
        status: lastErr?.response?.status,
        ax_code: lastErr?.code,
        errno: lastErr?.errno,
      });

      return res.status(403).json({
        error: "NO_ACCESS_TO_AD_ACCOUNT",
        meta: {
          status: lastErr?.response?.status || null,
          code: data?.error?.code || null,
          sub: data?.error?.error_subcode || null,
          message: data?.error?.message || lastErr?.message || "Unknown error",
          ax_code: lastErr?.code || null,
        },
      });
    }

    const now = Date.now();

    // кэшируем кампании (как и раньше)
    campaigns.forEach((c) => {
      db.run(
        `
INSERT INTO campaigns (id, app_user_id, account_id, name, status, effective_status, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?)
ON CONFLICT(id) DO UPDATE SET
  app_user_id = excluded.app_user_id,
  account_id = excluded.account_id,
  name = excluded.name,
  status = excluded.status,
  effective_status = excluded.effective_status,
  updated_at = excluded.updated_at

        `,
        [
          c.id,
          appUserId,
          acctNode,
          c.name || "",
          c.status || "",
          c.effective_status || "",
          now,
        ]
      );
    });

    // мапа: какой адсет имеет хотя бы одно активное объявление
    const adsetsWithActiveAds = new Set();
    ads.forEach((ad) => {
      if (
        ad.status === "ACTIVE" &&
        ad.effective_status === "ACTIVE" &&
        ad.adset_id
      ) {
        adsetsWithActiveAds.add(ad.adset_id);
      }
    });

    // список "по-настоящему активных" кампаний по твоей логике
    const activeCampaignIds = new Set();

    campaigns.forEach((c) => {
      // кампания сама должна быть активной
      if (!(c.status === "ACTIVE" && c.effective_status === "ACTIVE")) return;

      // ищем хотя бы один активный адсет этой кампании, у которого есть активное объявление
      const hasGoodAdset = adsets.some((a) => {
        if (a.campaign_id !== c.id) return false;
        if (!(a.status === "ACTIVE" && a.effective_status === "ACTIVE"))
          return false;
        return adsetsWithActiveAds.has(a.id);
      });

      if (hasGoodAdset) {
        activeCampaignIds.add(c.id);
      }
    });
    const uniq = new Map();
    for (const cc of campaigns || []) {
      if (!cc?.id) continue;
      if (!uniq.has(String(cc.id))) uniq.set(String(cc.id), cc);
    }
    campaigns = Array.from(uniq.values());

    res.json({
      campaigns,
      active_ids: Array.from(activeCampaignIds),
    });
  } catch (e) {
    console.error("campaigns error:", e.response?.data || e.message);
    if (e.code === "TOKEN_EXPIRED") {
      return res
        .status(401)
        .json({ error: "Access token expired, please login again" });
    }
    res.status(500).json({ error: "Failed to load campaigns" });
  }
});

// (адсеты/объявления в UI пока не нужны, поэтому отдельные эндпоинты можно не делать)

// ---------- API: Rules CRUD ----------

// список правил
app.get("/api/rules", requireAppAuth, (req, res) => {
  db.all(
    "SELECT * FROM rules WHERE app_user_id = ? ORDER BY created_at DESC",
    [req.session.appUserId],

    (err, rows) => {
      if (err) {
        console.error("rules list error:", err);
        return res.status(500).json({ error: "Failed to load rules" });
      }
      res.json({ rules: rows });
    }
  );
});

// создание правила
// создание правила
app.post("/api/rules", requireAppAuth, async (req, res) => {
  // ===== ПРОВЕРКА ПЛАНА =====
  const u = await getAppUserById(req.session.appUserId);
  if (!u) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (u.plan === "expired") {
    return res.status(403).json({
      error: "Plan expired",
      code: "PLAN_EXPIRED",
    });
  }
  // ===== ПРОВЕРКА ЛИМИТА ПРАВИЛ ПО ТАРИФУ =====
  const userPlan = u.plan || "trial";

  const planLimits = {
    trial: { maxRules: 5 },
    pro: { maxRules: 100 },
  };

  const limits = planLimits[userPlan] || planLimits.trial;

  const existingRules = await new Promise((resolve) => {
    db.get(
      `SELECT COUNT(*) as cnt FROM rules WHERE app_user_id = ?`,
      [u.id],
      (err, row) => resolve(row?.cnt || 0)
    );
  });

  if (existingRules >= limits.maxRules) {
    return res.status(403).json({
      error: "Plan limit reached. Upgrade required.",
      code: "PLAN_LIMIT",
    });
  }
  // ===== ПРОВЕРКА fb_connection_ids =====
  let fbConnectionIds = req.body.fb_connection_ids;

  if (typeof fbConnectionIds === "string") {
    try {
      fbConnectionIds = JSON.parse(fbConnectionIds);
    } catch {
      fbConnectionIds = [];
    }
  }

  if (!Array.isArray(fbConnectionIds) || fbConnectionIds.length === 0) {
    return res.status(400).json({ error: "fb_connection_ids required" });
  }

  // ===== ОСНОВНАЯ ЛОГИКА СОЗДАНИЯ ПРАВИЛА =====
  const {
    name,
    level,
    scope,
    selected_accounts,
    selected_campaigns,
    selected_adsets,
    selected_ads,
    timeframe,
    schedule_type,
    schedule_datetime,
    action_json,
    conditions_json,
  } = req.body;

  const fb_connection_ids = fbConnectionIds.map(String);
  const fbConnIdsJson = JSON.stringify(fb_connection_ids);

  const now = Date.now();

  let scheduleTs = null;
  if (schedule_type === "once" && schedule_datetime) {
    const parsed = Number(schedule_datetime);
    if (Number.isFinite(parsed)) scheduleTs = parsed;
  }

  db.run(
    `
    INSERT INTO rules (
      app_user_id,
      name, level, scope,
      selected_accounts, selected_campaigns, selected_adsets, selected_ads,
      timeframe, schedule_type, schedule_datetime,
      action_json, conditions_json,
      fb_connection_ids,
      status, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)
    `,
    [
      req.session.appUserId,
      name || "Rule",
      level || "campaign",
      scope || "selected",
      JSON.stringify(selected_accounts || []),
      JSON.stringify(selected_campaigns || []),
      JSON.stringify(selected_adsets || []),
      JSON.stringify(selected_ads || []),
      timeframe || "today",
      schedule_type || "every_30m",
      scheduleTs,
      JSON.stringify(action_json || {}),
      JSON.stringify(conditions_json || []),
      fbConnIdsJson,
      now,
      now,
    ],
    function (err) {
      if (err) {
        console.error("rules insert error:", err);
        return res.status(500).json({ error: "Failed to create rule" });
      }
      res.json({ id: this.lastID });
    }
  );
});

// GET правило для редактирования
app.get("/api/rules/:id", requireAppAuth, async (req, res) => {
  const ruleId = req.params.id;

  const rule = await getAsync(
    "SELECT * FROM rules WHERE id = ? AND app_user_id = ?",
    [ruleId, req.session.appUserId]
  );

  if (!rule) {
    return res.status(404).json({ error: "Rule not found" });
  }

  res.json({
    rule: {
      ...rule,
      selected_accounts: JSON.parse(rule.selected_accounts || "[]"),
      selected_campaigns: JSON.parse(rule.selected_campaigns || "[]"),
      selected_adsets: JSON.parse(rule.selected_adsets || "[]"),
      selected_ads: JSON.parse(rule.selected_ads || "[]"),
      fb_connection_ids: JSON.parse(rule.fb_connection_ids || "[]").map(Number),

      action_json: JSON.parse(rule.action_json || "{}"),
      conditions_json: JSON.parse(rule.conditions_json || "[]"),
    },
  });
});

// обновление правила
app.put("/api/rules/:id", requireAppAuth, async (req, res) => {
  try {
    const ruleId = req.params.id;

    const {
      name,
      level,
      scope,
      selected_accounts,
      selected_campaigns,
      selected_adsets,
      selected_ads,
      timeframe,
      schedule_type,
      schedule_datetime,
      action_json,
      conditions_json,
      status,
    } = req.body;
    // ===== ПРОВЕРКА ПЛАНА =====
    const u = await getAppUserById(req.session.appUserId);
    if (!u) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    if (u.plan === "expired") {
      return res.status(403).json({
        error: "Plan expired",
        code: "PLAN_EXPIRED",
      });
    }

    // 1. Загружаем существующее правило
    const existingRule = await getAsync(
      "SELECT * FROM rules WHERE id = ? AND app_user_id = ?",
      [ruleId, req.session.appUserId]
    );

    if (!existingRule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    const now = Date.now();

    // 2. schedule_datetime
    let scheduleTs = existingRule.schedule_datetime;
    if (schedule_type === "once" && schedule_datetime) {
      const parsed = Number(schedule_datetime);
      if (Number.isFinite(parsed)) scheduleTs = parsed;
    }

    // 3. SAFE поля (если фронт не прислал — сохраняем старые)
    const safeSelectedAccounts =
      Array.isArray(selected_accounts) && selected_accounts.length > 0
        ? JSON.stringify(selected_accounts)
        : existingRule.selected_accounts;

    const safeSelectedCampaigns =
      Array.isArray(selected_campaigns) && selected_campaigns.length > 0
        ? JSON.stringify(selected_campaigns)
        : existingRule.selected_campaigns;

    const safeSelectedAdsets =
      selected_adsets !== undefined
        ? JSON.stringify(selected_adsets)
        : existingRule.selected_adsets;

    const safeSelectedAds =
      selected_ads !== undefined
        ? JSON.stringify(selected_ads)
        : existingRule.selected_ads;

    const safeFbConnIds =
      Array.isArray(req.body.fb_connection_ids) &&
      req.body.fb_connection_ids.length > 0
        ? JSON.stringify(req.body.fb_connection_ids.map(String))
        : existingRule.fb_connection_ids;

    const safeActionJson =
      action_json !== undefined
        ? JSON.stringify(action_json)
        : existingRule.action_json;

    const safeConditionsJson =
      conditions_json !== undefined
        ? JSON.stringify(conditions_json)
        : existingRule.conditions_json;

    // 4. UPDATE (ПОРЯДОК ВАЖЕН)
    db.run(
      `
      UPDATE rules SET
        name = ?,
        level = ?,
        scope = ?,
        selected_accounts = ?,
        selected_campaigns = ?,
        selected_adsets = ?,
        selected_ads = ?,
        timeframe = ?,
        schedule_type = ?,
        schedule_datetime = ?,
        action_json = ?,
        conditions_json = ?,
        fb_connection_ids = ?,
        status = ?,
        updated_at = ?
      WHERE id = ? AND app_user_id = ?
      `,
      [
        name ?? existingRule.name,
        level ?? existingRule.level,
        scope ?? existingRule.scope,
        safeSelectedAccounts,
        safeSelectedCampaigns,
        safeSelectedAdsets,
        safeSelectedAds,
        timeframe ?? existingRule.timeframe,
        schedule_type ?? existingRule.schedule_type,
        scheduleTs,
        safeActionJson,
        safeConditionsJson,
        safeFbConnIds,
        status ?? existingRule.status,
        now,
        ruleId,
        req.session.appUserId,
      ],
      function (err) {
        if (err) {
          console.error("rules update error:", err);
          return res.status(500).json({ error: "Failed to update rule" });
        }
        res.json({ ok: true });
      }
    );
  } catch (e) {
    console.error("rules update fatal error:", e);
    res.status(500).json({ error: "Server error" });
  }
});

// удаление правила
app.delete("/api/rules/:id", requireAppAuth, (req, res) => {
  const ruleId = req.params.id;
  db.run(
    "DELETE FROM rules WHERE id = ? AND app_user_id = ?",
    [ruleId, req.session.appUserId],
    function (err) {
      if (err) {
        console.error("rules delete error:", err);
        return res.status(500).json({ error: "Failed to delete rule" });
      }
      res.json({ ok: true });
    }
  );
});

// toggle rule status (active <-> paused)
app.post("/api/rules/:id/toggle-status", requireAppAuth, async (req, res) => {
  const ruleId = req.params.id;
  const appUserId = req.session.appUserId;

  try {
    const rule = await getAsync(
      `SELECT id, status FROM rules WHERE id = ? AND app_user_id = ?`,
      [ruleId, appUserId]
    );

    if (!rule) {
      return res.status(404).json({ error: "Rule not found" });
    }

    const newStatus = rule.status === "active" ? "paused" : "active";
    const now = Date.now();

    await runAsync(`UPDATE rules SET status = ?, updated_at = ? WHERE id = ?`, [
      newStatus,
      now,
      ruleId,
    ]);

    return res.json({ ok: true, status: newStatus });
  } catch (e) {
    console.error("toggle-status error:", e);
    return res.status(500).json({ error: "Failed to toggle rule status" });
  }
});

// ---------- Core rule execution helpers ----------
//Timeframe helpers
function getTimeRangeForAccount(timeframe, accountTimezone) {
  if (!accountTimezone) return null;

  const nowTz = new Date(
    new Date().toLocaleString("en-US", { timeZone: accountTimezone })
  );

  const startOfDay = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const endOfDay = (d) => {
    const x = new Date(d);
    x.setHours(23, 59, 59, 999);
    return x;
  };

  // ВАЖНО: формат даты в timezone аккаунта, без toISOString()
  const fmtDateTz = (d) => {
    // YYYY-MM-DD в timezone аккаунта
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: accountTimezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(d);

    const y = parts.find((p) => p.type === "year")?.value;
    const m = parts.find((p) => p.type === "month")?.value;
    const dd = parts.find((p) => p.type === "day")?.value;
    return `${y}-${m}-${dd}`;
  };

  let sinceDate, untilDate;

  switch (timeframe) {
    case "today":
      sinceDate = startOfDay(nowTz);
      untilDate = endOfDay(nowTz);
      break;

    case "yesterday": {
      const y = new Date(nowTz);
      y.setDate(y.getDate() - 1);
      sinceDate = startOfDay(y);
      untilDate = endOfDay(y);
      break;
    }

    case "last_2d": {
      const s = new Date(nowTz);
      s.setDate(s.getDate() - 1);
      sinceDate = startOfDay(s);
      untilDate = endOfDay(nowTz);
      break;
    }

    case "last_3d": {
      const s = new Date(nowTz);
      s.setDate(s.getDate() - 2);
      sinceDate = startOfDay(s);
      untilDate = endOfDay(nowTz);
      break;
    }

    case "last_7d": {
      const s = new Date(nowTz);
      s.setDate(s.getDate() - 6);
      sinceDate = startOfDay(s);
      untilDate = endOfDay(nowTz);
      break;
    }

    case "last_14d": {
      const s = new Date(nowTz);
      s.setDate(s.getDate() - 13);
      sinceDate = startOfDay(s);
      untilDate = endOfDay(nowTz);
      break;
    }

    default:
      return null;
  }

  return {
    since: fmtDateTz(sinceDate),
    until: fmtDateTz(untilDate),
  };
}

// Helper: safe number parse
function safeNumber(val, def = 0) {
  if (val === null || val === undefined) return def;

  // поддержка "0,59"
  if (typeof val === "string") {
    const s = val.trim().replace(",", ".");
    const n = Number(s);
    return isFinite(n) ? n : def;
  }

  const n = Number(val);
  return isFinite(n) ? n : def;
}

// Helper: get action count from actions array
function getActionCount(actions, actionName) {
  if (!Array.isArray(actions)) return 0;
  const act = actions.find((a) => a.action_type === actionName);
  return act ? safeNumber(act.value, 0) : 0;
}

// Evaluate conditions against metrics
function evaluateConditions(metrics, conditions) {
  if (!Array.isArray(conditions) || conditions.length === 0) return true;

  const evalOne = (f) => {
    const metricVal = safeNumber(metrics?.[f.metric], 0);
    const threshold = safeNumber(f.value, 0);

    switch (f.operator) {
      case ">":
        return metricVal > threshold;
      case ">=":
        return metricVal >= threshold;
      case "<":
        return metricVal < threshold;
      case "<=":
        return metricVal <= threshold;
      case "==":
        return metricVal === threshold;
      case "!=":
        return metricVal !== threshold;
      default:
        return false;
    }
  };

  // стартуем с результата первого условия
  let acc = evalOne(conditions[0]);

  // а дальше сворачиваем по logic каждого следующего условия
  for (let i = 1; i < conditions.length; i++) {
    const f = conditions[i];
    const ok = evalOne(f);
    if ((f.logic || "AND") === "OR") acc = acc || ok;
    else acc = acc && ok;
  }

  return acc;
}

// Fetch insights for a specific level (campaign/adset/ad)
async function fetchInsightsForAccountLevel(
  accountId,
  level,
  accessToken,
  timeframe,
  cache = {},
  timeRange = null
) {
  const act = normalizeActId(accountId);
  if (!act) return {};

  const todayStr = new Date().toISOString().split("T")[0];

  const timeRanges = {
    today: { since: todayStr, until: todayStr },
    yesterday: {
      since: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      until: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    },
    last_2d: {
      since: new Date(Date.now() - 2 * 86400000).toISOString().split("T")[0],
      until: todayStr,
    },
    last_3d: {
      since: new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0],
      until: todayStr,
    },
    last_7d: {
      since: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0],
      until: todayStr,
    },
    last_14d: {
      since: new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0],
      until: todayStr,
    },
  };

  const tr = timeRange || timeRanges[timeframe] || timeRanges.last_7d;

  const fields = [
    "spend",
    "impressions",
    "unique_clicks",
    "actions",
    "campaign_id",
    "adset_id",
    "ad_id",
  ].join(",");

  const byObjectId = {};

  // 1-я страница
  let nextUrl = `https://graph.facebook.com/${META_API_VERSION}/${act}/insights`;
  let isFirst = true;

  const firstParams = {
    access_token: accessToken,
    level,
    time_range: JSON.stringify(tr),
    fields,
    limit: 500,
  };

  try {
    while (nextUrl) {
      const resp = isFirst
        ? await metaRequest(() =>
            axios.get(nextUrl, { params: firstParams, timeout: 20000 })
          )
        : await metaRequest(() => axios.get(nextUrl, { timeout: 20000 }));

      isFirst = false;

      const rows = resp.data?.data || [];
      for (const r of rows) {
        let objectId = null;
        if (level === "campaign") objectId = r.campaign_id || null;
        else if (level === "adset") objectId = r.adset_id || null;
        else if (level === "ad") objectId = r.ad_id || null;

        if (!objectId) continue;

        const spend = safeNumber(r.spend, 0);
        const impressions = safeNumber(r.impressions, 0);
        const uniqueClicks = safeNumber(r.unique_clicks, 0);

        const leads = getActionCount(r.actions, "lead");
        const registrations = getActionCount(
          r.actions,
          "complete_registration"
        );
        const purchases = getActionCount(r.actions, "purchase");
        const installs = getActionCount(r.actions, "mobile_app_install");
        const appPurchases = getActionCount(r.actions, "mobile_app_purchase");

        byObjectId[String(objectId)] = {
          object_id: String(objectId),
          campaign_id: r.campaign_id || null,
          adset_id: r.adset_id || null,
          metrics: finalizeDerivedMetrics({
            spend,
            impressions,
            unique_clicks: uniqueClicks,
            leads,
            registrations,
            purchases,
            installs,
            app_purchases: appPurchases,
          }),
        };
      }

      nextUrl = resp.data?.paging?.next || null;
    }
  } catch (e) {
    const msg = e?.response?.data?.error?.message || e.message;
    const sub = e?.response?.data?.error?.error_subcode;
    const code = e?.response?.data?.error?.code;
    console.error(
      "[insights error]",
      act,
      level,
      "status=",
      e?.response?.status,
      "code=",
      code,
      "sub=",
      sub,
      "msg=",
      msg
    );
  }

  return byObjectId;
}

// Apply action to object (pause/start/budget change)
async function applyActionToObject(objectId, level, accessToken, action) {
  const endpointMap = {
    campaign: "campaigns",
    adset: "adsets",
    ad: "ads",
  };

  const endpoint = endpointMap[level];
  if (!endpoint) throw new Error(`Unsupported level: ${level}`);

  const url = `https://graph.facebook.com/${META_API_VERSION}/${objectId}`;

  const fields = {};

  switch (action.type) {
    case "pause":
      fields.status = "PAUSED";
      break;

    case "start":
      fields.status = "ACTIVE";
      break;

    case "increase_budget_percent":
    case "decrease_budget_percent":
    case "increase_budget_value":
    case "decrease_budget_value": {
      if (level !== "adset") {
        throw new Error(
          `Budget change supported only for adset (got level=${level})`
        );
      }

      // 1) GET текущий бюджет (через metaRequest(() => axios.get))
      let data;
      try {
        const currentResp = await metaRequest(() =>
          axios.get(url, {
            params: {
              access_token: accessToken,
              fields: "daily_budget,lifetime_budget",
            },
          })
        );
        data = currentResp?.data || {};
      } catch (e) {
        throw new Error(
          `Failed to load current budget: ${
            e.response?.data?.error?.message || e.message
          }`
        );
      }

      // 2) Определяем какое поле реально установлено
      const hasDaily = safeNumber(data.daily_budget, 0) > 0;
      const hasLifetime = safeNumber(data.lifetime_budget, 0) > 0;

      const budgetField = hasDaily
        ? "daily_budget"
        : hasLifetime
        ? "lifetime_budget"
        : null;
      if (!budgetField) throw new Error("No budget set");

      const currentBudget = safeNumber(data[budgetField], 0);
      if (currentBudget <= 0) throw new Error("No budget set");

      // 3) Считаем новый бюджет
      let newBudget = currentBudget;

      if (action.type.includes("percent")) {
        const percent = safeNumber(action.value, 10) / 100;
        newBudget = Math.round(
          action.type.includes("increase")
            ? currentBudget * (1 + percent)
            : currentBudget * (1 - percent)
        );
      } else {
        // action.value приходит "в долларах" (major units), budget хранится в minor units
        const valueMajor = safeNumber(action.value, 10);
        const valueMinor = Math.round(valueMajor * 100);

        newBudget = action.type.includes("increase")
          ? currentBudget + valueMinor
          : currentBudget - valueMinor;
      }

      // 4) Ограничения (cap + не ниже 0)
      if (action.cap) {
        const capMinor = Math.round(safeNumber(action.cap, 0) * 100);
        if (capMinor > 0 && newBudget > capMinor) newBudget = capMinor;
      }

      if (newBudget < 0) newBudget = 0;

      // 5) Пишем ТОЛЬКО одно поле (daily или lifetime)
      fields[budgetField] = newBudget;

      break;
    }

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }

  // 6) POST апдейт (тоже через metaRequest(() => axios.post))
  const resp = await metaRequest(() =>
    axios.post(url, fields, {
      params: { access_token: accessToken },
    })
  );

  return resp.data;
}

// ----- логирование выполнения правила -----
function insertRuleLog({
  ruleId,
  appUserId,
  status,
  message,
  affected,
  metaRequests,
}) {
  const now = Date.now();
  db.run(
    `
      INSERT INTO rule_logs (
        rule_id, app_user_id, executed_at, status, message, affected_objects, meta_request_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [ruleId, appUserId, now, status, message, affected, metaRequests],
    (err) => {
      if (err) {
        console.error("rule_logs insert error:", err);
      }
    }
  );
}

// ----- ядро выполнения правила -----

// ----- ядро выполнения правила -----
async function runRuleCore(user, rule, userCache) {
  const accessToken = user.access_token;
  const timeframe = rule.timeframe || "today";
  const level = rule.level || "campaign";

  let rawConditions = [];
  let singleAction = {};
  let selectedAccounts = [];
  let selectedCampaigns = [];

  try {
    rawConditions = JSON.parse(rule.conditions_json || "[]");
  } catch {}
  try {
    singleAction = JSON.parse(rule.action_json || "{}");
  } catch {}
  try {
    selectedAccounts = JSON.parse(rule.selected_accounts || "[]");
  } catch {}
  try {
    selectedCampaigns = JSON.parse(rule.selected_campaigns || "[]");
  } catch {}

  const selectedCampaignSet = new Set((selectedCampaigns || []).map(String));

  // ===== groups (условия + action) =====
  let groups = [];
  if (Array.isArray(rawConditions) && rawConditions.length) {
    const first = rawConditions[0];
    if (first && typeof first === "object" && "conditions" in first) {
      groups = rawConditions.map((g) => {
        const action =
          g && g.action && Object.keys(g.action).length
            ? g.action
            : Object.keys(singleAction || {}).length
            ? singleAction
            : { type: "pause" };
        const conds = Array.isArray(g.conditions) ? g.conditions : [];
        return { action, conditions: conds };
      });
    } else {
      groups = [
        {
          action: Object.keys(singleAction || {}).length
            ? singleAction
            : { type: "pause" },
          conditions: rawConditions,
        },
      ];
    }
  } else {
    groups = [
      {
        action: Object.keys(singleAction || {}).length
          ? singleAction
          : { type: "pause" },
        conditions: [],
      },
    ];
  }

  // ===== accountsToUse =====
  let affected = 0;
  let requestCount = 0;
  let accountsToUse = [];
  if (Array.isArray(selectedAccounts) && selectedAccounts.length > 0) {
    accountsToUse = selectedAccounts.map(String);
  } else {
    try {
      const resp = await metaRequest(() =>
        axios.get(
          `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts`,
          {
            params: {
              access_token: accessToken,
              fields: "id,account_status",
              limit: 500,
            },
            timeout: 20000,
          }
        )
      );
      requestCount += 1;

      accountsToUse = (resp.data.data || [])
        .filter((a) => a.account_status === 1)
        .map((a) => String(a.id));
    } catch (e) {
      console.error(
        "Failed to fetch ad accounts during rule execution:",
        e.response?.data || e.message
      );
      accountsToUse = [];
    }
  }

  if (!accountsToUse.length) {
    return { affected: 0, requestCount: 0 };
  }

  // ===== главный цикл по ad accounts =====
  for (const accountId of accountsToUse) {
    // ===== ШАГ 1: TIMEZONE per account =====
    let accountTimezone = null;

    const cachedTz = accountTimezoneCache.get(accountId);
    if (cachedTz && cachedTz.expiresAt > Date.now()) {
      accountTimezone = cachedTz.tz;
    } else {
      try {
        const tzResp = await metaRequest(() =>
          axios.get(
            `https://graph.facebook.com/${META_API_VERSION}/${accountId}`,
            {
              params: {
                access_token: accessToken,
                fields: "timezone_name",
              },
            }
          )
        );
        requestCount += 1;

        accountTimezone = tzResp.data?.timezone_name || null;

        if (accountTimezone) {
          accountTimezoneCache.set(accountId, {
            tz: accountTimezone,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          });
        }
      } catch (e) {
        console.error(
          "Failed to fetch account timezone",
          accountId,
          e.response?.data || e.message
        );
        // timezone останется null — timeRange функция должна это пережить
      }
    }

    // ===== ШАГ 2: TIME RANGE =====
    const timeRange = getTimeRangeForAccount(timeframe, accountTimezone);

    // ===== ШАГ 3: INSIGHTS (ОДИН РАЗ на account+level+range) =====
    const insightsCacheKey =
      accountId +
      "|" +
      level +
      "|" +
      timeframe +
      "|" +
      JSON.stringify(timeRange || {});

    let rowsByObject;
    if (insightsTickCache.has(insightsCacheKey)) {
      rowsByObject = insightsTickCache.get(insightsCacheKey);
    } else {
      rowsByObject = await fetchInsightsForAccountLevel(
        accountId,
        level,
        accessToken,
        timeframe,
        userCache,
        timeRange
      );
      requestCount += 1;
      insightsTickCache.set(insightsCacheKey, rowsByObject);
    }

    const objectIds = Object.keys(rowsByObject || {});

    console.log("[debug]", "rule", rule.id, "objects", objectIds.length);

    if (objectIds.length) {
      const firstId = objectIds[0];
      console.log("[debug]", "first", firstId, "row=", rowsByObject[firstId]);
      console.log("[debug]", "first.metrics=", rowsByObject[firstId]?.metrics);
    }

    for (const objectId of objectIds) {
      const row = rowsByObject[objectId];
      if (!row || !row.metrics) continue;

      // фильтр по выбранным кампаниям (если задан)
      if (selectedCampaignSet.size > 0) {
        if (
          !row.campaign_id ||
          !selectedCampaignSet.has(String(row.campaign_id))
        ) {
          continue;
        }
      }

      const metrics = row.metrics;

      for (const group of groups) {
        const conds = Array.isArray(group.conditions) ? group.conditions : [];
        if (!conds.length) continue; // оставляю как у тебя: без условий не применяем

        const match = evaluateConditions(metrics, conds);
        if (!match) continue;

        const groupAction =
          group.action && Object.keys(group.action).length
            ? group.action
            : Object.keys(singleAction || {}).length
            ? singleAction
            : { type: "pause" };

        // ===== MAX CHANGES PER DAY =====
        if (
          groupAction.max_changes_per_day &&
          groupAction.max_changes_per_day > 0
        ) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const todayTs = today.getTime();

          const usedToday = await new Promise((resolve) => {
            db.get(
              `
              SELECT COUNT(*) as cnt
              FROM rule_action_limits
              WHERE
                rule_id = ?
                AND object_id = ?
                AND action_type = ?
                AND applied_at >= ?
              `,
              [rule.id, String(objectId), groupAction.type, todayTs],
              (err, row2) => {
                if (err) return resolve(0);
                resolve(row2?.cnt || 0);
              }
            );
          });

          if (usedToday >= groupAction.max_changes_per_day) {
            continue;
          }
        }

        try {
          const result = await applyActionToObject(
            objectId,
            level,
            accessToken,
            groupAction
          );
          requestCount += 1;
          affected += 1;

          // фиксируем лимит
          if (
            groupAction.max_changes_per_day &&
            groupAction.max_changes_per_day > 0
          ) {
            db.run(
              `
              INSERT INTO rule_action_limits (
                rule_id,
                object_id,
                action_type,
                applied_at
              ) VALUES (?, ?, ?, ?)
              `,
              [rule.id, String(objectId), groupAction.type, Date.now()]
            );
          }

          console.log("Rule applied", {
            ruleId: rule.id,
            level,
            accountId,
            objectId,
            action: groupAction,
            result,
          });

          break; // применили action для этой группы — выходим из groups
        } catch (e) {
          console.error(
            "Error applying action",
            objectId,
            e.response?.data || e.message
          );
        }
      }
    }
  }

  // last_run_at тут больше НЕ трогаем — это делает schedulerTick finally
  return { affected, requestCount };
}

// Keep selected connection in session for downstream endpoints (optional but helps UX).

// логи
app.get("/api/logs", requireAppAuth, (req, res) => {
  const sql = `
    SELECT
      rl.id,
      rl.rule_id,
      rl.status,
      rl.executed_at,
      rl.message,
      rl.affected_objects,
      rl.meta_request_count,
      r.name AS rule_name
    FROM rule_logs rl
    LEFT JOIN rules r ON r.id = rl.rule_id
    WHERE rl.app_user_id = ?
    ORDER BY rl.executed_at DESC
    LIMIT 200
  `;

  db.all(sql, [req.session.appUserId], (err, rows) => {
    if (err) {
      console.error("logs error:", err);
      return res.status(500).json({ error: "Failed to load logs" });
    }
    res.json({ logs: rows });
  });
});

// системный юзер — проверка токена
app.get("/api/system/ping", async (req, res) => {
  try {
    const token = SYSTEM_USER_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ ok: false, error: "SYSTEM_USER_TOKEN is missing" });
    }

    const url = `https://graph.facebook.com/${META_API_VERSION}/me`;
    const r = await axios.get(url, { params: { access_token: token } });

    res.json({
      ok: true,
      id: r.data.id,
      name: r.data.name,
      email: r.data.email || null,
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e.response?.data || e.message,
    });
  }
});

// системный юзер — набивка API-запросов для ревью
app.post("/api/system/load-test", async (req, res) => {
  try {
    const token = SYSTEM_USER_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ ok: false, error: "SYSTEM_USER_TOKEN is missing" });
    }

    const N = (req.body && Number(req.body.count)) || 40;
    const results = [];

    for (let i = 0; i < N; i++) {
      try {
        await axios.get(
          `https://graph.facebook.com/${META_API_VERSION}/me/adaccounts`,
          { params: { access_token: token, limit: 1 } }
        );
        results.push("ok");
      } catch (e) {
        results.push("err");
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    res.json({ ok: true, sent: results.length, results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ---------- Scheduler (auto-run) ----------

function getSchedulePeriodMs(scheduleType) {
  switch (scheduleType) {
    case "every_30m":
    case "every_30min":
      return 30 * 60 * 1000;
    case "every_1h":
    case "hourly":
      return 60 * 60 * 1000;
    case "every_2h":
      return 2 * 60 * 60 * 1000;
    case "once":
      // особая логика
      return null;
    default:
      // по умолчанию каждые 30 минут
      return 30 * 60 * 1000;
  }
}

function shouldRunRule(rule, now) {
  // rule должен быть активным
  if (rule.status !== "active") return false;

  const lastRun = Number(rule.last_run_at || 0);

  switch (rule.schedule_type) {
    case "once": {
      if (!rule.schedule_datetime) return false;
      if (lastRun > 0) return false;
      return now >= Number(rule.schedule_datetime);
    }

    case "every_30m":
    case "every_30min": {
      return now - lastRun >= 30 * 60 * 1000;
    }

    case "every_1h":
    case "hourly": {
      return now - lastRun >= 60 * 60 * 1000;
    }

    case "every_2h": {
      return now - lastRun >= 2 * 60 * 60 * 1000;
    }

    default:
      return false;
  }
}

// Автопауза правил, если у пользователя нет активных fb_connections
async function enforceNoActiveConnectionsAutopause() {
  return new Promise((resolve) => {
    db.all(
      `
      SELECT au.id AS app_user_id
      FROM app_users au
      LEFT JOIN fb_connections fc ON fc.app_user_id = au.id AND fc.status = 'active'
      GROUP BY au.id
      HAVING COUNT(fc.id) = 0
      `,
      [],
      (err, rows) => {
        if (err) {
          console.error(
            "Error in enforceNoActiveConnectionsAutopause query:",
            err
          );
          return resolve();
        }
        if (!rows || rows.length === 0) return resolve();

        const ids = rows.map((r) => r.app_user_id);
        const placeholders = ids.map(() => "?").join(",");

        db.run(
          `UPDATE rules SET status = 'paused', updated_at = ? WHERE status = 'active' AND app_user_id IN (${placeholders})`,
          [Date.now(), ...ids],
          (runErr) => {
            if (runErr) {
              console.error(
                "Error pausing rules for users without connections:",
                runErr
              );
            }
            resolve();
          }
        );
      }
    );
  });
}
// Автопауза при истёкшем триале
async function enforceExpiredAutopause() {
  const now = nowMs();

  // Находим пользователей с истёкшим trial
  const expiredUsers = await allAsync(
    `SELECT id FROM app_users WHERE plan = 'trial' AND trial_ends_at IS NOT NULL AND ? > trial_ends_at`,
    [now]
  );

  if (expiredUsers.length === 0) return;

  for (const user of expiredUsers) {
    // Переводим в expired
    await runAsync(
      `UPDATE app_users SET plan = 'expired', updated_at = ? WHERE id = ?`,
      [now, user.id]
    );

    // Паузим все активные правила этого пользователя
    await runAsync(
      `UPDATE rules SET status = 'paused', updated_at = ? WHERE app_user_id = ? AND status = 'active'`,
      [now, user.id]
    );
  }
}

async function schedulerTick() {
  insightsTickCache.clear();
  const now = Date.now();

  try {
    await enforceNoActiveConnectionsAutopause();
  } catch (e) {
    console.error("Scheduler: enforce autopause error", e);
  }

  try {
    await enforceExpiredAutopause();
  } catch (e) {
    console.error("Scheduler: enforce expired autopause error", e);
  }

  db.all(
    `
    SELECT r.*
    FROM rules r
    WHERE r.status = 'active'
      AND r.is_running = 0
    `,
    [],
    async (err, rules) => {
      if (err) {
        console.error("Scheduler: load rules error", err);
        return;
      }
      if (!rules || !rules.length) return;

      // группируем по app_user_id + фильтруем по расписанию
      const rulesByAppUser = {};
      for (const r of rules) {
        if (!shouldRunRule(r, now)) continue;
        const key = String(r.app_user_id);
        if (!rulesByAppUser[key]) rulesByAppUser[key] = [];
        rulesByAppUser[key].push(r);
      }

      for (const appUserIdStr of Object.keys(rulesByAppUser)) {
        const appUserId = Number(appUserIdStr);
        const userRules = rulesByAppUser[appUserIdStr];

        // загружаем активные коннекты для этого app_user
        const connections = await new Promise((resolve) => {
          db.all(
            `
            SELECT id, fb_user_id, access_token, name, status
            FROM fb_connections
            WHERE app_user_id = ? AND status = 'active' AND access_token IS NOT NULL
            `,
            [appUserId],
            (err2, rows) => {
              if (err2) {
                console.error("Scheduler: load connections error", err2);
                return resolve([]);
              }
              resolve(rows || []);
            }
          );
        });

        if (!connections.length) {
          console.warn(
            "Scheduler: no active connections for app_user",
            appUserId
          );
          continue;
        }

        for (const rule of userRules) {
          // === LOCK RULE (atomic) ===
          const lock = await runAsync(
            `
            UPDATE rules
            SET is_running = 1,
                updated_at = ?
            WHERE id = ?
              AND is_running = 0
            `,
            [Date.now(), rule.id]
          );

          if (lock.changes === 0) {
            // правило уже выполняется другим scheduler-тиком
            continue;
          }

          // ВАЖНО: после lock ВСЁ выполнение правила под try/finally,
          // чтобы гарантированно снять is_running + обновить last_run_at
          try {
            // читаем список выбранных фарм для правила
            let ruleConnIds = [];
            try {
              ruleConnIds = JSON.parse(rule.fb_connection_ids || "[]").map(
                String
              );
            } catch (e) {
              console.error("Invalid fb_connection_ids JSON in rule", rule.id);
              ruleConnIds = [];
            }

            // берём ТОЛЬКО выбранные и активные connections (если список пуст – используем все)
            let availableConns = connections;
            if (ruleConnIds.length) {
              availableConns = connections.filter((c) =>
                ruleConnIds.includes(String(c.id))
              );
            }

            if (!availableConns.length) {
              insertRuleLog({
                ruleId: rule.id,
                appUserId,
                status: "error",
                message: "No active Facebook connection for rule",
                affected: 0,
                metaRequests: 0,
              });
              continue;
            }

            // === НОВАЯ ЛОГИКА: пробуем ВСЕ доступные фармы ===
            let totalAffected = 0;
            let totalRequests = 0;
            const MAX_META_REQUESTS_PER_RULE = 100;
            let hadSuccess = false;
            const errors = [];

            for (const conn of availableConns) {
              // === SAFETY: stop if Meta request limit reached ===
              if (totalRequests >= MAX_META_REQUESTS_PER_RULE) {
                console.warn(
                  "Rule",
                  rule.id,
                  "stopped due to Meta request limit"
                );
                break;
              }
              if (!conn.access_token) {
                errors.push(`conn ${conn.id}: missing access_token`);
                continue;
              }
              const token = decryptToken(conn.access_token);
              if (!token) {
                errors.push(`conn ${conn.id}: empty token`);
                continue;
              }

              const fakeUser = {
                id: null,
                access_token: token,
                fb_user_id: conn.fb_user_id,
              };

              try {
                const result = await runRuleCore(fakeUser, rule, {});

                // runRuleCore у тебя ожидается как: { affected, requestCount }
                const affected = Number(result?.affected || 0);
                const requestCount = Number(result?.requestCount || 0);

                totalAffected += affected;
                totalRequests += requestCount;

                // Считаем успехом только реальный успешный прогон (не просто "запустилось")
                // Даже если affected=0 — это всё равно успешное выполнение правила.
                hadSuccess = true;

                // === SAFETY: check again after execution ===
                if (totalRequests >= MAX_META_REQUESTS_PER_RULE) {
                  console.warn(
                    "Rule",
                    rule.id,
                    "reached Meta request limit during execution"
                  );
                  break;
                }
              } catch (e) {
                console.error(
                  "Scheduler error running rule",
                  rule.id,
                  "connection",
                  conn.id,
                  e.response?.data || e.message
                );

                errors.push(
                  `conn ${conn.id}: ${
                    e.response?.data?.error?.message || e.message
                  }`
                );
              }
            }

            // === ЛОГ РЕЗУЛЬТАТА ===
            if (!hadSuccess) {
              insertRuleLog({
                ruleId: rule.id,
                appUserId,
                status: "error",
                message:
                  errors.length > 0
                    ? errors.join(" | ")
                    : "All Facebook connections failed",
                affected: totalAffected || 0,
                metaRequests: totalRequests || 0, // FIX: было 0, теперь правда
              });

              // === COMPLETE ONCE RULE ===
              // (по твоей логике: даже если все упали — "once" помечается completed)
              if (rule.schedule_type === "once") {
                await runAsync(
                  `
                  UPDATE rules
                  SET status = 'completed',
                      updated_at = ?
                  WHERE id = ?
                  `,
                  [Date.now(), rule.id]
                );
              }
            } else {
              insertRuleLog({
                ruleId: rule.id,
                appUserId,
                status: "success",
                message:
                  totalRequests >= MAX_META_REQUESTS_PER_RULE
                    ? `Stopped after ${totalRequests} Meta requests (safety limit)`
                    : totalAffected > 0
                    ? `Applied to ${totalAffected} objects`
                    : "No objects matched conditions",
                affected: totalAffected || 0,
                metaRequests: totalRequests || 0,
              });

              // OPTIONAL: если тебе нужно "once" завершать даже при success — можно включить.
              // Сейчас оставляю как у тебя: once завершался только в error-ветке.
              // Если хочешь, скажи — добавлю в success-ветку тоже.
            }
          } finally {
            // ВСЕГДА: снимаем running и обновляем last_run_at
            const t = Date.now();
            try {
              await runAsync(
                `
                UPDATE rules
                SET is_running = 0,
                    last_run_at = ?,
                    updated_at = ?
                WHERE id = ?
                `,
                [t, t, rule.id]
              );
            } catch (e) {
              console.error(
                "[scheduler] failed to unlock rule",
                rule.id,
                e?.message || e
              );
            }
          }
        }
      }
    }
  );
}

// --- Legal static pages ---
// Privacy Policy
app.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "privacy-policy.html"));
});

// Terms of Service
app.get("/terms", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "terms.html"));
});

// ЛЕНД — ТОЛЬКО /
app.get("/", (req, res) => {
  if (req.session.appUserId) return res.redirect("/app");
  res.sendFile(path.join(__dirname, "public", "landing.html"));
});

// SPA — БЕЗ /
const SPA_ROUTES = ["/app", "/rules", "/logs", "/payment", "/creatives"];

app.get(SPA_ROUTES, (req, res) => {
  if (!req.session.appUserId) {
    return res.redirect("/");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// запускаем шедулер
async function schedulerLoop() {
  try {
    await schedulerTick();
  } catch (e) {
    console.error("Scheduler loop error", e);
  } finally {
    setTimeout(schedulerLoop, SCHEDULER_INTERVAL_MS);
  }
}

// стартуем ОДИН раз
schedulerLoop();

// ===== CLEAN OLD RULE LOGS (every hour) =====
setInterval(() => {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;

  db.run("DELETE FROM rule_logs WHERE executed_at < ?", [cutoff], (err) => {
    if (err) {
      console.error("rule_logs cleanup error:", err);
    }
  });
}, 60 * 60 * 1000); // раз в час
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
