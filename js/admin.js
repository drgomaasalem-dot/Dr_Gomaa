// ============================================================
// admin.js - لوحة إدارة المحتوى
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
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

const PASSWORD = "gomaa2026";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================================================
// هيكل الأقسام
// ============================================================
const SECTIONS = {
    // ===== الصفحة الرئيسية =====
    "home-pillars": [
        { value: "pillars", label: "محاور المعرفة", badgeText: "", badgeClass: "", buttonText: "تصفح القسم" }
    ],
    "home-fatwa": [
        { value: "fatwa", label: "بوابة الفتاوى", badgeText: "", badgeClass: "", buttonText: "قراءة الإجابة كاملة" }
    ],
    "home-videos": [
        { value: "videos", label: "البرامج والمرئيات", badgeText: "", badgeClass: "", buttonText: "شاهد" }
    ],
    "home-programs": [
        { value: "programs", label: "برامج المنصة", badgeText: "", badgeClass: "", buttonText: "استمع" }
    ],
    "home-verify": [
        { value: "verify", label: "تحقق", badgeText: "", badgeClass: "", buttonText: "قراءة التحقيق" }
    ],
    "home-library": [
        { value: "library", label: "المكتبة الرقمية", badgeText: "", badgeClass: "", buttonText: "تحميل مباشر" }
    ],

    // ===== باقي الصفحات =====
    library: [
        { value: "books", label: "الكتب", badgeText: "📖 كتاب", badgeClass: "book", buttonText: "تحميل" },
        { value: "summaries", label: "ملخصات الكتب", badgeText: "📋 ملخص", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "articles", label: "المقالات", badgeText: "📝 مقال", badgeClass: "article", buttonText: "اقرأ" },
        { value: "beneficial", label: "مختارات نافعة", badgeText: "⭐ مختارات", badgeClass: "beneficial", buttonText: "اقرأ" }
    ],
    faith: [
        { value: "quran", label: "القرآن الكريم", badgeText: "📖 قرآن", badgeClass: "book", buttonText: "اقرأ" },
        { value: "hadith", label: "الحديث الشريف", badgeText: "📜 حديث", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "aqeedah", label: "العقيدة", badgeText: "☪️ عقيدة", badgeClass: "article", buttonText: "اقرأ" },
        { value: "ethics", label: "الأخلاق", badgeText: "🤝 أخلاق", badgeClass: "beneficial", buttonText: "اقرأ" },
        { value: "tazkiyah", label: "تزكية النفس", badgeText: "🌱 تزكية", badgeClass: "article", buttonText: "اقرأ" },
        { value: "fiqh-life", label: "فقه الحياة", badgeText: "📋 فقه", badgeClass: "book", buttonText: "اقرأ" }
    ],
    science: [
        { value: "culture", label: "المعرفة والثقافة", badgeText: "📚 ثقافة", badgeClass: "article", buttonText: "اقرأ" },
        { value: "faith-science", label: "العلم والإيمان", badgeText: "🔬 إيمان", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "articles", label: "مقالات وبحوث", badgeText: "📝 مقالات", badgeClass: "article", buttonText: "اقرأ" },
        { value: "summaries", label: "ملخصات الكتب", badgeText: "📋 ملخصات", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "scholars", label: "أعلام وعلماء", badgeText: "🌟 أعلام", badgeClass: "beneficial", buttonText: "اقرأ" }
    ],
    life: [
        { value: "self", label: "تطوير الذات", badgeText: "🌱 تطوير", badgeClass: "book", buttonText: "اقرأ" },
        { value: "time", label: "إدارة الوقت", badgeText: "⏰ وقت", badgeClass: "article", buttonText: "اقرأ" },
        { value: "procrastination", label: "التغلب على التسويف", badgeText: "🎯 تسويف", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "habits", label: "بناء العادات", badgeText: "🔄 عادات", badgeClass: "article", buttonText: "اقرأ" },
        { value: "goals", label: "تحديد الأهداف", badgeText: "🎯 أهداف", badgeClass: "book", buttonText: "اقرأ" },
        { value: "confidence", label: "الثقة بالنفس", badgeText: "💪 ثقة", badgeClass: "beneficial", buttonText: "اقرأ" }
    ],
    pulpit: [
        { value: "written", label: "خطب مكتوبة", badgeText: "📝 مكتوبة", badgeClass: "book", buttonText: "اقرأ" },
        { value: "audio", label: "خطب صوتية", badgeText: "🎧 صوتية", badgeClass: "summary", buttonText: "استمع" },
        { value: "video", label: "خطب مرئية", badgeText: "🎬 مرئية", badgeClass: "article", buttonText: "شاهد" }
    ],
    qa: [
        { value: "religious", label: "أسئلة شرعية", badgeText: "📖 شرعية", badgeClass: "book", buttonText: "اقرأ" },
        { value: "life", label: "أسئلة حياتية", badgeText: "🌱 حياتية", badgeClass: "article", buttonText: "اقرأ" },
        { value: "audience", label: "أسئلة الجمهور", badgeText: "👥 الجمهور", badgeClass: "summary", buttonText: "اقرأ" }
    ],
    stories: [
        { value: "history", label: "قصص من التاريخ", badgeText: "📜 تاريخ", badgeClass: "book", buttonText: "اقرأ" },
        { value: "real", label: "قصص واقعية", badgeText: "📖 واقعي", badgeClass: "article", buttonText: "اقرأ" },
        { value: "prophets", label: "قصص الأنبياء والصالحين", badgeText: "🌟 أنبياء", badgeClass: "summary", buttonText: "اقرأ" },
        { value: "lessons", label: "العبرة المستفادة", badgeText: "💡 عبرة", badgeClass: "beneficial", buttonText: "اقرأ" }
    ],
    soul: [
        { value: "thoughts", label: "خواطر إيمانية", badgeText: "💭 خواطر", badgeClass: "book", buttonText: "اقرأ" },
        { value: "letters", label: "رسائل حياتية", badgeText: "✉️ رسائل", badgeClass: "article", buttonText: "اقرأ" },
        { value: "heart", label: "كلمات من القلب", badgeText: "❤️ كلمات", badgeClass: "summary", buttonText: "اقرأ" }
    ],
    videos: [
        { value: "episodes", label: "حلقات وبرامج", badgeText: "🎬 حلقات", badgeClass: "book", buttonText: "شاهد" },
        { value: "shorts", label: "مقاطع قصيرة", badgeText: "⚡ شورت", badgeClass: "article", buttonText: "شاهد" },
        { value: "interviews", label: "لقاءات", badgeText: "🎙️ لقاء", badgeClass: "summary", buttonText: "شاهد" },
        { value: "live", label: "بث مباشر", badgeText: "🔴 بث", badgeClass: "beneficial", buttonText: "شاهد" }
    ],
    audios: [
        { value: "lectures", label: "محاضرات", badgeText: "🎙️ محاضرة", badgeClass: "book", buttonText: "استمع" },
        { value: "lessons", label: "دروس", badgeText: "📖 درس", badgeClass: "article", buttonText: "استمع" },
        { value: "selected", label: "تسجيلات مختارة", badgeText: "⭐ مختار", badgeClass: "summary", buttonText: "استمع" }
    ],
    games: [
        { value: "cultural", label: "مسابقات ثقافية", badgeText: "🏆 ثقافية", badgeClass: "book", buttonText: "شاهد" },
        { value: "religious", label: "أسئلة دينية", badgeText: "☪️ دينية", badgeClass: "article", buttonText: "شاهد" },
        { value: "puzzle", label: "ألغاز هادفة", badgeText: "🧩 ألغاز", badgeClass: "summary", buttonText: "شاهد" }
    ],
    entertainment: [
        { value: "jokes", label: "طرائف", badgeText: "😄 طرائف", badgeClass: "book", buttonText: "اقرأ" },
        { value: "situations", label: "مواقف جميلة", badgeText: "💖 مواقف", badgeClass: "article", buttonText: "اقرأ" },
        { value: "smile", label: "ابتسامة وفائدة", badgeText: "😊 ابتسامة", badgeClass: "summary", buttonText: "اقرأ" }
    ]
};

