/* ==========================================================
   Lumi — main site logic
   - Package rendering
   - View switching
   - 3-step checkout
   - Audio toggle
   - Focus trap on modal
   ========================================================== */

const NETWORKS = [
  { id: "zong", name: "Zong" },
  { id: "telenor", name: "Telenor" },
  { id: "jazz", name: "Jazz" },
];
const DEFAULT_NETWORK = "zong";

const PACKAGES = [
  {
    id: "lumi-500",
    name: "Spark",
    pricePkr: 500,
    dataGb: 6,
    validityDays: 7,
    kicker: "Starter",
    blurb: "A few days of data, installed in minutes.",
    features: ["Instant eSIM after payment", "Nationwide coverage", "No QR code"],
    kind: "spark",
    cta: "Get eSIM",
  },
  {
    id: "lumi-1000",
    name: "Pulse",
    pricePkr: 1000,
    dataGb: 16,
    validityDays: 15,
    kicker: "Must buy",
    blurb: "The plan people actually buy.",
    features: ["Instant eSIM after payment", "Nationwide coverage", "No QR code"],
    kind: "pulse",
    cta: "Get eSIM",
  },
  {
    id: "lumi-2000",
    name: "Drift",
    pricePkr: 2000,
    dataGb: 40,
    validityDays: 30,
    kicker: "Full month",
    blurb: "A month of data on the network you choose.",
    features: ["Instant eSIM after payment", "Zong, Telenor or Jazz", "No shop visit"],
    kind: "drift",
    cta: "Get eSIM",
  },
  {
    id: "lumi-5000",
    name: "Aether",
    pricePkr: 5000,
    dataGb: 120,
    validityDays: 90,
    kicker: "Best value",
    blurb: "Three months of data. The quiet premium pick.",
    features: ["Instant eSIM after payment", "Zong, Telenor or Jazz", "No QR code", "Priority provisioning"],
    kind: "aether",
    cta: "Get eSIM",
  },
];

const SCAN_TITLES = [
  "Detecting device",
  "Checking operating system",
  "Analyzing network bands",
  "Verifying eSIM capability",
  "Preparing your profile",
];

function formatPkr(n) { return "Rs. " + n.toLocaleString("en-US"); }
function formatData(gb) { return gb + " GB"; }
function formatValidity(days) {
  if (days % 30 === 0) {
    const m = days / 30;
    return m === 1 ? "30 days" : m + " months";
  }
  return days + " days";
}

const cardState = {};
PACKAGES.forEach((p) => { cardState[p.id] = DEFAULT_NETWORK; });

function pills(pkgId) {
  const current = cardState[pkgId];
  const idx = Math.max(0, NETWORKS.findIndex((n) => n.id === current));
  return `
    <div class="network-pills" role="radiogroup" aria-label="Network">
      <span class="network-pills__thumb" style="transform:translateX(${idx * 100}%)"></span>
      ${NETWORKS.map(
        (n) => `
        <button type="button" role="radio" aria-checked="${n.id === current}"
          class="${n.id === current ? "is-on" : ""}"
          data-net="${n.id}" data-pkg="${pkgId}">${n.name}</button>`
      ).join("")}
    </div>`;
}

