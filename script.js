
window.addEventListener('load', function () {
  
    var wrapper = document.querySelector('.wrapper');
    if (wrapper) {
        wrapper.style.transition = 'opacity 0.8s ease';
        setTimeout(function () { wrapper.style.opacity = '1'; }, 100);
    }

    var header = document.querySelector('header');
    if (header) {
        var msg = document.createElement('p');
        msg.id = 'welcome-msg';
        msg.style.cssText = 'margin:6px 0 0; font-size:0.85em; opacity:0; transition:opacity 1s ease; color:#ffd700;';
        msg.textContent = 'Bine ați venit pe site-ul despre România!';
        header.appendChild(msg);
        setTimeout(function () { msg.style.opacity = '1'; }, 1000);
    }

    var footer = document.querySelector('footer');
    if (footer) {
        var clock = document.createElement('span');
        clock.id = 'live-clock';
        clock.style.cssText = 'margin-left:20px; font-size:0.85em; color:#ffd700;';
        footer.appendChild(clock);

        function updateClock() {
            var now = new Date();
            var h = String(now.getHours()).padStart(2, '0');
            var m = String(now.getMinutes()).padStart(2, '0');
            var s = String(now.getSeconds()).padStart(2, '0');
            clock.textContent = '⏰ ' + h + ':' + m + ':' + s;
        }
        updateClock();
        setInterval(updateClock, 1000);
    }
    initDarkMode();
    initCustomCursor();
    initScrollProgress();
    initBackToTop();
    initImageTooltips();
});

(function highlightActiveNav() {
    var links = document.querySelectorAll('nav a');
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === currentPage) {
            link.style.cssText = 'color:#cc0000; text-decoration:underline; font-weight:bold;';
        }
    });
})();

function initDarkMode() {
    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.innerHTML = '🌙'; 
    document.body.appendChild(btn);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        btn.innerHTML = '☀️';
    }

    btn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        btn.innerHTML = isDark ? '☀️' : '🌙';
    });
}

function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    document.body.appendChild(cursor);

    window.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, img').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(2)');
        el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
    });
}

function initScrollProgress() {
    const progress = document.createElement('div');
    progress.id = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', function() {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progress.style.width = scrolled + "%";
    });
}

function initBackToTop() {
    var btn = document.createElement('button');
    btn.id = 'btn-top';
    btn.textContent = '▲ Sus';
    document.body.appendChild(btn);

    window.addEventListener('scroll', function () {
        btn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initImageTooltips() {
    var images = document.querySelectorAll('img');
    var tooltip = document.createElement('div');
    tooltip.style.cssText = 'position:fixed; background:rgba(0,0,0,0.8); color:#fff; padding:5px 10px; border-radius:4px; font-size:13px; pointer-events:none; display:none; z-index:1000;';
    document.body.appendChild(tooltip);

    images.forEach(function (img) {
        img.addEventListener('mouseenter', function () {
            if (img.alt) {
                tooltip.textContent = img.alt;
                tooltip.style.display = 'block';
            }
        });
        img.addEventListener('mousemove', function (e) {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top  = (e.clientY + 15) + 'px';
        });
        img.addEventListener('mouseleave', function () { tooltip.style.display = 'none'; });
    });
}

(function visitCounter() {
    var key = 'ro_visit_count';
    var count = parseInt(sessionStorage.getItem(key) || '0') + 1;
    sessionStorage.setItem(key, count);

    window.addEventListener('load', function () {
        var footer = document.querySelector('footer');
        if (footer) {
            var counter = document.createElement('p');
            counter.style.cssText = 'font-size:0.8em; color:#aac4ff; margin-top:10px;';
            counter.textContent = 'Pagini vizitate în această sesiune: ' + count;
            footer.appendChild(counter);
        }
    });
})();