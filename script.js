// ============================================
//   NEBULA GALLERY — app.js
//   S3 Photo Gallery Logic
// ============================================

// ── DEMO DATA ────────────────────────────────
// In production, replace this with a call to:
//   AWS.S3.listObjectsV2({ Bucket: 'your-bucket' })
// Each object's URL = https://<bucket>.s3.<region>.amazonaws.com/<key>

const BUCKET_NAME = "my-photo-gallery-bucket-rudra";
const REGION      = "eu-north-1";

const PHOTOS = [
  {
    id: 1, name: "Aurora Peaks",       category: "nature",
    size: "3.2 MB",   date: "2026-01-08",
    key: "images/mountain1.jpg",
    url: "https://my-photo-gallery-bucket-rudra.s3.eu-north-1.amazonaws.com/Mountain1.jpg"
  },
  {
    id: 2, name: "Neon District",      category: "city",
    size: "2.8 MB",   date: "2026-01-22",
    key: "images/city1.jpg",
    url: "https://my-photo-gallery-bucket-rudra.s3.eu-north-1.amazonaws.com/City1.jpg"
  },
  {
    id: 3, name: "Deep Forest",        category: "nature",
    size: "1.9 MB",   date: "2026-02-05",
    key: "images/forest1.jpg",
    url: "https://my-photo-gallery-bucket-rudra.s3.eu-north-1.amazonaws.com/Forest1.jpg"
  },
  {
    id: 4, name: "Studio Blue",        category: "portrait",
    size: "4.0 MB",   date: "2026-02-14",
    key: "portraits/studio-blue.jpg",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&q=80"
  },
  {
    id: 5, name: "Skyline at Dusk",    category: "city",
    size: "3.4 MB",   date: "2026-02-28",
    key: "city/skyline-dusk.jpg",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80"
  },
  {
    id: 6, name: "Desert Storm",       category: "nature",
    size: "2.1 MB",   date: "2026-03-03",
    key: "nature/desert-storm.jpg",
    url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=900&q=80"
  },
  {
    id: 7, name: "Golden Hour",        category: "portrait",
    size: "3.7 MB",   date: "2026-03-11",
    key: "portraits/golden-hour.jpg",
    url: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=900&q=80"
  },
  {
    id: 8, name: "Rain Market",        category: "city",
    size: "2.5 MB",   date: "2026-03-18",
    key: "city/rain-market.jpg",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=900&q=80"
  },
  {
    id: 9, name: "Frozen Lake",        category: "nature",
    size: "2.9 MB",   date: "2026-03-24",
    key: "nature/frozen-lake.jpg",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80"
  },
  {
    id: 10, name: "Street Shadows",   category: "portrait",
    size: "3.1 MB",   date: "2026-03-27",
    key: "portraits/street-shadows.jpg",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&q=80"
  },
  {
    id: 11, name: "Ocean Abyss",      category: "nature",
    size: "2.6 MB",   date: "2026-03-29",
    key: "nature/ocean-abyss.jpg",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=900&q=80"
  },
  {
    id: 12, name: "Tokyo Nights",     category: "city",
    size: "3.8 MB",   date: "2026-03-30",
    key: "city/tokyo-nights.jpg",
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=900&q=80"
  },
];

// ── STATE ────────────────────────────────────
const state = {
  filter:  "all",
  sort:    "newest",
  view:    "grid",
  lightbox: null,
  filtered: [],
};

