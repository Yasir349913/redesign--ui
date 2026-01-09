// db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = process.env.DB_PATH || "./data.db";

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
`);

db.serialize(() => {
  // ===== SaaS users (email auth) - CREATE FIRST (referenced by other tables) =====
  db.run(`
    CREATE TABLE IF NOT EXISTS app_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password_hash TEXT,
      email_verified_at INTEGER,
      plan TEXT DEFAULT 'trial_pending',
      trial_used INTEGER DEFAULT 0,
      trial_started_at INTEGER,
      trial_ends_at INTEGER,
      pro_ends_at INTEGER,
      created_at INTEGER,
      updated_at INTEGER
    )
  `);

  // Правила - with is_running column included from the start
  db.run(`
    CREATE TABLE IF NOT EXISTS rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER NOT NULL,
      name TEXT,
      level TEXT,
      scope TEXT,
      selected_accounts TEXT,
      selected_campaigns TEXT,
      selected_adsets TEXT,
      selected_ads TEXT,
      timeframe TEXT,
      schedule_type TEXT,
      schedule_datetime INTEGER,
      action_json TEXT,
      conditions_json TEXT,
      status TEXT DEFAULT 'active',
      last_run_at INTEGER,
      fb_connection_ids TEXT,
      is_running INTEGER DEFAULT 0,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  // Now create indexes AFTER table exists with all columns
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rules_status_running ON rules (status, is_running)`
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rules_last_run ON rules (last_run_at)`
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rules_app_user_id ON rules(app_user_id)`
  );

  // Логи выполнения правил
  db.run(`
    CREATE TABLE IF NOT EXISTS rule_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_id INTEGER,
      app_user_id INTEGER,
      executed_at INTEGER,
      status TEXT,
      message TEXT,
      affected_objects INTEGER,
      meta_request_count INTEGER,
      FOREIGN KEY(rule_id) REFERENCES rules(id),
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rule_logs_app_user_id ON rule_logs(app_user_id)`
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rule_logs_executed_at ON rule_logs (executed_at)`
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS rule_action_limits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_id INTEGER NOT NULL,
      object_id TEXT NOT NULL,
      action_type TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    )
  `);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_rule_action_limits_lookup ON rule_action_limits (rule_id, object_id, action_type, applied_at)`
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS rule_object_actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rule_id INTEGER,
      object_id TEXT,
      executed_at INTEGER
    )
  `);

  // Кэш-таблицы
  db.run(`
    CREATE TABLE IF NOT EXISTS cached_ad_accounts (
      id TEXT PRIMARY KEY,
      app_user_id INTEGER NOT NULL,
      name TEXT,
      account_status INTEGER,
      currency TEXT,
      updated_at INTEGER,
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cached_campaigns (
      id TEXT PRIMARY KEY,
      app_user_id INTEGER NOT NULL,
      account_id TEXT,
      name TEXT,
      status TEXT,
      effective_status TEXT,
      updated_at INTEGER,
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS email_verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      code TEXT,
      expires_at INTEGER,
      used_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES app_users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      code TEXT,
      expires_at INTEGER,
      used_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES app_users(id)
    )
  `);

  // ===== SaaS: FB connections =====
  db.run(`
    CREATE TABLE IF NOT EXISTS fb_connections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER NOT NULL,
      fb_user_id TEXT NOT NULL,
      name TEXT,
      access_token TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(app_user_id, fb_user_id),
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS app_user_ad_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER NOT NULL,
      ad_account_id TEXT NOT NULL,
      first_seen_at INTEGER NOT NULL,
      last_seen_at INTEGER NOT NULL,
      UNIQUE(app_user_id, ad_account_id),
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  // ===== Billing: invoices/payments =====
  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      app_user_id INTEGER NOT NULL,
      plan TEXT NOT NULL,
      price_amount REAL NOT NULL,
      price_currency TEXT NOT NULL,
      pay_currency TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_payment_id TEXT,
      pay_address TEXT,
      pay_amount REAL,
      pay_amount_received REAL,
      payment_status TEXT DEFAULT 'pending',
      invoice_url TEXT,
      expires_at INTEGER,
      created_at INTEGER,
      updated_at INTEGER,
      paid_at INTEGER,
      UNIQUE(provider, provider_payment_id),
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      invoice_id INTEGER NOT NULL,
      app_user_id INTEGER NOT NULL,
      provider TEXT NOT NULL,
      provider_payment_id TEXT NOT NULL,
      payment_status TEXT,
      pay_currency TEXT,
      price_amount REAL,
      pay_amount REAL,
      actually_paid REAL,
      txid TEXT,
      raw_json TEXT,
      created_at INTEGER,
      UNIQUE(provider, provider_payment_id),
      FOREIGN KEY(invoice_id) REFERENCES invoices(id),
      FOREIGN KEY(app_user_id) REFERENCES app_users(id)
    )
  `);

  // Site events
  db.run(`
    CREATE TABLE IF NOT EXISTS site_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event TEXT NOT NULL,
      anon_id TEXT NOT NULL,
      ip TEXT,
      ua TEXT,
      created_at INTEGER
    )
  `);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_site_events_created ON site_events(created_at)`
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_site_events_anon ON site_events(anon_id)`
  );

  // Admin creatives cache
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_creatives (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      asset_key TEXT NOT NULL,
      link_url TEXT NOT NULL,
      type TEXT,
      media_url TEXT,
      media_url_full TEXT,
      thumb_url TEXT,
      video_id TEXT,
      src_conn_id INTEGER,
      created_at INTEGER,
      UNIQUE(asset_key, link_url)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin_creative_stats_daily (
      day TEXT NOT NULL,
      asset_key TEXT NOT NULL,
      link_url TEXT NOT NULL,
      spend REAL DEFAULT 0,
      impressions INTEGER DEFAULT 0,
      unique_clicks INTEGER DEFAULT 0,
      leads INTEGER DEFAULT 0,
      registrations INTEGER DEFAULT 0,
      purchases INTEGER DEFAULT 0,
      app_purchases INTEGER DEFAULT 0,
      PRIMARY KEY(day, asset_key, link_url)
    )
  `);
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_admin_crea_day ON admin_creative_stats_daily(day)`
  );
  db.run(
    `CREATE INDEX IF NOT EXISTS idx_admin_crea_pair ON admin_creative_stats_daily(asset_key, link_url)`
  );

  db.run(`
    CREATE TABLE IF NOT EXISTS admin_sync_state (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      status TEXT DEFAULT 'idle',
      last_sync_at INTEGER DEFAULT 0,
      progress_total INTEGER DEFAULT 0,
      progress_done INTEGER DEFAULT 0,
      last_error TEXT DEFAULT ''
    )
  `);
  db.run(`INSERT OR IGNORE INTO admin_sync_state(id) VALUES (1)`);
});

module.exports = db;
