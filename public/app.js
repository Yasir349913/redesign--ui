// ====== i18n ======
let SAAS_BLOCKED = false;

const i18n = {
  ru: {
    logs_manual_run: "Ручной запуск",
    logs_scheduler_run: "Автоматический запуск",
    logs_affected: "Затронуто объектов",
    rule_activate: "Включить правило",
    rule_pause: "Остановить правило",
    toggle_status_error: "Ошибка смены статуса правила",

    login_btn: "Войти через Facebook",
    tab_rules: "Правила",
    tab_logs: "Логи",
    tab_billing: "Оплата",
    tab_creatives: "Креативы",
    rules_title: "Правила",
    create_rule_btn: "Создать правило",
    no_rules: "Правил пока нет.",
    logs_title: "Логи",
    no_logs: "Логов пока нет.",
    billing_title: "Оплата",
    billing_soon: "Позже добавим крипту и статусы подписок.",
    creatives_title: "Креативы",
    creatives_soon: "Позже добавим загрузку креативов и метрики.",
    rule_modal_title: "Новое правило",
    field_rule_name: "Название правила",
    field_level: "Куда применять на уровне",
    level_campaign: "Кампании",
    level_adset: "Ad Sets",
    level_ad: "Объявления",
    field_timeframe: "За какой период учитывать статистику",
    tf_today: "Сегодня",
    tf_yesterday: "Вчера",
    tf_2d: "Последние 2 дня",
    tf_3d: "Последние 3 дня",
    tf_7d: "Последняя неделя",
    tf_14d: "Последние 2 недели",
    field_schedule: "Расписание",
    sch_30m: "Каждые 30 минут",
    sch_1h: "Каждый час",
    sch_2h: "Каждые 2 часа",
    sch_once: "Один раз в конкретное время",
    field_schedule_datetime: "Дата и время для одноразового запуска",
    field_targets: "Куда применять",
    btn_load_accounts: "Подтянуть аккаунты",
    hint_targets:
      "Сначала выбери аккаунты, затем кампании. Активные кампании подсвечены.",
    label_accounts: "Аккаунты",
    label_campaigns: "Кампании",
    btn_select_all: "Выделить все",
    field_action_title: "Действие",
    field_action_type: "Тип действия",
    act_pause: "Стоп",
    act_start: "Старт",
    act_inc_budget_percent: "Повысить бюджет (%)",
    act_dec_budget_percent: "Понизить бюджет (%)",
    act_inc_budget_value: "Повысить бюджет ($)",
    act_dec_budget_value: "Понизить бюджет ($)",
    field_budget_value: "На сколько",
    field_budget_cap: "Максимальный бюджет ($, опционально)",
    field_conditions: "Условия",
    btn_add_condition: "Добавить условие",
    btn_save_rule: "Сохранить",
    run_success: "Правило выполнено. Затронуто объектов: ",
    run_error: "Ошибка запуска правила",
    delete_confirm: "Удалить это правило?",
    delete_error: "Ошибка удаления правила",
    save_error: "Ошибка сохранения правила",
    load_accounts_error: "Ошибка загрузки аккаунтов",
    load_campaigns_error: "Ошибка загрузки кампаний",
    group_label: "Группа",
    group_or_label: "ИЛИ",
    btn_add_condition_group: "Добавить группу условий",
    no_conditions_hint: "Условий пока нет. Добавьте первую группу.",
    creatives_accounts: "Аккаунты",
    select_all: "Выбрать все",
    date_from: "Дата с",
    date_to: "Дата по",
    creatives_load_btn: "Загрузить креативы",
    please_wait: "Подождите…",
    creatives_filters: "Фильтры",
    apply: "Применить",
    clear: "Сброс",
    sort: "Сортировка",
    asc: "По возрастанию",
    desc: "По убыванию",
    creatives_columns: "Показывать метрики",
    billing_plans_title: "Тарифы",
    plan_free: "Бесплатно",
    plan_best_choice: "Лучший выбор",
    plan_trial_feature_1: "2 соц аккаунта",
    plan_trial_feature_2: "до 6 рекламных кабинетов",
    plan_trial_feature_3: "Ограниченный доступ",
    plan_pro_feature_1: "до 5 соц аккаунтов",
    plan_pro_feature_2: "до 50 рекламных кабинетов",
    plan_pro_feature_3: "Все функции",
    plan_active: "Активен",
    plan_unavailable: "Недоступен",
    plan_trial_used: "Вы уже использовали Trial",
    plan_current: "Текущий тариф",
    plan_activate_pro: "Активировать Pro",
    plan_activating: "Активация…",
    plan_error: "Ошибка",

    // Creatives UI (labels + placeholders)
    crea_title: "Креативы",
    crea_accounts: "Аккаунты",
    crea_selected: "Выбрано",
    crea_filters: "Фильтры",
    crea_sorting: "Сортировка",
    crea_add_condition: "+ условие",
    crea_apply: "Применить",
    crea_reset: "Сброс",
    crea_from: "С",
    crea_to: "По",
    crea_load: "Загрузить",
    crea_metrics: "Метрики",
    crea_search: "Поиск",
    crea_search_placeholder: "ID или название",
    // Creatives alerts
    crea_err_select_account: "Выбери хотя бы 1 рекламный кабинет",
    crea_err_select_dates: "Выбери диапазон дат",
    crea_err_select_farm: "Выбери хотя бы 1 соц-аккаунт (farm) в креативах",
    search: "Поиск",
  },
  en: {
    logs_manual_run: "Manual run",
    logs_scheduler_run: "Scheduled run",
    logs_affected: "Affected objects",
    rule_activate: "Activate rule",
    rule_pause: "Pause rule",
    toggle_status_error: "Failed to change rule status",

    login_btn: "Login with Facebook",
    tab_rules: "Rules",
    tab_logs: "Logs",
    tab_billing: "Billing",
    tab_creatives: "Creatives",
    rules_title: "Rules",
    create_rule_btn: "Create rule",
    no_rules: "No rules yet.",
    logs_title: "Logs",
    no_logs: "No logs yet.",
    billing_title: "Billing",
    billing_soon: "Crypto payments and plans are coming soon.",
    creatives_title: "Creatives",
    creatives_soon: "Creatives and metrics will be added later.",
    rule_modal_title: "New rule",
    field_rule_name: "Rule name",
    field_level: "Apply on level",
    level_campaign: "Campaigns",
    level_adset: "Ad Sets",
    level_ad: "Ads",
    field_timeframe: "Time range for stats",
    tf_today: "Today",
    tf_yesterday: "Yesterday",
    tf_2d: "Last 2 days",
    tf_3d: "Last 3 days",
    tf_7d: "Last 7 days",
    tf_14d: "Last 14 days",
    field_schedule: "Schedule",
    sch_30m: "Every 30 minutes",
    sch_1h: "Every hour",
    sch_2h: "Every 2 hours",
    sch_once: "Once at specific time",
    field_schedule_datetime: 'Date and time (for "once")',
    field_targets: "Targets",
    btn_load_accounts: "Load accounts",
    hint_targets:
      "First select accounts, then campaigns. Active campaigns are highlighted.",
    label_accounts: "Accounts",
    label_campaigns: "Campaigns",
    btn_select_all: "Select all",
    field_action_title: "Action",
    field_action_type: "Action type",
    act_pause: "Pause",
    act_start: "Start",
    act_inc_budget_percent: "Increase budget (%)",
    act_dec_budget_percent: "Decrease budget (%)",
    act_inc_budget_value: "Increase budget ($)",
    act_dec_budget_value: "Decrease budget ($)",
    field_budget_value: "Amount",
    field_budget_cap: "Max budget ($, optional)",
    field_conditions: "Conditions",
    btn_add_condition: "Add condition",
    btn_save_rule: "Save",
    run_success: "Rule executed. Affected objects: ",
    run_error: "Rule run error",
    delete_confirm: "Delete this rule?",
    delete_error: "Error deleting rule",
    save_error: "Error saving rule",
    load_accounts_error: "Failed to load ad accounts",
    load_campaigns_error: "Failed to load campaigns",
    group_label: "Group",
    group_or_label: "OR",
    btn_add_condition_group: "Add condition group",
    // Billing
    billing_plans_title: "Plans",
    plan_free: "Free",
    plan_best_choice: "Best choice",
    plan_trial_feature_1: "2 social accounts",
    plan_trial_feature_2: "up to 6 ad accounts",
    plan_trial_feature_3: "Limited access",
    plan_pro_feature_1: "up to 5 social accounts",
    plan_pro_feature_2: "up to 50 ad accounts",
    plan_pro_feature_3: "All features",
    plan_active: "Active",
    plan_unavailable: "Unavailable",
    plan_trial_used: "You already used the Trial",
    plan_current: "Current plan",
    plan_activate_pro: "Activate Pro",
    plan_activating: "Activating…",
    plan_error: "Error",

    // Creatives UI
    crea_title: "Creatives",
    crea_accounts: "Accounts",
    crea_selected: "Selected",
    crea_filters: "Filters",
    crea_sorting: "Sorting",
    crea_add_condition: "+ condition",
    crea_apply: "Apply",
    crea_reset: "Reset",
    crea_from: "From",
    crea_to: "To",
    crea_load: "Load",
    crea_metrics: "Metrics",
    crea_search: "Search",
    crea_search_placeholder: "ID or name",
    // Creatives alerts
    crea_err_select_account: "Select at least one ad account",
    crea_err_select_dates: "Select date range",
    crea_err_select_farm:
      "Select at least one social account (farm) in Creatives",

    no_conditions_hint: "No conditions yet. Add the first group.",
  },
};

const routeToTab = {
  "/": "rules",
  "/rules": "rules",
  "/logs": "logs",
  "/payment": "billing",
  "/creatives": "creatives",
};
function activateTab(tabKey) {
  // визуально
  tabs.forEach((t) => {
    const key = t.getAttribute("data-tab");
    t.classList.toggle("active", key === tabKey);
  });

  Object.keys(tabContents).forEach((key) => {
    tabContents[key].classList.toggle("active", key === tabKey);
  });
}
let __connRecheckLastAt = 0;

let currentLang = "ru";

// ====== DOM refs ======
const loginBtn = document.getElementById("login-btn");
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const userInfoEl = document.getElementById("user-info");
const langToggle = document.getElementById("lang-toggle");
const logoutBtn = document.getElementById("logout-btn");

const tabs = document.querySelectorAll(".tab");
const tabContents = {
  rules: document.getElementById("tab-rules"),
  logs: document.getElementById("tab-logs"),
  billing: document.getElementById("tab-billing"),
  creatives: document.getElementById("tab-creatives"),
};

const rulesListEl = document.getElementById("rules-list");
const logsListEl = document.getElementById("logs-list");

// modal
const ruleModal = document.getElementById("rule-modal");
const ruleModalClose = document.getElementById("rule-modal-close");
const ruleModalTitle = document.getElementById("rule-modal-title");
const createRuleBtn = document.getElementById("create-rule-btn");
const planLabel = document.getElementById("plan-label");

const ruleNameInput = document.getElementById("rule-name");
const ruleLevelSelect = document.getElementById("rule-level");
const ruleTimeframeSelect = document.getElementById("rule-timeframe");
const ruleScheduleTypeSelect = document.getElementById("rule-schedule-type");
const ruleScheduleDatetimeInput = document.getElementById(
  "rule-schedule-datetime"
);
const scheduleDatetimeWrapper = document.getElementById(
  "schedule-datetime-wrapper"
);

const loadAccountsBtn = document.getElementById("load-accounts-btn");
const accountsContainer = document.getElementById("accounts-container");
const campaignsContainer = document.getElementById("campaigns-container");
const campaignSearchInput = document.getElementById("campaign-search");

const selectAllAccountsBtn = document.getElementById("select-all-accounts");
const selectAllCampaignsBtn = document.getElementById("select-all-campaigns");

const ruleActionTypeSelect = document.getElementById("rule-action-type");
const ruleActionValueInput = document.getElementById("rule-action-value");
const budgetExtraWrapper = document.getElementById("budget-extra-wrapper");
const budgetCapInput = document.getElementById("rule-budget-cap");

const conditionsContainer = document.getElementById("conditions-container");
const addConditionBtn = document.getElementById("add-condition-btn");
const conditionGroupsContainer = document.getElementById(
  "conditions-groups-container"
);
const addConditionGroupBtn = document.getElementById("add-condition-group-btn");
const ruleSaveBtn = document.getElementById("rule-save-btn");
const globalActionBlock = document.getElementById("global-action-block");

// ====== state ======
let rules = [];
let logs = [];
let editingRuleId = null;

let loadedAccounts = [];
let loadedCampaigns = []; // { id, name, account_id, active }

// ====== metrics options ======
const metricsOptions = [
  { value: "spend", label: "Spend" },
  { value: "leads", label: "Leads" },
  { value: "registrations", label: "Registrations" },
  { value: "purchases", label: "Purchases" },
  { value: "unique_clicks", label: "Unique Clicks" },
  { value: "cpl", label: "Cost per Lead" },
  { value: "cpa", label: "CPA (Cost per Purchase)" }, // ✅
  { value: "cpr", label: "Cost per Registration" }, // ✅
  { value: "ucpc", label: "UCPC" },
  { value: "cpm", label: "CPM" },
  { value: "ctr", label: "CTR" },
  { value: "impressions", label: "Impressions" },
  { value: "installs", label: "Mobile app installs" },
  { value: "cpi", label: "Cost per install" },
  { value: "app_purchases", label: "Mobile app purchases" },
  { value: "cap", label: "Cost per Mobile App Purchase" }, // ✅
];

// ===== Billing globals (MUST be defined before billOpenModal/billApplyInvoiceUI) =====
let billPollTimer = null;
let currentInvoiceId = null;

// ====== helpers ======
// ===== Billing modal (shared) =====
// ===== Billing state (single source of truth, NO tab disabling) =====
async function loadRulesForExpiredView() {
  // 1) пробуем честно загрузить с бэка
  try {
    await loadRules();
    return true;
  } catch (e) {
    // если apiJson увёл в billing — ок, но правила всё равно покажем из кэша
    console.warn("loadRules failed, fallback to cache", e);

    // 2) fallback: кэш
    try {
      const cached = JSON.parse(localStorage.getItem("rulesCache") || "[]");
      if (Array.isArray(cached)) {
        // важно: используем ту же переменную, что и renderRules
        rules = cached;
        // если у тебя рендер называется иначе — подставь свой
        renderRules(rules, { readOnly: true, reason: "expired" });
        return true;
      }
    } catch (e2) {}

    // 3) если даже кэша нет — показать текст
    try {
      const el = document.getElementById("rules-empty");
      if (el)
        el.textContent =
          currentLang === "ru"
            ? "Правила недоступны (Expired)."
            : "Rules are unavailable (Expired).";
    } catch {}
    return false;
  }
}

function syncRuleScheduleDatetimeUI() {
  if (
    !ruleScheduleTypeSelect ||
    !scheduleDatetimeWrapper ||
    !ruleScheduleDatetimeInput
  )
    return;

  const isOnce = ruleScheduleTypeSelect.value === "once";
  scheduleDatetimeWrapper.classList.toggle("hidden", !isOnce);

  // если ушли с once — чистим дату
  if (!isOnce) ruleScheduleDatetimeInput.value = "";
}

// важно: показать/скрыть при смене селекта
if (ruleScheduleTypeSelect) {
  ruleScheduleTypeSelect.addEventListener("change", syncRuleScheduleDatetimeUI);
}

function getBillingState() {
  return {
    locked: localStorage.getItem("lockToBilling") === "1",
    reason: localStorage.getItem("lockReason") || "",
    pendingInvoiceId: localStorage.getItem("pendingInvoiceId") || "",
  };
}

function isBillingLockedNow() {
  const s = getBillingState();
  return (
    s.locked && (s.reason === "expired" || s.reason.startsWith("antifraud"))
  );
}

function lockToBilling(reason = "expired") {
  try {
    localStorage.setItem("lockToBilling", "1");
    localStorage.setItem("lockReason", reason || "expired");
  } catch (e) {
    console.warn("lockToBilling storage failed", e);
  }

  showApp();
  activateTab("billing");

  try {
    window.history.replaceState({}, "", "/payment");
  } catch (e) {}

  console.warn("Locked to billing:", reason);
}
function unlockBilling() {
  try {
    localStorage.removeItem("lockToBilling");
    localStorage.removeItem("lockReason");
  } catch (e) {}

  if (billPollTimer) {
    clearInterval(billPollTimer);
    billPollTimer = null;
  }
}
function showModal({ title, text }) {
  const m = document.getElementById("ui-modal");
  if (!m) {
    console.warn("ui-modal missing:", title, text);
    // fallback чтобы не падало:
    try {
      console.log("[ALERT]", title, text);
    } catch {}
    return;
  }

  const tEl = document.getElementById("ui-modal-title");
  const txtEl = document.getElementById("ui-modal-text");
  const okBtn = document.getElementById("ui-modal-ok");

  if (tEl) tEl.textContent = title || "";
  if (txtEl) txtEl.textContent = String(text || "");

  m.classList.remove("hidden");

  if (okBtn) {
    okBtn.onclick = () => m.classList.add("hidden");
  }
}

