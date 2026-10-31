(function () {
  var lang = 'en', release = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showVersion() {
    var el = document.getElementById('ver');
    if (!el || !release) return;
    el.textContent = (lang === 'es' ? 'Versión ' : 'Version ') + release.v + ' · Windows';
  }

  function setLang(l) {
    lang = l === 'es' ? 'es' : 'en';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function (el) {
      el.innerHTML = el.getAttribute('data-' + lang);
    });
    // capturas de la app en el idioma elegido
    document.querySelectorAll('img[data-src-en]').forEach(function (img) {
      var src = img.getAttribute('data-src-' + lang);
      if (src && img.getAttribute('src') !== src) img.setAttribute('src', src);
      var alt = img.getAttribute('data-alt-' + lang);
      if (alt) img.setAttribute('alt', alt);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    try { localStorage.setItem('vincent-lang', lang); } catch (e) {}
    showVersion();
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var saved = null;
  try { saved = localStorage.getItem('vincent-lang'); } catch (e) {}
  setLang(saved || ((navigator.language || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en'));

  // aparicion suave de cada bloque al llegar a el
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.feature, .grid3 > *, .steps li, .faq').forEach(function (el) {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Latest version number (the download itself needs a sign-in)
  fetch('https://account.vincent-ai.app/api/version')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j || !j.version) return;
      release = { v: j.version };
      showVersion();
    })
    .catch(function () {});
})();