// ============================================================
// حالة التطبيق
// ============================================================
let allContent = [];
let currentEditId = null;

// ============================================================
// تسجيل الدخول
// ============================================================
window.tryLogin = function () {
    const input = document.getElementById("passwordInput");
    const error = document.getElementById("loginError");

    if (input.value === PASSWORD) {
        sessionStorage.setItem("admin_logged", "true");
        showDashboard();
    } else {
        error.style.display = "block";
        input.value = "";
        input.focus();
        setTimeout(() => { error.style.display = "none"; }, 3000);
    }
};

document.getElementById("passwordInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") window.tryLogin();
});

window.logout = function () {
    sessionStorage.removeItem("admin_logged");
    location.reload();
};

function showDashboard() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("dashboardScreen").style.display = "block";
    loadContent();
}

if (sessionStorage.getItem("admin_logged") === "true") {
    showDashboard();
}

// ============================================================
// التبويبات
// ============================================================
window.switchTab = function (tab) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    if (tab === "add") {
        document.querySelectorAll(".tab-btn")[0].classList.add("active");
        document.getElementById("tab-add").classList.add("active");
    } else {
        document.querySelectorAll(".tab-btn")[1].classList.add("active");
        document.getElementById("tab-list").classList.add("active");
    }
};

// ============================================================
// القوائم المنسدلة
// ============================================================
const pageSelect = document.getElementById("fieldPage");
const sectionSelect = document.getElementById("fieldSection");