function cardHTML(pkg) {
  const net = cardState[pkg.id];
  let extra = "";
  if (pkg.kind === "pulse") {
    extra = `
      <span class="pkg-badge">${pkg.kicker}</span>
      <div class="pkg-data-xl"><em>${pkg.dataGb}</em><span>GB · ${formatValidity(pkg.validityDays)}</span></div>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-meta">${pkg.blurb}</p>`;
  } else if (pkg.kind === "drift") {
    extra = `
      <p class="pkg-kicker">${pkg.kicker}</p>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <div class="pkg-stats">
        <div class="pkg-stat"><span>Data</span><strong>${formatData(pkg.dataGb)}</strong></div>
        <div class="pkg-stat"><span>Valid</span><strong>${formatValidity(pkg.validityDays)}</strong></div>
      </div>
      <ul class="pkg-features">
        ${pkg.features.map((f) => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>${f}</li>`).join("")}
      </ul>`;
  } else if (pkg.kind === "aether") {
    extra = `
      <p class="pkg-kicker">${pkg.kicker}</p>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-meta">${pkg.blurb}</p>
      <div class="pkg-glass">
        <div class="pkg-glass-row"><span>Data</span><strong>${formatData(pkg.dataGb)}</strong></div>
        <div class="pkg-glass-row"><span>Validity</span><strong>${formatValidity(pkg.validityDays)}</strong></div>
      </div>`;
  } else {
    extra = `
      <p class="pkg-kicker">${pkg.kicker}</p>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-meta">${formatData(pkg.dataGb)} · ${formatValidity(pkg.validityDays)}</p>`;
  }

  return `
    <article class="pkg pkg--${pkg.kind}" data-pkg="${pkg.id}" data-network="${net}">
      ${extra}
      ${pills(pkg.id)}
      <button type="button" class="pkg-cta ${pkg.kind === "pulse" ? "pkg-cta--buy" : ""}" data-get="${pkg.id}">
        ${pkg.cta}
      </button>
    </article>`;
}

function sectionHTML(firstId) {
  return `
    <section class="section" id="${firstId ? "first-package" : ""}">
      <span class="section-kicker">Packages</span>
      <h2>Four plans. Your network.</h2>
      <div class="pkg-list">
        ${PACKAGES.map((p) => cardHTML(p)).join("")}
      </div>
    </section>`;
}

function paintPackages() {
  const home = document.getElementById("packages-home");
  const install = document.getElementById("packages-install");
  if (home) home.innerHTML = sectionHTML(false);
  if (install) install.innerHTML = sectionHTML(true);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((el) => el.classList.toggle("is-on", el.id === "view-" + name));
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("is-active", el.dataset.view === name));
  document.querySelectorAll(".nav-link").forEach((el) => el.classList.toggle("is-active", el.dataset.view === name));
  const stage = document.getElementById("stage");
  if (stage) stage.scrollTop = 0;
  if (history && history.replaceState) history.replaceState(null, "", "#" + name);
}

/* Audio */
let audioCtx = null;
let master = null;
let musicGain = null;
let musicTimer = null;
let unlocked = false;
let musicOn = false;

function audio() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
    master = audioCtx.createGain();
    master.gain.value = 0.6;
    master.connect(audioCtx.destination);
    musicGain = audioCtx.createGain();
    musicGain.gain.value = 0;
    musicGain.connect(master);
  }
  return audioCtx;
}
function env(dur, peak) {
  const c = audio();
  if (!c || !master) return null;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(peak, c.currentTime + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  g.connect(master);
  return g;
}
function playTap() {
  const c = audio();
  if (!c || !unlocked) return;
  const g = env(0.06, 0.06);
  if (!g) return;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(880, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(620, c.currentTime + 0.05);
  o.connect(g);
  o.start();
  o.stop(c.currentTime + 0.07);
}
function playTick() {
  const c = audio();
  if (!c || !unlocked) return;
  const g = env(0.1, 0.05);
  if (!g) return;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = 1180;
  o.connect(g);
  o.start();
  o.stop(c.currentTime + 0.1);
}
function playSuccess() {
  const c = audio();
  if (!c || !unlocked) return;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const g = env(0.24, 0.06);
    if (!g) return;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g);
    const t = c.currentTime + i * 0.08;
    o.start(t);
    o.stop(t + 0.24);
  });
}
function startMusic() {
  const c = audio();
  if (!c || !musicGain || musicTimer) return;
  const beat = () => {
    if (!musicOn) return;
    [196, 246.94].forEach((freq, i) => {
      const g = c.createGain();
      g.gain.value = 0.03;
      g.connect(musicGain);
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      o.start(c.currentTime + i * 0.05);
      o.stop(c.currentTime + 2.4);
    });
  };
  beat();
  musicTimer = window.setInterval(beat, 3200);
}
function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
}
function unlockAudio() {
  const c = audio();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  unlocked = true;
  if (musicOn && !musicTimer) startMusic();
  updateAudioIcon();
}
function updateAudioIcon() {
  const onIco = document.querySelector(".ico-vol-on");
  const offIco = document.querySelector(".ico-vol-off");
  if (onIco && offIco) {
    onIco.classList.toggle("hidden", !musicOn);
    offIco.classList.toggle("hidden", musicOn);
  }
}

