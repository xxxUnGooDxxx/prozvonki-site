// Живой поиск по вопросам FAQ. Без зависимостей.
(function () {
  var input = document.getElementById('faq-q');
  if (!input) return;

  var sections = Array.prototype.slice.call(document.querySelectorAll('[data-faq-section]'));
  var empty = document.getElementById('faq-empty');
  var toc = document.getElementById('faq-toc');

  function normalize(s) {
    return (s || '').toLowerCase().replace(/ё/g, 'е').trim();
  }

  function apply() {
    var q = normalize(input.value);
    var anyVisible = false;

    sections.forEach(function (section) {
      var items = section.querySelectorAll('.faq-list details');
      var sectionHasMatch = false;

      Array.prototype.forEach.call(items, function (d) {
        var text = normalize(d.textContent);
        var match = q === '' || text.indexOf(q) !== -1;
        d.style.display = match ? '' : 'none';
        // При активном поиске раскрываем совпавшие, иначе сворачиваем.
        if (q === '') {
          d.open = false;
        } else {
          d.open = match;
        }
        if (match) sectionHasMatch = true;
      });

      section.classList.toggle('faq-hidden', !sectionHasMatch);
      if (sectionHasMatch) anyVisible = true;
    });

    if (empty) empty.classList.toggle('show', !anyVisible);
    if (toc) toc.style.display = q === '' ? '' : 'none';
  }

  input.addEventListener('input', apply);

  // Клик по чипу оглавления сначала сбрасывает поиск, затем перематывает к разделу.
  if (toc) {
    toc.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (input.value) {
        input.value = '';
        apply();
      }
    });
  }
})();