function uiAlert(msg, title) {
  showModal({
    title: title || (currentLang === "ru" ? "Уведомление" : "Notice"),
    text: String(msg || ""),
  });
}
window.alert = (msg) => uiAlert(msg);

function billResetToStage1() {
  // стоп таймеров
  if (billPollTimer) {
    clearInterval(billPollTimer);
    billPollTimer = null;
  }

  // сброс айди инвойса + localStorage
  currentInvoiceId = null;
  localStorage.removeItem("pendingInvoiceId");

  // скрываем stage2
  const stage = document.getElementById("bill-stage");
  if (stage) stage.classList.add("hidden");

  // показываем кнопку create
  const createBtn = document.getElementById("bill-create");
  if (createBtn) {
    createBtn.style.display = "";
    createBtn.disabled = false;
    createBtn.dataset.loading = "0";
  }

  // включаем выбор валют снова
  const payGrid = document.getElementById("bill-pay-grid");
  const hiddenCurrency = document.getElementById("bill-currency");

  if (payGrid) {
    payGrid.classList.remove("disabled");
    payGrid
      .querySelectorAll(".bill-pay-card")
      .forEach((c) => c.classList.remove("active"));

    const def = payGrid.querySelector('[data-currency="USDTTRC20"]');
    if (def) def.classList.add("active");
  }
  if (hiddenCurrency) hiddenCurrency.value = "USDTTRC20";

  // очистка полей stage2
  const qr = document.getElementById("bill-qr");
  if (qr) qr.src = "";
  const addr = document.getElementById("bill-address");
  if (addr) addr.value = "";
  const payAmt = document.getElementById("bill-pay-amount");
  if (payAmt) payAmt.value = "";
  const st = document.getElementById("bill-status");
  if (st) st.textContent = "pending";
  const exp = document.getElementById("bill-expires");
  if (exp) exp.textContent = "—";
  const hint = document.getElementById("bill-hint");
  if (hint) hint.textContent = "";
  const statusText = document.getElementById("bill-status-text");
  if (statusText) statusText.textContent = "";
}

function billApplyInvoiceUI(inv) {
  const isRu = currentLang === "ru";

  currentInvoiceId = String(inv.id);
  localStorage.setItem("pendingInvoiceId", String(inv.id));

  const createBtn = document.getElementById("bill-create");
  if (createBtn) {
    createBtn.style.display = "none";
    createBtn.disabled = true;
    createBtn.dataset.loading = "0";
  }

  const payGrid = document.getElementById("bill-pay-grid");
  if (payGrid) payGrid.classList.add("disabled");

  const stage = document.getElementById("bill-stage");
  if (stage) stage.classList.remove("hidden");

  document.getElementById("bill-address").value = inv.pay_address || "";
  document.getElementById("bill-pay-amount").value = String(
    inv.pay_amount || ""
  );

  // QR
  const qrImg = document.getElementById("bill-qr");

  const addr = (inv.pay_address || "").trim();
  const amt = String(inv.pay_amount || "").trim();
  const cur = String(inv.pay_currency || "").toUpperCase();

  let qrText = "";
  if (addr) {
    if (cur === "BTC" && amt) {
      qrText = `bitcoin:${addr}?amount=${encodeURIComponent(amt)}`;
    } else if (amt) {
      qrText = `${addr}?amount=${encodeURIComponent(amt)}`;
    } else {
      qrText = addr;
    }
  }

  if (qrImg) {
    if (!qrText) {
      qrImg.src = "";
    } else {
      const data = encodeURIComponent(qrText);
      const bust = `&_=${Date.now()}`;

      const urls = [
        `https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=${data}${bust}`,
        `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}${bust}`,
        `https://quickchart.io/qr?size=240&text=${data}${bust}`,
      ];

      let i = 0;
      qrImg.referrerPolicy = "no-referrer";
      qrImg.onerror = () => {
        i += 1;
        if (i < urls.length) qrImg.src = urls[i];
        else qrImg.onerror = null;
      };

      qrImg.src = urls[0];
    }
  }
  updateExpires(inv.expires_at);

  document.getElementById("bill-hint").textContent = isRu
    ? "После оплаты нажмите “Проверить оплату”."
    : "After payment click “Check payment”.";

  if (billPollTimer) clearInterval(billPollTimer);
  billPollTimer = setInterval(() => billCheckStatus(true), 10000);
}

function billOpenModal(fromWhere = "app") {
  const m = document.getElementById("bill-modal");
  if (!m) return;

  // тексты RU/EN
  const isRu = currentLang === "ru";
  document.getElementById("bill-title").textContent = isRu
    ? "Оплата PRO"
    : "PRO payment";
  document.getElementById("bill-desc").textContent = isRu
    ? "Сумма фиксированная и не редактируется."
    : "Amount is fixed and cannot be edited.";

  document.getElementById("bill-amount").textContent = "$10";

  // reset state
  document.getElementById("bill-stage").classList.add("hidden");
  document.getElementById("bill-status").textContent = "pending";
  document.getElementById("bill-hint").textContent = "";
  document.getElementById("bill-qr").src = "";
  document.getElementById("bill-address").value = "";
  document.getElementById("bill-pay-amount").value = "";
  document.getElementById("bill-expires").textContent = "—";
  currentInvoiceId = null;
  // вернуть кнопку Create invoice (стадия 1) на всякий случай
  const createBtn = document.getElementById("bill-create");
  if (createBtn) {
    createBtn.style.display = "";
    createBtn.disabled = false;
    createBtn.dataset.loading = "0";
  }

  if (billPollTimer) {
    clearInterval(billPollTimer);
    billPollTimer = null;
  }
  // ===== pay cards init (3 валюты) =====
  const payGrid = document.getElementById("bill-pay-grid");
  const hiddenCurrency = document.getElementById("bill-currency"); // hidden input

  if (hiddenCurrency) hiddenCurrency.value = "USDTTRC20";

  if (payGrid) {
    payGrid.classList.remove("disabled");

    payGrid
      .querySelectorAll(".bill-pay-card")
      .forEach((b) => b.classList.remove("active"));
    const def = payGrid.querySelector('[data-currency="USDTTRC20"]');
    if (def) def.classList.add("active");

    payGrid.querySelectorAll(".bill-pay-card").forEach((btn) => {
      btn.onclick = () => {
        if (currentInvoiceId) return; // после инвойса не меняем
        payGrid
          .querySelectorAll(".bill-pay-card")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        if (hiddenCurrency)
          hiddenCurrency.value = btn.dataset.currency || "USDTTRC20";
      };
    });
  }

  m.classList.remove("hidden");

  const cancelBtn = document.getElementById("bill-cancel");
  if (cancelBtn) {
    cancelBtn.textContent =
      currentLang === "ru" ? "Отменить счёт" : "Cancel invoice";
    cancelBtn.onclick = () => billResetToStage1();
  }
  // ===== RESUME: если был создан инвойс — показываем стадию 2 сразу =====
  const savedId = localStorage.getItem("pendingInvoiceId");
  if (savedId) {
    (async () => {
      try {
        const r = await apiGet(`/api/billing/invoice/${savedId}`);
        if (r?.invoice?.id) {
          billApplyInvoiceUI(r.invoice);
          // чтобы статус/expiry/кнопки были актуальны — сразу чекнем
          await billCheckStatus(true);
        } else {
          localStorage.removeItem("pendingInvoiceId");
        }
      } catch (e) {
        console.error("resume invoice error", e);
        // если совсем не получается — лучше очистить, чтобы не ломало UI
        localStorage.removeItem("pendingInvoiceId");
      }
    })();
  }

  // close
  const closeBtn = document.getElementById("bill-close");
  closeBtn.onclick = () => billCloseModal();

  m.onclick = (e) => {
    if (e.target === m) billCloseModal();
  };

  // create invoice
  document.getElementById("bill-create").onclick = async () => {
    const isRu = currentLang === "ru";
    const pay_currency = document.getElementById("bill-currency").value; // hidden input
    const createBtn = document.getElementById("bill-create");
    const payGrid = document.getElementById("bill-pay-grid");

    try {
      // анти-даблклик сразу
      if (createBtn) {
        createBtn.disabled = true;
        createBtn.dataset.loading = "1";
      }

      const resp = await apiJson("/api/billing/create_pro_invoice", "POST", {
        pay_currency,
      });
      if (!resp?.ok || !resp?.invoice?.id)
        throw new Error("create invoice failed");

      const inv = resp.invoice;

      billApplyInvoiceUI(inv);
      await billCheckStatus(true);
    } catch (e) {
      alert(isRu ? "Не удалось создать счет" : "Failed to create invoice");
      console.error(e);

      // вернуть кнопку если ошибка
      if (createBtn) {
        createBtn.disabled = false;
        createBtn.dataset.loading = "0";
      }
      if (payGrid) payGrid.classList.remove("disabled");
    }
  };

  // copy address
  document.getElementById("bill-copy").onclick = async () => {
    const val = document.getElementById("bill-address").value || "";
    try {
      await navigator.clipboard.writeText(val);
    } catch {}
  };

  // manual check
  const billCheckBtn = document.getElementById("bill-check");
  const statusEl = document.getElementById("bill-status-text");
  billCheckBtn.onclick = async () => {
    if (billCheckBtn.dataset.loading === "1") return;

    billCheckBtn.dataset.loading = "1";

    const prevText = billCheckBtn.textContent;
    billCheckBtn.textContent = isRu ? "Проверяем…" : "Checking…";
    billCheckBtn.disabled = true;
    billCheckBtn.classList.add("loading");

    try {
      await billCheckStatus(false);

      // UX-подсказка, если платёж ещё не найден
      if (statusEl) {
        statusEl.textContent = isRu
          ? "Если оплата уже отправлена, подтверждение может занять 1–3 минуты."
          : "If payment was sent, blockchain confirmation may take 1–3 minutes.";
      }
    } catch (e) {
      console.error("billCheckStatus error", e);
      if (statusEl) {
        statusEl.textContent = isRu
          ? "Ошибка при проверке платежа"
          : "Error while checking payment";
      }
    } finally {
      billCheckBtn.dataset.loading = "0";
      billCheckBtn.textContent = prevText;
      billCheckBtn.disabled = false;
      billCheckBtn.classList.remove("loading");
    }
  };
}
function billCloseModal(resetUI = false) {
  const m = document.getElementById("bill-modal");
  if (!m) return;

  // закрываем модалку
  m.classList.add("hidden");

  // стоп поллинг
  if (billPollTimer) {
    clearInterval(billPollTimer);
    billPollTimer = null;
  }

  // если НЕ просили reset — выходим (это нужно для pending)
  if (!resetUI) return;

  // ===== полный reset UI/state =====
  currentInvoiceId = null;

  const stage = document.getElementById("bill-stage");
  if (stage) stage.classList.add("hidden");

  const createBtn = document.getElementById("bill-create");
  if (createBtn) {
    createBtn.style.display = "";
    createBtn.disabled = false;
    createBtn.dataset.loading = "0";
  }

  const currencyEl = document.getElementById("bill-currency");
  if (currencyEl) {
    currencyEl.disabled = false;
    currencyEl.value = "USDTTRC20";
  }

  const payGrid = document.getElementById("bill-pay-grid");
  if (payGrid) {
    payGrid.classList.remove("disabled");
    payGrid
      .querySelectorAll(".bill-pay-card")
      .forEach((c) => c.classList.remove("active"));
    const def = payGrid.querySelector('[data-currency="USDTTRC20"]');
    if (def) def.classList.add("active");
  }

  const qr = document.getElementById("bill-qr");
  if (qr) qr.src = "";

  const addr = document.getElementById("bill-address");
  if (addr) addr.value = "";

  const payAmt = document.getElementById("bill-pay-amount");
  if (payAmt) payAmt.value = "";

  const st = document.getElementById("bill-status");
  if (st) st.textContent = "pending";

  const exp = document.getElementById("bill-expires");
  if (exp) exp.textContent = "—";

  const hint = document.getElementById("bill-hint");
  if (hint) hint.textContent = "";

  const statusText = document.getElementById("bill-status-text");
  if (statusText) statusText.textContent = "";
}

let billExpiresTimer = null;

function updateExpires(expiresAt) {
  const el = document.getElementById("bill-expires");
  if (!el || !expiresAt) return;

  // ❗️важно: не плодим таймеры
  if (billExpiresTimer) clearInterval(billExpiresTimer);

  const tick = () => {
    const left = Math.floor((expiresAt - Date.now()) / 1000);

    // ✅ ВОТ СЮДА добавляем проверку
    if (left <= 0) {
      el.textContent = "00:00";

      billResetToStage1();

      const hint = document.getElementById("bill-hint");
      if (hint) {
        hint.textContent =
          currentLang === "ru"
            ? "Счёт истёк. Создайте новый."
            : "Invoice expired. Create a new one.";
      }

      if (billExpiresTimer) {
        clearInterval(billExpiresTimer);
        billExpiresTimer = null;
      }
      return;
    }

    const mm = String(Math.floor(left / 60)).padStart(2, "0");
    const ss = String(left % 60).padStart(2, "0");
    el.textContent = `${mm}:${ss}`;
  };

  tick();
  billExpiresTimer = setInterval(tick, 1000);
}
function buildQrPayload(inv) {
  const addr = (inv?.pay_address || "").trim();
  const amt = String(inv?.pay_amount || "").trim();
  const cur = String(inv?.pay_currency || inv?.payCurrency || "").toUpperCase();

  if (!addr) return "";

  // BTC — нормальный стандарт URI
  if (cur === "BTC" && amt)
    return `bitcoin:${addr}?amount=${encodeURIComponent(amt)}`;

  // Для USDT TRC20 / BEP20 и прочего:
  // большинство кошельков отлично понимают просто адрес,
  // но добавим сумму как подсказку (не всем кошелькам важно)
  if (amt) return `${addr}?amount=${encodeURIComponent(amt)}`;

  return addr;
}

function setQrImageWithFallback(qrImg, text) {
  if (!qrImg) return;

  if (!text) {
    qrImg.src = "";
    return;
  }

  const data = encodeURIComponent(text);
  const bust = `&_=${Date.now()}`;

  const urls = [
    `https://chart.googleapis.com/chart?chs=240x240&cht=qr&chl=${data}${bust}`,
    `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}${bust}`,
    `https://quickchart.io/qr?size=240&text=${data}${bust}`,
  ];

  let i = 0;
  qrImg.referrerPolicy = "no-referrer";
  qrImg.onerror = () => {
    i += 1;
    if (i < urls.length) qrImg.src = urls[i];
    else qrImg.onerror = null;
  };

  qrImg.src = urls[0];
}

async function billCheckStatus(silent) {
  if (!currentInvoiceId) return;

  const isRu = currentLang === "ru";

  try {
    const r = await apiGet(`/api/billing/invoice/${currentInvoiceId}`);
    const st = (r?.invoice?.payment_status || "pending").toLowerCase();
    const stEl = document.getElementById("bill-status");
    if (stEl) stEl.textContent = st;

    if (st === "finished" || st === "confirmed" || st === "paid") {
      if (billPollTimer) {
        clearInterval(billPollTimer);
        billPollTimer = null;
      }

      alert(
        isRu
          ? "Оплата подтверждена. PRO активирован."
          : "Payment confirmed. PRO activated."
      );

      // 1) Обновим план
      try {
        const appMe = await getAppMe();
        window.__me = appMe;
      } catch {}

      // 2) Очистим локи/пендинг
      localStorage.removeItem("pendingInvoiceId");
      unlockBilling();

      // 3) Закроем модалку и ресетим UI оплаты
      billCloseModal(true);

      // 4) Жесткий ре-init без reload
      await reinitAfterBilling();

      return;
    }
  } catch (e) {
    if (!silent)
      alert(isRu ? "Не удалось проверить оплату" : "Failed to check payment");
    console.error(e);
  }
}

function isBudgetAction(type) {
  return (
    type === "increase_budget_percent" ||
    type === "decrease_budget_percent" ||
    type === "increase_budget_value" ||
    type === "decrease_budget_value"
  );
}

function updateGroupActionVisibility(
  actionSelect,
  valueInput,
  capInput,
  maxChangesInput
) {
  if (!actionSelect) return;

  const t = actionSelect.value;

  const isBudget =
    t === "increase_budget_percent" ||
    t === "decrease_budget_percent" ||
    t === "increase_budget_value" ||
    t === "decrease_budget_value";

  const isIncrease =
    t === "increase_budget_percent" || t === "increase_budget_value";

  if (valueInput) valueInput.style.display = isBudget ? "" : "none";
  if (capInput) capInput.style.display = isIncrease ? "" : "none";
  if (maxChangesInput) maxChangesInput.style.display = isBudget ? "" : "none";
}

function showLogin() {
  // ✅ если залочены на оплату (expired/antifraud/pro_required) — не показываем FB login экран
  let lockedToBilling = false;
  let lockReason = "";

  try {
    lockedToBilling = localStorage.getItem("lockToBilling") === "1";
    lockReason = localStorage.getItem("lockReason") || "";
  } catch (e) {}

  if (
    lockedToBilling &&
    (lockReason === "expired" ||
      lockReason === "pro_required" ||
      lockReason.startsWith("antifraud"))
  ) {
    goToBilling();
    return;
  }

  loginScreen.classList.remove("hidden");
  appScreen.classList.add("hidden");

  if (logoutBtn) logoutBtn.style.display = "none";
}

