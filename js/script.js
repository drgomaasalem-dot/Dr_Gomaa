/**
 * script.js - العلم والإيمان والحياة
 * جميع وظائف الموقع المركزة في ملف واحد
 */

(function () {
    'use strict';

    // ============================
    // 1. HEADER SCROLL SHADOW
    // ============================
    var header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', function () {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        });
    }

    // ============================
    // 2. MOBILE DRAWER
    // ============================
    var burger = document.getElementById('burgerBtn');
    var drawer = document.getElementById('mobileDrawer');
    var overlay = document.getElementById('drawerOverlay');
    var closeBtn = document.getElementById('drawerClose');

    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
        if (burger) burger.classList.add('is-active');
        if (burger) burger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        if (overlay) overlay.classList.remove('is-open');
        if (burger) burger.classList.remove('is-active');
        if (burger) burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (burger) {
        burger.addEventListener('click', function () {
            drawer && drawer.classList.contains('is-open') ? closeDrawer() : openDrawer();
        });
    }
    if (overlay) overlay.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    // Close drawer on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
            closeDrawer();
        }
    });

    // ============================
    // 3. MEGA MENU (click toggle)
    // ============================
    var navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(function (item) {
        var link = item.querySelector('.nav-link');
        if (!link || !item.querySelector('.mega-menu')) return;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var isOpen = item.classList.contains('is-open');
            navItems.forEach(function (i) { i.classList.remove('is-open'); });
            if (!isOpen) { item.classList.add('is-open'); }
        });
    });
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item')) {
            navItems.forEach(function (i) { i.classList.remove('is-open'); });
        }
    });

    // ============================
    // 4. DAILY CARD TABS
    // ============================
    var tabButtons = document.querySelectorAll('.daily-tabs button');
    var panels = document.querySelectorAll('.daily-panel');
    tabButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            tabButtons.forEach(function (b) { b.classList.remove('is-active'); });
            panels.forEach(function (p) { p.classList.remove('is-active'); });
            btn.classList.add('is-active');
            var target = btn.getAttribute('data-tab');
            var targetPanel = document.querySelector('.daily-panel[data-panel="' + target + '"]');
            if (targetPanel) targetPanel.classList.add('is-active');
        });
    });

    // ============================
    // 5. WHATSAPP INTEGRATION
    // ============================
    var WHATSAPP_NUMBER = '201017712000';

    function openWhatsApp(message) {
        var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // --- Ask the Sheikh form ---
    var askForm = document.getElementById('askSheikhForm');
    if (askForm) {
        askForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('askName');
            var category = document.getElementById('askCategory');
            var question = document.getElementById('askQuestion');

            if (!name || !category || !question) return;

            var nameVal = name.value.trim();
            var categoryVal = category.value.trim();
            var questionVal = question.value.trim();

            if (!nameVal || !categoryVal || !questionVal) {
                askForm.reportValidity();
                return;
            }

            var message =
                '🌙 *سؤال جديد من منصة العلم والإيمان والحياة*\n\n' +
                '👤 *الاسم:* ' + nameVal + '\n' +
                '📂 *التصنيف:* ' + categoryVal + '\n' +
                '❓ *نص السؤال:*\n' + questionVal + '\n\n' +
                '_تم الإرسال عبر بوابة "اسأل الشيخ"_';

            openWhatsApp(message);
            askForm.reset();
        });
    }

    // --- Newsletter / Contact form ---
    var newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = document.getElementById('nlName');
            var email = document.getElementById('nlEmail');

            if (!name || !email) return;

            var nameVal = name.value.trim();
            var emailVal = email.value.trim();

            if (!nameVal || !emailVal) {
                newsletterForm.reportValidity();
                return;
            }

            var message =
                '✉️ *طلب اشتراك في النشرة البريدية*\n\n' +
                '👤 *الاسم:* ' + nameVal + '\n' +
                '📧 *البريد الإلكتروني:* ' + emailVal + '\n\n' +
                '_يرجى إضافتي إلى قائمة النشرة البريدية لمنصة العلم والإيمان والحياة._';

            openWhatsApp(message);
            newsletterForm.reset();
        });
    }

    // ============================
    // 6. YOUTUBE VIDEO EMBED
    // ============================
    var videoGrid = document.querySelector('.video-grid');
    if (videoGrid) {
        function extractYouTubeId(raw) {
            if (!raw) return null;
            raw = raw.trim();
            var match = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            if (match) return match[1];
            if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
            return null;
        }

        videoGrid.querySelectorAll('.video-card[data-youtube]').forEach(function (card) {
            var id = extractYouTubeId(card.getAttribute('data-youtube'));
            var thumb = card.querySelector('.video-thumb');
            if (!thumb || !id) return;

            var titleEl = card.querySelector('.video-info h4');

            var iframe = document.createElement('iframe');
            iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0';
            iframe.title = titleEl ? titleEl.textContent : 'فيديو يوتيوب';
            iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
            iframe.setAttribute('allowfullscreen', '');
            iframe.setAttribute('frameborder', '0');
            iframe.loading = 'lazy';

            thumb.appendChild(iframe);
            thumb.classList.add('is-playing');
        });
    }

    // ============================
    // 7. FATWA MODE FILTER
    // ============================
    var modeButtons = document.querySelectorAll('.fatwa-mode');
    var fatwaItems = document.querySelectorAll('.fatwa-item');
    if (modeButtons.length && fatwaItems.length) {
        modeButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                modeButtons.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                var filter = btn.getAttribute('data-filter');
                fatwaItems.forEach(function (item) {
                    var cat = item.getAttribute('data-cat');
                    item.style.display = (cat === filter || !filter) ? '' : 'none';
                });
            });
        });

        // Activate first filter by default
        var firstActive = document.querySelector('.fatwa-mode.is-active');
        if (firstActive) {
            firstActive.click();
        }
    }

    // ============================
    // 8. IN-PAGE SEARCH
    // ============================
    function clearSearchHighlights() {
        document.querySelectorAll('.search-highlight').forEach(function (mark) {
            var parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }

    function showNoResultsToast(query) {
        var existing = document.querySelector('.search-no-results');
        if (existing) existing.remove();
        var toast = document.createElement('div');
        toast.className = 'search-no-results';
        toast.textContent = 'لا توجد نتائج لـ "' + query + '"';
        document.body.appendChild(toast);
        setTimeout(function () { toast.remove(); }, 2500);
    }

    function runPageSearch(rawQuery) {
        var query = (rawQuery || '').trim();
        clearSearchHighlights();
        if (!query || query.length < 2) return;

        var lowerQuery = query.toLowerCase();
        var main = document.querySelector('main');
        if (!main) return;

        var walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                var tag = node.parentElement ? node.parentElement.tagName : '';
                if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'INPUT' || tag === 'TEXTAREA') {
                    return NodeFilter.FILTER_REJECT;
                }
                return node.nodeValue.toLowerCase().indexOf(lowerQuery) !== -1 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
            }
        });

        var firstMatchEl = null;
        var node;
        while ((node = walker.nextNode())) {
            var text = node.nodeValue;
            var lowerText = text.toLowerCase();
            var idx = lowerText.indexOf(lowerQuery);
            if (idx === -1) continue;

            var frag = document.createDocumentFragment();
            var cursor = 0;
            while (idx !== -1) {
                frag.appendChild(document.createTextNode(text.slice(cursor, idx)));
                var mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.textContent = text.slice(idx, idx + query.length);
                frag.appendChild(mark);
                cursor = idx + query.length;
                idx = lowerText.indexOf(lowerQuery, cursor);
            }
            frag.appendChild(document.createTextNode(text.slice(cursor)));

            var parent = node.parentNode;
            parent.replaceChild(frag, node);

            if (!firstMatchEl) {
                firstMatchEl = parent.closest('section, article, .fatwa-item, .pillar-card, .book-card, .video-card') || parent;
            }
        }

        if (firstMatchEl) {
            firstMatchEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstMatchEl.classList.add('search-target-flash');
            setTimeout(function () { firstMatchEl && firstMatchEl.classList.remove('search-target-flash'); }, 1800);
        } else {
            showNoResultsToast(query);
        }
    }

    var heroSearchForm = document.getElementById('heroSearchForm');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var input = document.getElementById('heroSearch');
            if (input) runPageSearch(input.value);
        });
    }

})();