/* Device detection */
function detectDevice() {
  const ua = navigator.userAgent || "";
  let os = "Phone";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Win/i.test(ua)) os = "Windows";
  return { os, esim: /iPhone|iPad|Android/i.test(ua), ua };
}

/* Modal / checkout */
const PAY_API = "https://icy-breeze-8412.babysomething.workers.dev/";
const PACKAGE_PAY_ID = {
  "lumi-500": 1,
  "lumi-1000": 2,
  "lumi-2000": 3,
  "lumi-5000": 4,
};

let scanTimers = [];
let activeRequest = null;
let deviceInfo = null;
let payUrl = null;
let payOrder = null;
let modalTriggerElement = null;
let focusableElements = [];
let scanElements = null;

async function createPayOrder(pkg) {
  const id = PACKAGE_PAY_ID[pkg.id];
  const res = await fetch(PAY_API + "?id=" + id);
  const link = (await res.text()).trim().replace(/^"|"$/g, "");
  if (!res.ok || !/^https?:\/\//i.test(link)) throw new Error("Payment link missing");
  return link;
}

function updateFocusable() {
  const modal = document.getElementById("modal");
  if (!modal) return;
  focusableElements = Array.from(
    modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ).filter((el) => !el.disabled && el.offsetParent !== null);
}

function closeModal() {
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-overlay").classList.add("hidden");
  document.body.style.overflow = "";
  if (modalTriggerElement && typeof modalTriggerElement.focus === "function") modalTriggerElement.focus();
  modalTriggerElement = null;
  activeRequest = null;
  payUrl = null;
  payOrder = null;
  scanElements = null;
}

function openModal(pkgId) {
  const pkg = PACKAGES.find((p) => p.id === pkgId);
  if (!pkg) return;

  activeRequest = { packageId: pkgId, networkId: cardState[pkgId] };
  deviceInfo = detectDevice();
  modalTriggerElement = document.activeElement;

  payUrl = null;
  payOrder = createPayOrder(pkg)
    .then((link) => { payUrl = link; return link; })
    .catch(() => { payUrl = null; return null; });

  document.getElementById("modal-overlay").classList.remove("hidden");
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  const body = document.getElementById("modal-body");
  body.innerHTML = buildScanHTML();

  scanElements = {
    title: body.querySelector(".scan-title"),
    steps: body.querySelectorAll(".scan-step"),
    meter: body.querySelector(".scan-meter-fill"),
  };

  updateFocusable();
  setTimeout(() => { if (focusableElements.length) focusableElements[0].focus(); }, 60);
  runScan();
}

function buildScanHTML() {
  return `
    <div class="modal-panel is-active">
      <div class="scan-stage">
        <div class="radar" aria-hidden="true">
          <span class="radar-sweep"></span>
          <span class="radar-core"></span>
          <span class="radar-dot"></span>
          <span class="radar-dot"></span>
          <span class="radar-dot"></span>
        </div>
        <p class="scan-title">Checking your device</p>
        <p class="scan-copy">This takes about 10 seconds.</p>
        <div class="scan-meter"><span class="scan-meter-fill"></span></div>
      </div>
      <ol class="scan-steps" aria-live="polite" aria-atomic="true">
        ${SCAN_TITLES.map((label) => `<li class="scan-step"><span class="scan-dot"></span>${label}</li>`).join("")}
      </ol>
    </div>`;
}

function runScan() {
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  const total = SCAN_TITLES.length;
  const stepDuration = 1800;
  let step = 0;
  const advance = () => {
    if (!scanElements) return;
    if (step < total) {
      scanElements.steps.forEach((el, i) => {
        el.classList.toggle("is-on", i === step);
        el.classList.toggle("is-done", i < step);
      });
      scanElements.title.textContent = SCAN_TITLES[step];
      scanElements.meter.style.width = ((step + 1) / total) * 100 + "%";
      playTick();
      step++;
      scanTimers.push(setTimeout(advance, stepDuration));
    } else {
      scanElements.steps.forEach((el) => { el.classList.remove("is-on"); el.classList.add("is-done"); });
      playSuccess();
      scanTimers.push(setTimeout(showSuccessPayoff, 500));
    }
  };
  advance();
}

function showSuccessPayoff() {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-panel is-active">
      <div class="success-payoff">
        <div class="success-circle">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </div>
        <p class="success-title">Your device is compatible</p>
        <p class="success-sub">Preparing your order…</p>
      </div>
    </div>`;
  updateFocusable();
  scanTimers.push(setTimeout(renderReview, 1100));
}

function checkoutDots(step) {
  if (step < 1) return "";
  const cls = (i) => (i < step ? "is-done" : i === step ? "is-active" : "");
  return `
    <div class="checkout-steps" aria-hidden="true">
      <span class="checkout-step ${cls(1)}"></span>
      <span class="checkout-step ${cls(2)}"></span>
      <span class="checkout-step ${cls(3)}"></span>
    </div>`;
}

function renderReview() {
  const pkg = PACKAGES.find((p) => p.id === activeRequest.packageId);
  const net = NETWORKS.find((n) => n.id === activeRequest.networkId);
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-panel is-active">
      ${checkoutDots(1)}
      <p class="checkout-title">Review your order</p>
      <p class="checkout-sub">Confirm the plan and network before continuing.</p>
      <div class="checkout-summary">
        <div class="checkout-summary__left">
          <span class="name">${pkg.name}</span>
          <span class="meta">${formatData(pkg.dataGb)} · ${formatValidity(pkg.validityDays)} · ${net.name}</span>
        </div>
        <span class="checkout-summary__price">${formatPkr(pkg.pricePkr)}</span>
      </div>
      <div class="fact-list">
        <div class="fact"><span>Device</span><strong>${deviceInfo.os}</strong></div>
        <div class="fact"><span>Delivery</span><strong>Email · Instant</strong></div>
        <div class="fact"><span>Total</span><strong>${formatPkr(pkg.pricePkr)}</strong></div>
      </div>
      <div class="checkout-actions">
        <button type="button" class="btn btn--primary" id="step-review-next">Continue to details</button>
        <button type="button" class="btn btn--secondary" id="step-review-cancel">Cancel</button>
      </div>
    </div>`;
  document.getElementById("step-review-next").addEventListener("click", renderDetails);
  document.getElementById("step-review-cancel").addEventListener("click", closeModal);
  updateFocusable();
  setTimeout(() => { const el = document.getElementById("step-review-next"); if (el) el.focus(); }, 60);
}

function renderDetails() {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-panel is-active">
      ${checkoutDots(2)}
      <p class="checkout-title">Your details</p>
      <p class="checkout-sub">We'll send your eSIM confirmation here.</p>
      <form class="checkout-form" id="checkout-form" novalidate>
        <div class="input-group">
          <label for="email">Email address</label>
          <input type="email" id="email" placeholder="you@example.com" autocomplete="email" />
        </div>
        <div class="input-group">
          <label for="whatsapp">Instagram handle (optional)</label>
          <div class="prefix">
            <span>@</span>
            <input type="text" id="instagram" placeholder="yourhandle" autocomplete="off" />
          </div>
        </div>
      </form>
      <div class="checkout-actions">
        <button type="button" class="btn btn--primary" id="step-details-next">Continue to payment</button>
        <button type="button" class="btn btn--secondary" id="step-details-back">Back</button>
      </div>
    </div>`;
  document.getElementById("step-details-next").addEventListener("click", validateAndContinue);
  document.getElementById("step-details-back").addEventListener("click", renderReview);
  updateFocusable();
  setTimeout(() => { const el = document.getElementById("email"); if (el) el.focus(); }, 60);
}

function validateAndContinue() {
  const email = document.getElementById("email");
  let valid = true;
  if (!email.value || !email.value.includes("@")) {
    email.style.borderColor = "var(--danger)";
    valid = false;
  } else {
    email.style.borderColor = "";
  }
  if (!valid) { playTick(); return; }
  renderPayment();
}

function renderPayment() {
  const pkg = PACKAGES.find((p) => p.id === activeRequest.packageId);
  const body = document.getElementById("modal-body");
  const payReady = payUrl !== null;
  body.innerHTML = `
    <div class="modal-panel is-active">
      ${checkoutDots(3)}
      <p class="checkout-title">Choose payment method</p>
      <p class="checkout-sub">Pay securely with Easypaisa.</p>
      <div class="easypaisa-option">
        <img src="easypaisa.png" alt="Easypaisa" />
        <div class="easypaisa-option__text">
          <strong>Easypaisa</strong>
          <span>Secure payment gateway</span>
        </div>
        <span class="easypaisa-option__check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
        </span>
      </div>
      <div class="next-steps">
        <div class="next-step">
          <span class="next-step__num">1</span>
          <span class="next-step__text"><strong>Email confirmation</strong> with your eSIM profile and installation steps.</span>
        </div>
        <div class="next-step">
          <span class="next-step__num">2</span>
          <span class="next-step__text"><strong>Tap install</strong> when the prompt appears. No QR code needed.</span>
        </div>
        <div class="next-step">
          <span class="next-step__num">3</span>
          <span class="next-step__text"><strong>You're online</strong> — usually within 2 minutes.</span>
        </div>
      </div>
      <div class="checkout-actions">
        <button type="button" class="btn btn--primary" id="pay-now" ${!payReady ? "disabled" : ""}>
          ${payReady ? "Pay " + formatPkr(pkg.pricePkr) : "Preparing payment link…"}
        </button>
        <button type="button" class="btn btn--secondary" id="step-payment-back">Back</button>
      </div>
    </div>`;

  if (!payReady) {
    payOrder.then(() => {
      const btn = document.getElementById("pay-now");
      if (btn && payUrl) {
        btn.disabled = false;
        btn.textContent = "Pay " + formatPkr(pkg.pricePkr);
      }
    });
  }

  document.getElementById("pay-now").addEventListener("click", handlePay);
  document.getElementById("step-payment-back").addEventListener("click", renderDetails);
  updateFocusable();
  setTimeout(() => { const el = document.getElementById("pay-now"); if (el && !el.disabled) el.focus(); }, 60);
}

function handlePay() {
  const btn = document.getElementById("pay-now");
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  btn.classList.add("btn--loading");
  btn.textContent = "Redirecting to payment…";
  const proceed = () => {
    if (payUrl) {
      window.location.assign(payUrl);
    } else {
      createPayOrder(PACKAGES.find((p) => p.id === activeRequest.packageId))
        .then((link) => { if (link) window.location.assign(link); else throw new Error("no link"); })
        .catch(() => {
          btn.disabled = false;
          btn.classList.remove("btn--loading");
          btn.textContent = "Pay " + formatPkr(PACKAGES.find((p) => p.id === activeRequest.packageId).pricePkr);
          const sub = document.querySelector(".checkout-sub");
          if (sub) sub.textContent = "Could not open payment. Please try again.";
        });
    }
  };
  setTimeout(proceed, 700);
}

function renderTestimonials() {
  const list = document.getElementById("testimonial-list");
  if (!list) return;
  const reviews = [];
  if (reviews.length === 0) {
    list.innerHTML = `
      <div class="testimonial-empty" style="grid-column:1/-1;">
        <p>We're a new service and are collecting our first customer reviews. Order today — your feedback helps others decide, and you'll receive priority Instagram support.</p>
      </div>`;
    return;
  }
  list.innerHTML = reviews.map((r) => `
    <div class="testimonial">
      <div class="testimonial__stars">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</div>
      <p class="testimonial__quote">${r.quote}</p>
      <div class="testimonial__author">
        <span class="testimonial__avatar">${r.name.charAt(0)}</span>
        <div class="testimonial__meta">
          <strong>${r.name}</strong>
          <span>${r.city}</span>
        </div>
      </div>
    </div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  paintPackages();
  renderTestimonials();

  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const hash = (location.hash || "#home").slice(1);
  const validViews = ["home", "install", "faq", "about", "contact", "refund", "terms", "privacy"];
  const initialView = validViews.includes(hash) ? hash : "home";
  showView(initialView);

  updateAudioIcon();

  document.body.addEventListener("pointerdown", (e) => {
    unlockAudio();
    if (e.target.closest("button, a, .tab, .pkg-cta, .btn, [data-view], [data-get]")) playTap();
  });

  document.body.addEventListener("click", (e) => {
    const scrollEl = e.target.closest("[data-scroll]");
    if (scrollEl) {
      e.preventDefault();
      const activeView = document.querySelector(".view.is-on");
      if (!activeView) return;
      const target = activeView.querySelector(".pkg-list");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const viewEl = e.target.closest("[data-view]");
    if (viewEl) {
      e.preventDefault();
      const viewName = viewEl.dataset.view;
      if (viewName) showView(viewName);
      return;
    }

    const netBtn = e.target.closest("[data-net]");
    if (netBtn) {
      const pkgId = netBtn.dataset.pkg;
      const netId = netBtn.dataset.net;
      cardState[pkgId] = netId;
      document.querySelectorAll('.pkg[data-pkg="' + pkgId + '"]').forEach((card) => {
        card.dataset.network = netId;
        const group = card.querySelector(".network-pills");
        if (!group) return;
        const idx = NETWORKS.findIndex((n) => n.id === netId);
        const thumb = group.querySelector(".network-pills__thumb");
        if (thumb) thumb.style.transform = "translateX(" + idx * 100 + "%)";
        group.querySelectorAll("button").forEach((b) => {
          const on = b.dataset.net === netId;
          b.classList.toggle("is-on", on);
          b.setAttribute("aria-checked", on);
        });
      });
      return;
    }

    const getBtn = e.target.closest("[data-get]");
    if (getBtn) { openModal(getBtn.dataset.get); return; }

    if (e.target.id === "modal-overlay") { closeModal(); return; }
    if (e.target.closest("#modal-close")) { closeModal(); return; }
  });

  const audioToggle = document.getElementById("audio-toggle");
  if (audioToggle) {
    audioToggle.addEventListener("click", () => {
      musicOn = !musicOn;
      if (musicGain) musicGain.gain.value = musicOn ? 0.08 : 0;
      if (musicOn) { unlockAudio(); stopMusic(); startMusic(); }
      else stopMusic();
      audioToggle.setAttribute("aria-label", musicOn ? "Mute ambient sound" : "Play ambient sound");
      updateAudioIcon();
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopMusic();
    else if (unlocked && musicOn && !musicTimer) startMusic();
  });

  document.addEventListener("keydown", (e) => {
    const modal = document.getElementById("modal");
    const modalOpen = modal && !modal.classList.contains("hidden");
    if (e.key === "Escape" && modalOpen) { closeModal(); return; }
    if (modalOpen && e.key === "Tab") {
      if (focusableElements.length === 0) return;
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
  });
});