function showApp() {
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");

  if (logoutBtn) {
    logoutBtn.style.display = "";
  }
}

function timestampToInputValue(ts) {
  if (!ts) return "";
  const d = new Date(Number(ts));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

// i18n
function applyI18n() {
  const dict = i18n[currentLang];
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  updateConditionGroupTitles();
  rebuildConditionGroupDividers();
}

// разделители между группами
function rebuildConditionGroupDividers() {
  if (!conditionGroupsContainer) return;

  const oldDivs = conditionGroupsContainer.querySelectorAll(
    ".condition-group-divider"
  );
  oldDivs.forEach((el) => el.remove());

  const groups = Array.from(
    conditionGroupsContainer.querySelectorAll(".condition-group")
  );
  if (!groups.length) return;

  const dividerLabel = i18n[currentLang].group_or_label || "ИЛИ";

  for (let i = 1; i < groups.length; i++) {
    const group = groups[i];
    const divider = document.createElement("div");
    divider.className = "condition-group-divider muted small";
    divider.textContent = dividerLabel;
    conditionGroupsContainer.insertBefore(divider, group);
  }
}

// заголовки "Группа 1/2/3"
function updateConditionGroupTitles() {
  if (!conditionGroupsContainer) return;
  const groups = conditionGroupsContainer.querySelectorAll(".condition-group");
  const label = i18n[currentLang].group_label || "Группа";

  groups.forEach((groupEl, index) => {
    const titleEl = groupEl.querySelector(".condition-group-title");
    if (titleEl) {
      titleEl.textContent = `${label} ${index + 1}`;
    }
  });

  const dividerLabel = i18n[currentLang].group_or_label || "ИЛИ";
  const divs = conditionGroupsContainer.querySelectorAll(
    ".condition-group-divider"
  );
  divs.forEach((d) => {
    d.textContent = dividerLabel;
  });
}

// ====== API helpers ======
async function reinitAfterBilling() {
  // 0) стопаем polling
  if (billPollTimer) {
    clearInterval(billPollTimer);
    billPollTimer = null;
  }

  // 0.1) (безопасно) если где-то остался pending invoice — не мешаем, но и не ломаем UI
  let pendingInvoiceId = null;
  let lockedToBilling = false;
  let lockReason = "";
  try {
    pendingInvoiceId = localStorage.getItem("pendingInvoiceId");
    lockedToBilling = localStorage.getItem("lockToBilling") === "1";
    lockReason = localStorage.getItem("lockReason") || "";
  } catch (e) {}

  // 1) пересобираем billing UI
  try {
    await initBillingUI();
  } catch (e) {
    console.warn("initBillingUI fail", e);
  }

  // 2) обновляем header/email/plan label
  try {
    await loadMe();
  } catch (e) {}

  // 3) обновляем farms dropdown
  try {
    await renderConnectionsDropdown();
  } catch (e) {}

  // 4) проверяем фермы
  let conns = [];
  try {
    conns = await getConnections();
  } catch (e) {
    conns = [];
  }

  const getUiStatus = (c) =>
    String(c.ui_status || c.status || "").toLowerCase();
  const hasActive = (conns || []).some((c) => getUiStatus(c) === "active");

  showApp();

  // 5) если лочены (expired/antifraud/pro_required) — остаёмся в billing
  if (
    lockedToBilling &&
    (lockReason === "expired" ||
      lockReason === "pro_required" ||
      lockReason.startsWith("antifraud"))
  ) {
    activateTab("billing");
    try {
      window.history.replaceState({}, "", "/payment");
    } catch (e) {}
    if (pendingInvoiceId) {
      try {
        billOpenModal("resume");
      } catch (e) {}
    }
    return;
  }

  // 6) нет активной фермы → billing
  if (!hasActive) {
    activateTab("billing");
    try {
      window.history.replaceState({}, "", "/payment");
    } catch (e) {}
    if (pendingInvoiceId) {
      try {
        billOpenModal("resume");
      } catch (e) {}
    }
    return;
  }

  // 7) ферма есть → грузим приложение
  try {
    await loadRules();
  } catch (e) {}
  try {
    await loadLogs();
  } catch (e) {}
  try {
    await initCreativesTab();
  } catch (e) {}

  // 8) если мы остались на /payment после оплаты/триала — уводим на "главный" таб
  let initialTab = routeToTab[window.location.pathname] || "rules";
  if (window.location.pathname === "/payment") {
    initialTab = "rules";
    try {
      window.history.replaceState({}, "", "/");
    } catch (e) {}
  }

  activateTab(initialTab);
}

async function apiPostJson(url, body) {
  return await apiJson(url, "POST", body || {});
}

async function getAppMe() {
  const r = await fetch("/api/app/me", { credentials: "include" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "HTTP " + r.status);
  return j;
}

async function apiGet(url) {
  return await apiJson(url, "GET");
}

async function getConnections() {
  const data = await apiGet("/api/connections");
  return data.connections || [];
}
async function selectConnection(id) {
  return await apiJson("/api/connections/select", "POST", {
    connection_id: id,
  });
}

async function deleteConnection(connectionId) {
  const ok = confirm("Are you sure you want to delete this Facebook account?");
  if (!ok) return;

  try {
    // важно: DELETE тоже должен пройти через apiJson,
    // чтобы needBilling (expired/antifraud/pro_required) отработал единообразно
    await apiJson(`/api/connections/${connectionId}`, "DELETE");

    // перерисовываем список
    await renderConnectionsDropdown();
  } catch (e) {
    console.error("deleteConnection error", e);

    // если apiJson уже увёл в billing и кинул billing-lock — ничего не алертим
    if (e && e.isBillingLock) return;

    alert(e && e.message ? e.message : "Network error");
  }
}

async function apiJson(url, method, body) {
  const resp = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body || {}),
  });

  // 1) Читаем тело безопасно (может быть не JSON)
  let data = {};
  let rawText = "";
  try {
    rawText = await resp.text();
  } catch (_) {
    rawText = "";
  }

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch (_) {
      data = { error: rawText };
    }
  }

  // 2) OK
  if (resp.ok) return data;

  // 3) Нормализуем ошибку
  const errText = data && typeof data.error === "string" ? data.error : "";
  const code = data && typeof data.code === "string" ? data.code : "";
  const errLow = String(errText || "").toLowerCase();
  const codeUp = String(code || "").toUpperCase();

  // 4) Определяем причины
  const isNotAuth =
    resp.status === 401 &&
    (errText === "Not authenticated" || errLow.includes("not authenticated"));

  const isExpired =
    codeUp === "PLAN_EXPIRED" ||
    errLow.includes("plan expired") ||
    errLow.includes("subscription expired");

  const isProRequired =
    codeUp === "PRO_REQUIRED" ||
    errText.includes("PRO required") ||
    errLow.includes("pro required");

  const isAntifraud =
    codeUp.startsWith("ANTIFRAUD") ||
    errLow.includes("antifraud") ||
    errLow.includes("farm reuse") ||
    (errLow.includes("used") && errLow.includes("trial"));

  const isPlanSelectRequired =
    resp.status === 402 &&
    (codeUp === "PLAN_SELECT_REQUIRED" ||
      errLow.includes("plan_select_required"));

  const needBilling = isExpired || isProRequired || isAntifraud;
  // ===== FORCE PLAN SELECTION (trial_pending) =====
  if (isPlanSelectRequired) {
    try {
      showPlanSelectModal({ force: true });
    } catch (e) {}

    const err = new Error("PLAN_SELECT_REQUIRED");
    err.code = "PLAN_SELECT_REQUIRED";
    err.status = resp.status;
    err.url = url;
    err.data = data;
    throw err;
  }

  // 5) ЕДИНАЯ точка “нужна оплата”
  if (needBilling) {
    // reason для логики init/showLogin
    const lr = isAntifraud
      ? "antifraud_farm_reuse"
      : isExpired
      ? "expired"
      : "pro_required";

    // reason для дебага/логов (оставляем как у тебя)
    const billingReason = isAntifraud
      ? codeUp.startsWith("ANTIFRAUD")
        ? codeUp
        : "ANTIFRAUD_FARM_REUSE"
      : isExpired
      ? "PLAN_EXPIRED"
      : "PRO_REQUIRED";

    try {
      localStorage.setItem("lockToBilling", "1");
      localStorage.setItem("lockReason", lr);
    } catch (e) {}

    // гарантируем, что мы в billing
    try {
      lockToBilling(lr); // showApp + billing + /payment (важно: без disable вкладок)
    } catch (e) {
      try {
        goToBilling();
      } catch (_) {}
    }

    try {
      billOpenModal("paywall");
    } catch (e) {}

    const err = new Error(errText || code || "need_billing");
    err.isBillingLock = true;
    err.billingReason = billingReason;
    err.status = resp.status;
    err.url = url;
    err.data = data;
    throw err;
  }

  // 6) 401 “не авторизован”
  if (isNotAuth) {
    const err = new Error("Not authenticated");
    err.code = "SAAS_NOT_AUTH";
    err.status = resp.status;
    err.url = url;
    err.data = data;
    throw err;
  }

  // 7) Обычная ошибка
  const err = new Error(errText || "HTTP " + resp.status);
  err.status = resp.status;
  err.url = url;
  err.data = data;
  throw err;
}

function goToBilling() {
  showApp();
  activateTab("billing");

  // мягко фиксируем URL только если нужно
  try {
    if (window.location.pathname !== "/payment") {
      window.history.replaceState({}, "", "/payment");
    }
  } catch (e) {}
}

function setRuleStatusBtnView(btn, status) {
  const isActive = status === "active";
  btn.textContent = "●";
  btn.style.color = isActive ? "#16a34a" : "#dc2626";
  btn.title = isActive
    ? i18n[currentLang].rule_pause || "Pause rule"
    : i18n[currentLang].rule_activate || "Activate rule";
}

// ====== auth / init UI ======
document.addEventListener(
  "click",
  async (e) => {
    const el = e.target.closest("button,a,div,span");
    if (!el) return;

    const txt = (el.innerText || "").trim();
    const isLogout =
      el.matches('#logout-btn, [data-action="logout"]') ||
      txt === "Выйти" ||
      txt === "Logout";

    if (!isLogout) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    console.log("LOGOUT CLICK HIT", el);

    try {
      const resp = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      console.log("LOGOUT STATUS", resp.status);
    } catch (err) {
      console.error("logout error", err);
    }
    // ✅ важное: не наследуем lock между разными email-аккаунтами
    try {
      unlockBilling();
    } catch (e) {}
    try {
      localStorage.removeItem("pendingInvoiceId");
    } catch (e) {}

    setTimeout(() => {
      window.location.href = "/";
    }, 150);
  },
  true
); // <-- capture true (очень важно)

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "ru" ? "en" : "ru";
    applyI18n();
    renderRules();
    renderLogs();
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", async (e) => {
    e.preventDefault();

    const tabKey = tab.getAttribute("data-tab");

    // ✅ FORCE re-init creatives every time
    if (tabKey === "creatives") {
      console.log("[TAB] 🎯 Creatives tab clicked - forcing init");
      creativesInitialized = false; // Reset flag

      try {
        await initCreativesTab();
      } catch (e) {
        console.error("[TAB] initCreativesTab failed:", e);
      }
    }

    let newPath = "/rules";
    if (tabKey === "logs") newPath = "/logs";
    else if (tabKey === "billing") newPath = "/payment";
    else if (tabKey === "creatives") newPath = "/creatives";

    if (window.location.pathname !== newPath) {
      window.history.pushState({ tabKey }, "", newPath);
    }

    activateTab(tabKey);
  });
});
window.addEventListener("popstate", () => {
  const path = window.location.pathname;
  const tabKey = routeToTab[path] || "rules";
  activateTab(tabKey);
});