/*****************************************************************************/

// ===== تنسيق التوب بار: إظهار عن الشيخ وتواصل معنا في الموبايل =====
(function () {
    // تعديل روابط التوب بار
    var topbarLinks = document.querySelector('.topbar-links');
    if (topbarLinks) {
        // التأكد من وجود الروابط المطلوبة
        var links = topbarLinks.querySelectorAll('a');
        var hasAbout = false;
        var hasContact = false;
        var hasNewsletter = false;

        links.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === 'about-sheikh.html') hasAbout = true;
            if (href === 'contact.html') hasContact = true;
            if (href === '#newsletter') hasNewsletter = true;
        });

        // إضافة رابط "عن الشيخ والمنصة" إذا لم يكن موجوداً
        if (!hasAbout) {
            var aboutLink = document.createElement('a');
            aboutLink.href = 'about-sheikh.html';
            aboutLink.textContent = 'عن الشيخ';
            topbarLinks.insertBefore(aboutLink, topbarLinks.firstChild);
        }

        // إضافة رابط "تواصل معنا" إذا لم يكن موجوداً
        if (!hasContact) {
            var contactLink = document.createElement('a');
            contactLink.href = 'contact.html';
            contactLink.textContent = 'تواصل معنا';
            topbarLinks.appendChild(contactLink);
        }

        // إضافة class خاص لروابط التوب بار لتسهيل التنسيق
        topbarLinks.querySelectorAll('a').forEach(function (link) {
            link.classList.add('topbar-link-item');
        });
    }

    // إضافة class للتاريخ لتنسيقه بشكل أفضل
    var topbarDates = document.querySelector('.topbar-dates');
    if (topbarDates) {
        topbarDates.classList.add('topbar-dates-flex');
    }
})();

