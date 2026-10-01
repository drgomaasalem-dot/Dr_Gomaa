// ============================================================
// firebase-content.js - Universal Auto Loader + Cleaner + Ticker
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBEUlp5MZW9imycaFHce9jb3wiKSbvcu3U",
  authDomain: "drgomaa-903b3.firebaseapp.com",
  projectId: "drgomaa-903b3",
  storageBucket: "drgomaa-903b3.firebasestorage.app",
  messagingSenderId: "792008022548",
  appId: "1:792008022548:web:826701ea589f07be38e501"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// اكتشاف اسم الصفحة
// ============================================================
function detectPageName() {
  const path = window.location.pathname;
  const file = path.split("/").pop().replace(".html", "");
  return file || "index";
}

// ============================================================
// استخراج YouTube ID
// ============================================================
function extractYouTubeId(raw) {
  if (!raw) return null;
  raw = raw.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/
  ];
  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1];
  }
  return null;
}

// ============================================================
// الأقسام في الصفحة الرئيسية
// ============================================================
const HOME_PAGE_MAP = {
  "pillars": "home-pillars",
  "fatwa": "home-fatwa",
  "videos": "home-videos",
  "programs": "home-programs",
  "verify": "home-verify",
  "library": "home-library"
};

// ============================================================
// القوالب
// ============================================================

// 1. library-card (وأيضاً science-card, faith-card, life-card, pulpit-card, qa-card, stories-card, soul-card, games-card, entertainment-card, issues-card)
function tplLibrary(item) {
  const CARD_CLASS = {
    library: "library-card",
    science: "science-card",
    faith: "faith-card",
    life: "self-card",
    pulpit: "pulpit-card",
    qa: "qa-card",
    stories: "stories-card",
    soul: "soul-card",
    games: "games-card",
    entertainment: "entertainment-card",
    issues: "issues-card",
    audios: "video-card"
  };
  const page = detectPageName();
  const cls = CARD_CLASS[page] || "library-card";

  return `
    <article class="${cls}">
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7">
          <path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      </span>
      <span class="type-badge ${item.badgeClass || 'book'}">${item.badgeText || '📌'}</span>
      <h3>${item.title || ""}</h3>
      <p>${item.description || ""}</p>
      <div class="meta">
        <span class="info">${item.meta || ""}</span>
        <a class="link" href="${item.url || '#'}" target="_blank" rel="noopener">
          ${item.buttonText || "اقرأ"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </a>
      </div>
    </article>
  `;
}

// 2. book-card
function tplBook(item) {
  const bt = item.buttonText || "تحميل مباشر";
  const isDl = bt.includes("تحميل");
  const icon = isDl
    ? '<path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />'
    : '<path d="M15 6l-6 6 6 6" />';
  return `
    <article class="book-card">
      <span class="book-cover">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
          <path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
        </svg>
      </span>
      <div class="book-meta">
        <h4>${item.title || ""}</h4>
        <p>${item.meta || ""}</p>
        <a href="${item.url || '#'}" target="_blank" rel="noopener">
          ${bt}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">${icon}</svg>
        </a>
      </div>
    </article>
  `;
}

// 3. pillar-card
function tplPillar(item) {
  const icon = item.icon || '<path d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z" />';
  return `
    <article class="pillar-card">
      <span class="pillar-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7">${icon}</svg>
      </span>
      <h3>${item.title || ""}</h3>
      <p>${item.description || ""}</p>
      <div class="pillar-meta">
        <span class="count">${item.meta || ""}</span>
        <a class="browse" href="${item.url || '#'}">
          ${item.buttonText || "تصفح القسم"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </a>
      </div>
    </article>
  `;
}

// 4. fatwa-item
function tplFatwa(item) {
  return `
    <article class="fatwa-item">
      <div class="badge-row">
        <span class="cat">${item.meta || item.badgeText || "سؤال"}</span>
        <time>${item.badgeText || ""}</time>
      </div>
      <h4>${item.title || ""}</h4>
      <p>${item.description || ""}</p>
      <a class="read-more" href="${item.url || '#'}" target="_blank" rel="noopener">
        ${item.buttonText || "قراءة الإجابة كاملة"}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </a>
    </article>
  `;
}

