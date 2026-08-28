/* Lumi — static store
   Edit PACKAGES to change prices, data, or copy.
   Payment URL is pre‑fetched when modal opens.
   Checkout form is visual only – no data is sent.
*/
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
    cta: "Get eSIM",
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
    cta: "Get eSIM",
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
    cta: "Get eSIM",
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
    cta: "Get eSIM",
  },
];

const SCAN_TITLES = [
  "Detecting device",
  "Analyzing network bands",
  "Handshaking with tower",
  "Preparing eSIM profile",
  "Finalizing compatibility",
];

function formatPkr(n) {
  return "Rs. " + n.toLocaleString("en-US");
}
function formatData(gb) {
  return gb + " GB";
}
function formatValidity(days) {
  if (days % 30 === 0) {
    const m = days / 30;
    return m === 1 ? "30 days" : m + " months";
  }
  return days + " days";
}

const cardState = {};
PACKAGES.forEach((p) => {
  cardState[p.id] = DEFAULT_NETWORK;
});

function netMark(id) {
  if (id === "zong") {
    return `<svg class="net-mark" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#EC008C"/><path d="M6.4 6.6h11.2L8.6 17.4h9.2" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`;
  }
  if (id === "telenor") {
    return `<svg class="net-mark" viewBox="0 0 24 24" aria-hidden="true"><path fill="#00A9E0" d="M12 2.1c-4.7 0-7.6 3.7-7.6 8.1 0 5.4 3.7 9.4 7.3 9.4 1.2 0 2-.3 2-.3l2.9 2.4c.3.25.8 0 .75-.4l-.35-2.7c2.5-1.5 4.1-4.4 4.1-8.4 0-4.4-2.9-8.1-7.6-8.1Zm0 12.7c-2.5 0-4.3-2.2-4.3-5.1S9.5 4.6 12 4.6s4.3 2.2 4.3 5.1-1.8 5.1-4.3 5.1Z"/></svg>`;
  }
  return `<svg class="net-mark" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#E31B23"/><path d="M13.4 4.6h3.1v10.4c0 3.4-2 5.4-5.6 5.4-2.9 0-5-1.5-5.6-3.8l2.7-.9c.35 1.3 1.35 2.15 2.9 2.15 1.8 0 2.7-1 2.7-3V4.6Z" fill="#fff"/></svg>`;
}

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
          data-net="${n.id}" data-pkg="${pkgId}">${netMark(n.id)}<span>${n.name}</span></button>`
      ).join("")}
    </div>`;
}