/**********************************************************************/
(function () {
    // أسماء الأشهر الميلادية
    var gregorianMonths = [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];

    // أسماء الأشهر الهجرية
    var hijriMonths = [
        'محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر',
        'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
        'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ];

    // أسماء أيام الأسبوع
    var weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

    // دالة لتحويل الأرقام الإنجليزية إلى عربية
    function toArabicNumber(num) {
        var arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().replace(/[0-9]/g, function (match) {
            return arabicNumbers[parseInt(match)];
        });
    }

    // دالة لجلب التاريخ الهجري من API (دقة 100%)
    function getHijriDateFromAPI(callback) {
        var now = new Date();
        var year = now.getFullYear();
        var month = String(now.getMonth() + 1).padStart(2, '0');
        var day = String(now.getDate()).padStart(2, '0');

        fetch('https://api.aladhan.com/v1/gToH/' + day + '-' + month + '-' + year)
            .then(function (response) { return response.json(); })
            .then(function (data) {
                if (data && data.data && data.data.hijri) {
                    var hijri = data.data.hijri;
                    var hijriDay = parseInt(hijri.day) || 1;
                    var hijriMonth = hijri.month.number - 1 || 0;
                    var hijriYear = parseInt(hijri.year) || 1446;

                    var hijriDayFormatted = toArabicNumber(hijriDay);
                    var hijriYearFormatted = toArabicNumber(hijriYear);
                    var hijriMonthName = hijriMonths[hijriMonth] || 'محرم';

                    var hijriFormatted = hijriDayFormatted + ' ' + hijriMonthName + ' ' + hijriYearFormatted + 'هـ';
                    callback(hijriFormatted);
                } else {
                    callback(getLocalHijriDate());
                }
            })
            .catch(function () {
                callback(getLocalHijriDate());
            });
    }

    // دالة احتياطية (لو API وقع)
    function getLocalHijriDate() {
        var now = new Date();
        var hijriFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });
        var hijriString = hijriFormatter.format(now);
        var englishHijri = hijriString.replace(/[٠-٩]/g, function (match) {
            var arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            var englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            return englishNumbers[arabicNumbers.indexOf(match)];
        });
        var parts = englishHijri.split('/');
        var hijriDay = parseInt(parts[0]) || 1;
        var hijriMonth = parseInt(parts[1]) - 1 || 0;
        var hijriYear = parseInt(parts[2]) || 1446;
        if (hijriMonth < 0 || hijriMonth > 11) hijriMonth = 0;

        var hijriDayFormatted = toArabicNumber(hijriDay);
        var hijriYearFormatted = toArabicNumber(hijriYear);
        var hijriMonthName = hijriMonths[hijriMonth] || 'محرم';

        return hijriDayFormatted + ' ' + hijriMonthName + ' ' + hijriYearFormatted + 'هـ';
    }

    // دالة الحصول على التاريخ الميلادي
    function getGregorianDate() {
        var now = new Date();
        var day = now.getDate();
        var month = gregorianMonths[now.getMonth()];
        var year = now.getFullYear();
        var weekDay = weekDays[now.getDay()];
        return weekDay + ' ' + toArabicNumber(day) + ' ' + month + ' ' + toArabicNumber(year);
    }

    // دالة تحديث التوب بار
    function updateTopbarDates() {
        var topbar = document.querySelector('.topbar');
        if (!topbar) return;

        var allSpans = topbar.querySelectorAll('.topbar-dates span');

        if (allSpans.length >= 2) {
            var gregorianSpan = allSpans[1];
            gregorianSpan.textContent = getGregorianDate();

            var hijriSpan = allSpans[0];
            getHijriDateFromAPI(function (hijriDate) {
                var hijriIcon = hijriSpan.querySelector('svg');
                if (hijriIcon) {
                    hijriSpan.innerHTML = '';
                    hijriSpan.appendChild(hijriIcon);
                    hijriSpan.appendChild(document.createTextNode(' ' + hijriDate));
                } else {
                    hijriSpan.innerHTML = `
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                        </svg>
                        ${hijriDate}
                    `;
                }
            });
        } else {
            var container = topbar.querySelector('.topbar-dates');
            if (container) {
                container.innerHTML = `
                    <span>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <rect x="3" y="5" width="18" height="16" rx="2" />
                            <path d="M16 3v4M8 3v4M3 10h18" />
                        </svg>
                        جاري التحميل...
                    </span>
                    <span>${getGregorianDate()}</span>
                `;
                setTimeout(updateTopbarDates, 1000);
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateTopbarDates);
    } else {
        updateTopbarDates();
    }

    setInterval(updateTopbarDates, 86400000);
})();





