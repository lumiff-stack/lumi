/* Lumi — Lightweight, 60fps-ready JavaScript */

// --- Performance Detection (Runs Synchronously) ---
(function detectLowEnd() {
  try {
    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 2;
    if (mem < 4 || cores < 4) {
      document.documentElement.classList.add('low-end');
    }
  } catch (_) { /* silently fail */ }
})();

// --- Data ---
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
    dataGb: 3,
    validityDays: 7,
    kicker: "Starter",
    blurb: "A few days of data, installed in minutes.",
    features: ["Instant eSIM after payment", "Nationwide coverage", "No QR code"],
    kind: "spark",
    cta: "Install eSIM",
  },
  {
    id: "lumi-1000",
    name: "Pulse",
    pricePkr: 1000,
    dataGb: 8,
    validityDays: 15,
    kicker: "Must buy",
    blurb: "The plan people actually buy.",
    features: ["Instant eSIM after payment", "Nationwide coverage", "No QR code"],
    kind: "pulse",
    cta: "Buy now",
  },
  {
    id: "lumi-2000",
    name: "Drift",
    pricePkr: 2000,
    dataGb: 20,
    validityDays: 30,
    kicker: "Full month",
    blurb: "A month of data on the network you choose.",
    features: ["Instant eSIM after payment", "Zong, Telenor or Jazz", "No shop visit"],
    kind: "drift",
    cta: "Install eSIM",
  },
  {
    id: "lumi-5000",
    name: "Aether",
    pricePkr: 5000,
    dataGb: 60,
    validityDays: 90,
    kicker: "Best value",
    blurb: "Three months of data. The quiet premium pick.",
    features: [
      "Instant eSIM after payment",
      "Zong, Telenor or Jazz",
      "No QR code",
      "Priority provisioning",
    ],
    kind: "aether",
    cta: "Install eSIM",
  },
];

// --- Helpers ---
function formatPkr(n) { return "Rs. " + n.toLocaleString("en-US"); }
function formatData(gb) { return gb + " GB"; }
function formatValidity(days) {
  if (days % 30 === 0) {
    const m = days / 30;
    return m === 1 ? "30 days" : m + " months";
  }
  return days + " days";
}
function formatPricePerGb(price, gb) {
  return "Rs. " + Math.round(price / gb).toLocaleString("en-US") + "/GB";
}

const cardState = {};
PACKAGES.forEach((p) => { cardState[p.id] = DEFAULT_NETWORK; });

// --- Rendering ---
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

function cardHTML(pkg, first) {
  const perGb = formatPricePerGb(pkg.pricePkr, pkg.dataGb);
  const bestVal = pkg.kind === 'aether' ? ' · Best value' : '';
  let extra = '';

  if (pkg.kind === "pulse") {
    extra = `
      <span class="pkg-badge">${pkg.kicker}</span>
      <div class="pkg-data-xl"><em>${pkg.dataGb}</em><span>GB · ${formatValidity(pkg.validityDays)}</span></div>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-per-gb">${perGb}${bestVal}</p>
      <p class="pkg-meta">${pkg.blurb}</p>`;
  } else if (pkg.kind === "drift") {
    extra = `
      <p class="pkg-kicker">${pkg.kicker}</p>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-per-gb">${perGb}${bestVal}</p>
      <div class="pkg-stats">
        <div class="pkg-stat"><span>Data</span><strong>${formatData(pkg.dataGb)}</strong></div>
        <div class="pkg-stat"><span>Valid</span><strong>${formatValidity(pkg.validityDays)}</strong></div>
      </div>
      <ul class="pkg-features">${pkg.features.map((f) => `<li>✓ ${f}</li>`).join("")}</ul>`;
  } else if (pkg.kind === "aether") {
    extra = `
      <p class="pkg-kicker">${pkg.kicker}</p>
      <h3 class="pkg-name">${pkg.name}</h3>
      <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
      <p class="pkg-per-gb">${perGb}${bestVal}</p>
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
      <p class="pkg-per-gb">${perGb}${bestVal}</p>
      <p class="pkg-meta">${formatData(pkg.dataGb)} · ${formatValidity(pkg.validityDays)}</p>`;
  }

  return `
    <article class="pkg pkg--${pkg.kind}" ${first ? 'id="first-package"' : ""} data-pkg="${pkg.id}" data-network="${cardState[pkg.id]}">
      ${extra}
      ${pills(pkg.id)}
      <button type="button" class="pkg-cta ${pkg.kind === "pulse" ? "pkg-cta--buy" : ""}" data-install="${pkg.id}">
        ${pkg.cta}
      </button>
    </article>`;
}