// ====== RULES UI ======
function renderRules() {
  rulesListEl.innerHTML = "";

  const isExpired = window.__me && window.__me.expired === true;

  if (!rules.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = i18n[currentLang].no_rules;
    rulesListEl.appendChild(p);
    return;
  }

  rules.forEach((rule) => {
    const card = document.createElement("div");
    card.className = "card";

    const main = document.createElement("div");
    main.className = "card-main";

    const title = document.createElement("div");
    title.className = "card-title";
    // если имени нет — просто "Rule"
    title.textContent = rule.name || "Rule";

    const sub = document.createElement("div");
    sub.className = "card-sub";
    // без ID, только уровень/период/расписание
    sub.textContent = `Level: ${rule.level} • TF: ${rule.timeframe} • Schedule: ${rule.schedule_type}`;

    main.appendChild(title);
    main.appendChild(sub);

    // блок с кнопками
    const actions = document.createElement("div");
    actions.className = "card-actions";

    // статус
    const statusBtn = document.createElement("button");
    statusBtn.className = "secondary-btn small";
    // если expired — всегда рисуем как paused и запрещаем toggle
    if (isExpired) {
      setRuleStatusBtnView(statusBtn, "paused");
      statusBtn.disabled = true;
      statusBtn.title = "Plan expired";
    } else {
      setRuleStatusBtnView(statusBtn, rule.status);

      statusBtn.addEventListener("click", async () => {
        try {
          const res = await apiJson(
            `/api/rules/${rule.id}/toggle-status`,
            "POST"
          );
          if (res && res.status) {
            rule.status = res.status;
            setRuleStatusBtnView(statusBtn, rule.status);
          }
        } catch (e) {
          alert(i18n[currentLang].toggle_status_error || "Status toggle error");
          console.error(e);
        }
      });
    }

    // edit
    const editBtn = document.createElement("button");
    editBtn.className = "secondary-btn small";
    editBtn.textContent = "✏️";
    editBtn.title = "Edit";
    editBtn.addEventListener("click", async () => {
      const data = await apiGet(`/api/rules/${rule.id}`);
      openRuleModal(data.rule);
    });

    // delete
    const delBtn = document.createElement("button");
    delBtn.className = "secondary-btn small";
    delBtn.textContent = "🗑";
    delBtn.title = "Delete";
    delBtn.addEventListener("click", () => deleteRule(rule.id));

    actions.appendChild(statusBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    // правильный порядок сборки карточки
    card.appendChild(main);
    card.appendChild(actions);
    rulesListEl.appendChild(card);
  });
}

// ====== LOGS UI ======
function renderLogs() {
  logsListEl.innerHTML = "";

  if (!logs || !logs.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = i18n[currentLang].no_logs;
    logsListEl.appendChild(p);
    return;
  }

  logs.forEach((log) => {
    const card = document.createElement("div");
    card.className = "card";

    const main = document.createElement("div");
    main.className = "card-main";

    const title = document.createElement("div");
    title.className = "card-title";

    const ruleTitle =
      (log.rule_name && log.rule_name.trim()) ||
      log.rule_display_name ||
      log.rule_label ||
      "Rule";

    title.textContent = `${ruleTitle} • ${log.status}`;

    const sub = document.createElement("div");
    sub.className = "card-sub";

    const dateStr = log.executed_at
      ? new Date(log.executed_at).toLocaleString()
      : "";

    let messageText = "";
    if (log.message?.startsWith("Manual run")) {
      messageText = i18n[currentLang].logs_manual_run;
    } else if (log.message?.startsWith("Scheduler run")) {
      messageText = i18n[currentLang].logs_scheduler_run;
    }

    const affected =
      log.affected_objects != null
        ? log.affected_objects
        : log.affected != null
        ? log.affected
        : 0;

    const affectedLabel = i18n[currentLang].logs_affected;

    const parts = [];
    if (dateStr) parts.push(dateStr);
    if (messageText) parts.push(messageText);
    parts.push(`${affectedLabel}: ${affected}`);

    sub.textContent = parts.join(" • ");

    main.appendChild(title);
    main.appendChild(sub);
    card.appendChild(main);

    logsListEl.appendChild(card);
  });
}

// ====== modal rules ======
function resetRuleModal() {
  editingRuleId = null;
  ruleModalTitle.textContent = i18n[currentLang].rule_modal_title;
  ruleNameInput.value = "";
  ruleLevelSelect.value = "campaign";
  ruleTimeframeSelect.value = "today";
  ruleScheduleTypeSelect.value = "every_30m";
  ruleScheduleDatetimeInput.value = "";
  scheduleDatetimeWrapper.classList.add("hidden");
  syncRuleScheduleDatetimeUI();

  loadedAccounts = [];
  loadedCampaigns = [];
  accountsContainer.innerHTML = "";
  campaignsContainer.innerHTML = "";

  if (ruleActionTypeSelect) ruleActionTypeSelect.value = "pause";
  if (ruleActionValueInput) ruleActionValueInput.value = "10";
  if (budgetCapInput) budgetCapInput.value = "";
  if (budgetExtraWrapper) budgetExtraWrapper.classList.add("hidden");

  if (conditionGroupsContainer) {
    conditionGroupsContainer.innerHTML = "";
    addConditionGroup(null);
  }
}

async function openRuleModal(rule) {
  if (rule) {
    editingRuleId = rule.id;
    ruleModalTitle.textContent = `${i18n[currentLang].rule_modal_title} #${rule.id}`;
    ruleNameInput.value = rule.name || "";
    ruleLevelSelect.value = rule.level || "campaign";
    ruleTimeframeSelect.value = rule.timeframe || "today";
    ruleScheduleTypeSelect.value = rule.schedule_type || "every_30m";

    if (rule.schedule_type === "once" && rule.schedule_datetime) {
      scheduleDatetimeWrapper.classList.remove("hidden");
      ruleScheduleDatetimeInput.value = timestampToInputValue(
        rule.schedule_datetime
      );
    } else {
      scheduleDatetimeWrapper.classList.add("hidden");
      ruleScheduleDatetimeInput.value = "";
    }

    // action (старое поле, пусть живёт для бэка)
    try {
      const action = JSON.parse(rule.action_json || "{}");
      if (action.type) ruleActionTypeSelect.value = action.type;

      ruleActionValueInput.value = action.value != null ? action.value : "10";

      if (budgetCapInput) {
        budgetCapInput.value =
          action.budget_cap != null ? action.budget_cap : "";
      }

      if (isBudgetAction(action.type)) {
        budgetExtraWrapper.classList.remove("hidden");
      } else {
        budgetExtraWrapper.classList.add("hidden");
      }
    } catch {
      ruleActionTypeSelect.value = "pause";
      if (budgetCapInput) budgetCapInput.value = "";
      budgetExtraWrapper.classList.add("hidden");
    }

    // аккаунты / кампании / группы условий
    try {
      const accounts = Array.isArray(rule.selected_accounts)
        ? rule.selected_accounts
        : parseJsonArray(rule.selected_accounts);

      const campaigns = Array.isArray(rule.selected_campaigns)
        ? rule.selected_campaigns
        : parseJsonArray(rule.selected_campaigns);

      // сначала farms
      const fbIds = Array.isArray(rule.fb_connection_ids)
        ? rule.fb_connection_ids
        : parseJsonArray(rule.fb_connection_ids);

      await renderRuleFarms(fbIds);

      // потом аккаунты/кампании
      await loadAccounts(accounts, campaigns);
    } catch {
      accountsContainer.innerHTML = "";
      campaignsContainer.innerHTML = "";
    }

    // ===== groups/conditions restore (FIX) =====
    if (conditionGroupsContainer) conditionGroupsContainer.innerHTML = "";
    if (conditionsContainer) conditionsContainer.innerHTML = "";

    let parsedConditions = [];
    try {
      if (Array.isArray(rule.conditions_json)) {
        parsedConditions = rule.conditions_json;
      } else if (typeof rule.conditions_json === "string") {
        parsedConditions = JSON.parse(rule.conditions_json || "[]");
      } else {
        parsedConditions = [];
      }
    } catch {
      parsedConditions = [];
    }

    // поддержка 2 форматов:
    // 1) новый: [{ action, conditions }]
    // 2) старый: [ {metric, operator, value}, ... ]
    let groups = [];

    if (
      Array.isArray(parsedConditions) &&
      parsedConditions.length &&
      parsedConditions[0] &&
      typeof parsedConditions[0] === "object" &&
      "conditions" in parsedConditions[0]
    ) {
      // новый формат уже группами
      groups = parsedConditions;
    } else {
      // старый формат: один набор условий + action из action_json
      let actionObj = {};
      try {
        if (rule.action_json && typeof rule.action_json === "object")
          actionObj = rule.action_json;
        else actionObj = JSON.parse(rule.action_json || "{}");
      } catch {
        actionObj = {};
      }

      groups = [
        {
          action: actionObj,
          conditions: Array.isArray(parsedConditions) ? parsedConditions : [],
        },
      ];
    }

    // render groups
    if (groups.length) {
      groups.forEach((g) =>
        addConditionGroup({
          action: g && g.action ? g.action : {},
          conditions: Array.isArray(g?.conditions) ? g.conditions : [],
        })
      );
    } else {
      addConditionGroup(null);
    }
    // ===== end restore =====
  } else {
    // новое правило
    resetRuleModal();
    await renderRuleFarms([]);
    await loadAccounts([], []);
  }
  syncRuleScheduleDatetimeUI();

  ruleModal.classList.remove("hidden");
  const appFooter = document.querySelector(".app-footer");
  if (appFooter) appFooter.classList.add("hidden");
}

function closeRuleModal() {
  ruleModal.classList.add("hidden");
  const appFooter = document.querySelector(".app-footer");
  if (appFooter) appFooter.classList.remove("hidden");
}

if (createRuleBtn) {
  createRuleBtn.addEventListener("click", () => openRuleModal(null));
}
if (ruleModalClose) {
  ruleModalClose.addEventListener("click", closeRuleModal);
}
if (ruleModal) {
  ruleModal.addEventListener("click", (e) => {
    if (e.target === ruleModal.querySelector(".modal-backdrop")) {
      closeRuleModal();
    }
  });
}

// ====== accounts & campaigns ======
async function loadAccounts(
  preselectedAccounts = [],
  preselectedCampaigns = []
) {
  try {
    if (window.__me?.expired) {
      alert(
        currentLang === "ru"
          ? "Ваш план PRO истёк. Пожалуйста, оформите подписку для продолжения работы."
          : "Your PRO plan has expired. Please upgrade your subscription to continue."
      );
      return;
    }

    const connIds = getSelectedRuleConnIds();
    if (!connIds.length) {
      alert("Сначала добавьте хотя бы 1 соц аккаунт");
      return;
    }

    const data = await apiJson("/api/adaccounts_multi", "POST", {
      connection_ids: connIds,
    });

    loadedAccounts = data.accounts || [];
    renderAccounts(preselectedAccounts);

    if (preselectedAccounts.length) {
      await loadCampaigns(preselectedAccounts, preselectedCampaigns);
    }
  } catch (e) {
    alert(i18n[currentLang].load_accounts_error);
    console.error(e);
  }
}

async function renderRuleFarms(preselectedConnIds = []) {
  const el = document.getElementById("rule-farms");
  if (!el) return;
  el.innerHTML = "";

  let conns = [];
  try {
    const data = await apiGet("/api/connections");
    conns = data.connections || []; // показываем и active, и disabled
  } catch (e) {
    console.error("Failed to load connections for rules", e);
  }

  // если ничего не выбрано — по умолчанию выбираем ТОЛЬКО active
  const selected = new Set((preselectedConnIds || []).map(String));
  if (selected.size === 0)
    conns
      .filter((c) => c.status === "active")
      .forEach((c) => selected.add(String(c.id)));

  conns.forEach((c) => {
    const row = document.createElement("label");
    row.className = "selector-item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("data-conn-id", c.id);
    cb.checked = selected.has(String(c.id));
    const isActive = c.status === "active";
    cb.disabled = !isActive;
    if (!isActive) row.style.opacity = "0.55";

    cb.addEventListener("change", async () => {
      // когда меняются farm — перезагружаем аккаунты
      await loadAccounts();
    });

    const span = document.createElement("span");
    span.textContent = c.name || `Farm ${c.id}`;

    row.appendChild(cb);
    row.appendChild(span);
    el.appendChild(row);
  });
}

function getSelectedRuleConnIds() {
  const el = document.getElementById("rule-farms");
  if (!el) return [];
  return [
    ...el.querySelectorAll('input[type="checkbox"][data-conn-id]:checked'),
  ].map((x) => String(x.getAttribute("data-conn-id")));
}

function applyRuleAccountLimit() {
  const me = window.__me || {};
  const maxAcc = Number(me?.limits?.max_ad_accounts || 0);
  if (!maxAcc) return;

  const cbs = [...accountsContainer.querySelectorAll('input[type="checkbox"]')];
  const checked = cbs.filter((cb) => cb.checked).length;
  const reached = checked >= maxAcc;

  cbs.forEach((cb) => {
    if (reached && !cb.checked) {
      cb.disabled = true;
      cb.closest("label")?.style && (cb.closest("label").style.opacity = "0.6");
      cb.closest("label")?.setAttribute(
        "title",
        `Лимит аккаунтов: ${checked}/${maxAcc}`
      );
    } else {
      cb.disabled = false;
      cb.closest("label")?.style && (cb.closest("label").style.opacity = "1");
      cb.closest("label")?.removeAttribute("title");
    }
  });
}

function renderAccounts(preselected = []) {
  accountsContainer.innerHTML = "";
  loadedAccounts.forEach((acc) => {
    const item = document.createElement("label");
    item.className = "selector-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = acc.id;
    if (preselected.includes(acc.id)) checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      applyRuleAccountLimit();
      loadCampaigns();
    });

    const span = document.createElement("span");
    const displayId =
      acc.account_id || acc.accountId || acc.adaccount_id || acc.id;
    span.textContent = displayId
      ? `${acc.name || acc.id} (${displayId})`
      : `${acc.name || acc.id}`;

    item.appendChild(checkbox);
    item.appendChild(span);
    accountsContainer.appendChild(item);
  });
  applyRuleAccountLimit();

  if (preselected.length) {
    loadCampaigns(preselected);
  }
}

async function loadCampaigns(
  preselectedAccounts = null,
  preselectedCampaigns = []
) {
  const selectedAccountIds =
    preselectedAccounts && preselectedAccounts.length
      ? preselectedAccounts
      : getSelectedAccountIds();

  loadedCampaigns = [];
  campaignsContainer.innerHTML = "";

  for (const accId of selectedAccountIds) {
    try {
      const data = await apiGet(
        `/api/campaigns?account_id=${encodeURIComponent(accId)}`
      );
      const activeSet = new Set(data.active_ids || []);
      (data.campaigns || []).forEach((c) => {
        loadedCampaigns.push({
          id: c.id,
          name: c.name,
          account_id: accId,
          active: activeSet.has(c.id),
        });
      });
    } catch (e) {
      if (e.message === "FB_NOT_AUTH") {
        return; // ❗ НЕ логин, просто фарма не выбрана
      }
      console.error("load campaigns error:", e);
    }
  }
  const uniq = new Map();
  for (const c of loadedCampaigns || []) {
    const key = `${String(c.account_id)}:${String(c.id)}`;
    if (!uniq.has(key)) uniq.set(key, c);
  }
  loadedCampaigns = Array.from(uniq.values());
  renderCampaigns(preselectedCampaigns);
}

function renderCampaigns(preselected = []) {
  campaignsContainer.innerHTML = "";

  const filter = campaignSearchInput
    ? campaignSearchInput.value.trim().toLowerCase()
    : "";
  const sorted = [...loadedCampaigns].sort((a, b) => {
    // active сначала
    if (a.active !== b.active) return (b.active ? 1 : 0) - (a.active ? 1 : 0);

    // дальше — чтобы было стабильно и красиво (по имени)
    return String(a.name || "").localeCompare(String(b.name || ""), undefined, {
      sensitivity: "base",
    });
  });

  sorted.forEach((c) => {
    const name = (c.name || "").toLowerCase();
    const id = (c.id || "").toLowerCase();

    if (filter && !name.includes(filter) && !id.includes(filter)) return;

    const item = document.createElement("label");
    item.className = "selector-item";
    if (c.active) item.classList.add("active");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = c.id;
    if (preselected.includes(c.id)) checkbox.checked = true;

    const span = document.createElement("span");
    span.textContent = `${c.name} (${c.id})`;

    item.appendChild(checkbox);
    item.appendChild(span);
    campaignsContainer.appendChild(item);
  });
}

function getSelectedAccountIds() {
  return Array.from(
    accountsContainer.querySelectorAll('input[type="checkbox"]:checked')
  ).map((el) => el.value);
}

function getSelectedCampaignIds() {
  return Array.from(
    campaignsContainer.querySelectorAll('input[type="checkbox"]:checked')
  ).map((el) => el.value);
}

if (loadAccountsBtn) {
  loadAccountsBtn.addEventListener("click", () => loadAccounts());
}

if (selectAllAccountsBtn) {
  selectAllAccountsBtn.addEventListener("click", () => {
    const me = window.__me || {};
    const maxAcc = Number(me?.limits?.max_ad_accounts || 0); // 0 => без лимита

    const cbs = [
      ...accountsContainer.querySelectorAll('input[type="checkbox"]'),
    ];
    if (!cbs.length) return;

    const checkedCount = cbs.filter((cb) => cb.checked).length;
    const allChecked = checkedCount === cbs.length;

    if (allChecked) {
      // если уже всё выбрано — снимаем всё
      cbs.forEach((cb) => (cb.checked = false));
    } else {
      // выбираем максимум по лимиту
      let left = maxAcc > 0 ? maxAcc : Infinity;
      cbs.forEach((cb) => {
        if (left > 0) {
          cb.checked = true;
          left -= 1;
        } else {
          cb.checked = false; // важно: лишнее снимаем
        }
      });
    }

    applyRuleAccountLimit(); // дизейблим остальные
    loadCampaigns(); // кампании пересчитать по выбранным аккаунтам
  });
}

if (selectAllCampaignsBtn) {
  selectAllCampaignsBtn.addEventListener("click", () => {
    const cbs = [
      ...campaignsContainer.querySelectorAll('input[type="checkbox"]'),
    ];
    if (!cbs.length) return;

    const checkedCount = cbs.filter((cb) => cb.checked).length;
    const allChecked = checkedCount === cbs.length;

    // toggle: если всё выбрано — снимаем всё, иначе выбираем всё
    cbs.forEach((cb) => (cb.checked = !allChecked));
  });
}

if (campaignSearchInput) {
  campaignSearchInput.addEventListener("input", () => {
    const selected = getSelectedCampaignIds();
    renderCampaigns(selected);
  });
}

// ====== conditions (groups) ======
function createConditionRow(container, existing = null, isFirst = false) {
  const wrapper = document.createElement("div");
  wrapper.className = "condition-wrapper";

  if (!isFirst) {
    const connector = document.createElement("div");
    connector.className = "condition-connector";

    const logicSelect = document.createElement("select");
    logicSelect.className = "logic-select";

    const optAND = document.createElement("option");
    optAND.value = "AND";
    optAND.textContent = "AND";

    const optOR = document.createElement("option");
    optOR.value = "OR";
    optOR.textContent = "OR";

    logicSelect.appendChild(optAND);
    logicSelect.appendChild(optOR);

    if (existing && existing.logic) logicSelect.value = existing.logic;

    connector.appendChild(logicSelect);
    wrapper.appendChild(connector);
  }

  const row = document.createElement("div");
  row.className = "condition-row-metric";

  const metricSelect = document.createElement("select");
  metricSelect.className = "metric";
  metricsOptions.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.value;
    opt.textContent = m.label;
    metricSelect.appendChild(opt);
  });
  if (existing && existing.metric) metricSelect.value = existing.metric;

  const operatorSelect = document.createElement("select");
  operatorSelect.className = "operator";
  [">", ">=", "<", "<=", "==", "!="].forEach((op) => {
    const opt = document.createElement("option");
    opt.value = op;
    opt.textContent = op;
    operatorSelect.appendChild(opt);
  });
  if (existing && existing.operator) operatorSelect.value = existing.operator;

  const valueInput = document.createElement("input");
  valueInput.type = "number";
  valueInput.className = "value-input";
  valueInput.value = existing && existing.value != null ? existing.value : 0;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "icon-btn";
  removeBtn.textContent = "✕";
  removeBtn.addEventListener("click", () => wrapper.remove());

  row.appendChild(metricSelect);
  row.appendChild(operatorSelect);
  row.appendChild(valueInput);
  row.appendChild(removeBtn);

  wrapper.appendChild(row);

  if (container) {
    container.appendChild(wrapper);
  }

  return wrapper;
}