// ============================================================
//  توليد القوائم من الهيكل الجديد (مركزي)
// ============================================================

// ============================================================
//  توليد القوائم من الهيكل الجديد (مركزي)
// ============================================================

var menuStructure = {
    nav: [
        // ===== الموقع الرسمي للشيخ (جديد - قبل من نحن) =====
        {
            name: 'الموقع الرسمي',
            children: [
                { name: 'نبذة عن الشيخ', link: 'sheikh.html#about' },
                { name: 'السيرة الذاتية', link: 'sheikh.html#bio' },
                { name: 'رسالتي ورؤيتي', link: 'sheikh.html#message' },
                { name: 'مؤلفاتي وأبحاثي', link: 'sheikh.html#books' },
                { name: 'خطبي ودروسي ومحاضراتي', link: 'sheikh.html#lectures' },
                { name: 'صور وذكريات', link: 'sheikh.html#gallery' },
                { name: 'تواصل مع الشيخ', link: 'sheikh.html#contact' }
            ]
        },
        // ===== باقي الأقسام =====
        {
            name: 'من نحن؟',
            children: [
                { name: 'رسالة المنصة', link: 'about.html#message' },
                { name: 'رؤيتنا وأهدافنا', link: 'about.html#vision' },
                { name: 'عن الشيخ الدكتور/ جمعة سالم الأزهري', link: 'about.html#sheikh' }
            ]
        },
        {
            name: 'العلم',
            children: [
                { name: 'المعرفة والثقافة', link: 'science.html#culture' },
                { name: 'العلم والإيمان', link: 'science.html#faith-science' },
                { name: 'مقالات وبحوث', link: 'science.html#articles' },
                { name: 'ملخصات الكتب', link: 'science.html#summaries' },
                { name: 'أعلام وعلماء', link: 'science.html#scholars' }
            ]
        },
        {
            name: 'الإيمان',
            children: [
                { name: 'القرآن الكريم', link: 'faith.html#quran' },
                { name: 'الحديث الشريف', link: 'faith.html#hadith' },
                { name: 'العقيدة', link: 'faith.html#aqeedah' },
                { name: 'الأخلاق', link: 'faith.html#ethics' },
                { name: 'تزكية النفس', link: 'faith.html#tazkiyah' },
                { name: 'فقه الحياة', link: 'faith.html#fiqh-life' }
            ]
        },
        {
            name: 'الحياة',
            children: [
                { name: 'الأسرة', link: 'life.html#family' },
                { name: 'الشباب', link: 'life.html#youth' },
                { name: 'التربية', link: 'life.html#education' },
                { name: 'النجاح وتطوير الذات', link: 'life.html#success' },
                { name: 'قضايا المجتمع', link: 'life.html#society' },
                { name: 'العلاقات الإنسانية', link: 'life.html#relationships' }
            ]
        },
        {
            name: 'مكتبة المعرفة',
            children: [
                { name: 'الكتب', link: 'library.html#books' },
                { name: 'ملخصات الكتب', link: 'library.html#summaries' },
                { name: 'المقالات', link: 'library.html#articles' },
                { name: 'مختارات نافعة', link: 'library.html#beneficial' }
            ]
        },
        {
            name: 'منبر الجمعة',
            children: [
                { name: 'خطب مكتوبة', link: 'pulpit.html#written' },
                { name: 'خطب صوتية', link: 'pulpit.html#audio' },
                { name: 'خطب مرئية', link: 'pulpit.html#video' }
            ]
        },
        {
            name: 'سؤال وجواب',
            children: [
                { name: 'أسئلة شرعية', link: 'qa.html#religious' },
                { name: 'أسئلة حياتية', link: 'qa.html#life' },
                { name: 'أسئلة الجمهور', link: 'qa.html#audience' }
            ]
        },
        {
            name: 'قصص ودروس وعبر',
            children: [
                { name: 'قصص من التاريخ', link: 'stories.html#history' },
                { name: 'قصص واقعية', link: 'stories.html#real' },
                { name: 'قصص الأنبياء والصالحين', link: 'stories.html#prophets' },
                { name: 'العبرة المستفادة', link: 'stories.html#lessons' }
            ]
        },
        {
            name: 'حديث الروح',
            children: [
                { name: 'خواطر إيمانية', link: 'soul.html#thoughts' },
                { name: 'رسائل حياتية', link: 'soul.html#letters' },
                { name: 'كلمات من القلب', link: 'soul.html#heart' }
            ]
        },
        {
            name: 'مرئيات المنصة',
            children: [
                { name: 'حلقات وبرامج', link: 'videos.html#episodes' },
                { name: 'مقاطع قصيرة', link: 'videos.html#shorts' },
                { name: 'لقاءات', link: 'videos.html#interviews' },
                { name: 'بث مباشر', link: 'videos.html#live' }
            ]
        },
        {
            name: 'صوتيات',
            children: [
                { name: 'محاضرات', link: 'audios.html#lectures' },
                { name: 'دروس', link: 'audios.html#lessons' },
                { name: 'تسجيلات مختارة', link: 'audios.html#selected' }
            ]
        },
        {
            name: 'قضايا معاصرة',
            children: [
                { name: 'قضايا فكرية', link: 'issues.html#intellectual' },
                { name: 'قضايا اجتماعية', link: 'issues.html#social' },
                { name: 'قضايا تربوية', link: 'issues.html#educational' },
                { name: 'قضايا الشباب', link: 'issues.html#youth' }
            ]
        },
        {
            name: 'مسابقات وألغاز',
            children: [
                { name: 'مسابقات ثقافية', link: 'games.html#cultural' },
                { name: 'أسئلة دينية', link: 'games.html#religious' },
                { name: 'ألغاز هادفة', link: 'games.html#puzzles' }
            ]
        },
        {
            name: 'ترفيه هادف',
            children: [
                { name: 'طرائف', link: 'entertainment.html#jokes' },
                { name: 'مواقف جميلة', link: 'entertainment.html#situations' },
                { name: 'ابتسامة وفائدة', link: 'entertainment.html#smile' }
            ]
        },
        {
            name: 'تواصل معنا',
            children: [
                { name: 'أرسل سؤالك', link: 'contact.html#ask' },
                { name: 'اقترح موضوعاً', link: 'contact.html#suggest' },
                { name: 'تواصل مع الشيخ', link: 'contact.html#sheikh' },
                { name: 'جميع حسابات التواصل الاجتماعي', link: 'contact.html#social' }
            ]
        }
    ]
};


