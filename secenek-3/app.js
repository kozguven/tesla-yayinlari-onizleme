/* Tesla Lab — küçük etkileşimler: menü, alt paneller, sekmeler, filtre, galeri, adet, bayi */
(function () {
  var d = document, root = d.documentElement;
  if (window.self !== window.top) {
    root.classList.add('in-frame');
    d.querySelectorAll('img[loading="lazy"]').forEach(function (i) { i.loading = 'eager'; });
  }

  // Ekranlar düğmesi
  var sc = d.querySelector('.screens');
  if (sc) {
    var sb = sc.querySelector('.screens-btn');
    sb.addEventListener('click', function () {
      var o = sc.classList.toggle('is-open');
      sb.setAttribute('aria-expanded', o);
    });
    d.addEventListener('click', function (e) { if (!sc.contains(e.target)) { sc.classList.remove('is-open'); sb.setAttribute('aria-expanded', 'false'); } });
  }

  // Alttan açılan paneller
  var bd = d.querySelector('.backdrop');
  function openSheet(id) {
    var s = d.getElementById(id); if (!s) return;
    closeAll(); s.classList.add('is-open'); s.setAttribute('aria-hidden', 'false');
    d.body.classList.add('open');
    var f = s.querySelector('button,a,input,select'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 50);
  }
  function closeAll() {
    d.querySelectorAll('.sheet.is-open').forEach(function (s) { s.classList.remove('is-open'); s.setAttribute('aria-hidden', 'true'); });
    d.body.classList.remove('open');
  }
  d.querySelectorAll('[data-sheet]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openSheet(b.getAttribute('data-sheet')); });
  });
  d.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', closeAll); });
  if (bd) bd.addEventListener('click', closeAll);
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });

  // Hash ile durum (mobil.html önizlemeleri için)
  var h = location.hash.replace('#', '');
  if (h === 'menu') openSheet('menuSheet');
  if (h === 'filtre') openSheet('filterSheet');
  if (h === 'indir') openSheet('docSheet');
  var tgt = h && d.getElementById(h);
  if (tgt && !tgt.classList.contains('sheet')) {
    if (root.classList.contains('in-frame')) {
      // telefon önizlemesinde (mobil.html) hedef bölümü üste al; baskıda da kaydırma gerekmesin
      var p = tgt.previousElementSibling;
      while (p) { p.style.display = 'none'; p = p.previousElementSibling; }
    } else {
      window.addEventListener('load', function () { tgt.scrollIntoView(); });
    }
  }

  // Sekmeler + filtre (katalog)
  var tabs = d.querySelectorAll('.tab[data-level]');
  var cards = d.querySelectorAll('[data-lv]');
  var count = d.getElementById('count');
  function filter(lv) {
    var n = 0;
    cards.forEach(function (c) { var ok = lv === 'hepsi' || c.getAttribute('data-lv') === lv; c.hidden = !ok; if (ok) n++; });
    if (count) count.textContent = n + ' ürün listeleniyor';
  }
  tabs.forEach(function (t) {
    if (h && t.getAttribute('data-level') === h) setTimeout(function () { t.click(); }, 0);
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
      t.setAttribute('aria-selected', 'true'); filter(t.getAttribute('data-level'));
    });
  });

  // Galeri
  var main = d.getElementById('galMain');
  d.querySelectorAll('.th').forEach(function (t) {
    t.addEventListener('click', function () {
      d.querySelectorAll('.th').forEach(function (x) { x.setAttribute('aria-current', 'false'); });
      t.setAttribute('aria-current', 'true');
      main.innerHTML = t.getAttribute('data-big');
      main.classList.toggle('cover', t.hasAttribute('data-cover'));
    });
  });

  // Adet
  d.querySelectorAll('.qty').forEach(function (q) {
    var i = q.querySelector('input');
    q.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = Math.max(1, (parseInt(i.value, 10) || 1) + parseInt(b.getAttribute('data-step'), 10));
        i.value = v;
      });
    });
  });

  // Bayi / deneme filtresi (select)
  d.querySelectorAll('select[data-filter]').forEach(function (s) {
    s.addEventListener('change', function () {
      var key = s.getAttribute('data-filter'), v = s.value;
      d.querySelectorAll('[data-' + key + ']').forEach(function (el) {
        if (el === s || el.classList.contains('reg')) return;
        el.hidden = !(v === 'hepsi' || el.getAttribute('data-' + key).split(' ').indexOf(v) > -1);
      });
      d.querySelectorAll('.reg[data-il]').forEach(function (r) { r.classList.toggle('on', r.getAttribute('data-il') === v); });
    });
  });

  // Önizleme formları gönderilmez
  d.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = f.querySelector('.form-msg'); if (m) { m.hidden = false; m.focus(); }
    });
  });
})();