function sectionHTML(firstId) {
  return `
    <section class="section">
      <p class="section-kicker">Packages</p>
      <h2>Four plans. Your network.</h2>
      <div class="pkg-list">
        ${PACKAGES.map((p, i) => cardHTML(p, firstId && i === 0)).join("")}
      </div>
    </section>`;
}

function paintPackages() {
  const home = document.getElementById("packages-home");
  const install = document.getElementById("packages-install");
  if (home) home.innerHTML = sectionHTML(true);
  if (install) install.innerHTML = sectionHTML(true);
}

// --- Views ---
function showView(name) {
  document.querySelectorAll(".view").forEach((el) => el.classList.toggle("is-on", el.id === "view-" + name));
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("is-active", el.dataset.view === name));
  document.getElementById("stage").scrollTop = 0;
  history.replaceState(null, "", "#" + name);
}

// --- Audio (Lightweight Web Audio) ---
let audioCtx = null, master = null, musicGain = null, musicTimer = null;
let unlocked = false, musicOn = true;

function audio() {
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) {
    audioCtx = new Ctor();
    master = audioCtx.createGain();
    master.gain.value = 0.7;
    master.connect(audioCtx.destination);
    musicGain = audioCtx.createGain();
    musicGain.gain.value = musicOn ? 0.11 : 0;
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
  const g = env(0.07, 0.09);
  if (!g) return;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(920, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(640, c.currentTime + 0.06);
  o.connect(g);
  o.start();
  o.stop(c.currentTime + 0.08);
}
function playTick() {
  const c = audio();
  if (!c || !unlocked) return;
  const g = env(0.12, 0.07);
  if (!g) return;
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.value = 1240;
  o.connect(g);
  o.start();
  o.stop(c.currentTime + 0.12);
}
function playSuccess() {
  const c = audio();
  if (!c || !unlocked) return;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const g = env(0.28, 0.08);
    if (!g) return;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g);
    const t = c.currentTime + i * 0.07;
    o.start(t);
    o.stop(t + 0.28);
  });
}
function startMusic() {
  const c = audio();
  if (!c || !musicGain || musicTimer) return;
  const beat = () => {
    if (!musicOn) return;
    [196, 246.94, 293.66].forEach((freq, i) => {
      const g = c.createGain();
      g.gain.value = 0.04;
      g.connect(musicGain);
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g);
      o.start(c.currentTime + i * 0.02);
      o.stop(c.currentTime + 1.6);
    });
  };
  beat();
  musicTimer = setInterval(beat, 2400);
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
}
function resumeAudio() {
  if (document.hidden) return;
  const c = audio();
  if (!c || !unlocked) return;
  const kick = () => {
    if (!musicOn) return;
    stopMusic();
    startMusic();
  };
  if (c.state === "suspended") c.resume().then(kick).catch(() => {});
  else kick();
}

// --- Device Detection ---
function detectDevice() {
  const ua = navigator.userAgent || "";
  let os = "Phone", esim = false;
  if (/iPhone|iPad|iPod/.test(ua)) {
    os = "iOS";
    const match = ua.match(/OS (\d+)_/);
    if (match && parseInt(match[1]) >= 13) esim = true;
  } else if (/Android/.test(ua)) {
    os = "Android";
    const match = ua.match(/Android (\d+)/);
    if (match && parseInt(match[1]) >= 10) esim = true;
  } else { os = "Desktop"; esim = false; }
  return { os, esim, ua };
}