// ==========
function generateMainNav() {
    var navList = document.querySelector('.nav-list');
    if (!navList) return;

    navList.innerHTML = '';

    // عدد العناصر المرئية قبل "المزيد"
    var visibleCount = 8;

    menuStructure.nav.forEach(function (item, index) {
        var li = document.createElement('li');
        li.className = 'nav-item';

        // إخفاء العناصر الزائدة عن 8
        if (index >= visibleCount) {
            li.style.display = 'none';
            li.classList.add('more-item');
        }

        var btn = document.createElement('button');
        btn.className = 'nav-link';
        btn.textContent = item.name;
        btn.innerHTML += ' <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';

        var mega = document.createElement('div');
        mega.className = 'mega-menu';
        mega.style.display = 'grid';
        mega.style.gridTemplateColumns = 'repeat(3, 1fr)';

        item.children.forEach(function (child) {
            var col = document.createElement('div');
            col.className = 'mega-col';
            col.innerHTML = '<a href="' + child.link + '"><strong>' + child.name + '</strong></a>';
            mega.appendChild(col);
        });

        li.appendChild(btn);
        li.appendChild(mega);
        navList.appendChild(li);
    });

    // ===== إضافة زر "المزيد" =====
    var moreLi = document.createElement('li');
    moreLi.className = 'nav-item more-btn';
    var moreBtn = document.createElement('button');
    moreBtn.className = 'nav-link';
    moreBtn.textContent = 'المزيد';
    moreBtn.innerHTML += ' <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';
    moreLi.appendChild(moreBtn);

    // القائمة المنسدلة لـ "المزيد"
    var moreMega = document.createElement('div');
    moreMega.className = 'mega-menu';
    moreMega.style.display = 'grid';
    moreMega.style.gridTemplateColumns = 'repeat(3, 1fr)';

    // إضافة العناصر المخفية في "المزيد"
    var hiddenItems = menuStructure.nav.slice(visibleCount);
    hiddenItems.forEach(function (item) {
        var col = document.createElement('div');
        col.className = 'mega-col';
        var link = document.createElement('a');
        link.href = '#';
        link.innerHTML = '<strong>' + item.name + '</strong>';
        col.appendChild(link);

        // إضافة الفروع داخل الـ mega
        var subDiv = document.createElement('div');
        subDiv.style.marginTop = '8px';
        subDiv.style.display = 'flex';
        subDiv.style.flexDirection = 'column';
        subDiv.style.gap = '4px';
        item.children.forEach(function (child) {
            var a = document.createElement('a');
            a.href = child.link;
            a.style.fontSize = '.8rem';
            a.style.color = 'var(--navy-500)';
            a.textContent = child.name;
            subDiv.appendChild(a);
        });
        col.appendChild(subDiv);

        moreMega.appendChild(col);
    });

    moreLi.appendChild(moreMega);
    navList.appendChild(moreLi);
}