// 5. video-card (مع iframe)
function tplVideo(item) {
  const videoId = extractYouTubeId(item.url);
  const iframe = videoId
    ? `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?rel=0"
              title="${(item.title || '').replace(/"/g, '&quot;')}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen loading="lazy" frameborder="0"
              style="position:absolute;inset:0;width:100%;height:100%;border:0;z-index:3"></iframe>`
    : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#d4af37;background:#0f172a;z-index:3">
         <span style="font-size:.9rem">⚠️ رابط الفيديو غير صحيح</span>
       </div>`;

  return `
    <article class="video-card">
      <div class="video-thumb">
        <span class="video-series">${item.badgeText || ""}</span>
        <span class="video-duration">${item.meta || ""}</span>
        ${iframe}
      </div>
      <div class="video-info">
        <h4>${item.title || ""}</h4>
        <p>${item.description || ""}</p>
      </div>
    </article>
  `;
}

// 6. sheikh-card (صفحة الشيخ)
function tplSheikh(item) {
  return `
    <div class="sheikh-card">
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7">
          <path d="M12 2C9 6 6 9 6 13a6 6 0 0012 0c0-4-3-7-6-11z" />
        </svg>
      </span>
      <h3>${item.title || ""}</h3>
      <p>${item.description || ""}</p>
      <div class="meta">
        <span class="count">${item.meta || ""}</span>
        <a class="link" href="${item.url || '#'}" target="_blank" rel="noopener">
          ${item.buttonText || "اقرأ المزيد"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </a>
      </div>
    </div>
  `;
}

// 7. gallery-item (صور وذكريات)
function tplGallery(item) {
  return `
    <div class="gallery-item">
      <img src="${item.url || ''}" alt="${(item.title || '').replace(/"/g, '&quot;')}" loading="lazy" onerror="this.style.display='none'">
      ${item.title ? `<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(15,23,42,.85));color:#f0e2bd;padding:12px;font-size:.85rem;text-align:center">${item.title}</div>` : ''}
    </div>
  `;
}

// 8. ticker-item
function tplTickerItem(item) {
  return `<span><time>${item.meta || ""}</time> ${item.title || ""}</span>`;
}

// ============================================================
// ربط اسم القسم بالقالب
// ============================================================
const SECTION_TEMPLATES = {
  // library-card
  "books": tplLibrary, "summaries": tplLibrary, "articles": tplLibrary,
  "beneficial": tplLibrary, "quran": tplLibrary, "hadith": tplLibrary,
  "aqeedah": tplLibrary, "ethics": tplLibrary, "tazkiyah": tplLibrary,
  "fiqh-life": tplLibrary, "culture": tplLibrary, "faith-science": tplLibrary,
  "scholars": tplLibrary, "self": tplLibrary, "time": tplLibrary,
  "procrastination": tplLibrary, "habits": tplLibrary, "goals": tplLibrary,
  "confidence": tplLibrary, "written": tplLibrary,
  "religious": tplLibrary, "life": tplLibrary, "audience": tplLibrary,
  "history": tplLibrary, "real": tplLibrary, "prophets": tplLibrary,
  "lessons": tplLibrary, "thoughts": tplLibrary, "letters": tplLibrary,
  "heart": tplLibrary, "cultural": tplLibrary, "puzzle": tplLibrary,
  "jokes": tplLibrary, "situations": tplLibrary, "smile": tplLibrary,

  // ===== قضايا معاصرة (issues.html) - جديد =====
  "intellectual": tplLibrary,
  "social": tplLibrary,
  "educational": tplLibrary,
  "youth": tplLibrary,

  // book-card
  "home-library": tplBook, "library": tplBook,

  // pillar-card
  "pillars": tplPillar, "programs": tplPillar,
  "home-pillars": tplPillar, "home-programs": tplPillar,

  // fatwa-item
  "fatwa": tplFatwa, "verify": tplFatwa,
  "home-fatwa": tplFatwa, "home-verify": tplFatwa,

  // video-card
  "episodes": tplVideo, "shorts": tplVideo, "interviews": tplVideo, "live": tplVideo,
  "videos": tplVideo, "home-videos": tplVideo,
  "lectures": tplVideo, "lessons": tplVideo, "selected": tplVideo,
  "audio": tplVideo, "video": tplVideo,

  // sheikh-card
  "sheikh-about": tplSheikh,
  "sheikh-bio": tplSheikh,
  "sheikh-message": tplSheikh,
  "sheikh-books": tplSheikh,
  "sheikh-lectures": tplSheikh,

  // gallery
  "gallery": tplGallery
};

// ============================================================
// خريطة أقسام صفحة الشيخ
// ============================================================
const SHEIKH_SECTION_MAP = {
  "about": "sheikh-about",
  "bio": "sheikh-bio",
  "message": "sheikh-message",
  "books": "sheikh-books",
  "lectures": "sheikh-lectures",
  "gallery": "gallery"
};

// ============================================================
// خريطة أقسام صفحة قضايا معاصرة (issues.html) - جديد
// ============================================================
const ISSUES_SECTION_MAP = {
  "intellectual": "intellectual",
  "social": "social",
  "educational": "educational",
  "youth": "youth"
};

// ============================================================
// الأقسام اللي بنستخدم فيها الـ grid الصحيح
// ============================================================
const GRID_CLASSES = {
  "issues": "issues-grid",
  "audios": "video-grid",
  "videos": "video-grid",
  "library": "library-grid",
  "science": "science-grid",
  "faith": "faith-grid",
  "life": "self-grid",
  "pulpit": "pulpit-grid",
  "qa": "qa-grid",
  "stories": "stories-grid",
  "soul": "soul-grid",
  "games": "games-grid",
  "entertainment": "entertainment-grid",
  "sheikh": "sheikh-grid"
};

// ============================================================
// مسح الكروت الثابتة (مع استثناء بعض الأقسام)
// ============================================================
const SKIP_SECTIONS = [];

function cleanContainer(sectionEl) {
  const sectionId = sectionEl.getAttribute("id");

  if (SKIP_SECTIONS.includes(sectionId)) return null;

  // نبحث عن أي حاوية grid أو fatwa-list
  let container =
    sectionEl.querySelector('[class*="-grid"]') ||
    sectionEl.querySelector('.fatwa-list');

  if (!container) {
    // لو مفيش grid، نبحث عن الحاوية اللي فيها id مناسب
    // مثال: <div class="issues-grid" id="issuesIntellectual">
    // أو نستخدم أول div داخل section
    const firstDiv = sectionEl.querySelector('.container > div');
    if (firstDiv && !firstDiv.classList.contains('section-head')) {
      container = firstDiv;
    }
  }

  if (!container) return null;
  container.innerHTML = "";
  return container;
}

// ============================================================
// تحميل قسم
// ============================================================
async function loadSection(pageName, sectionName, container, tpl) {
  try {
    const q = query(
      collection(db, "content"),
      where("page", "==", pageName),
      where("section", "==", sectionName)
    );
    const snap = await getDocs(q);

    if (snap.empty) {
      container.innerHTML = `
        <p style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:30px">
          لا يوجد محتوى في هذا القسم بعد.
        </p>`;
      return;
    }

    const items = snap.docs.map(d => d.data());
    container.innerHTML = items.map(tpl).join("");

  } catch (err) {
    console.error(`خطأ في ${pageName}/${sectionName}:`, err);
    container.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:#dc3545;padding:30px">
        تعذّر تحميل المحتوى.
      </p>`;
  }
}

