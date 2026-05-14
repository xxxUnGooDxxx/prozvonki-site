'use strict';

/* ===========================
   Showcase Slider (Hero)
   =========================== */
(function initShowcase() {
  var track   = document.getElementById('showcaseTrack');
  var frame   = document.getElementById('showcaseFrame');
  var btnPrev = document.getElementById('showcasePrev');
  var btnNext = document.getElementById('showcaseNext');
  var caption = document.getElementById('showcaseCaption');
  var dotsWrap = document.getElementById('showcaseDots');
  if (!track || !frame) return;

  var slides = track.querySelectorAll('.showcase-slide');
  var dots   = dotsWrap ? dotsWrap.querySelectorAll('.showcase-dot') : [];
  var total  = slides.length;
  var current = 0;
  var autoTimer = null;
  var slideWidth = 0;

  var captions = [
    'Звонки под контролем',
    'Напоминание о перезвоне',
    'Поиск звонков по тегу',
    'Статистика звонков',
    'SMS-визитка',
    'Безопасность звонков',
    'Светлая и тёмная тема',
    'Удобный журнал звонков',
    'Всё локально на устройстве',
    'Резерв настроек и звонков'
  ];

  function getSlideWidth() {
    return frame.offsetWidth;
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    slideWidth = getSlideWidth();
    track.style.transform = 'translateX(-' + (current * slideWidth) + 'px)';

    dots.forEach(function(d, i) {
      d.classList.toggle('active', i === current);
    });

    if (caption) {
      caption.style.opacity = '0';
      setTimeout(function() {
        caption.textContent = captions[current] || '';
        caption.style.opacity = '1';
      }, 180);
    }
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 4500);
  }
  function stopAuto() { clearInterval(autoTimer); }

  /* Arrows */
  if (btnPrev) btnPrev.addEventListener('click', function() { stopAuto(); prev(); startAuto(); });
  if (btnNext) btnNext.addEventListener('click', function() { stopAuto(); next(); startAuto(); });

  /* Dots */
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { stopAuto(); goTo(i); startAuto(); });
  });

  /* Pause on hover */
  frame.addEventListener('mouseenter', stopAuto);
  frame.addEventListener('mouseleave', startAuto);

  /* Touch / Pointer drag (без setPointerCapture — иначе клик на стрелках ломается) */
  var dragStartX = 0;
  var dragStartY = 0;
  var isDragging = false;
  var hasMoved   = false;

  frame.addEventListener('pointerdown', function(e) {
    /* Пропускаем нажатие на кнопки-стрелки — они обрабатывают click сами */
    if (e.target.closest && e.target.closest('.showcase-arrow')) return;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    isDragging = true;
    hasMoved   = false;
    stopAuto();
  });

  /* pointermove и pointerup — на window, чтобы drag работал даже за пределами frame */
  window.addEventListener('pointermove', function(e) {
    if (!isDragging) return;
    if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - dragStartY) > 5) {
      hasMoved = true;
    }
  });

  window.addEventListener('pointerup', function(e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = e.clientX - dragStartX;
    if (hasMoved && Math.abs(diff) > 40) {
      diff < 0 ? next() : prev();
    }
    startAuto();
  });

  window.addEventListener('pointercancel', function() {
    if (!isDragging) return;
    isDragging = false;
    startAuto();
  });

  /* Keyboard navigation when focused */
  frame.setAttribute('tabindex', '0');
  frame.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft')  { stopAuto(); prev(); startAuto(); }
    if (e.key === 'ArrowRight') { stopAuto(); next(); startAuto(); }
  });

  /* Recalculate on resize */
  var resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() { goTo(current); }, 100);
  });

  /* Init — wait for layout so offsetWidth is correct */
  requestAnimationFrame(function() { goTo(0); startAuto(); });
})();

/* ===========================
   Reveal on scroll
   =========================== */
(function initReveal() {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var delay = Number(entry.target.dataset.delay) || 0;
      setTimeout(function() { entry.target.classList.add('visible'); }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  /* Staggered cascade for grid cards */
  document.querySelectorAll('.features-grid, .audience-grid, .privacy-grid').forEach(function(grid) {
    grid.querySelectorAll('.reveal').forEach(function(card, idx) {
      card.dataset.delay = idx * 70;
    });
  });

  items.forEach(function(el) { observer.observe(el); });
})();

/* ===========================
   Smooth anchor scroll
   =========================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var id = link.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var header = document.querySelector('.site-header');
      var offset = header ? header.offsetHeight : 0;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset - 16, behavior: 'smooth' });
    });
  });
})();

/* ===========================
   Active nav highlight
   =========================== */
(function initActiveNav() {
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!navLinks.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.getAttribute('id');
      navLinks.forEach(function(link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
      });
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('section[id]').forEach(function(s) { observer.observe(s); });
})();
