// ============================================================
// firebase-content.js
// ربط تلقائي كامل - بدون أي تعديل في HTML
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ============================================================
// إعدادات Firebase
// ============================================================
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
// اكتشاف اسم الصفحة الحالية تلقائيًا
// ============================================================
function detectPageName() {
    const path = window.location.pathname;
    const file = path.split("/").pop().replace(".html", "");
    return file || "index";
}

// ============================================================
// قالب الكارت (نفس تصميمك الأصلي)
// ============================================================
function cardTemplate(item) {
    return `
    <article class="library-card">
      <span class="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.7">
          <path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
          <path d="M8 8h8M8 12h8M8 16h5" />
        </svg>
      </span>
      <span class="type-badge ${item.badgeClass || 'book'}">${item.badgeText || '📌 عنصر'}</span>
      <h3>${item.title || ""}</h3>
      <p>${item.description || ""}</p>
      <div class="meta">
        <span class="info">${item.meta || ""}</span>
        <a class="link" href="${item.url || "#"}" target="_blank" rel="noopener">
          ${item.buttonText || "اقرأ"}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </a>
      </div>
    </article>
  `;
}

// ============================================================
// تحميل محتوى قسم واحد
// ============================================================
async function loadSection(pageName, sectionName, container) {
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
        container.innerHTML = items.map(cardTemplate).join("");

    } catch (err) {
        console.error(`خطأ في تحميل ${pageName}/${sectionName}:`, err);
        container.innerHTML = `
      <p style="grid-column:1/-1;text-align:center;color:#dc3545;padding:30px">
        تعذّر تحميل المحتوى.
      </p>`;
    }
}

// ============================================================
// التشغيل التلقائي
// الكود بيدور على كل <section id="..."> فيها <div class="library-grid">
// ويستخدم الـ id كـ "اسم القسم"
// ============================================================
async function autoInit() {
    const pageName = detectPageName();

    // ابحث على كل الأقسام اللي فيها library-grid
    const sections = document.querySelectorAll("section[id] .library-grid");

    if (!sections.length) return;

    console.log(`🔍 الصفحة: ${pageName} — عدد الأقسام: ${sections.length}`);

    for (const grid of sections) {
        const sectionEl = grid.closest("section[id]");
        const sectionName = sectionEl.getAttribute("id");

        await loadSection(pageName, sectionName, grid);
    }
}

// ============================================================
// التشغيل عند تحميل الصفحة
// ============================================================
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
} else {
    autoInit();
}