function addConditionGroup(existingGroup = null) {
  if (!conditionGroupsContainer) return;

  const hint = conditionGroupsContainer.querySelector(".no-conditions-hint");
  if (hint) hint.remove();

  const groupEl = document.createElement("div");
  groupEl.className = "condition-group";

  const headerEl = document.createElement("div");
  headerEl.className = "condition-group-header";

  const titleEl = document.createElement("span");
  titleEl.className = "condition-group-title";
  headerEl.appendChild(titleEl);

  const actionWrap = document.createElement("div");
  actionWrap.className = "condition-group-action";

  const actionSelect = document.createElement("select");
  actionSelect.className = "group-action-type";

  const actions = [
    { value: "pause", label: i18n[currentLang].act_pause },
    { value: "start", label: i18n[currentLang].act_start },
    {
      value: "increase_budget_percent",
      label: i18n[currentLang].act_inc_budget_percent,
    },
    {
      value: "decrease_budget_percent",
      label: i18n[currentLang].act_dec_budget_percent,
    },
    {
      value: "increase_budget_value",
      label: i18n[currentLang].act_inc_budget_value,
    },
    {
      value: "decrease_budget_value",
      label: i18n[currentLang].act_dec_budget_value,
    },
  ];
  actions.forEach((a) => {
    const opt = document.createElement("option");
    opt.value = a.value;
    opt.textContent = a.label;
    actionSelect.appendChild(opt);
  });

  const actionValueInput = document.createElement("input");
  actionValueInput.type = "number";
  actionValueInput.className = "group-action-value";
  actionValueInput.placeholder = "10";

  const actionCapInput = document.createElement("input");
  actionCapInput.type = "number";
  actionCapInput.className = "group-action-cap";
  actionCapInput.placeholder = "Max budget";

  const actionMaxChangesInput = document.createElement("input");
  actionMaxChangesInput.type = "number";
  actionMaxChangesInput.className = "group-action-max-changes";
  actionMaxChangesInput.placeholder = "Max changes / day";
  actionMaxChangesInput.min = "1";

  actionWrap.appendChild(actionSelect);
  actionWrap.appendChild(actionValueInput);
  actionWrap.appendChild(actionCapInput);
  actionWrap.appendChild(actionMaxChangesInput);

  actionSelect.addEventListener("change", () => {
    updateGroupActionVisibility(
      actionSelect,
      actionValueInput,
      actionCapInput,
      actionMaxChangesInput
    );
  });

  const removeGroupBtn = document.createElement("button");
  removeGroupBtn.type = "button";
  removeGroupBtn.className = "icon-btn";
  removeGroupBtn.textContent = "✕";
  removeGroupBtn.addEventListener("click", () => {
    conditionGroupsContainer.removeChild(groupEl);

    if (!conditionGroupsContainer.querySelector(".condition-group")) {
      const placeholder = document.createElement("div");
      placeholder.className = "no-conditions-hint muted small";
      placeholder.textContent =
        i18n[currentLang].no_conditions_hint ||
        "Условий пока нет. Добавьте первую группу.";
      conditionGroupsContainer.appendChild(placeholder);
    }

    rebuildConditionGroupDividers();
    updateConditionGroupTitles();
  });

  headerEl.appendChild(actionWrap);
  headerEl.appendChild(removeGroupBtn);

  const groupConditionsContainer = document.createElement("div");
  groupConditionsContainer.className = "conditions-container";

  const addCondBtn = document.createElement("button");
  addCondBtn.type = "button";
  addCondBtn.className = "secondary-btn small";
  addCondBtn.textContent =
    i18n[currentLang].btn_add_condition || "Добавить условие";
  addCondBtn.addEventListener("click", () => {
    const isFirst =
      groupConditionsContainer.querySelectorAll(".condition-wrapper").length ===
      0;
    createConditionRow(groupConditionsContainer, null, isFirst);
  });

  groupEl.appendChild(headerEl);
  groupEl.appendChild(groupConditionsContainer);
  groupEl.appendChild(addCondBtn);

  conditionGroupsContainer.appendChild(groupEl);

  if (existingGroup) {
    const act = existingGroup.action || {};
    if (act.type) actionSelect.value = act.type;

    // ✅ восстанавливаем значения всегда (visibility решит что показывать)
    if (act.value != null) actionValueInput.value = act.value;
    if (act.budget_cap != null) actionCapInput.value = act.budget_cap;
    if (act.max_changes_per_day != null)
      actionMaxChangesInput.value = act.max_changes_per_day;

    const conds = Array.isArray(existingGroup.conditions)
      ? existingGroup.conditions
      : [];
    if (conds.length) {
      conds.forEach((c, idx) => {
        createConditionRow(groupConditionsContainer, c, idx === 0);
      });
    } else {
      createConditionRow(groupConditionsContainer, null, true);
    }
  } else {
    actionSelect.value = "pause";
    createConditionRow(groupConditionsContainer, null, true);
  }

  updateGroupActionVisibility(
    actionSelect,
    actionValueInput,
    actionCapInput,
    actionMaxChangesInput
  );
  rebuildConditionGroupDividers();
  updateConditionGroupTitles();
}

function collectConditionGroupsFromDom() {
  const groups = [];
  if (!conditionGroupsContainer) return groups;

  const groupEls =
    conditionGroupsContainer.querySelectorAll(".condition-group");

  groupEls.forEach((groupEl) => {
    const actionTypeEl = groupEl.querySelector(".group-action-type");
    const actionValueEl = groupEl.querySelector(".group-action-value");
    const actionCapEl = groupEl.querySelector(".group-action-cap");
    const condContainer = groupEl.querySelector(".conditions-container");
    const actionMaxChangesEl = groupEl.querySelector(
      ".group-action-max-changes"
    );

    const actionType = actionTypeEl ? actionTypeEl.value : "pause";
    const action = { type: actionType };

    if (isBudgetAction(actionType)) {
      const val = Number(actionValueEl?.value || 0);
      const cap = Number(actionCapEl?.value || 0);
      const maxChanges = Number(actionMaxChangesEl?.value || 0);

      action.value = val;

      if (cap > 0) action.budget_cap = cap;
      if (maxChanges > 0) action.max_changes_per_day = maxChanges;
    }

    const wrappers = condContainer
      ? Array.from(condContainer.querySelectorAll(".condition-wrapper"))
      : [];

    const conditions = wrappers.map((wrapper, idx) => {
      const selects = wrapper.querySelectorAll("select");
      const valueInput = wrapper.querySelector(".value-input");

      let logic = "AND";
      let metricSelect;
      let operatorSelect;

      if (idx === 0) {
        metricSelect = selects[0];
        operatorSelect = selects[1];
      } else {
        logic = selects[0]?.value || "AND";
        metricSelect = selects[1];
        operatorSelect = selects[2];
      }

      const metric = metricSelect ? metricSelect.value : "spend";
      const operator = operatorSelect ? operatorSelect.value : ">";
      const value = Number(valueInput?.value || 0);

      return { logic, metric, operator, value };
    });

    if (!conditions.length) return;

    groups.push({ action, conditions });
  });

  return groups;
}

// спрятать старый блок условий
if (conditionsContainer) {
  conditionsContainer.classList.add("hidden");
}
if (addConditionBtn) {
  addConditionBtn.classList.add("hidden");
}
if (globalActionBlock) {
  globalActionBlock.classList.add("hidden");
}
if (addConditionGroupBtn) {
  addConditionGroupBtn.addEventListener("click", () => addConditionGroup(null));
}

// ====== save / delete / run rule ======
// ====== save / delete / run rule ======
if (ruleSaveBtn) {
  ruleSaveBtn.addEventListener("click", async () => {
    try {
      // === 1. Проверяем выбранную farm ===
      const connIds = getSelectedRuleConnIds();

      if (!connIds.length) {
        alert("Выбери соц-аккаунт");
        return;
      }

      // === 3. Собираем данные правила ===
      const name = ruleNameInput.value || "Rule";
      const level = ruleLevelSelect.value;
      const timeframe = ruleTimeframeSelect.value;
      const schedule_type = ruleScheduleTypeSelect.value;

      let schedule_datetime = null;
      if (schedule_type === "once" && ruleScheduleDatetimeInput.value) {
        const ts = Date.parse(ruleScheduleDatetimeInput.value);
        if (!Number.isNaN(ts)) {
          schedule_datetime = ts;
        }
      }

      const selected_accounts = getSelectedAccountIds();
      const selected_campaigns = getSelectedCampaignIds();

      const groups = collectConditionGroupsFromDom();
      const finalGroups =
        groups && groups.length
          ? groups
          : [
              {
                action: { type: "pause" },
                conditions: [],
              },
            ];

      // === 4. Формируем payload (СТРОГО как ждёт сервер) ===
      const payload = {
        name,
        level,
        scope: "selected",
        fb_connection_ids: connIds,
        selected_accounts,
        selected_campaigns,
        selected_adsets: [],
        selected_ads: [],
        timeframe,
        schedule_type,
        schedule_datetime,
        action_json: finalGroups[0].action || { type: "pause" },
        conditions_json: finalGroups,
      };

      // === 5. Create / Update ===
      if (editingRuleId) {
        await apiJson(`/api/rules/${editingRuleId}`, "PUT", payload);
      } else {
        await apiJson("/api/rules", "POST", payload);
      }

      // === 6. Обновляем UI ===
      await loadRules();
      closeRuleModal();
    } catch (e) {
      console.error("Save rule error:", e);

      // ❗️1. Реальный logout — ТОЛЬКО если УМЕР /api/app/me
      if (e.code === "SAAS_NOT_AUTH") {
        alert("Сессия истекла. Войдите ещё раз.");
        showLogin();
        return;
      }

      // ❗️2. 401 от rules — ЭТО НЕ ЛОГИН
      if (e.message === "Not authenticated") {
        alert("Ошибка сохранения правила. Проверь план.");
        return;
      }

      alert(i18n[currentLang].save_error);
    }
  });
}

async function deleteRule(ruleId) {
  if (!confirm(i18n[currentLang].delete_confirm)) return;
  try {
    await apiJson(`/api/rules/${ruleId}`, "DELETE");
    await loadRules();
  } catch (e) {
    alert(i18n[currentLang].delete_error);
    console.error(e);
  }
}
function parseJsonArray(v) {
  try {
    const a = JSON.parse(v || "[]");
    return Array.isArray(a) ? a : [];
  } catch {
    return [];
  }
}

// ====== data loading ======
async function loadMe() {
  try {
    const me = await apiGet("/api/app/me");

    // === план / trial label как у тебя уже было ===
    const planLabel = document.getElementById("plan-label");
    if (planLabel && me.plan) {
      planLabel.className = "plan-label";
      if (me.plan === "trial" || me.plan === "trial_pending") {
        if (me.daysLeft != null) {
          planLabel.textContent = `Trial (${me.daysLeft}d left)`;
        } else {
          planLabel.textContent = "Trial";
        }
      } else if (me.plan === "pro") {
        if (me.daysLeft != null) {
          planLabel.textContent = `PRO (${me.daysLeft}d left)`;
        } else {
          planLabel.textContent = "PRO";
        }
      } else if (me.plan === "expired") {
        planLabel.textContent = "Expired";
      } else {
        planLabel.textContent = me.plan || "";
      }
    }

    showApp();

    // подтягиваем email
    try {
      const appMe = await getAppMe();
      if (appMe?.email) userInfoEl.textContent = appMe.email;
    } catch {}
  } catch (e) {
    // SaaS-сессия потеряна → сразу на логин
    if (e.code === "SAAS_NOT_AUTH" || e.error === "Not authenticated") {
      console.warn("SaaS session lost in loadMe");
      showLogin();
      return;
    }

    console.error("loadMe error:", e);
    showLogin();
  }
}

renderConnectionsDropdown();

async function loadRules() {
  try {
    const data = await apiGet("/api/rules");
    rules = data.rules || [];
    renderRules();
    // ✅ cache last good rules list for read-only expired mode
    try {
      localStorage.setItem("rulesCache", JSON.stringify(rules || []));
    } catch (e) {}
  } catch (e) {
    console.error("loadRules error:", e);

    if (e.code === "SAAS_NOT_AUTH") {
      showLogin();
      return;
    }
  }
}