// ===== دالة توليد الدراور (القائمة الجانبية) =====
function generateDrawerMenu() {
    var drawer = document.querySelector('.drawer-accordion');
    if (!drawer) return;

    drawer.innerHTML = '';

    var home = document.createElement('a');
    home.className = 'drawer-top-link';
    home.href = 'index.html';
    home.textContent = '🏠 الرئيسية';
    drawer.appendChild(home);

    menuStructure.nav.forEach(function (item) {
        var details = document.createElement('details');
        var summary = document.createElement('summary');
        summary.className = 'drawer-top-link';
        summary.textContent = item.name;
        summary.innerHTML += ' <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';

        var sub = document.createElement('div');
        sub.className = 'drawer-sub';

        item.children.forEach(function (child) {
            var a = document.createElement('a');
            a.href = child.link;
            a.textContent = child.name;
            sub.appendChild(a);
        });

        details.appendChild(summary);
        details.appendChild(sub);
        drawer.appendChild(details);
    });
}

// ===== تنفيذ التوليد عند تحميل الصفحة =====
function initMenus() {
    generateMainNav();
    generateDrawerMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenus);
} else {
    initMenus();
}

////////////////////////////////////////////////////////////////////

// ===== تعديل روابط التوب بار (مركزي) =====
(function () {
    var topbarLinks = document.querySelector('.topbar-links');
    if (topbarLinks) {
        // حذف المحتوى القديم
        topbarLinks.innerHTML = '';

        // إضافة الروابط الجديدة بالترتيب
        var links = [
            { href: 'sheikh.html', text: 'الموقع الرسمي' },
            { href: 'about.html', text: 'من نحن؟' },
            { href: 'contact.html', text: 'تواصل معنا' }
        ];

        links.forEach(function (link) {
            var a = document.createElement('a');
            a.href = link.href;
            a.textContent = link.text;
            topbarLinks.appendChild(a);
        });
    }
})();