pageSelect.addEventListener("change", () => {
    const page = pageSelect.value;
    sectionSelect.innerHTML = "";

    if (!page || !SECTIONS[page]) {
        sectionSelect.disabled = true;
        sectionSelect.innerHTML = '<option value="">اختر الصفحة أولاً...</option>';
        return;
    }

    sectionSelect.disabled = false;
    sectionSelect.innerHTML = '<option value="">اختر القسم...</option>';

    SECTIONS[page].forEach(sec => {
        const opt = document.createElement("option");
        opt.value = sec.value;
        opt.textContent = sec.label;
        sectionSelect.appendChild(opt);
    });
});

// حفظ القيم تلقائي عند اختيار القسم
sectionSelect.addEventListener("change", () => {
    const page = pageSelect.value;
    const section = sectionSelect.value;
    if (!page || !section) return;

    const secData = SECTIONS[page]?.find(s => s.value === section);
    if (!secData || currentEditId) return;

    document.getElementById("fieldButtonText").value = secData.buttonText || "اقرأ";
});

// ============================================================
// إضافة / تعديل
// ============================================================
const form = document.getElementById("contentForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ جاري الحفظ...";

    const page = pageSelect.value;
    const section = sectionSelect.value;
    const title = document.getElementById("fieldTitle").value.trim();
    const description = document.getElementById("fieldDescription").value.trim();
    const url = document.getElementById("fieldUrl").value.trim();
    const meta = document.getElementById("fieldMeta").value.trim();
    const buttonText = document.getElementById("fieldButtonText").value.trim() || "اقرأ";

    // جلب badgeText و badgeClass من القسم
    const secData = SECTIONS[page]?.find(s => s.value === section) || {};
    const badgeText = secData.badgeText || "📌 عنصر";
    const badgeClass = secData.badgeClass || "article";

    const data = {
        page, section, title, description, url, meta, buttonText, badgeText, badgeClass
    };

    try {
        if (currentEditId) {
            await updateDoc(doc(db, "content", currentEditId), data);
            showToast("✅ تم تعديل المحتوى بنجاح", "success");
            cancelEdit();
        } else {
            await addDoc(collection(db, "content"), data);
            showToast("✅ تمت إضافة المحتوى بنجاح", "success");
            form.reset();
            document.getElementById("fieldButtonText").value = "اقرأ";
        }

        loadContent();

    } catch (err) {
        console.error("خطأ:", err);
        showToast("❌ حدث خطأ، حاول مرة أخرى", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = currentEditId ? "💾 حفظ التعديل" : "✅ إضافة المحتوى";
    }
});

// ============================================================
// تحميل المحتوى
// ============================================================
async function loadContent() {
    const list = document.getElementById("contentList");
    list.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      جاري التحميل...
    </div>`;

    try {
        const snap = await getDocs(collection(db, "content"));
        allContent = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        renderList();
    } catch (err) {
        console.error("خطأ في التحميل:", err);
        list.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>تعذّر تحميل المحتوى</p></div>`;
    }
}