async function loadLogs() {
  try {
    const data = await apiGet("/api/logs");
    logs = data.logs || [];
    renderLogs();
  } catch (e) {
    // если SaaS-сессия умерла
    if (e.code === "SAAS_NOT_AUTH" || e.error === "Not authenticated") {
      console.warn("SaaS session lost in loadLogs");
      showLogin();
      return;
    }

    // если позже появится отдельный код типа FB_NOT_SELECTED —
    // здесь можно будет его обработать
    console.error("loadLogs error:", e);
  }
}
function showTrialModal(appMe) {
  if (document.getElementById("trial-modal")) return;

  const overlay = document.createElement("div");
  overlay.id = "trial-modal";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.65)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const box = document.createElement("div");
  box.style.width = "520px";
  box.style.maxWidth = "92vw";
  box.style.background = "#0f1116";
  box.style.border = "1px solid #222838";
  box.style.borderRadius = "16px";
  box.style.padding = "16px";
  box.style.color = "#fff";

  box.innerHTML = `
    <div style="font-size:18px;font-weight:700;margin-bottom:8px;">Активировать Trial</div>
    <div style="opacity:.85;margin-bottom:12px;">Trial на 5 дней. Нажми кнопку ниже, чтобы включить.</div>
    <button id="trial-start-btn" style="width:100%;padding:10px 12px;border-radius:10px;border:0;background:#3b82f6;color:#fff;cursor:pointer">
      Использовать Trial
    </button>
    <div id="trial-msg" style="margin-top:10px;font-size:14px;color:#fb7185;display:none;"></div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const msg = box.querySelector("#trial-msg");

  box.querySelector("#trial-start-btn").addEventListener("click", async () => {
    msg.style.display = "none";
    msg.textContent = "";

    try {
      const r = await fetch("/api/app/start-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "HTTP " + r.status);

      overlay.remove();
      try {
        const appMe = await getAppMe();
        window.__me = appMe;
      } catch {}

      try {
        await initBillingUI();
      } catch {}
      try {
        await reinitAfterBilling();
      } catch {}
    } catch (e) {
      msg.style.display = "block";
      msg.textContent = e.message || String(e);
    }
  });
}

function showPlanSelectModal(opts = {}) {
  const force = opts.force === true;
  if (document.getElementById("plan-modal")) return;

  const isRu =
    (typeof currentLang !== "undefined" ? currentLang : "ru") === "ru";

  const overlay = document.createElement("div");
  overlay.id = "plan-modal";
  overlay.style.cssText = `
    position:fixed; inset:0;
    background:rgba(0,0,0,.65);
    backdrop-filter: blur(6px);
    display:flex; align-items:center; justify-content:center;
    z-index:9999;
    padding:22px;
  `;

  overlay.innerHTML = `
    <div style="
      width:min(1080px, 96vw);
      background:#0b0f19;
      border:1px solid rgba(255,255,255,.08);
      border-radius:22px;
      padding:18px;
      color:#e5e7eb;
      box-shadow: 0 18px 60px rgba(0,0,0,.55);
    ">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">
        <div>
          <div style="font-size:22px;font-weight:800;letter-spacing:.2px">
            ${isRu ? "Выберите план" : "Choose your plan"}
          </div>
          <div style="margin-top:6px;color:rgba(229,231,235,.72);font-size:13.5px;line-height:1.35">
            ${
              isRu
                ? "Можно начать с Trial. PRO можно активировать в любой момент."
                : "Start with Trial. You can upgrade to PRO anytime."
            }
          </div>
        </div>
        <button id="plan-x" aria-label="Close" style="
          border:1px solid rgba(255,255,255,.12);
          background:rgba(255,255,255,.06);
          color:#e5e7eb;
          border-radius:12px;
          padding:8px 10px;
          cursor:pointer;
          line-height:1;
          font-size:14px;
        ">✕</button>
      </div>

      <div style="
        display:grid;
        grid-template-columns: 1fr 1.08fr;
        gap:14px;
      " id="plan-grid">

        <!-- TRIAL CARD -->
        <div style="
          background:#ffffff;
          color:#0b1220;
          border:1px solid #e5e7eb;
          border-radius:20px;
          padding:18px 18px 16px;
          position:relative;
          overflow:hidden;
        ">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="font-size:18px;font-weight:800">Trial</div>
            <div style="
              font-size:12px;
              font-weight:700;
              padding:6px 10px;
              border-radius:999px;
              background:#eef2ff;
              color:#1e293b;
            ">
              ${isRu ? "Бесплатно" : "Free"}
            </div>
          </div>

          <div style="margin-top:10px;font-size:13.5px;color:#334155">
            ${isRu ? "5 дней доступа" : "5 days access"}
          </div>

          <div style="margin-top:14px;font-size:13.5px;color:#0b1220;font-weight:800">
            ${isRu ? "Лимиты" : "Limits"}
          </div>

          <ul style="margin:10px 0 0; padding-left:18px; color:#334155; font-size:13.5px; line-height:1.55">
            <li>${isRu ? "2 соц-аккаунта" : "2 social accounts"}</li>
            <li>${
              isRu ? "до 6 рекламных кабинетов" : "up to 6 ad accounts"
            }</li>
            <li>${
              isRu
                ? "базовые функции (правила/креативы)"
                : "basic features (rules/creatives)"
            }</li>
          </ul>

          <button id="plan-trial" class="btn" style="
            width:100%;
            margin-top:16px;
            border:0;
            border-radius:999px;
            padding:12px 14px;
            font-weight:900;
            cursor:pointer;
            background:#facc15;
            color:#111827;
            box-shadow: 0 10px 26px rgba(250,204,21,.28);
          ">
            ${isRu ? "Начать Trial" : "Start Trial"}
          </button>

          <div style="margin-top:10px;font-size:12.5px;color:#64748b;text-align:center">
            ${isRu ? "Можно перейти на PRO в любой момент" : "Upgrade anytime"}
          </div>
        </div>

        <!-- PRO CARD (HIGHLIGHT) -->
        <div style="
          background:linear-gradient(180deg, #0f1116 0%, #0b1220 100%);
          border:1px solid rgba(250,204,21,.35);
          border-radius:22px;
          padding:18px 18px 16px;
          position:relative;
          overflow:hidden;
          box-shadow: 0 16px 46px rgba(0,0,0,.55);
        ">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="font-size:18px;font-weight:900;color:#fff">Pro</div>
              <div style="
                font-size:12px;
                font-weight:900;
                padding:6px 10px;
                border-radius:999px;
                background:#facc15;
                color:#111827;
              ">
                ${isRu ? "Лучший выбор" : "Most popular"}
              </div>
            </div>
            <div style="text-align:right">
              <div style="font-size:30px;font-weight:950;color:#fff;line-height:1">10$</div>
              <div style="margin-top:4px;font-size:12.5px;color:rgba(229,231,235,.72)">
                ${
                  isRu
                    ? "Действует 30 дней после оплаты"
                    : "Valid for 30 days after payment"
                }
              </div>
            </div>
          </div>

          <div style="margin-top:14px;font-size:13.5px;color:rgba(229,231,235,.92);font-weight:800">
            ${isRu ? "Лимиты" : "Limits"}
          </div>

          <ul style="margin:10px 0 0; padding-left:18px; color:rgba(229,231,235,.78); font-size:13.5px; line-height:1.6">
            <li>${isRu ? "5 соц-аккаунтов" : "5 social accounts"}</li>
            <li>${
              isRu ? "до 50 рекламных кабинетов" : "up to 50 ad accounts"
            }</li>
            <li>${
              isRu
                ? "все функции + без ограничений"
                : "all features + no limits"
            }</li>
          </ul>

          <button id="plan-pro" class="btn" style="
            width:100%;
            margin-top:16px;
            border:0;
            border-radius:999px;
            padding:12px 14px;
            font-weight:950;
            cursor:pointer;
            background:#facc15;
            color:#111827;
            box-shadow: 0 12px 30px rgba(250,204,21,.26);
          ">
            ${isRu ? "Активировать PRO" : "Activate PRO"}
          </button>

          <div style="margin-top:10px;font-size:12.5px;color:rgba(229,231,235,.70);text-align:center">
            ${
              isRu
                ? "Оплата USDT TRC20, USDT BEP20, BTC"
                : "Crypto payment with USDT TRC20, USDT BEP20, BTC"
            }
          </div>
        </div>

      </div>

      <div id="plan-err" style="
        margin-top:12px;
        padding:10px 12px;
        border-radius:12px;
        background:rgba(239,68,68,.10);
        border:1px solid rgba(239,68,68,.25);
        color:#fb7185;
        display:none;
        font-size:13px;
      "></div>
    </div>
  `;

  document.body.appendChild(overlay);

  // responsive: 1 column on small screens
  try {
    const grid = overlay.querySelector("#plan-grid");
    const applyResponsive = () => {
      if (!grid) return;
      grid.style.gridTemplateColumns =
        window.innerWidth < 860 ? "1fr" : "1fr 1.08fr";
    };
    applyResponsive();
    window.addEventListener("resize", applyResponsive, { passive: true });

    // close button (disabled when force=true)
    const xBtn = overlay.querySelector("#plan-x");
    if (force && xBtn) {
      xBtn.style.display = "none"; // прячем крестик
    } else {
      xBtn?.addEventListener("click", () => {
        try {
          window.removeEventListener("resize", applyResponsive);
        } catch (e) {}
        overlay.remove();
      });
    }
    // block ESC when force=true
    const onKey = (e) => {
      if (!force) return;
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKey, true);

    // optional: close on overlay click (if you want). For now: NO (to force choice)
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        // do nothing (force choice)
      }
    });
  } catch (e) {}

  const err = overlay.querySelector("#plan-err");

  async function select(plan) {
    try {
      const r = await fetch("/api/app/select-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });

      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || "Failed");

      // ✅ PRO → открыть оплату
      if (j && j.open_payment) {
        // важно: при trial_pending у тебя init() возвращается раньше showApp(),
        // поэтому тут принудительно показываем приложение
        showApp();
        activateTab("billing");
        window.history.replaceState({}, "", "/payment");

        const m = document.getElementById("bill-modal");
        if (!m) throw new Error("bill-modal not found in index.html");

        overlay.remove();
        billOpenModal("plan_modal");
        return;
        const isRu = currentLang === "ru";
      }

      // ✅ TRIAL → закрыть и обновить UI (без reload)
      overlay.remove();

      try {
        const appMe = await getAppMe();
        window.__me = appMe;
      } catch {}

      try {
        await initBillingUI();
      } catch {}
      try {
        await reinitAfterBilling();
      } catch {}
      return;
    } catch (e) {
      err.textContent = e && e.message ? e.message : String(e);
      err.style.display = "block";
    }
  }

  overlay.querySelector("#plan-trial").onclick = (e) => {
    e.preventDefault();
    select("trial");
  };
  overlay.querySelector("#plan-pro").onclick = (e) => {
    e.preventDefault();
    select("pro");
  };
}

async function initBillingUI() {
  const page = document.getElementById("billing-page");
  if (!page) return;

  page.style.display = "block";

  const me = await getAppMe();

  const trialBtn = document.getElementById("trial-btn");
  const trialNote = document.getElementById("trial-note");

  const proBtn = document.getElementById("pro-btn");
  const proNote = document.getElementById("pro-note");

  // ===== TRIAL =====
  if (me.plan === "trial") {
    trialBtn.textContent = "Активен";
    trialBtn.disabled = true;
  } else if (me.trial_used) {
    trialBtn.textContent = "Недоступен";
    trialBtn.disabled = true;
    trialNote.textContent = "Вы уже использовали Trial";
  }

  // ===== PRO =====
  if (me.plan === "pro") {
    proBtn.textContent = "Активен";
    proBtn.disabled = true;
    proNote.textContent = "Текущий тариф";
  } else {
    proBtn.onclick = async (e) => {
      if (e) e.preventDefault();

      proBtn.disabled = true;
      proBtn.textContent = currentLang === "ru" ? "Активация…" : "Activating…";

      try {
        const j = await apiJson("/api/app/select-plan", "POST", {
          plan: "pro",
        });

        // сервер сказал "открой оплату"
        if (j && j.open_payment) {
          proBtn.disabled = false;
          proBtn.textContent =
            currentLang === "ru" ? "Активировать Pro" : "Activate Pro";
          billOpenModal("billing_btn");
          return;
        }

        // на всякий обновим me + перерисуем UI
        try {
          const appMe2 = await getAppMe();
          window.__me = appMe2;
        } catch {}

        await reinitAfterBilling();
      } catch (err) {
        console.error(err);
        proBtn.textContent = currentLang === "ru" ? "Ошибка" : "Error";
        proBtn.disabled = false;
        alert(err?.message || String(err));
      }
    };
  }
}

// ====== init ======
(async function init() {
  applyI18n();

  // helper: safe read billing flags
  const getBillingFlags = () => {
    let pendingInvoiceId = null,
      lockedToBilling = false,
      lockReason = "";
    try {
      pendingInvoiceId = localStorage.getItem("pendingInvoiceId");
      lockedToBilling = localStorage.getItem("lockToBilling") === "1";
      lockReason = localStorage.getItem("lockReason") || "";
    } catch (e) {}
    return { pendingInvoiceId, lockedToBilling, lockReason };
  };

  // 1) SaaS me
  let appMe = null;
  try {
    appMe = await getAppMe();
    window.__me = appMe;
    try {
      await loadMe();
    } catch (e) {
      console.warn("loadMe fail", e);
    }
  } catch (e) {
    console.warn("getAppMe failed:", e);

    // Prevent infinite redirect loop - check if we already tried redirecting
    const now = Date.now();
    const lastRedirect = sessionStorage.getItem("last_auth_redirect");

    // If we redirected within the last 3 seconds, don't redirect again (prevents loop)
    if (lastRedirect && now - parseInt(lastRedirect, 10) < 3000) {
      console.error("Redirect loop detected! Stopping redirect.");
      // Show error message to user instead of looping
      const appEl = document.getElementById("app");
      if (appEl) {
        appEl.innerHTML = `
          <div style="text-align:center; padding:50px; font-family:system-ui,sans-serif;">
            <h2>Authentication Error</h2>
            <p>Unable to verify session. Please try logging in again.</p>
            <p style="color:#888;font-size:14px;">Make sure you're accessing via https://rulez.vip</p>
            <a href="/" style="color:#3b82f6;">Go to Login Page</a>
          </div>
        `;
      }
      return;
    }

    // Mark that we're redirecting
    sessionStorage.setItem("last_auth_redirect", now.toString());

    // Only redirect if we're not already on the landing page
    if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    return;
  }

  // 2) handle server redirect errors (?error=...)
  try {
    const q = new URLSearchParams(window.location.search || "");
    const err = q.get("error");

    if (err === "plan_limit_connections") {
      uiAlert(
        currentLang === "ru"
          ? "Лимит соц-аккаунтов для Trial — 2. Чтобы добавить больше, перейдите на PRO."
          : "Trial limit is 2 social accounts. Upgrade to PRO to add more.",
        currentLang === "ru" ? "Ограничение тарифа" : "Plan limit"
      );
      history.replaceState({}, "", window.location.pathname);
    }
  } catch (e) {}

  // 3) trial_pending -> force plan selection modal
  if (appMe.plan === "trial_pending") {
    showPlanSelectModal({ force: true });
    return;
  }

  // 4) open_payment=1 -> open paywall BEFORE any farm checks
  try {
    const q = new URLSearchParams(window.location.search || "");
    if (q.get("open_payment") === "1") {
      showApp();
      activateTab("billing");
      try {
        await initBillingUI();
      } catch (e) {}
      try {
        billOpenModal("paywall");
      } catch (e) {}

      // cleanup param to avoid reopening on refresh
      q.delete("open_payment");
      const newUrl =
        window.location.pathname + (q.toString() ? "?" + q.toString() : "");
      try {
        window.history.replaceState({}, "", newUrl);
      } catch (e) {}

      return;
    }
  } catch (e) {}

  // 5) read billing flags + route
  let { pendingInvoiceId, lockedToBilling, lockReason } = getBillingFlags();
  const isPaymentRoute = window.location.pathname === "/payment";
  const isExpiredNow = appMe.plan === "expired";

  // 6) /payment route always allowed without farm
  if (isPaymentRoute) {
    showApp();
    activateTab("billing");
    try {
      await initBillingUI();
    } catch (e) {}

    // refresh flags (could have been set while opening)
    ({ pendingInvoiceId, lockedToBilling, lockReason } = getBillingFlags());
    if (pendingInvoiceId) {
      try {
        billOpenModal("resume");
      } catch (e) {}
    }
    return;
  }

  // 7) if plan is NOT expired, remove stale expired locks
  if (
    !isExpiredNow &&
    lockedToBilling &&
    (lockReason === "" || lockReason === "expired")
  ) {
    try {
      unlockBilling();
    } catch (e) {}
    ({ pendingInvoiceId, lockedToBilling, lockReason } = getBillingFlags());
  }

  // 8) EXPIRED -> show Rules read-only, keep billing available but don't force it
  if (isExpiredNow) {
    try {
      localStorage.setItem("lockToBilling", "1");
      localStorage.setItem("lockReason", "expired");
    } catch (e) {}

    showApp();
    try {
      await initBillingUI();
    } catch (e) {}

    activateTab("rules");

    try {
      await loadRules();
    } catch (e) {
      try {
        const cached = JSON.parse(localStorage.getItem("rulesCache") || "[]");
        if (Array.isArray(cached)) {
          rules = cached;
          renderRules(rules, { readOnly: true, reason: "expired" });
        }
      } catch {}
    }

    try {
      setRulesReadOnlyExpiredUI();
    } catch (e) {}
    return;
  }

  // 9) antifraud lock -> keep locked (normalize to billing)
  if (lockedToBilling && lockReason && lockReason.startsWith("antifraud")) {
    try {
      lockToBilling(lockReason);
    } catch (e) {}
    ({ pendingInvoiceId, lockedToBilling, lockReason } = getBillingFlags());
  }

  // 10) pending invoice -> show billing + resume, but DON'T hard lock
  // 10) pending invoice -> show billing + resume, but DON'T hard lock
  if (pendingInvoiceId) {
    // показываем приложение и сразу поднимаем billing UI
    showApp();

    // ✅ обязательно инициализируем billing UI (хендлеры PRO/Trial и т.д.)
    try {
      await initBillingUI();
    } catch (e) {
      console.warn("initBillingUI fail", e);
    }

    // ✅ если пользователь сейчас не на billing — переключим на billing,
    // но НЕ делаем hard-lock вкладок
    try {
      activateTab("billing");
    } catch (e) {}

    // ✅ открываем resume модалку (если есть что резюмить)
    try {
      billOpenModal("resume");
    } catch (e) {
      console.warn("billOpenModal resume fail", e);
    }

    // ⚠️ ВАЖНО: НЕ return — продолжаем init дальше.
    // Если есть активная farm, можно загрузить rules/logs/creatives.
    // Если нет — ниже по коду у тебя сработает ветка "no active farm" и оставит billing.
  }

  // 11) show SPA and init billing UI (always)
  showApp();
  try {
    await initBillingUI();
  } catch (e) {}

  // 12) if hard-locked (expired/antifraud) -> stay on billing and stop here
  ({ pendingInvoiceId, lockedToBilling, lockReason } = getBillingFlags());
  if (
    lockedToBilling &&
    (lockReason === "expired" ||
      lockReason === "pro_required" ||
      lockReason.startsWith("antifraud"))
  ) {
    showApp();
    activateTab("billing");
    return;
  }

  // 13) load connections and check active farm
  let conns = [];
  try {
    conns = await getConnections();
  } catch (e) {
    conns = [];
  }

  const getUiStatus = (c) =>
    String(c.ui_status || c.status || "").toLowerCase();
  const hasActive = (conns || []).some((c) => getUiStatus(c) === "active");

  // 14) header me (email + plan label) should be present as early as possible
  try {
    await loadMe();
  } catch (e) {}

  // 15) if no active farm -> stay on billing
  if (!hasActive) {
    showApp();
    activateTab("billing");
    return;
  }

  // 16) load main tabs
  if (appScreen.classList.contains("hidden")) return;

  try {
    await loadRules();
  } catch (e) {}
  try {
    await loadLogs();
  } catch (e) {}
  try {
    await initCreativesTab();
  } catch (e) {}

  const p = window.location.pathname;
  const initialTab = routeToTab[p] || "rules";
  activateTab(initialTab);
})();

async function renderConnectionsDropdown() {
  // чтобы не плодить дубли
  let wrap = document.getElementById("conn-dd");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "conn-dd";
    wrap.style.marginLeft = "12px";
    wrap.style.position = "relative";
    wrap.style.display = "inline-block";

    // вставляем рядом с userInfoEl (справа сверху)
    userInfoEl.parentNode.appendChild(wrap);
  }

  let connections = [];
  try {
    connections = await getConnections();
  } catch (e) {
    // если SaaS не залогинен — просто не рисуем
    wrap.innerHTML = "";
    return;
  }

  const getUiStatus = (c) =>
    String(c.ui_status || c.status || "").toLowerCase();

  const active = connections.filter((c) => getUiStatus(c) === "active");
  const needReconnect = connections.filter(
    (c) => getUiStatus(c) === "need_reconnect"
  );
  const disabled = connections.filter((c) => {
    const s = getUiStatus(c);
    return s !== "active" && s !== "need_reconnect";
  });

  wrap.innerHTML = `
    <button id="conn-dd-btn" class="btn" style="padding:6px 10px;">
      Соц аккаунты: ${active.length}
    </button>
    <div id="conn-dd-menu" style="
      display:none; position:absolute; right:0; top:38px; width:320px;
      background:#0f1116; border:1px solid #222838; border-radius:12px;
      padding:10px; z-index:9999;
    ">
      <div style="font-weight:700;margin-bottom:8px;">Подключённые</div>
      <div id="conn-dd-list"></div>
      <div style="margin-top:10px; border-top:1px solid #222838; padding-top:10px;">
        <button id="conn-add-btn" class="btn" style="width:100%;">+ Добавить Facebook аккаунт</button>
      </div>
    </div>
  `;

  const btn = wrap.querySelector("#conn-dd-btn");
  const menu = wrap.querySelector("#conn-dd-menu");
  const list = wrap.querySelector("#conn-dd-list");
  async function recheckConnectionsThrottled() {
    const now = Date.now();
    if (now - __connRecheckLastAt < 60_000) return; // не чаще 1 раза/мин
    __connRecheckLastAt = now;

    try {
      await fetch("/api/connections/recheck", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // молча: если Meta тупит, UI всё равно покажем по старым данным
    }
  }

  const renderRow = (c) => {
    const name = c.name || c.fb_user_id || "ID " + c.id;

    const uiStatus = String(c.ui_status || c.status || "").toLowerCase();

    const isActive = uiStatus === "active";
    const isNeedReconnect = uiStatus === "need_reconnect";

    let statusText = "Disconnected";
    if (isNeedReconnect) statusText = "Need reconnect";
    else if (isActive) statusText = "Active";

    const statusClass = isActive
      ? "active"
      : isNeedReconnect
      ? "need-reconnect"
      : "disabled";

    // кнопка: если need_reconnect — подсвечиваем и текст "Переподключить"
    const reconnectText =
      isActive || isNeedReconnect ? "Переподключить" : "Подключить";
    const reconnectClass = isNeedReconnect ? "btn-reconnect-hot" : "";

    return `
    <div class="conn-row">
      <div class="conn-left">
        <div class="conn-avatar">
          ${escapeHtml((name && name[0]) || "?")}
        </div>

        <div class="conn-meta">
          <div class="conn-name">${escapeHtml(name)}</div>
          <div class="conn-status ${statusClass}">
            ${statusText}
          </div>
        </div>
      </div>

      <div class="conn-actions">
        <button
          class="btn btn-secondary ${reconnectClass}"
          data-reconnect-id="${c.id}"
        >
          ${reconnectText}
        </button>

        <button
          class="btn btn-danger"
          data-delete-id="${c.id}"
        >
          Удалить
        </button>
      </div>
    </div>
  `;
  };

  list.innerHTML =
    [...active, ...needReconnect, ...disabled].map(renderRow).join("") ||
    `<div style="opacity:.7;">Нет подключённых аккаунтов</div>`;

  // ===== RECONNECT / CONNECT =====
  list.querySelectorAll("[data-reconnect-id]").forEach((b) => {
    b.addEventListener("click", () => {
      const locked = localStorage.getItem("lockToBilling") === "1";
      const reason = localStorage.getItem("lockReason") || "";

      // ✅ антифрод/expired — нельзя предлагать FB login, только оплата
      if (locked && (reason === "expired" || reason.startsWith("antifraud"))) {
        goToBilling();
        return;
      }

      window.location.href = "/auth/login";
    });
  });
  // ===== DELETE FARM =====
  list.querySelectorAll("[data-delete-id]").forEach((b) => {
    b.addEventListener("click", async () => {
      const id = b.getAttribute("data-delete-id");

      if (!confirm("Are you sure you want to delete this Facebook account?")) {
        return;
      }

      try {
        const r = await fetch(`/api/connections/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "HTTP " + r.status);

        await renderConnectionsDropdown();
      } catch (e) {
        alert(e.message || String(e));
      }
    });
  });

  btn.onclick = async () => {
    const willOpen = menu.style.display === "none";
    menu.style.display = willOpen ? "block" : "none";

    if (willOpen) {
      await recheckConnectionsThrottled();
      await renderConnectionsDropdown(); // перерисует уже со свежими статусами
      // и снова откроем меню, т.к. перерисовка пересоздала DOM
      const newWrap = document.getElementById("conn-dd");
      const newMenu = newWrap?.querySelector("#conn-dd-menu");
      if (newMenu) newMenu.style.display = "block";
    }
  };

  document.addEventListener("click", (e) => {
    if (!wrap.contains(e.target)) menu.style.display = "none";
  });

  wrap.querySelector("#conn-add-btn").onclick = () => {
    window.location.href = "/auth/login";
  };
}