// ── HELPERS ──────────────────────────────────
const s3PublicUrl = (key) =>
  `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;

const formatBytes = (str) => str; // already formatted in demo data

const el = (id) => document.getElementById(id);

// ── CURSOR ───────────────────────────────────
function initCursor() {
  const cursor = el("cursor");
  const ring   = el("cursor-ring");
  let rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";

    // ring follows with slight lag
    rx += (e.clientX - rx) * 0.12;
    ry += (e.clientY - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top  = ry + "px";
  });

  // smooth ring via rAF
  function animateRing() {
    requestAnimationFrame(animateRing);
  }
  animateRing();
}

// ── RENDER GALLERY ───────────────────────────
function getFiltered() {
  let list = state.filter === "all"
    ? [...PHOTOS]
    : PHOTOS.filter(p => p.category === state.filter);

  list.sort((a, b) => {
    if (state.sort === "newest") return b.id - a.id;
    if (state.sort === "oldest") return a.id - b.id;
    if (state.sort === "name")   return a.name.localeCompare(b.name);
    if (state.sort === "size")   return parseFloat(b.size) - parseFloat(a.size);
    return 0;
  });

  return list;
}

function renderGallery() {
  const grid  = el("gallery");
  const empty = el("emptyState");
  state.filtered = getFiltered();

  grid.innerHTML = "";

  if (state.filtered.length === 0) {
    empty.classList.add("show");
    return;
  }
  empty.classList.remove("show");

  // set view class
  grid.className = "gallery-grid";
  if (state.view === "masonry") grid.classList.add("masonry");
  if (state.view === "list")    grid.classList.add("list");

  state.filtered.forEach((photo, i) => {
    const card = document.createElement("div");
    card.className = "photo-card";
    card.style.animationDelay = `${i * 0.07}s`;
    card.dataset.id = photo.id;

    const categoryColors = {
      nature:   "var(--neon-green)",
      city:     "var(--neon-blue)",
      portrait: "var(--neon-pink)",
    };
    const catColor = categoryColors[photo.category] || "var(--neon-blue)";

    card.innerHTML = `
      <div class="card-thumb">
        <img src="${photo.url}" alt="${photo.name}" loading="lazy">
        <div class="card-overlay">
          <span class="card-badge">${photo.category}</span>
          <div class="card-actions">
            <button class="card-btn" data-action="view" data-id="${photo.id}">View</button>
            <button class="card-btn pink" data-action="copy" data-key="${photo.key}">Copy Key</button>
          </div>
        </div>
      </div>
      <div class="card-info">
        <div class="card-name">${photo.name}</div>
        <div class="card-meta">
          <span style="color:${catColor}">${photo.category}</span>
          <span>${photo.size} · ${photo.date}</span>
        </div>
        <div class="card-key">s3://${BUCKET_NAME}/${photo.key}</div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      const action = e.target.closest("[data-action]");
      if (!action) {
        openLightbox(photo.id);
        return;
      }
      if (action.dataset.action === "view") {
        e.stopPropagation();
        openLightbox(photo.id);
      }
      if (action.dataset.action === "copy") {
        e.stopPropagation();
        copyToClipboard(action.dataset.key);
      }
    });

    grid.appendChild(card);
  });

  updateStats();
}

// ── STATS ─────────────────────────────────────
function updateStats() {
  const total = state.filtered.length;
  const totalMB = state.filtered.reduce((acc, p) => acc + parseFloat(p.size), 0);

  el("statPhotos").textContent = total;
  el("statSize").textContent   = totalMB.toFixed(1) + " MB";
}

// ── FILTER & SORT ─────────────────────────────
function setFilter(cat, btn) {
  state.filter = cat;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGallery();
}

function setSort(val) {
  state.sort = val;
  renderGallery();
}

function setView(v, btn) {
  state.view = v;
  document.querySelectorAll(".view-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  renderGallery();
}

// ── LIGHTBOX ──────────────────────────────────
function openLightbox(id) {
  const photo = PHOTOS.find(p => p.id === id);
  if (!photo) return;
  state.lightbox = id;

  el("lbImg").src = photo.url;
  el("lbImg").alt = photo.name;

  el("lbPanel").innerHTML = `
    <div class="lb-title">${photo.name}</div>
    <div class="lb-field">
      <div class="lb-field-key">S3 Object Key</div>
      <div class="lb-field-val neon">${photo.key}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Public URL</div>
      <div class="lb-field-val neon" style="font-size:0.65rem">${s3PublicUrl(photo.key)}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Bucket</div>
      <div class="lb-field-val">${BUCKET_NAME}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Region</div>
      <div class="lb-field-val">${REGION}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">File Size</div>
      <div class="lb-field-val">${photo.size}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Upload Date</div>
      <div class="lb-field-val">${photo.date}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Category</div>
      <div class="lb-field-val green">${photo.category}</div>
    </div>
    <div class="lb-field">
      <div class="lb-field-key">Content-Type</div>
      <div class="lb-field-val">image/jpeg</div>
    </div>
  `;

  el("lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox(e) {
  if (e && e.target !== el("lightbox") && !e.target.closest(".lb-close-btn")) return;
  el("lightbox").classList.remove("open");
  document.body.style.overflow = "";
  state.lightbox = null;
}

function lightboxNav(dir) {
  if (!state.lightbox) return;
  const ids    = state.filtered.map(p => p.id);
  const idx    = ids.indexOf(state.lightbox);
  const newIdx = (idx + dir + ids.length) % ids.length;
  openLightbox(ids[newIdx]);
}

// ── CLIPBOARD ─────────────────────────────────
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(() => {});
  showToast("Key copied to clipboard!");
}

// ── TOAST ─────────────────────────────────────
function showToast(msg) {
  const toast = el("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── KEYBOARD SHORTCUTS ────────────────────────
document.addEventListener("keydown", (e) => {
  const lb = el("lightbox");
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape")      closeLightbox({ target: lb });
  if (e.key === "ArrowRight")  lightboxNav(1);
  if (e.key === "ArrowLeft")   lightboxNav(-1);
});

// ── INIT ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initCursor();
  renderGallery();

  // Lightbox backdrop click
  el("lightbox").addEventListener("click", closeLightbox);
});