window.renderList = function () {
    const list = document.getElementById("contentList");
    const filterPage = document.getElementById("filterPage").value;

    let filtered = allContent;
    if (filterPage) {
        filtered = allContent.filter(item => item.page === filterPage);
    }

    if (!filtered.length) {
        list.innerHTML = `
      <div class="empty-state">
        <div class="icon">📭</div>
        <p>${filterPage ? "لا يوجد محتوى في هذه الصفحة" : "لا يوجد محتوى بعد"}</p>
      </div>`;
        return;
    }

    list.innerHTML = filtered.map(item => {
        const pageName = getPageLabel(item.page);
        const sectionName = getSectionLabel(item.page, item.section);

        return `
      <div class="item-card">
        <div class="item-info">
          <div class="badges">
            <span class="badge">${pageName}</span>
            <span class="badge">${sectionName}</span>
          </div>
          <h3>${escapeHtml(item.title || "")}</h3>
          <p>${escapeHtml(item.description || "")}</p>
          <div class="item-url">${escapeHtml(item.url || "")}</div>
        </div>
        <div class="item-actions">
          <button class="btn-edit" onclick="editItem('${item.id}')">✏️ تعديل</button>
          <button class="btn-delete" onclick="deleteItem('${item.id}', '${escapeHtml(item.title || "")}')">🗑️ حذف</button>
        </div>
      </div>
    `;
    }).join("");
};

// ============================================================
// تعديل
// ============================================================
window.editItem = function (id) {
    const item = allContent.find(i => i.id === id);
    if (!item) return;

    currentEditId = id;

    document.getElementById("fieldPage").value = item.page || "";
    pageSelect.dispatchEvent(new Event("change"));

    setTimeout(() => {
        document.getElementById("fieldSection").value = item.section || "";
        document.getElementById("fieldTitle").value = item.title || "";
        document.getElementById("fieldDescription").value = item.description || "";
        document.getElementById("fieldUrl").value = item.url || "";
        document.getElementById("fieldMeta").value = item.meta || "";
        document.getElementById("fieldButtonText").value = item.buttonText || "اقرأ";
    }, 50);

    document.getElementById("formTitle").textContent = "✏️ تعديل محتوى";
    document.getElementById("submitBtn").textContent = "💾 حفظ التعديل";
    document.getElementById("cancelBtn").style.display = "block";

    switchTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.cancelEdit = function () {
    currentEditId = null;
    form.reset();
    document.getElementById("fieldButtonText").value = "اقرأ";
    document.getElementById("fieldSection").innerHTML = '<option value="">اختر الصفحة أولاً...</option>';
    document.getElementById("fieldSection").disabled = true;
    document.getElementById("formTitle").textContent = "➕ إضافة محتوى جديد";
    document.getElementById("submitBtn").textContent = "✅ إضافة المحتوى";
    document.getElementById("cancelBtn").style.display = "none";
};

// ============================================================
// حذف
// ============================================================
window.deleteItem = async function (id, title) {
    if (!confirm(`هل أنت متأكد من حذف:\n"${title}" ؟`)) return;

    try {
        await deleteDoc(doc(db, "content", id));
        showToast("✅ تم حذف المحتوى", "success");
        loadContent();
    } catch (err) {
        console.error("خطأ في الحذف:", err);
        showToast("❌ فشل الحذف", "error");
    }
};

// ============================================================
// مساعدات
// ============================================================
function getPageLabel(page) {
    const map = {
        "home-library": "المكتبة الرقمية (الرئيسية)",
        library: "مكتبة المعرفة",
        faith: "الإيمان",
        science: "العلم",
        life: "الحياة",
        pulpit: "منبر الجمعة",
        qa: "سؤال وجواب",
        stories: "قصص ودروس وعبر",
        soul: "حديث الروح",
        videos: "مرئيات المنصة",
        audios: "صوتيات",
        games: "مسابقات وألغاز",
        entertainment: "ترفيه هادف"
    };
    return map[page] || page;
}

function getSectionLabel(page, section) {
    if (!SECTIONS[page]) return section;
    const sec = SECTIONS[page].find(s => s.value === section);
    return sec ? sec.label : section;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showToast(msg, type = "") {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.className = "toast show " + type;
    setTimeout(() => { toast.className = "toast"; }, 3000);
}