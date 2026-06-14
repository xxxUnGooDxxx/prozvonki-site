/* ProZvonki — атрибуция установок (AppMetrica) + цели кликов (Яндекс.Метрика)
   1) Кнопки магазинов ведут на трекинговые ссылки AppMetrica (атрибуция установок).
   2) В трекер прокидывается источник, с которого человек пришёл на сайт (UTM или referrer).
   3) На клик по кнопке отправляется цель в Яндекс.Метрику. */
(function () {
  var YM_ID = 109706895;
  var TRACKERS = {
    google_play: 'https://6295318.redirect.appmetrica.yandex.com?appmetrica_tracking_id=606347937584262038&referrer=reattribution%3D1',
    rustore:     'https://6295318.redirect.appmetrica.yandex.com?appmetrica_tracking_id=966635906163333592&referrer=reattribution%3D1'
  };
  var STORE_KEY = 'pz_attr';

  function deriveFromReferrer() {
    var ref = document.referrer;
    if (!ref) return { utm_source: 'direct', utm_medium: 'none' };
    var host;
    try { host = new URL(ref).hostname; } catch (e) { return { utm_source: 'direct', utm_medium: 'none' }; }
    if (host.indexOf(location.hostname) !== -1) return null; // переход внутри сайта — не перетираем источник
    if (/(^|\.)yandex\./.test(host))  return { utm_source: 'yandex', utm_medium: 'organic' };
    if (/(^|\.)google\./.test(host))  return { utm_source: 'google', utm_medium: 'organic' };
    if (/(bing|duckduckgo|rambler|mail\.ru)/.test(host)) return { utm_source: host, utm_medium: 'organic' };
    return { utm_source: host, utm_medium: 'referral' };
  }

  function getAttribution() {
    var p = new URLSearchParams(location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var utm = {}, has = false;
    keys.forEach(function (k) { var v = p.get(k); if (v) { utm[k] = v; has = true; } });
    if (has) { try { localStorage.setItem(STORE_KEY, JSON.stringify(utm)); } catch (e) {} return utm; }
    try { var s = localStorage.getItem(STORE_KEY); if (s) return JSON.parse(s); } catch (e) {}
    var d = deriveFromReferrer();
    if (d) { try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {} return d; }
    return { utm_source: 'direct', utm_medium: 'none' };
  }

  function buildUrl(base, content, attr) {
    var u;
    try { u = new URL(base); } catch (e) { return base; }
    if (attr.utm_source)   u.searchParams.set('utm_source', attr.utm_source);
    u.searchParams.set('utm_medium', attr.utm_medium || 'referral');
    if (attr.utm_campaign) u.searchParams.set('utm_campaign', attr.utm_campaign);
    if (attr.utm_term)     u.searchParams.set('utm_term', attr.utm_term);
    u.searchParams.set('utm_content', content);
    return u.toString();
  }

  function goal(name) {
    if (typeof window.ym === 'function') { try { ym(YM_ID, 'reachGoal', name); } catch (e) {} }
  }

  function wire() {
    var attr = getAttribution();
    [
      ['.store-badge-google',  TRACKERS.google_play, 'google_play', 'click_google_play'],
      ['.store-badge-rustore', TRACKERS.rustore,     'rustore',     'click_rustore']
    ].forEach(function (m) {
      document.querySelectorAll('a' + m[0]).forEach(function (a) {
        a.href = buildUrl(m[1], m[2], attr);
        a.addEventListener('click', function () { goal(m[3]); });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
})();
