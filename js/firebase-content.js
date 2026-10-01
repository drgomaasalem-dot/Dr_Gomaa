// ============================================================
// firebase-content.js - Universal Auto Loader
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
// الأقسام اللي في الصفحة الرئيسية (لها أسماء خاصة)
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

// 1. library-card (المكتبة العادية)
function tplLibrary(item) {
    return `
    <article class="library-card">
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

// 2. book-card (المكتبة الرقمية في الرئيسية)
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

// 3. pillar-card (محاور المعرفة + برامج المنصة)
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

// 4. fatwa-item (الفتاوى + تحقق)
function tplFatwa(item) {
    const cat = item.meta || item.badgeText || "سؤال";
    return `
    <article class="fatwa-item">
      <div class="badge-row">
        <span class="cat">${cat}</span>
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

// 5. video-card (المرئيات)
function tplVideo(item) {
    return `
    <article class="video-card" data-youtube="${item.url || ''}">
      <div class="video-thumb">
        <span class="video-series">${item.badgeText || ""}</span>
        <span class="video-duration">${item.meta || ""}</span>
      </div>
      <div class="video-info">
        <h4>${item.title || ""}</h4>
        <p>${item.description || ""}</p>
      </div>
    </article>
  `;
}

// ============================================================
// ربط القسم بالقالب المناسب
// ============================================================
const SECTION_TEMPLATES = {
    // library-card
    "books": tplLibrary,
    "summaries": tplLibrary,
    "articles": tplLibrary,
    "beneficial": tplLibrary,
    // library.html عادي
    "library": tplLibrary,

    // book-card (الصفحة الرئيسية)
    "home-library": tplBook,

    // pillar-card
    "pillars": tplPillar,
    "programs": tplPillar,
    "home-pillars": tplPillar,
    "home-programs": tplPillar,

    // fatwa-item
    "fatwa": tplFatwa,
    "verify": tplFatwa,
    "home-fatwa": tplFatwa,
    "home-verify": tplFatwa,
    "religious": tplFatwa,
    "life-qa": tplFatwa,
    "audience": tplFatwa,

    // video-card
    "videos": tplVideo,
    "home-videos": tplVideo
};

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

// ============================================================
// تنظيف الكروت الثابتة قبل تحميل المحتوى الجديد
// ============================================================
function clearStaticCards(sectionEl) {
    // حدد الحاوية
    const container =
        sectionEl.querySelector(".library-grid") ||
        sectionEl.querySelector(".pillars-grid") ||
        sectionEl.querySelector(".fatwa-list") ||
        sectionEl.querySelector(".video-grid");

    if (!container) return null;

    // امسح كل الكروت الثابتة
    container.innerHTML = "";

    return container;
}









// التشغيل التلقائي
// ============================================================
async function autoInit() {
    const pageName = detectPageName();
    const isHome = pageName === "index" || pageName === "";

    // ابحث في كل sections اللي فيها حاويات كروت
    const sections = document.querySelectorAll("section[id]");

    for (const sectionEl of sections) {
        const sectionId = sectionEl.getAttribute("id");

        // حدد الحاوية
        const container = clearStaticCards(sectionEl);
        if (!container) continue;

        // حدد اسم الصفحة في Firebase
        let fbPage = pageName;
        let fbSection = sectionId;

        if (isHome && HOME_PAGE_MAP[sectionId]) {
            fbPage = HOME_PAGE_MAP[sectionId];
            fbSection = sectionId;
        }

        // حدد القالب
        let tpl = SECTION_TEMPLATES[fbSection] || SECTION_TEMPLATES[sectionId];

        // لو مفيش قالب محدد، استخدم library-card كافتراضي
        if (!tpl) tpl = tplLibrary;

        // جيب المحتوى
        await loadSection(fbPage, fbSection, container, tpl);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
} else {
    autoInit();
}