function cardHTML(pkg, first) {
  const net = cardState[pkg.id];
  let extra = "";
  if (pkg.kind === "pulse") {
    extra = `<span class="pkg-badge">${pkg.kicker}</span>
             <div class="pkg-data-xl"><em>${pkg.dataGb}</em><span>GB · ${formatValidity(pkg.validityDays)}</span></div>
             <h3 class="pkg-name">${pkg.name}</h3>
             <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
             <p class="pkg-meta">${pkg.blurb}</p>`;
  } else if (pkg.kind === "drift") {
    extra = `<p class="pkg-kicker">${pkg.kicker}</p>
             <h3 class="pkg-name">${pkg.name}</h3>
             <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
             <div class="pkg-stats">
               <div class="pkg-stat"><span>Data</span><strong>${formatData(pkg.dataGb)}</strong></div>
               <div class="pkg-stat"><span>Valid</span><strong>${formatValidity(pkg.validityDays)}</strong></div>
             </div>
             <ul class="pkg-features">${pkg.features.map((f) => `<li><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg> ${f}</li>`).join("")}</ul>`;
  } else if (pkg.kind === "aether") {
    extra = `<p class="pkg-kicker">${pkg.kicker}</p>
             <h3 class="pkg-name">${pkg.name}</h3>
             <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
             <p class="pkg-meta">${pkg.blurb}</p>
             <div class="pkg-glass">
               <div class="pkg-glass-row"><span>Data</span><strong>${formatData(pkg.dataGb)}</strong></div>
               <div class="pkg-glass-row"><span>Validity</span><strong>${formatValidity(pkg.validityDays)}</strong></div>
             </div>`;
  } else {
    extra = `<p class="pkg-kicker">${pkg.kicker}</p>
             <h3 class="pkg-name">${pkg.name}</h3>
             <p class="pkg-price">${formatPkr(pkg.pricePkr)}</p>
             <p class="pkg-meta">${formatData(pkg.dataGb)} · ${formatValidity(pkg.validityDays)}</p>`;
  }

  return `
    <article class="pkg pkg--${pkg.kind}" ${first ? 'id="first-package"' : ""} data-pkg="${pkg.id}" data-network="${net}">
      ${extra}
      ${pills(pkg.id)}
      <button type="button" class="pkg-cta ${pkg.kind === "pulse" ? "pkg-cta--buy" : ""}" data-get="${pkg.id}">
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
  if (home) home.innerHTML = sectionHTML(false);
  if (install) install.innerHTML = sectionHTML(true);
}

function showView(name) {
  document.querySelectorAll(".view").forEach((el) => el.classList.toggle("is-on", el.id === "view-" + name));
  document.querySelectorAll(".tab").forEach((el) => el.classList.toggle("is-active", el.dataset.view === name));
  document.querySelectorAll(".nav-link").forEach((el) => el.classList.toggle("is-active", el.dataset.view === name));
  document.getElementById("stage").scrollTop = 0;
  history.replaceState(null, "", "#" + name);
}

/* ——— Sound ——— */
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
    master.gain.value = 0.7;
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
    const notes = [196, 246.94, 293.66];
    notes.forEach((freq, i) => {
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
  musicTimer = window.setInterval(beat, 2400);
}

function stopMusic() {
  if (musicTimer) {
    clearInterval(musicTimer);
    musicTimer = null;
  }
}

function unlockAudio() {
  const c = audio();
  if (!c) return;
  if (c.state === "suspended") c.resume();
  unlocked = true;
  if (musicOn && !musicTimer) startMusic();
  updateAudioIcon();
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
  if (c.state === "suspended") {
    c.resume().then(kick).catch(() => {});
  } else {
    kick();
  }
}

function updateAudioIcon() {
  const onIco = document.querySelector(".ico-vol-on");
  const offIco = document.querySelector(".ico-vol-off");
  if (onIco && offIco) {
    onIco.classList.toggle("hidden", !musicOn);
    offIco.classList.toggle("hidden", musicOn);
  }
}

/* ——— Device ——— */
function detectDevice() {
  const ua = navigator.userAgent || "";
  let os = "Phone";
  if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Mac/i.test(ua)) os = "macOS";
  else if (/Win/i.test(ua)) os = "Windows";
  return { os, esim: /iPhone|iPad|Android/i.test(ua), ua };
}

/* ——— Modal ——— */
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

async function createPayOrder(pkg) {
  const id = PACKAGE_PAY_ID[pkg.id];
  const res = await fetch(PAY_API + "?id=" + id);
  const link = (await res.text()).trim().replace(/^"|"$/g, "");
  if (!res.ok || !/^https?:\/\//i.test(link)) {
    throw new Error("Payment link missing");
  }
  return link;
}

function closeModal() {
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modal-overlay").classList.add("hidden");
  if (modalTriggerElement) {
    modalTriggerElement.focus();
    modalTriggerElement = null;
  }
  activeRequest = null;
  payUrl = null;
  payOrder = null;
  document.body.style.overflow = "";
}

function openModal(pkgId) {
  const pkg = PACKAGES.find((p) => p.id === pkgId);
  if (!pkg) return;
  activeRequest = { packageId: pkgId, networkId: cardState[pkgId] };
  deviceInfo = detectDevice();
  modalTriggerElement = document.activeElement;

  payUrl = null;
  payOrder = createPayOrder(pkg)
    .then((link) => {
      payUrl = link;
      return link;
    })
    .catch(() => {
      payUrl = null;
      throw new Error("fail");
    });

  document.getElementById("modal-overlay").classList.remove("hidden");
  document.getElementById("modal").classList.remove("hidden");
  document.body.style.overflow = "hidden";

  setTimeout(() => {
    const modal = document.getElementById("modal");
    focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusableElements.length) focusableElements[0].focus();
  }, 50);

  renderScan(0);
  scanTimers.forEach(clearTimeout);
  scanTimers = [];
  const totalSteps = SCAN_TITLES.length;
  const stepDuration = 2000;

  for (let i = 0; i < totalSteps; i++) {
    scanTimers.push(
      setTimeout(() => {
        playTick();
        renderScan(i + 1);
        const fill = document.querySelector(".scan-meter-fill");
        if (fill) {
          const pct = ((i + 1) / totalSteps) * 100;
          fill.style.width = pct + "%";
        }
      }, i * stepDuration)
    );
  }

  scanTimers.push(
    setTimeout(() => {
      playSuccess();
      showSuccessPayoff();
    }, totalSteps * stepDuration)
  );
}

function showSuccessPayoff() {
  const body = document.getElementById("modal-body");
  body.innerHTML = `
    <div class="modal-panel is-active" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:30px 0;">
      <div style="width:80px; height:80px; border-radius:50%; background:var(--color-accent); display:grid; place-items:center; animation: scale-in 0.4s var(--ease-out) both; box-shadow:0 0 40px var(--color-accent);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#152048" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
      </div>
      <p style="margin:18px 0 6px; font-size:1.25rem; font-weight:700; color:var(--color-fg);">Device Compatible</p>
      <p style="margin:0; color:var(--color-muted); font-size:0.875rem;">Your phone is ready for eSIM installation.</p>
    </div>
  `;
  setTimeout(() => renderResult(), 1200);
}

function renderScan(step) {
  const body = document.getElementById("modal-body");
  const title = step < SCAN_TITLES.length ? SCAN_TITLES[step] : SCAN_TITLES[SCAN_TITLES.length - 1];
  body.innerHTML = `
    <div class="modal-panel is-active">
      <div class="scan-stage">
        <div class="radar" aria-hidden="true">
          <span class="radar-sweep"></span>
          <span class="radar-core"></span>
          <span class="radar-line"></span>
          <span class="radar-dots">
            <span class="radar-dot"></span>
            <span class="radar-dot"></span>
            <span class="radar-dot"></span>
            <span class="radar-d