/////////////////////////////////////////////////////////

// ============================================================
//  إدارة وسائل التواصل الاجتماعي (مركزي)
// ============================================================

// ============================================================
//  إدارة وسائل التواصل الاجتماعي (مركزي)
// ============================================================

// ===== بيانات وسائل التواصل =====
var SOCIAL_LINKS = [
    {
        key: 'youtube',
        url: 'https://youtube.com/channel/UCzHcE1PdPdGwCwqlH73uv-g',
        label: 'يوتيوب',
        className: 'youtube'
    },
    {
        key: 'facebook1',
        url: 'https://www.facebook.com/share/1GDQPCWqQB/',
        label: 'فيسبوك 1',
        className: 'facebook'
    },
    {
        key: 'facebook2',
        url: 'https://www.facebook.com/share/1ETXBqLtft/',
        label: 'فيسبوك 2',
        className: 'facebook'
    },
    {
        key: 'twitter',
        url: 'https://x.com/GomaSalem1',
        label: 'إكس',
        className: 'twitter'
    },
    {
        key: 'instagram',
        url: 'https://www.instagram.com/ldktwrjmbd',
        label: 'انستجرام',
        className: 'instagram'
    },
    {
        key: 'threads',
        url: 'https://www.threads.com/@ldktwrjmbd',
        label: 'ثريدز',
        className: 'threads'
    },
    {
        key: 'telegram',
        url: 'https://t.me/+201017712000',
        label: 'تليجرام',
        className: 'telegram'
    },
    {
        key: 'whatsapp',
        url: 'https://wa.me/201017712000',
        label: 'واتساب',
        className: 'whatsapp'
    },
    {
        key: 'whatsappBusiness',
        url: 'https://wa.me/201201304444',
        label: 'واتساب أعمال',
        className: 'whatsapp-business'
    },
    {
        key: 'blog',
        url: 'https://blogger.com', // ← غيره لرابط بلوجر الفعلي
        label: 'المدونة',
        className: 'blog'
    }
];

// ===== أيقونات SVG =====
var SOCIAL_ICONS = {
    youtube: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M23 12s0-4-1-5.5c-1-1.5-2-1.5-2.5-1.6C16 4.5 12 4.5 12 4.5s-4 0-7.5.4C4 5 3 5 2 6.5 1 8 1 12 1 12s0 4 1 5.5c1 1.5 2.3 1.5 3 1.6C7.5 19.5 12 19.5 12 19.5s4 0 7.5-.4c.7-.1 2-.1 3-1.6 1-1.5 1-5.5 1-5.5zM9.8 15.5v-7l6 3.5z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 4l16 16M20 4L4 20"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/></svg>',
    threads: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2z"/><path d="M8 12h8M12 8v8"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 2L2 10l6 2 2 7 3-4 5 4z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.8 14.3c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.2-.3.4-.5.5-.2.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.5 1.5.3.1.5.1.6-.1.2-.2.7-.8.9-1 .2-.2.4-.2.6-.1.2.1 1.5.7 1.7.8.2.1.4.2.4.3.1.2.1.6-.1 1.3z"/></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M4 19V5a2 2 0 012-2h11l3 3v13a2 2 0 01-2 2H6a2 2 0 01-2-2z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>'
};

