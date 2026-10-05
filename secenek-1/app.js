(function(){
  var d=document, q=new URLSearchParams(location.search);
  try{ if(window.top!==window.self) d.documentElement.classList.add('embed'); }catch(e){ d.documentElement.classList.add('embed'); }

  /* missing photos: keep the frame, hide broken icon */
  d.querySelectorAll('.photo img').forEach(function(img){
    function miss(){ img.parentNode.classList.add('missing'); }
    if(img.complete && img.naturalWidth===0) miss(); else img.addEventListener('error',miss);
  });

  /* mobile menu */
  var mb=d.querySelector('.menu-btn'), mn=d.getElementById('mnav');
  function setMenu(open){
    if(!mb||!mn) return;
    mb.setAttribute('aria-expanded',open?'true':'false');
    mn.classList.toggle('open',open); mn.hidden=!open;
    mb.querySelector('.lbl').textContent=open?'Kapat':'Menü';
    d.body.style.overflow=open?'hidden':'';
  }
  if(mb){ mb.addEventListener('click',function(){ setMenu(mb.getAttribute('aria-expanded')!=='true'); }); }
  d.addEventListener('keydown',function(e){ if(e.key==='Escape'){ setMenu(false); setSheet(false); var s=d.querySelector('.screens'); if(s) s.open=false; } });

  /* catalog: tabs + filters */
  var cards=[].slice.call(d.querySelectorAll('.pcard[data-kademe]'));
  var tabs=[].slice.call(d.querySelectorAll('.tab[data-k]'));
  var cur='all';
  function apply(){
    var checked={};
    d.querySelectorAll('.filters input[type=checkbox]:checked').forEach(function(c){ (checked[c.name]=checked[c.name]||[]).push(c.value); });
    var n=0;
    cards.forEach(function(c){
      var ok=(cur==='all'||c.dataset.kademe===cur);
      Object.keys(checked).forEach(function(k){ if(ok && checked[k].indexOf(c.dataset[k])<0) ok=false; });
      c.hidden=!ok; if(ok) n++;
    });
    var cn=d.querySelector('[data-count]'); if(cn) cn.textContent=n+' ürün listeleniyor';
    var sc=d.querySelector('[data-sheet-count]'); if(sc) sc.textContent=n+' ürünü göster';
  }
  tabs.forEach(function(t){ t.addEventListener('click',function(){
    tabs.forEach(function(o){ o.setAttribute('aria-selected','false'); });
    t.setAttribute('aria-selected','true'); cur=t.dataset.k; apply();
  }); });
  d.querySelectorAll('.filters input').forEach(function(i){ i.addEventListener('change',apply); });
  var clr=d.querySelector('[data-clear]');
  if(clr) clr.addEventListener('click',function(){ d.querySelectorAll('.filters input:checked').forEach(function(i){ i.checked=false; }); apply(); });
  if(cards.length){
    var h=(location.hash||'').replace('#','');
    tabs.forEach(function(t){ if(t.dataset.k===h){ t.click(); } });
    apply();
  }

  /* filter sheet */
  var fs=d.querySelector('.filters'), scrim=d.querySelector('.scrim');
  function setSheet(open){
    if(!fs) return;
    fs.classList.toggle('open',open); if(scrim) scrim.classList.toggle('open',open);
    d.querySelectorAll('.filter-btn').forEach(function(b){ b.setAttribute('aria-expanded',open?'true':'false'); });
  }
  d.querySelectorAll('.filter-btn').forEach(function(b){ b.addEventListener('click',function(){ setSheet(true); }); });
  d.querySelectorAll('[data-close-sheet]').forEach(function(b){ b.addEventListener('click',function(){ setSheet(false); }); });
  if(scrim) scrim.addEventListener('click',function(){ setSheet(false); });

  /* exam filter */
  var ef=[].slice.call(d.querySelectorAll('[data-ef]'));
  ef.forEach(function(b){ b.addEventListener('change',function(){
    var v=b.value;
    d.querySelectorAll('.erow').forEach(function(r){ r.hidden=!(v==='all'||r.dataset.k.indexOf(v)>-1); });
    d.querySelectorAll('.month').forEach(function(m){ m.hidden=!m.querySelector('.erow:not([hidden])'); });
  }); });

  /* gallery */
  var gm=d.querySelector('.gal-main');
  d.querySelectorAll('.gal-thumbs button').forEach(function(b){ b.addEventListener('click',function(){
    d.querySelectorAll('.gal-thumbs button').forEach(function(o){ o.setAttribute('aria-pressed','false'); });
    b.setAttribute('aria-pressed','true');
    gm.innerHTML=b.innerHTML;
  }); });

  /* quantity */
  d.querySelectorAll('.qty').forEach(function(w){
    var i=w.querySelector('input');
    w.querySelectorAll('button').forEach(function(b){ b.addEventListener('click',function(){
      var v=parseInt(i.value||'1',10)+(b.dataset.d==='+'?1:-1); i.value=Math.max(1,v);
    }); });
  });

  /* dealers */
  var ds=d.getElementById('il');
  function dealers(){
    var v=ds.value, n=0;
    d.querySelectorAll('.dlist li').forEach(function(li){ var ok=(v==='all'||li.dataset.il===v); li.hidden=!ok; if(ok)n++; });
    d.querySelectorAll('[data-pin]').forEach(function(p){ p.setAttribute('opacity',(v==='all'||p.dataset.pin===v)?'1':'.3'); });
    var c=d.querySelector('[data-dcount]'); if(c) c.textContent=n+' satış noktası';
  }
  if(ds){ ds.addEventListener('change',dealers); if(q.get('il')){ ds.value=q.get('il'); } dealers(); }

  /* forms are demo-only */
  d.querySelectorAll('form[data-demo]').forEach(function(f){ f.addEventListener('submit',function(e){
    e.preventDefault(); var m=f.querySelector('.form-ok'); if(m){ m.hidden=false; m.focus(); }
  }); });

  /* states for the phone showcase */
  var ek=q.get('ekran');
  if(ek==='menu') setMenu(true);
  if(ek==='filtre') setSheet(true);
  var k=q.get('kaydir');
  if(k){ var t=d.getElementById(k); if(t){ var go=function(){ window.scrollTo({top:t.getBoundingClientRect().top+window.pageYOffset-84,behavior:'instant'}); }; go(); window.addEventListener('load',go); } }
})();
