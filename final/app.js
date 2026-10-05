(function(){
  var d=document, qs=function(s,c){return (c||d).querySelector(s)}, qa=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
  var params=new URLSearchParams(location.search);
  if(window.self!==window.top) d.documentElement.classList.add('in-frame');
  /* telefon önizlemesi: belirli bölümden başlat */
  var bolum=params.get('bolum');
  if(bolum){ d.documentElement.classList.add('bolum-mode'); var t=d.getElementById(bolum); if(t){ var sib=t.previousElementSibling; while(sib){ if(sib.tagName==='SECTION') sib.hidden=true; sib=sib.previousElementSibling; } } }

  /* mobil menü */
  var nav=qs('#mainnav'), burger=qs('.burger'), closeB=qs('.mnav-close');
  function setNav(open){ if(!nav) return; nav.classList.toggle('open',open); if(burger) burger.setAttribute('aria-expanded',open); d.body.style.overflow=open?'hidden':''; }
  if(burger) burger.addEventListener('click',function(){setNav(true)});
  if(closeB) closeB.addEventListener('click',function(){setNav(false)});

  /* mega menü */
  qa('.has-mega>.nav-l').forEach(function(b){
    b.addEventListener('click',function(e){
      var li=b.parentNode, open=!li.classList.contains('open');
      qa('.has-mega.open').forEach(function(x){ if(x!==li){x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false');} });
      li.classList.toggle('open',open); b.setAttribute('aria-expanded',open);
    });
  });
  d.addEventListener('click',function(e){ if(window.innerWidth>1100 && !e.target.closest('.has-mega')) qa('.has-mega.open').forEach(function(x){x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false');}); });
  d.addEventListener('keydown',function(e){ if(e.key==='Escape'){ qa('.has-mega.open').forEach(function(x){x.classList.remove('open')}); setNav(false); setSheet(false);} });
  if(params.get('menu')==='1'){ setNav(true); var first=qs('.has-mega'); if(first){first.classList.add('open');} }

  /* sekmeler (pano, katalog) */
  qa('[role="tablist"]').forEach(function(list){
    var tabs=qa('[role="tab"]',list), target=qs(list.getAttribute('data-target'));
    tabs.forEach(function(t){
      t.addEventListener('click',function(){
        tabs.forEach(function(x){x.setAttribute('aria-selected',x===t)});
        var f=t.getAttribute('data-f');
        if(target){ qa('[data-k]',target).forEach(function(it){ it.hidden = !(f==='all' || (' '+it.getAttribute('data-k')+' ').indexOf(' '+f+' ')>-1); }); }
        var cnt=qs('[data-count]'); if(cnt && target){ cnt.textContent=qa('[data-k]:not([hidden])',target).length; }
      });
    });
  });

  /* filtre paneli */
  var sheet=qs('.filters'), bg=qs('.sheet-bg');
  function setSheet(open){ if(!sheet) return; sheet.classList.toggle('open',open); if(bg) bg.classList.toggle('open',open); }
  qa('[data-sheet]').forEach(function(b){ b.addEventListener('click',function(){ setSheet(b.getAttribute('data-sheet')==='open'); }); });
  if(bg) bg.addEventListener('click',function(){setSheet(false)});
  if(params.get('filtre')==='1') setSheet(true);

  /* chip toggles */
  qa('.chip[aria-pressed]').forEach(function(c){ c.addEventListener('click',function(){ c.setAttribute('aria-pressed', c.getAttribute('aria-pressed')!=='true'); }); });
  qa('.vbtn').forEach(function(v){ v.addEventListener('click',function(){ qa('.vbtn').forEach(function(x){x.setAttribute('aria-pressed',x===v)}); }); });

  /* galeri */
  var view=qs('.gal-main .view');
  qa('.gt').forEach(function(t){
    t.addEventListener('click',function(){
      qa('.gt').forEach(function(x){x.setAttribute('aria-pressed',x===t)});
      view.style.cssText=t.getAttribute('data-style'); view.className='view'+(t.hasAttribute('data-crop')?' crop':'');
      view.setAttribute('aria-label',t.getAttribute('aria-label'));
    });
  });

  /* adet */
  var qin=qs('.qty input');
  if(qin){
    var price=+qin.getAttribute('data-price'), tot=qs('[data-total]');
    function upd(){ var n=Math.max(1,parseInt(qin.value||'1',10)); qin.value=n; if(tot) tot.textContent=(n*price).toLocaleString('tr-TR')+' ₺'; }
    qa('.qty button').forEach(function(b){ b.addEventListener('click',function(){ qin.value=(parseInt(qin.value,10)||1)+(+b.getAttribute('data-step')); upd(); }); });
    qin.addEventListener('input',upd); upd();
  }

  /* geri sayım */
  qa('[data-cd]').forEach(function(el){
    var t=new Date(el.getAttribute('data-cd')).getTime();
    function tick(){
      var s=Math.max(0,Math.floor((t-Date.now())/1000)), dd=Math.floor(s/86400), hh=Math.floor(s%86400/3600), mm=Math.floor(s%3600/60);
      var b=qa('b',el); if(b.length>=3){ b[0].textContent=String(dd).padStart(2,'0'); b[1].textContent=String(hh).padStart(2,'0'); b[2].textContent=String(mm).padStart(2,'0'); }
    }
    tick(); setInterval(tick,30000);
  });
  qa('[data-days]').forEach(function(el){
    var t=new Date(el.getAttribute('data-days')).getTime(), n=Math.ceil((t-Date.now())/86400000);
    if(n>1) el.textContent=n+' gün kaldı'; else if(n===1) el.textContent='Yarın'; else if(n===0) el.textContent='Bugün';
  });

  /* bayi il filtresi */
  var il=qs('#il');
  if(il){
    il.addEventListener('change',function(){
      var v=il.value, n=0;
      qa('.dl-items li').forEach(function(li){ var ok=(v==='all'||li.getAttribute('data-il')===v); li.hidden=!ok; if(ok)n++; });
      qa('.map [data-pin]').forEach(function(p){ p.setAttribute('opacity', (v==='all'||p.getAttribute('data-pin')===v)?'1':'.25'); });
      var c=qs('[data-dcount]'); if(c) c.textContent=n;
    });
  }

  /* formlar: önizleme */
  qa('form[data-demo]').forEach(function(f){
    f.addEventListener('submit',function(e){ e.preventDefault(); var m=qs('.form-done',f); if(m){ m.hidden=false; m.focus(); } });
  });

  /* panodaki ikincil dosya menüsü: dışarı tıklayınca kapan */
  d.addEventListener('click',function(e){ qa('details.more[open]').forEach(function(m){ if(!m.contains(e.target)) m.removeAttribute('open'); }); });
})();