// ===== دالة إنشاء وسائل التواصل (مع علامات مميزة) =====
function createSocialIconsHTML() {
    var html = '';
    SOCIAL_LINKS.forEach(function (item) {
        var iconType = item.className === 'whatsapp-business' ? 'whatsapp' : item.className;
        var icon = SOCIAL_ICONS[iconType] || SOCIAL_ICONS.whatsapp;

        // علامة مميزة للفيسبوك 2 (أيقونة شخصين)
        var badge = '';
        if (item.key === 'facebook2') {
            badge = '<span class="social-badge badge-page" aria-label="صفحة ثانية">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>' +
                '<circle cx="9" cy="7" r="4"/>' +
                '<path d="M23 21v-2a4 4 0 00-3-3.87"/>' +
                '<path d="M16 3.13a4 4 0 010 7.75"/>' +
                '</svg>' +
                '</span>';
        } else if (item.key === 'whatsappBusiness') {
            // علامة مميزة لواتساب الأعمال (شنطة)
            badge = '<span class="social-badge badge-business" aria-label="حساب أعمال">' +
                '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
                '<rect x="2" y="7" width="20" height="14" rx="2"/>' +
                '<path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>' +
                '</svg>' +
                '</span>';
        }

        html +=
            '<a href="' + item.url + '" target="_blank" rel="noopener" aria-label="' + item.label + '" class="' + item.className + '" style="position:relative;">' +
            icon +
            badge +
            '</a>';
    });
    return html;
}

// ===== 1. حقن الأيقونات في الفوتر (كل الصفحات) =====
function updateFooterSocial() {
    var footerSocial = document.querySelector('.footer-social');
    if (!footerSocial) return;

    footerSocial.innerHTML = createSocialIconsHTML();
}

// ===== 2. حقن الأيقونات في الصفحة الرئيسية (تحت "الأكثر بحثاً") =====
function addSocialToHero() {
    // نتأكد إننا في الصفحة الرئيسية
    var heroCopy = document.querySelector('.hero-copy');
    if (!heroCopy) return;

    // نتأكد إن القسم لسه ما اتضافش
    if (heroCopy.querySelector('.hero-social-wrapper')) return;

    // إنشاء قسم وسائل التواصل
    var wrapper = document.createElement('div');
    wrapper.className = 'hero-social-wrapper';

    // عنوان القسم
    var title = document.createElement('span');
    title.className = 'hero-social-title';
    title.textContent = 'تابعنا على:';

    // حاوية الأيقونات
    var iconsContainer = document.createElement('div');
    iconsContainer.className = 'hero-social-icons';
    iconsContainer.innerHTML = createSocialIconsHTML();

    wrapper.appendChild(title);
    wrapper.appendChild(iconsContainer);

    // نضيفه بعد tag-list (الأكثر بحثاً)
    var tagList = heroCopy.querySelector('.tag-list');
    if (tagList) {
        tagList.parentNode.insertBefore(wrapper, tagList.nextSibling);
    } else {
        heroCopy.appendChild(wrapper);
    }
}

// ===== 3. حقن الأيقونات في contact.html (لو موجودة الحاوية) =====
function updateContactSocial() {
    var contactSocial = document.querySelector('.social-icons');
    if (!contactSocial) return;

    contactSocial.innerHTML = createSocialIconsHTML();
}

// ===== 4. تعديل التوب بار =====
function updateTopbarLinks() {
    var topbarLinks = document.querySelector('.topbar-links');
    if (!topbarLinks) return;

    topbarLinks.innerHTML =
        '<a href="sheikh.html">الموقع الرسمي</a>' +
        '<a href="about.html">من نحن؟</a>' +
        '<a href="contact.html">تواصل معنا</a>';
}

// ===== تنفيذ كل التعديلات =====
function initCentralUpdates() {
    updateTopbarLinks();
    updateFooterSocial();
    addSocialToHero();
    updateContactSocial();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCentralUpdates);
} else {
    initCentralUpdates();
}