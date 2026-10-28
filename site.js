(function () {
  var RADIO = {
    en: [
      ['u', 'YOU', "How's the gap to the car behind?"],
      ['v', 'VINCENT', "1.8 and holding. He's quicker in sector two, you're quicker everywhere else. Keep it tidy."],
      ['v', 'VINCENT', 'Box this lap, box this lap. Fuel only, thirty-eight litres.'],
      ['u', 'YOU', 'Copy.']
    ],
    es: [
      ['u', 'TÚ', '¿Cómo va el de detrás?'],
      ['v', 'VICEN', 'A 1,8 y estable. Es más rápido en el sector dos; en el resto, tú. Limpio.'],
      ['v', 'VICEN', 'Entra esta vuelta. Solo gasolina, treinta y ocho litros.'],
      ['u', 'TÚ', 'Recibido.']
    ]
  };
  var lang = 'en', timer = null, release = null;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function playRadio() {
    var box = document.getElementById('radio');
    if (!box) return;
    clearTimeout(timer);
    box.innerHTML = '';
    var lines = RADIO[lang], i = 0;
    function add() {
      var l = lines[i], row = document.createElement('div');
      row.className = 'rad';
      row.innerHTML = '<span class="who ' + l[0] + '"></span><p></p>';
      row.firstChild.textContent = l[1];
      row.lastChild.textContent = l[2];
      box.appendChild(row);
      i++;
      if (i < lines.length) timer = setTimeout(add, reduce ? 0 : 1400);
    }
    add();
  }

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
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    try { localStorage.setItem('vincent-lang', lang); } catch (e) {}
    playRadio();
    showVersion();
  }

  document.querySelectorAll('.lang button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  var saved = null;
  try { saved = localStorage.getItem('vincent-lang'); } catch (e) {}
  setLang(saved || ((navigator.language || '').toLowerCase().indexOf('es') === 0 ? 'es' : 'en'));

  // Point download buttons straight at the latest installer
  fetch('https://api.github.com/repos/franzaragoza1/vincent-releases/releases/latest')
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (j) {
      if (!j) return;
      var a = (j.assets || []).filter(function (x) { return /\.exe$/i.test(x.name); })[0];
      if (!a) return;
      release = { v: (j.tag_name || '').replace(/^v/, ''), url: a.browser_download_url };
      document.querySelectorAll('a.dl').forEach(function (el) { el.href = release.url; });
      showVersion();
    })
    .catch(function () {});
})();