// --- Modal / Checkout ---
const SCAN = ["Detecting device", "Checking operating system", "Checking browser", "Checking eSIM capability", "Preparing installation"];
let scanTimers = [], activeRequest = null, deviceInfo = null, focusTrapHandler = null;

async function beginCheckout(ctx) {
  // Future: POST /api/checkout
  return { status: "awaiting_gateway", context: ctx, orderId: null };
}

function trapFocus(container) {
  const focusable = container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return null;
  const first = focusable[0], last = focusable[focusable.length - 1];
  const handler = (e) => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  container.addEventListener('keydown', handler);
  first.focus();
  return handler;
}

function closeModal() {
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-overlay").classList.add("hidden");
  if (focusTrapHandler) {
    document.getElementById("modal").removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }
  activeRequest = null;
}

function openModal(pkgId) {
  const pkg = PACKAGES.find((p) => p.id === pkgId);
  if (!pkg) return;
  activeRequest = { packageId: pkgId, networkId: cardState[pkgId] };
  deviceInfo = detectDevice();
  document.getElementById("modal-overlay").classList.remove("hidden");
  document.getElementById("modal").classList.remove("hidden");
  focusTrapHandler = trapFocus(document.getElementById("modal"));
  renderScan(0);
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  SCAN.forEach((_, i) => {
    scanTimers.push(setTimeout(() => { playTick(); renderScan(i + 1); }, i * 2000));
  });
  scanTimers.push(setTimeout(() => { playSuccess(); renderResult(); }, SCAN.length * 2000));
}

function renderScan(step) {
  document.getElementById("modal-body").innerHTML = `
    <div>
      <div class="scan-stage">
        <div class="radar" aria-hidden="true">
          <span class="radar-sweep"></span>
          <span class="radar-core"></span>
          <span class="radar-line"></span>
        </div>
        <p class="scan-title">Checking your phone</p>
        <p class="scan-copy">This takes about 10 seconds.</p>
        <div class="scan-meter"><span class="scan-meter-fill"></span></div>
      </div>
      <ol class="scan-steps">
        ${SCAN.map((label, i) => {
          const cls = step === i + 1 ? "is-on" : step > i + 1 ? "is-done" : "";
          return `<li class="scan-step ${cls}"><span class="scan-dot"></span>${label}</li>`;
        }).join("")}
      </ol>
    </div>`;
}

function renderResult() {
  const pkg = PACKAGES.find((p) => p.id === activeRequest.packageId);
  const net = NETWORKS.find((n) => n.id === activeRequest.networkId);
  const badges = `
    <div class="security-badges">
      <span>🔒 256-bit SSL</span>
      <span>✅ JazzCash / Easypaisa</span>
      <span>💳 Card</span>
    </div>`;
  let payButton = '';
  if (deviceInfo.esim) {
    payButton = `<button type="button" class="pkg-cta pkg-cta--buy" id="pay-now">Pay & activate now</button>`;
  } else {
    payButton = `
      <div class="compat-fallback">
        <p>⚠️ eSIM not detected on this device</p>
        <p>Don't worry — we'll send you a QR code via email instead. Continue to payment.</p>
      </div>
      <button type="button" class="pkg-cta" id="pay-now" style="background:var(--color-gold); color:#152048;">Continue with email delivery</button>`;
  }
  document.getElementById("modal-body").innerHTML = `
    <div class="result">
      <p class="result-kicker">✅ Ready to go</p>
      <h2 class="result-title">Device verified. Install in seconds.</h2>
      <p class="result-note">Your phone is compatible. Complete payment now and your eSIM activates automatically — no QR codes, no delays.</p>
      <div class="fact-list">
        <div class="fact"><span>Package</span><strong>${formatPkr(pkg.pricePkr)} · ${formatData(pkg.dataGb)}</strong></div>
        <div class="fact"><span>Network</span><strong>${net.name}</strong></div>
        <div class="fact"><span>Device</span><strong>${deviceInfo.os}</strong></div>
      </div>
      ${badges}
      ${payButton}
    </div>`;
}

