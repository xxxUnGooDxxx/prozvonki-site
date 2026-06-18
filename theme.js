// ProZvonki site theme: auto by time of day, manual override stored locally.
// The initial data-theme is set by a small inline bootstrap in <head> to avoid a flash.
(function () {
  var KEY = 'pz-theme';

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function update(btn) {
    if (!btn) return;
    var dark = current() === 'dark';
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    var ru = document.documentElement.lang === 'ru';
    btn.title = dark ? (ru ? 'Светлая тема' : 'Light theme') : (ru ? 'Тёмная тема' : 'Dark theme');
  }

  function apply(theme, btn) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    update(btn);
  }

  function init() {
    var header = document.querySelector('.site-header');
    if (!header || document.getElementById('theme-toggle')) return;

    var ru = document.documentElement.lang === 'ru';
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', ru ? 'Сменить тему оформления' : 'Toggle color theme');
    btn.innerHTML =
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark', btn);
    });

    var link = header.querySelector('.header-link');
    if (link) header.insertBefore(btn, link); else header.appendChild(btn);
    update(btn);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
