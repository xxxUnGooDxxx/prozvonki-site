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
    btn.setAttribute('aria-checked', dark ? 'true' : 'false');
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
    btn.className = 'theme-switch';
    btn.setAttribute('role', 'switch');
    btn.setAttribute('aria-label', ru ? 'Тёмная тема' : 'Dark theme');
    btn.innerHTML =
      '<span class="theme-switch-track">' +
      '<svg class="theme-switch-ico ico-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>' +
      '<svg class="theme-switch-ico ico-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>' +
      '<span class="theme-switch-knob"></span>' +
      '</span>';
    btn.addEventListener('click', function () {
      apply(current() === 'dark' ? 'light' : 'dark', btn);
    });

    var link = header.querySelector('.header-link');
    if (link) header.insertBefore(btn, link); else header.appendChild(btn);
    update(btn);
  }

  function initCookieNotice() {
    var CONSENT_KEY = 'pz-cookie-notice-v1';
    try { if (localStorage.getItem(CONSENT_KEY) === 'accepted') return; } catch (e) {}

    var ru = document.documentElement.lang === 'ru';
    var style = document.createElement('style');
    style.textContent =
      '.cookie-notice{position:fixed;z-index:1000;left:clamp(12px,3vw,36px);right:clamp(12px,3vw,36px);bottom:clamp(12px,3vw,28px);display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 20px 18px 24px;border:1px solid var(--line,#d9e9df);border-radius:14px;background:rgba(255,255,255,.97);color:var(--text,#26382f);box-shadow:0 18px 55px rgba(20,32,25,.2);backdrop-filter:blur(16px);font:500 15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
      '.cookie-notice p{margin:0;max-width:980px}.cookie-notice a{color:var(--green-dark,#086b42);font-weight:800;text-decoration:underline;text-underline-offset:3px}' +
      '.cookie-notice button{flex:0 0 auto;min-height:44px;padding:0 22px;border:0;border-radius:8px;background:var(--green,#15985d);color:#fff;font:800 14px/1 inherit;cursor:pointer;box-shadow:0 10px 24px rgba(21,152,93,.2)}.cookie-notice button:hover{background:var(--green-dark,#086b42)}' +
      'html[data-theme="dark"] .cookie-notice{border-color:#28342e;background:rgba(20,27,23,.97);color:#d7e2dc}' +
      '@media(max-width:680px){.cookie-notice{align-items:stretch;flex-direction:column;gap:14px;padding:18px}.cookie-notice button{width:100%}}';
    document.head.appendChild(style);

    var notice = document.createElement('aside');
    notice.className = 'cookie-notice';
    notice.setAttribute('role', 'dialog');
    notice.setAttribute('aria-label', ru ? 'Уведомление о файлах cookie' : 'Cookie notice');
    notice.innerHTML = ru
      ? '<p>Для улучшения работы сайта и взаимодействия с пользователями сайта мы используем файлы cookie. Продолжая работу с сайтом, вы разрешаете использование cookie-файлов. Обработка вашей персональной информации на нашем сайте осуществляется в соответствии с <a href="/privacy/#site-cookies">политикой обработки персональных данных</a>. Вы всегда можете отключить файлы cookie в настройках вашего браузера. Если файлы cookie отключены, это может означать, что вы не можете в полной мере использовать все функции нашего сайта.</p><button type="button">Понятно</button>'
      : '<p>To improve the website and our interaction with website users, we use cookies. By continuing to use the website, you consent to the use of cookies. The processing of your personal information on our website is carried out in accordance with our <a href="/privacy-en/#site-cookies">personal data processing policy</a>. You can disable cookies at any time in your browser settings. If cookies are disabled, you may not be able to fully use all features of our website.</p><button type="button">Got it</button>';
    notice.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
      notice.remove();
      style.remove();
    });
    document.body.appendChild(notice);
  }

  function boot() {
    init();
    initCookieNotice();
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