// ============================================================
// تحميل الشريط الإخباري
// ============================================================
async function loadTicker() {
  const tickerTrack = document.getElementById("tickerTrack");
  if (!tickerTrack) return;

  try {
    const q = query(
      collection(db, "content"),
      where("page", "==", "ticker"),
      where("section", "==", "items")
    );
    const snap = await getDocs(q);
    if (snap.empty) return;

    const items = snap.docs.map(d => d.data());
    const html = items.map(tplTickerItem).join("");
    tickerTrack.innerHTML = html + html;

  } catch (err) {
    console.error("خطأ في تحميل الشريط:", err);
  }
}

// ============================================================
// التشغيل التلقائي
// ============================================================
async function autoInit() {
  // 1. الشريط الإخباري
  await loadTicker();

  // 2. محتوى الأقسام
  const pageName = detectPageName();
  const isHome = pageName === "index" || pageName === "";
  const isSheikh = pageName === "sheikh";
  const isIssues = pageName === "issues";

  const sections = document.querySelectorAll("section[id]");
  for (const sectionEl of sections) {
    const sectionId = sectionEl.getAttribute("id");
    const container = cleanContainer(sectionEl);
    if (!container) continue;

    let fbPage = pageName;
    let fbSection = sectionId;

    // صفحة الشيخ — تحويل id
    if (isSheikh && SHEIKH_SECTION_MAP[sectionId]) {
      fbSection = SHEIKH_SECTION_MAP[sectionId];
    }

    // صفحة قضايا معاصرة — تحويل id
    if (isIssues && ISSUES_SECTION_MAP[sectionId]) {
      fbSection = ISSUES_SECTION_MAP[sectionId];
    }

    // الصفحة الرئيسية
    if (isHome && HOME_PAGE_MAP[sectionId]) {
      fbPage = HOME_PAGE_MAP[sectionId];
    }

    let tpl = SECTION_TEMPLATES[fbSection] ||
      SECTION_TEMPLATES[sectionId] ||
      tplLibrary;
    await loadSection(fbPage, fbSection, container, tpl);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", autoInit);
} else {
  autoInit();
}