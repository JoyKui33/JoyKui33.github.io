(function(){
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // mark experience bullets as staggered items
  document.querySelectorAll('.work ul.bullets li').forEach(function(li){ li.classList.add('st-item'); });

  // count-up animation
  function countUp(el){
    var to = parseFloat(el.dataset.to), dec = parseInt(el.dataset.dec || 0, 10), suf = el.dataset.suffix || '';
    var dur = 1100, start = null;
    function frame(t){
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      p = 1 - Math.pow(1 - p, 3);
      el.textContent = (to * p).toFixed(dec) + suf;
      if (p < 1) { requestAnimationFrame(frame); } else { el.textContent = to.toFixed(dec) + suf; }
    }
    requestAnimationFrame(frame);
  }

  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.st-item').forEach(function(el, i){
          setTimeout(function(){ el.classList.add('in'); }, i * 70);
        });
        e.target.querySelectorAll('.count').forEach(countUp);
        io.unobserve(e.target);
      });
    }, {threshold: .12});
    reveals.forEach(function(el){ io.observe(el); });
  } else {
    reveals.forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('.st-item').forEach(function(el){ el.classList.add('in'); });
  }

  // cursor-reactive spotlight
  var glow = document.getElementById('glow');
  if (glow) {
    window.addEventListener('pointermove', function(ev){
      glow.style.setProperty('--mx', ev.clientX + 'px');
      glow.style.setProperty('--my', ev.clientY + 'px');
    }, {passive: true});
  }

  // dark-mode toggle (persisted)
  var root = document.documentElement, tbtn = document.getElementById('themeToggle');
  function setTheme(mode){
    if (mode === 'dark') { root.setAttribute('data-theme', 'dark'); if (tbtn) tbtn.textContent = '◐ light'; }
    else { root.removeAttribute('data-theme'); if (tbtn) tbtn.textContent = '◐ dark'; }
    try { localStorage.setItem('kui-theme', mode); } catch(e) {}
  }
  var saved = 'light';
  try { saved = localStorage.getItem('kui-theme') || 'light'; } catch(e) {}
  setTheme(saved);
  if (tbtn) tbtn.addEventListener('click', function(){
    setTheme(root.hasAttribute('data-theme') ? 'light' : 'dark');
  });

  // terminal typing animation (home page only)
  var caret = document.getElementById('caret'), cmd1 = document.getElementById('cmd1'),
      out1 = document.getElementById('out1'), line3 = document.getElementById('line3'),
      cmd2 = document.getElementById('cmd2');
  if (!(caret && cmd1 && out1 && line3 && cmd2)) return;
  function typeInto(el, text, speed, done){
    var i = 0;
    (function step(){
      el.textContent = text.slice(0, i);
      if (i++ <= text.length) { setTimeout(step, speed); }
      else if (done) { done(); }
    })();
  }
  function moveCaret(after){ after.parentNode.insertBefore(caret, after.nextSibling); }
  setTimeout(function(){
    typeInto(cmd1, 'whoami', 85, function(){
      setTimeout(function(){
        out1.classList.add('show');
        setTimeout(function(){
          line3.classList.add('show');
          moveCaret(cmd2);
          typeInto(cmd2, 'cat ./work →', 70);
        }, 420);
      }, 350);
    });
  }, 500);
})();