// =====================
// Creatives tab (asset cards)
// Requirements:
// - One card = one creative asset (not ad). Dedup across ads by creative.id
// - Name = creative.name (original uploaded file name in Ads Manager)
// - Video must play (MP4 source if available). If not available: still show thumb and mark as video
// - Must survive 10-20 concurrent requests: server has cache + in-flight dedup; client does single request per click.

let creativesRaw = [];
let creativesView = [];
let creativesInitialized = false;

const CREA_METRICS = [
  { key: "spend", label: "Spend", fmt: (v) => money(v) },
  { key: "unique_clicks", label: "Unique Clicks", fmt: (v) => int(v) },
  { key: "ucpc", label: "UCPC", fmt: (v) => money(v) },
  { key: "leads", label: "Leads", fmt: (v) => int(v) },
  { key: "cpl", label: "CPL", fmt: (v) => money(v) },
  { key: "purchases", label: "Purchases", fmt: (v) => int(v) },
  { key: "cpa", label: "CPA", fmt: (v) => money(v) },
  { key: "registrations", label: "Registration", fmt: (v) => int(v) },
  { key: "cpr", label: "CPR", fmt: (v) => money(v) },
  { key: "leads_per_purchase", label: "Lead/Purchase", fmt: (v) => num(v, 2) },
  { key: "ctr", label: "CTR", fmt: (v) => num(v, 2) + "%" },
];

function int(v) {
  return String(Math.round(Number(v || 0)));
}
function num(v, d = 2) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(d) : (0).toFixed(d);
}
function money(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function showCreaLoading(on) {
  const el = document.getElementById("crea-loading");
  if (!el) return;
  el.classList.toggle("hidden", !on);
}

function escapeHtml(s) {
  return String(s || "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        c
      ])
  );
}

function ensureCreativesStyles() {
  if (document.getElementById("crea-styles")) return;

  const st = document.createElement("style");
  st.id = "crea-styles";
  st.textContent = `
    /* ===== METRICS GRID (CRITICAL) ===== */
    .metric-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 10px;
      margin-top: 12px;
    }

    /* ===== METRIC CHECKBOXES ===== */
    .mini-check {
      display: flex !important;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: var(--bg-tertiary, #1e293b);
      border: 1px solid var(--border-primary, #334155);
      border-radius: 8px;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;
    }

    .mini-check:hover {
      background: var(--bg-card, #293548);
      border-color: var(--primary-lilac, #a78bfa);
      transform: translateY(-1px);
    }

    .mini-check input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
      accent-color: var(--primary-lilac, #a78bfa);
      margin: 0;
      flex-shrink: 0;
    }

    .mini-check span {
      font-size: 13px;
      color: var(--text-secondary, #94a3b8);
      font-weight: 500;
      line-height: 1.2;
    }

    .mini-check input[type="checkbox"]:checked + span {
      color: var(--text-primary, #f1f5f9);
      font-weight: 600;
    }

    /* ===== CREATIVES GRID ===== */
    #crea-results {
      display: grid;
      grid-template-columns: repeat(6, minmax(0, 1fr));
      gap: 14px;
      align-items: start;
      margin-top: 20px;
    }

    @media (max-width: 1700px) {
      #crea-results { grid-template-columns: repeat(5, minmax(0, 1fr)); }
    }
    @media (max-width: 1450px) {
      #crea-results { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    }
    @media (max-width: 1150px) {
      #crea-results { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    }
    @media (max-width: 850px) {
      #crea-results { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 520px) {
      #crea-results { grid-template-columns: 1fr; }
    }

    .crea-card {
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      background: var(--bg-card, #1e293b);
      padding: 10px;
      overflow: hidden;
    }

    .crea-title {
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-primary, #f1f5f9);
    }

    .crea-media {
      width: 100%;
      height: 170px;
      border-radius: 10px;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      position: relative;
    }

    .crea-media img,
    .crea-media video {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    body.crea-fit-cover .crea-media img,
    body.crea-fit-cover .crea-media video {
      object-fit: cover;
    }

    .metric-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }

    .metric-table td {
      padding: 4px 0;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--text-secondary, #94a3b8);
    }

    .metric-table td:last-child {
      text-align: right;
      font-variant-numeric: tabular-nums;
      color: var(--text-primary, #f1f5f9);
      font-weight: 500;
    }

    /* ===== ACCOUNTS COLLAPSIBLE ===== */
    .crea-accounts-row .crea-accounts-body {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .crea-accounts-row.open .crea-accounts-body {
      max-height: 400px;
    }

    .crea-accounts-row .chevron {
      transition: transform 0.3s ease;
    }

    .crea-accounts-row.open .chevron {
      transform: rotate(180deg);
    }
  `;
  document.head.appendChild(st);
}

function creaGetSelectedAccountIds() {
  const list = document.getElementById("crea-acc-list");
  if (!list) return [];
  const checked = [
    ...list.querySelectorAll('input[type="checkbox"][data-acc-id]:checked'),
  ];
  return checked.map((i) => i.getAttribute("data-acc-id"));
}
function updateCreaAccountCheckboxLimit() {
  const list = document.getElementById("crea-acc-list");
  if (!list) return;

  const me = window.__me || {};
  const maxAcc = Number(me?.limits?.max_ad_accounts || 0);
  if (!maxAcc) return;

  const cbs = [...list.querySelectorAll('input[type="checkbox"][data-acc-id]')];
  const checkedCount = cbs.filter((cb) => cb.checked).length;

  const reached = checkedCount >= maxAcc;

  cbs.forEach((cb) => {
    // уже выбранные НЕ блокируем (чтобы можно было снять)
    if (reached && !cb.checked) {
      cb.disabled = true;
      cb.closest("label")?.style && (cb.closest("label").style.opacity = "0.6");
      cb.closest("label")?.setAttribute(
        "title",
        `Лимит аккаунтов: ${checkedCount}/${maxAcc}`
      );
    } else {
      cb.disabled = false;
      cb.closest("label")?.style && (cb.closest("label").style.opacity = "1");
      cb.closest("label")?.removeAttribute("title");
    }
  });
}
function updateCreativesAccountsSummary() {
  const countEl = document.getElementById("crea-accounts-selected-count");
  const list = document.getElementById("crea-acc-list");

  try {
    updateCreaAccountCheckboxLimit();
  } catch (e) {}

  if (!countEl || !list) return;

  const checked = list.querySelectorAll(
    'input[type="checkbox"][data-acc-id]:checked'
  ).length;
  countEl.textContent = String(checked);
}

function setBtnLoading(btn, loading, textNormal) {
  if (!btn) return;

  if (loading) {
    btn.disabled = true;
    btn.dataset._oldText = btn.textContent;
    btn.textContent = currentLang === "ru" ? "Загрузка…" : "Loading…";
    btn.classList.add("is-loading");
  } else {
    btn.disabled = false;
    btn.classList.remove("is-loading");
    btn.textContent = textNormal || btn.dataset._oldText || btn.textContent;
  }
}

function bindCreativesAccountsListListeners() {
  const list = document.getElementById("crea-acc-list");
  if (!list) return;

  // один обработчик на контейнер (делегирование) — и на будущие элементы тоже
  list.onchange = (e) => {
    const t = e.target;
    if (t && t.matches('input[type="checkbox"][data-acc-id]')) {
      updateCreativesAccountsSummary();
    }
  };

  // на всякий — сразу пересчитать
  updateCreativesAccountsSummary();
}

function creaGetSelectedConnectionIds() {
  const list = document.getElementById("crea-conn-list");
  if (!list) return [];
  const checked = [
    ...list.querySelectorAll('input[type="checkbox"][data-conn-id]:checked'),
  ];
  return checked.map((i) => i.getAttribute("data-conn-id"));
}

function ensureCreaConnectionsBox() {
  // создаём блок выбора фарм, если его нет в HTML
  let box = document.getElementById("crea-conn-box");
  if (box) return box;

  const accList = document.getElementById("crea-acc-list");
  if (!accList) return null;

  box = document.createElement("div");
  box.id = "crea-conn-box";
  box.className = "card";
  box.style.marginBottom = "12px";

  const title = document.createElement("div");
  title.className = "muted";
  title.style.marginBottom = "8px";
  title.textContent = "Соц-аккаунты (farm)";

  const list = document.createElement("div");
  list.id = "crea-conn-list";
  list.className = "selector";

  box.appendChild(title);
  box.appendChild(list);

  // вставляем перед выбором ad accounts
  accList.parentNode.insertBefore(box, accList);

  return box;
}

async function renderCreaConnectionsMultiSelect() {
  const box = ensureCreaConnectionsBox();
  if (!box) return;

  const list = document.getElementById("crea-conn-list");
  if (!list) return;

  const data = await apiGet("/api/connections");
  const conns = (data.connections || []).filter((c) => c.status === "active");

  const saved = new Set(
    (JSON.parse(localStorage.getItem("creaSelectedConnIds") || "[]") || []).map(
      String
    )
  );
  // если ничего не сохранено — по умолчанию выбираем ВСЕ активные фармы
  if (saved.size === 0 && conns.length) {
    conns.forEach((c) => saved.add(String(c.id)));
    localStorage.setItem("creaSelectedConnIds", JSON.stringify([...saved]));
  }

  list.innerHTML = "";
  conns.forEach((c) => {
    const row = document.createElement("label");
    row.className = "selector-item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("data-conn-id", c.id);
    cb.checked = saved.has(String(c.id));

    cb.addEventListener("change", async () => {
      const ids = creaGetSelectedConnectionIds();
      localStorage.setItem("creaSelectedConnIds", JSON.stringify(ids));

      // refresh accounts list based on selected farms
      await creaReloadAccountsFromSelectedFarms();
    });

    const name = document.createElement("span");
    name.textContent = c.name || c.fb_user_id || `Connection #${c.id}`;

    row.appendChild(cb);
    row.appendChild(name);
    list.appendChild(row);
  });
}

function setDefaultDates() {
  const sinceEl = document.getElementById("crea-since");
  const untilEl = document.getElementById("crea-until");
  if (!sinceEl || !untilEl) return;

  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");

  const yyyy = now.getFullYear();
  const mm = pad(now.getMonth() + 1);
  const dd = pad(now.getDate());

  // default: last 7 days
  const start = new Date(now);
  start.setDate(start.getDate() - 6);
  const sY = start.getFullYear();
  const sM = pad(start.getMonth() + 1);
  const sD = pad(start.getDate());

  if (!sinceEl.value) sinceEl.value = `${sY}-${sM}-${sD}`;
  if (!untilEl.value) untilEl.value = `${yyyy}-${mm}-${dd}`;
}

async function creaReloadAccountsFromSelectedFarms() {
  const connIds = creaGetSelectedConnectionIds();

  if (!connIds.length) {
    renderAccountsMultiSelect([]);
    // ✅ важно: после рендера повесить onchange + пересчитать "Выбрано"
    bindCreativesAccountsListListeners();
    return;
  }

  try {
    const data = await apiJson("/api/adaccounts_multi", "POST", {
      connection_ids: connIds,
    });
    const accounts = data.accounts || [];
    renderAccountsMultiSelect(accounts);

    // ✅ важно: после рендера повесить onchange + пересчитать "Выбрано"
    bindCreativesAccountsListListeners();
  } catch (e) {
    console.error("adaccounts_multi error", e);
    renderAccountsMultiSelect([]);

    // ✅ чтобы "Выбрано" не залипало
    bindCreativesAccountsListListeners();
  }
}

function bindRuleAccountsSelectAll() {
  const link = document.getElementById("rule-accounts-select-all");
  if (!link) return;

  link.onclick = (e) => {
    e.preventDefault();

    const me = window.__me || {};
    const maxAcc = Number(me?.limits?.max_ad_accounts || 0);
    const cbs = [
      ...accountsContainer.querySelectorAll('input[type="checkbox"]'),
    ];

    let left = maxAcc > 0 ? maxAcc : Infinity;

    cbs.forEach((cb) => {
      if (left > 0) {
        cb.checked = true;
        left -= 1;
      } else {
        cb.checked = false; // ключевое: лишние снимаем
      }
    });
    bindRuleAccountsSelectAll();

    applyRuleAccountLimit(); // твой лимитер из rules
    loadCampaigns(); // перезагрузим кампании по выбранным аккаунтам
  };
}

function renderAccountsMultiSelect(accounts) {
  const me = window.__me || {};
  const lim = me.limits || {};
  const maxAcc = Number(lim.max_ad_accounts || 0); // 0 => без лимита

  const list = document.getElementById("crea-acc-list");
  if (!list) return;
  list.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "selector";

  const allRow = document.createElement("label");
  allRow.className = "selector-item";

  const allCb = document.createElement("input");
  allCb.type = "checkbox";

  const allText = document.createElement("span");
  allText.textContent = `${i18n[currentLang].select_all || "Select all"} (0/${
    Array.isArray(accounts) ? accounts.length : 0
  })`;

  allRow.appendChild(allCb);
  allRow.appendChild(allText);
  wrap.appendChild(allRow);

  (accounts || []).forEach((acc) => {
    const row = document.createElement("label");
    row.className = "selector-item";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("data-acc-id", acc.id);

    const name = document.createElement("span");
    name.textContent = `${acc.name || acc.id}${
      acc.account_id ? " - " + acc.account_id : ""
    }`;

    row.appendChild(cb);
    row.appendChild(name);
    wrap.appendChild(row);
  });
  list.appendChild(wrap);
  bindCreativesAccountsListListeners();
  updateAllLabel();
  updateCreaAccountCheckboxLimit();
  updateCreativesAccountsSummary();

  function updateAllLabel() {
    const cbs = [
      ...wrap.querySelectorAll('input[type="checkbox"][data-acc-id]'),
    ];
    const checked = cbs.filter((cb) => cb.checked).length;
    const total = cbs.length;

    allText.textContent = `${
      i18n[currentLang].select_all || "Select all"
    } (${checked}/${total})`;

    if (checked === 0) {
      allCb.checked = false;
      allCb.indeterminate = false;
    } else if (checked === total) {
      allCb.checked = true;
      allCb.indeterminate = false;
    } else {
      allCb.checked = false;
      allCb.indeterminate = true;
    }
  }

  allCb.addEventListener("change", () => {
    const cbs = [
      ...wrap.querySelectorAll('input[type="checkbox"][data-acc-id]'),
    ];

    if (allCb.checked) {
      let left = maxAcc > 0 ? maxAcc : Infinity;
      cbs.forEach((cb) => {
        if (left > 0) {
          cb.checked = true;
          left -= 1;
        } else {
          cb.checked = false;
        }
      });
    } else {
      cbs.forEach((cb) => (cb.checked = false));
    }

    updateAllLabel();
    updateCreaAccountCheckboxLimit();
    updateCreativesAccountsSummary();
  });

  updateAllLabel();
  list.appendChild(wrap);

  // важно: сразу применяем лимит после рensureендера
  updateCreaAccountCheckboxLimit();
}

