// Живой поиск по вопросам FAQ + подсветка активного раздела в липкой полосе.
// Без зависимостей.
(function () {
  var input = document.getElementById('faq-q');
  var toc = document.getElementById('faq-toc');
  var nav = document.querySelector('.faq-nav');
  var empty = document.getElementById('faq-empty');
  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-faq-section]'));

  function normalize(s) {
    return (s || '').toLowerCase().replace(/ё/g, 'е').trim();
  }

  // --- Живой поиск ---------------------------------------------------------
  function applySearch() {
    if (!input) return;
    var q = normalize(input.value);
    var anyVisible = false;

    sections.forEach(function (section) {
      var items = section.querySelectorAll('.faq-list details');
      var sectionHasMatch = false;

      Array.prototype.forEach.call(items, function (d) {
        var match = q === '' || normalize(d.textContent).indexOf(q) !== -1;
        d.style.display = match ? '' : 'none';
        d.open = q === '' ? false : match;
        if (match) sectionHasMatch = true;
      });

      section.classList.toggle('faq-hidden', !sectionHasMatch);
      if (sectionHasMatch) anyVisible = true;
    });

    if (empty) empty.classList.toggle('show', !anyVisible);
  }

  if (input) input.addEventListener('input', applySearch);

  // --- Подсветка активного раздела (scroll-spy) ----------------------------
  var links = toc ? Array.prototype.slice.call(toc.querySelectorAll('a')) : [];
  var byId = {};
  links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var ids = links.map(function (a) { return a.getAttribute('href').slice(1); });
  var lastActive = null;

  function centerChip(a) {
    if (!toc) return;
    // Только когда полоса прокручивается по горизонтали (мобильная одна строка).
    if (toc.scrollWidth <= toc.clientWidth + 1) return;
    var target = a.offsetLeft - toc.clientWidth / 2 + a.clientWidth / 2;
    toc.scrollTo({ left: target, behavior: 'smooth' });
  }

  function spy() {
    if (!links.length) return;
    // Не подсвечиваем во время активного поиска (часть секций скрыта).
    if (input && input.value.trim() !== '') return;

    var line = (nav ? nav.getBoundingClientRect().bottom : 0) + 12;
    var current = ids[0];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && el.getBoundingClientRect().top <= line) current = ids[i];
    }

    if (current !== lastActive) {
      links.forEach(function (a) { a.classList.remove('active'); });
      if (byId[current]) {
        byId[current].classList.add('active');
        centerChip(byId[current]);
      }
      lastActive = current;
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { spy(); ticking = false; });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  spy();

  // Клик по чипу очищает поиск, чтобы переход к разделу сработал.
  if (toc) {
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (input && input.value) { input.value = ''; applySearch(); }
    });
  }
})();