function renderCheckout() {
  const pkg = PACKAGES.find((p) => p.id === activeRequest.packageId);
  const net = NETWORKS.find((n) => n.id === activeRequest.networkId);
  document.getElementById("modal-body").innerHTML = `
    <div class="result">
      <p class="result-kicker">Get your eSIM</p>
      <h2>${formatPkr(pkg.pricePkr)} · ${net.name}</h2>
      <p class="result-note">${formatData(pkg.dataGb)} · ${formatValidity(pkg.validityDays)} · ${pkg.name}</p>
      <div class="hold-card">
        <p>After payment, the eSIM installs automatically on your phone. There is no QR-code step.</p>
      </div>
      <button type="button" class="pkg-cta" id="close-pay">Close</button>
    </div>`;
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  paintPackages();

  const hash = (location.hash || "#home").slice(1);
  showView(["home", "install", "about"].includes(hash) ? hash : "home");

  // Audio initialization
  document.body.addEventListener("pointerdown", (e) => {
    unlockAudio();
    if (e.target.closest("button, a, .tab, .pkg-cta")) playTap();
  });
  document.addEventListener("visibilitychange", resumeAudio);
  window.addEventListener("focus", resumeAudio);

  // Navigation
  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      showView(el.dataset.view);
    });
  });

  // Scroll to package
  document.getElementById("choose-package").addEventListener("click", () => {
    const stage = document.getElementById("stage");
    const target = document.querySelector("#view-install #first-package");
    if (!target) return;
    const top = target.getBoundingClientRect().top - stage.getBoundingClientRect().top + stage.scrollTop - 12;
    stage.scrollTo({ top, behavior: "smooth" });
  });

  // Audio toggle
  document.getElementById("audio-toggle").addEventListener("click", () => {
    musicOn = !musicOn;
    if (musicGain) musicGain.gain.value = musicOn ? 0.11 : 0;
    const toggle = document.getElementById("audio-toggle");
    toggle.setAttribute("aria-label", musicOn ? "Mute music" : "Play music");
    toggle.innerHTML = musicOn 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 010 7"/><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" stroke-width="2"/></svg>`;
    if (musicOn) { unlockAudio(); stopMusic(); startMusic(); } 
    else stopMusic();
  });

  // Quick install floating CTA
  document.getElementById("quick-install")?.addEventListener("click", () => {
    showView("install");
    setTimeout(() => {
      const target = document.querySelector("#view-install #first-package");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  });

  // Global event delegation
  document.body.addEventListener("click", (e) => {
    // Network pills
    const netBtn = e.target.closest("[data-net]");
    if (netBtn) {
      cardState[netBtn.dataset.pkg] = netBtn.dataset.net;
      const card = netBtn.closest(".pkg");
      card.dataset.network = netBtn.dataset.net;
      const group = netBtn.parentElement;
      const idx = NETWORKS.findIndex((n) => n.id === netBtn.dataset.net);
      group.querySelector(".network-pills__thumb").style.transform = `translateX(${idx * 100}%)`;
      group.querySelectorAll("button").forEach((b) => {
        const on = b.dataset.net === netBtn.dataset.net;
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-checked", on);
      });
      return;
    }
    // Install trigger
    const inst = e.target.closest("[data-install]");
    if (inst) openModal(inst.dataset.install);
    // Pay now
    if (e.target.id === "pay-now") {
      beginCheckout({
        packageId: activeRequest.packageId,
        networkId: activeRequest.networkId,
        device: deviceInfo,
      }).then(renderCheckout);
    }
    // Close modal
    if (e.target.id === "close-pay" || e.target.id === "modal-close" || e.target.id === "modal-overlay") {
      closeModal();
    }
  });

  // Lazy load images
  if ('IntersectionObserver' in window) {
    document.querySelectorAll("img.lazy").forEach(img => {
      const src = img.dataset.src;
      if (src) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              img.src = src;
              observer.unobserve(img);
            }
          });
        });
        observer.observe(img);
      }
    });
  }
});