// ---- filters / sorting / toggles ----
function renderMetricToggles() {
  console.log("[METRICS] ===== renderMetricToggles START =====");

  const toggles = document.getElementById("crea-metric-toggles");
  console.log("[METRICS] Element:", toggles);
  console.log("[METRICS] Element exists:", !!toggles);
  console.log("[METRICS] Element visible:", toggles?.offsetParent !== null);

  if (!toggles) {
    console.error("[METRICS] ❌ CRITICAL: #crea-metric-toggles NOT FOUND!");

    // Debug: check if tab is visible
    const tab = document.getElementById("tab-creatives");
    console.log("[METRICS] Tab exists:", !!tab);
    console.log("[METRICS] Tab classes:", tab?.className);

    return;
  }

  toggles.innerHTML = "";
  console.log("[METRICS] Creating", CREA_METRICS.length, "toggles");

  CREA_METRICS.forEach((m, idx) => {
    const label = document.createElement("label");
    label.className = "mini-check";
    label.style.display = "flex"; // Force visible

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = true;
    cb.setAttribute("data-mkey", m.key);
    cb.addEventListener("change", () => {
      console.log("[METRICS] Checkbox changed:", m.key, cb.checked);
      renderCreatives();
    });

    const span = document.createElement("span");
    span.textContent = m.label;
    span.style.color = "#f1f5f9"; // Force color

    label.appendChild(cb);
    label.appendChild(span);
    toggles.appendChild(label);

    if (idx === 0) {
      console.log("[METRICS] First toggle HTML:", label.outerHTML);
    }
  });

  console.log("[METRICS] ✅ Rendered", toggles.children.length, "toggles");
  console.log("[METRICS] Container HTML length:", toggles.innerHTML.length);
  console.log("[METRICS] ===== renderMetricToggles COMPLETE =====");
}
// ✅ DEBUG: Log when metrics are rendered

function renderSortControls() {
  const selMetric = document.getElementById("crea-sort-metric");
  const selDir = document.getElementById("crea-sort-dir");
  if (!selMetric || !selDir) return;

  selMetric.innerHTML = "";
  CREA_METRICS.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m.key;
    opt.textContent = m.label;
    selMetric.appendChild(opt);
  });
  selMetric.value = "spend";

  selMetric.onchange = () => applyCreaView();
  selDir.onchange = () => applyCreaView();
}

function createFilterRow() {
  const row = document.createElement("div");
  row.className = "crea-filter-row";

  const logic = document.createElement("select");
  logic.className = "crea-filter-logic";
  ["AND", "OR"].forEach((x) => {
    const o = document.createElement("option");
    o.value = x;
    o.textContent = x;
    logic.appendChild(o);
  });

  const metric = document.createElement("select");
  metric.className = "crea-filter-metric";
  CREA_METRICS.forEach((m) => {
    const o = document.createElement("option");
    o.value = m.key;
    o.textContent = m.label;
    metric.appendChild(o);
  });

  const op = document.createElement("select");
  op.className = "crea-filter-op";
  [">", ">=", "<", "<=", "="].forEach((x) => {
    const o = document.createElement("option");
    o.value = x;
    o.textContent = x;
    op.appendChild(o);
  });

  const val = document.createElement("input");
  val.type = "number";
  val.className = "crea-filter-val";
  val.placeholder = "0";

  const del = document.createElement("button");
  del.type = "button";
  del.className = "icon-btn";
  del.textContent = "✕";
  del.onclick = () => row.remove();

  row.appendChild(logic);
  row.appendChild(metric);
  row.appendChild(op);
  row.appendChild(val);
  row.appendChild(del);
  return row;
}

function readFilters() {
  const box = document.getElementById("crea-filter-list");
  if (!box) return [];
  const rows = [...box.querySelectorAll(".crea-filter-row")];
  return rows.map((r) => ({
    logic: r.querySelector(".crea-filter-logic")?.value || "AND",
    metric: r.querySelector(".crea-filter-metric")?.value || "spend",
    op: r.querySelector(".crea-filter-op")?.value || ">",
    value: Number(r.querySelector(".crea-filter-val")?.value || 0),
  }));
}

function compareOp(v, op, x) {
  if (op === ">") return v > x;
  if (op === ">=") return v >= x;
  if (op === "<") return v < x;
  if (op === "<=") return v <= x;
  return v === x;
}

function passesFilters(item, filters) {
  if (!filters || filters.length === 0) return true;
  let acc = null;
  for (let i = 0; i < filters.length; i++) {
    const f = filters[i];
    const v = Number(item.metrics?.[f.metric] || 0);
    const ok = compareOp(v, f.op, Number(f.value || 0));
    if (acc === null) acc = ok;
    else {
      if ((f.logic || "AND") === "OR") acc = acc || ok;
      else acc = acc && ok;
    }
  }
  return !!acc;
}

function applyCreaView() {
  const q = (document.getElementById("crea-search")?.value || "")
    .trim()
    .toLowerCase();
  const filters = readFilters();

  const aggregated = aggregateCreativesByName(creativesRaw);

  creativesView = aggregated
    .filter((c) => (q ? (c.name || "").toLowerCase().includes(q) : true))
    .filter((c) => passesFilters(c, filters));

  const sortKey = document.getElementById("crea-sort-metric")?.value || "spend";
  const dir = document.getElementById("crea-sort-dir")?.value || "desc";
  creativesView.sort((a, b) => {
    const av = Number(a.metrics?.[sortKey] || 0);
    const bv = Number(b.metrics?.[sortKey] || 0);
    return dir === "asc" ? av - bv : bv - av;
  });

  renderCreatives();
}
function aggregateCreativesByName(raw) {
  const mKeys = CREA_METRICS.map((m) => m.key);
  const map = new Map();

  for (const c of raw || []) {
    const name = (c.name || "").trim();
    const key = name ? name.toLowerCase() : String(c.id || "");

    if (!map.has(key)) {
      // копия "шаблона"
      map.set(key, {
        id: c.id,
        name: c.name,
        object_type: c.object_type,
        thumbnail_url: c.thumbnail_url,
        media_url: c.media_url,
        metrics: {},
        __cnt: 0,
      });
      // init metrics
      mKeys.forEach((k) => (map.get(key).metrics[k] = 0));
    }

    const a = map.get(key);
    a.__cnt += 1;

    // если у агрегата нет медиа — возьмём первое попавшееся
    if (!a.media_url && c.media_url) a.media_url = c.media_url;
    if (!a.thumbnail_url && c.thumbnail_url) a.thumbnail_url = c.thumbnail_url;
    if (!a.object_type && c.object_type) a.object_type = c.object_type;

    // sum metrics
    mKeys.forEach((k) => {
      a.metrics[k] = Number(a.metrics[k] || 0) + Number(c.metrics?.[k] || 0);
    });
  }

  return [...map.values()].map((x) => {
    // можно убрать счётчик или оставить для дебага
    delete x.__cnt;
    return x;
  });
}

function renderCreatives() {
  const grid = document.getElementById("crea-results");
  if (!grid) return;
  const toggles = document.getElementById("crea-metric-toggles");
  const shown = toggles
    ? new Set(
        [
          ...toggles.querySelectorAll(
            'input[type="checkbox"][data-mkey]:checked'
          ),
        ].map((i) => i.getAttribute("data-mkey"))
      )
    : new Set(CREA_METRICS.map((m) => m.key));

  grid.innerHTML = "";

  creativesView.forEach((c) => {
    const card = document.createElement("div");
    card.className = "crea-card";

    // title
    const title = document.createElement("div");
    title.className = "crea-title";
    title.textContent = c.name || "(no name)";
    card.appendChild(title);

    // media
    const mediaWrap = document.createElement("div");
    mediaWrap.className = "crea-media";

    if (c.object_type === "video") {
      // If we have an MP4 source -> play
      if (c.media_url && String(c.media_url).toLowerCase().includes(".mp4")) {
        const v = document.createElement("video");
        v.controls = true;
        v.playsInline = true;
        v.preload = "metadata";
        v.src = c.media_url;
        if (c.thumbnail_url) v.poster = c.thumbnail_url;
        mediaWrap.appendChild(v);
      } else {
        // fallback: thumb only, but still marked as video
        const img = document.createElement("img");
        img.alt = "video";
        img.src = c.thumbnail_url || c.media_url || "";
        mediaWrap.appendChild(img);

        const badge = document.createElement("div");
        badge.className = "crea-badge";
        badge.textContent = "VIDEO";
        mediaWrap.appendChild(badge);
      }
    } else {
      const img = document.createElement("img");
      img.alt = "image";
      img.src = c.media_url || c.thumbnail_url || "";
      mediaWrap.appendChild(img);
    }

    card.appendChild(mediaWrap);

    // metrics
    const table = document.createElement("table");
    table.className = "metric-table";

    CREA_METRICS.forEach((m) => {
      if (!shown.has(m.key)) return;
      const tr = document.createElement("tr");
      const v = c.metrics?.[m.key] ?? 0;
      tr.innerHTML = `<td>${escapeHtml(m.label)}</td><td>${escapeHtml(
        m.fmt(v)
      )}</td>`;
      table.appendChild(tr);
    });

    card.appendChild(table);
    grid.appendChild(card);
  });
}
const accToggle = document.getElementById("crea-accounts-toggle");
const accRow = document.querySelector(".crea-accounts-row");

if (accToggle && accRow) {
  accToggle.addEventListener("click", () => {
    accRow.classList.toggle("open");
  });
}
// открыть аккаунты автоматически, если выбрано > 0
// открыть аккаунты автоматически, если выбрано > 0
setTimeout(() => {
  updateCreativesAccountsSummary();

  const cnt = document.getElementById("crea-accounts-selected-count");
  const accRow = document.querySelector(".crea-accounts-row");

  if (!cnt || !accRow) return;

  const count = parseInt(cnt.textContent || "0", 10) || 0;
  if (count > 0) accRow.classList.add("open");
}, 0);

async function loadCreatives() {
  const ids = creaGetSelectedAccountIds();
  const since = document.getElementById("crea-since")?.value;
  const until = document.getElementById("crea-until")?.value;
  const btn =
    document.getElementById("crea-load") ||
    document.getElementById("creatives-load-btn");

  if (window.__me?.expired) {
    alert(
      currentLang === "ru"
        ? "Ваш план PRO истёк. Пожалуйста, оформите подписку для продолжения работы."
        : "Your PRO plan has expired. Please upgrade your subscription to continue."
    );
    return;
  }

  if (!ids.length) {
    alert("Select at least one ad account");
    return;
  }
  if (!since || !until) {
    alert("Select date range");
    return;
  }

  const connIds = creaGetSelectedConnectionIds();
  if (!connIds.length) {
    alert("Выбери хотя бы 1 соц-аккаунт в креативах");
    return;
  }
  setBtnLoading(btn, true);

  try {
    const data = await apiJson("/api/creatives/load_multi", "POST", {
      connection_ids: connIds,
      account_ids: ids,
      since,
      until,
    });

    console.log("[CREA] load_multi response =", data);
    console.log("[CREA] keys =", Object.keys(data || {}));

    const list =
      data?.creatives ||
      data?.items ||
      data?.assets ||
      data?.data ||
      data?.result?.creatives ||
      data?.result?.items ||
      [];

    if (!Array.isArray(list)) {
      console.warn("[CREA] Unexpected payload shape, list is not array", data);
      creativesRaw = [];
    } else {
      creativesRaw = list.map((x) => ({
        id: x.id,
        name: x.name,
        object_type: x.object_type || "unknown",
        thumbnail_url: x.thumbnail_url || null,
        media_url: x.media_url || null,
        metrics: x.metrics || {},
      }));
    }

    applyCreaView();
  } catch (e) {
    console.error("[CREA] load failed", e);
    alert("Failed to load creatives. Check console.");
  } finally {
    setBtnLoading(btn, false);
  }
}

async function initCreativesTab() {
  console.log("[CREA] ===== initCreativesTab START =====");

  if (creativesInitialized) {
    console.log("[CREA] Already initialized");
    return;
  }
  creativesInitialized = true;

  // Step 1: Styles
  try {
    ensureCreativesStyles();
    console.log("[CREA] ✓ Styles injected");
  } catch (e) {
    console.error("[CREA] ✗ Styles failed:", e);
  }

  // Step 2: Connections box
  try {
    ensureCreaConnectionsBox();
    console.log("[CREA] ✓ Connections box created");
  } catch (e) {
    console.error("[CREA] ✗ Connections box failed:", e);
  }

  // Step 3: Load connections
  try {
    await renderCreaConnectionsMultiSelect();
    console.log("[CREA] ✓ Connections loaded");
  } catch (e) {
    console.error("[CREA] ✗ Connections failed:", e);
  }

  // Step 4: Load accounts
  try {
    await creaReloadAccountsFromSelectedFarms();
    console.log("[CREA] ✓ Accounts loaded");
  } catch (e) {
    console.error("[CREA] ✗ Accounts failed:", e);
  }

  // Step 5: Fit toggle
  try {
    (function ensureFitToggle() {
      if (document.getElementById("crea-fit-cover")) return;

      const toggles = document.getElementById("crea-metric-toggles");
      const host = toggles ? toggles.parentElement : null;
      if (!host) return;

      const label = document.createElement("label");
      label.style.cssText =
        "display:flex;align-items:center;gap:6px;margin-left:10px;font-size:12px;user-select:none;";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.id = "crea-fit-cover";

      const txt = document.createElement("span");
      txt.textContent = "Crop (cover)";

      label.appendChild(cb);
      label.appendChild(txt);
      host.appendChild(label);

      cb.addEventListener("change", () => {
        document.body.classList.toggle("crea-fit-cover", cb.checked);
      });
    })();
    console.log("[CREA] ✓ Fit toggle added");
  } catch (e) {
    console.error("[CREA] ✗ Fit toggle failed:", e);
  }

  // Step 6: Default dates
  try {
    setDefaultDates();
    console.log("[CREA] ✓ Default dates set");
  } catch (e) {
    console.error("[CREA] ✗ Default dates failed:", e);
  }

  // Step 7: METRICS TOGGLES (CRITICAL) - Force render with delay
  setTimeout(() => {
    try {
      console.log("[CREA] 🎯 Rendering metrics toggles NOW");
      renderMetricToggles();

      // Verify
      const toggles = document.getElementById("crea-metric-toggles");
      if (toggles) {
        console.log(
          "[CREA] ✓ Metrics rendered:",
          toggles.children.length,
          "items"
        );
        console.log("[CREA] ✓ HTML:", toggles.innerHTML.slice(0, 200));
      } else {
        console.error("[CREA] ✗ Element still missing after render!");
      }
    } catch (e) {
      console.error("[CREA] ✗ Metrics toggles failed:", e);
    }
  }, 200);

  // Step 8: Sort controls
  try {
    renderSortControls();
    console.log("[CREA] ✓ Sort controls rendered");
  } catch (e) {
    console.error("[CREA] ✗ Sort controls failed:", e);
  }

  // Step 9: FILTER BUTTONS (RE-BIND)
  setTimeout(() => {
    const box = document.getElementById("crea-filter-list");
    const btnAdd = document.getElementById("crea-add-filter");
    const btnApply = document.getElementById("crea-apply-filter");
    const btnClear = document.getElementById("crea-clear-filter");

    console.log("[CREA] Button check:", {
      btnAdd: !!btnAdd,
      btnApply: !!btnApply,
      btnClear: !!btnClear,
      box: !!box,
    });

    if (btnAdd) {
      const newAdd = btnAdd.cloneNode(true);
      btnAdd.parentNode.replaceChild(newAdd, btnAdd);
      newAdd.onclick = () => {
        console.log("[CREA] Add filter clicked");
        if (box) box.appendChild(createFilterRow());
      };
      console.log("[CREA] ✓ Add filter button bound");
    }

    if (btnApply) {
      const newApply = btnApply.cloneNode(true);
      btnApply.parentNode.replaceChild(newApply, btnApply);
      newApply.onclick = () => {
        console.log("[CREA] Apply clicked");
        applyCreaView();
      };
      console.log("[CREA] ✓ Apply button bound");
    }

    if (btnClear) {
      const newClear = btnClear.cloneNode(true);
      btnClear.parentNode.replaceChild(newClear, btnClear);
      newClear.onclick = () => {
        console.log("[CREA] Clear clicked");
        if (box) box.innerHTML = "";
        applyCreaView();
      };
      console.log("[CREA] ✓ Clear button bound");
    }

    // Step 10: Search
    const search = document.getElementById("crea-search");
    if (search) {
      const newSearch = search.cloneNode(true);
      search.parentNode.replaceChild(newSearch, search);
      newSearch.oninput = () => applyCreaView();
      console.log("[CREA] ✓ Search input bound");
    }

    // Step 11: Load button
    const btn = document.getElementById("crea-load");
    if (btn) {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.onclick = () => {
        console.log("[CREA] Load button clicked");
        loadCreatives();
      };
      console.log("[CREA] ✓ Load button bound");
    }

    console.log("[CREA] ===== initCreativesTab COMPLETE =====");
  }, 300);
}
