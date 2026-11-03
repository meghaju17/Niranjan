/* ==========================================================================
   For You ❤️  —  interactions
   Reads all text from js/config.js and brings the page to life.
   ========================================================================== */

(function () {
  'use strict';

  const C = window.CONFIG;
  if (!C) { console.error('js/config.js did not load.'); return; }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const fill = (s) => String(s == null ? '' : s)
    .replace(/\{name\}/g, C.boyfriendName || 'my love')
    .replace(/\{signature\}/g, C.signature || '');
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const setText = (id, text) => { const n = document.getElementById(id); if (n) n.textContent = fill(text); };

  const music = new window.RomanticMusic(C.music);

  /* ---------- fill in all the text ---------- */
  document.title = fill(C.pageTitle || 'For You ❤️');

  const intro = C.intro || {};
  setText('introFor', intro.for);
  setText('introTitle', intro.title);
  setText('introSub', intro.subtitle);
  setText('openBtn', intro.button);
  setText('introHint', intro.hint);

  const apology = C.apology || {};
  setText('apologyEyebrow', apology.eyebrow);
  setText('apologyTitle', apology.title);

  const cards = C.cards || {};
  setText('cardsEyebrow', cards.eyebrow);
  setText('cardsTitle', cards.title);
  setText('cardsSub', cards.subtitle);

  const letter = C.letter || {};
  setText('letterEyebrow', letter.eyebrow);
  setText('letterTitle', letter.title);

  const reasons = C.reasons || {};
  setText('reasonsEyebrow', reasons.eyebrow);
  setText('reasonsTitle', reasons.title);
  setText('reasonsSub', reasons.subtitle);

  const fin = C.finale || {};
  setText('fLead', fin.lead);
  setText('fImportant', fin.important);
  (fin.trio || []).forEach((t, i) => setText('fTrio' + (i + 1), t));
  setText('fSorry', fin.sorry);
  setText('fLove', fin.love);
  setText('hugPrompt', fin.hugPrompt);
  setText('hugBtn', fin.hugButton);
  setText('fNote', fin.note);
  setText('footer', (C.footer || '') + (C.yourName ? ' by ' + C.yourName : ''));
  $('#hugMsg').textContent = fill(fin.hugMessage);

  /* ---------- scroll reveal / visibility helpers ---------- */
  function onceVisible(node, cb, threshold) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { obs.disconnect(); cb(); }
      });
    }, { threshold: threshold || 0.2 });
    obs.observe(node);
  }

  /* ---------- typewriter ---------- */
  function makeTypewriter(box, text, skipBtn) {
    box.innerHTML = '';
    const ghost = el('span', 'ghost'); ghost.textContent = text;
    const live = el('span', 'live');
    const node = document.createTextNode('');
    const cursor = el('span', 'cursor');
    live.append(node, cursor);
    box.append(ghost, live);

    let i = 0, timer = null, finished = false, userScrolled = false;
    const stopFollow = () => { userScrolled = true; };
    window.addEventListener('wheel', stopFollow, { passive: true });
    window.addEventListener('touchmove', stopFollow, { passive: true });

    function finish() {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      node.data = text;
      cursor.remove();
      if (skipBtn) skipBtn.classList.add('gone');
    }

    function follow() {
      if (userScrolled) return;
      const r = cursor.getBoundingClientRect();
      const limit = window.innerHeight * 0.82;
      if (r.bottom > limit) window.scrollBy({ top: r.bottom - limit + 40, behavior: 'smooth' });
    }

    function tick() {
      if (i >= text.length) { finish(); return; }
      i++;
      node.data = text.slice(0, i);
      const ch = text[i - 1];
      let d = C.typingSpeed || 34;
      if ('.!?'.includes(ch)) d *= 9;
      else if (ch === ',') d *= 4;
      else if (ch === '\n') d *= 5;
      if (i % 12 === 0) follow();
      timer = setTimeout(tick, d);
    }

    if (skipBtn) skipBtn.addEventListener('click', finish);
    return {
      start(delay) {
        if (reduceMotion) { finish(); return; }
        setTimeout(tick, delay || 0);
      }
    };
  }

  const apologyText = (apology.paragraphs || []).map(fill).join('\n\n');
  const apologyType = makeTypewriter($('#apologyText'), apologyText, $('#apologySkip'));
  onceVisible($('#apologyText'), () => apologyType.start(1400), 0.2);

  const letterText =
    [fill(letter.greeting || ''), ...(letter.paragraphs || []).map(fill)].join('\n\n') +
    '\n\n' + (letter.closing || []).map(fill).join('\n');
  const letterType = makeTypewriter($('#letterText'), letterText, $('#letterSkip'));
  onceVisible($('#letterText'), () => letterType.start(700), 0.2);

  /* ---------- 3. flip cards ---------- */
  const grid = $('#cardGrid');
  (cards.items || []).forEach((txt, i) => {
    const b = el('button', 'flip reveal');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.style.transitionDelay = (i % 3) * 120 + 'ms';
    b.innerHTML =
      '<span class="flip-inner">' +
        '<span class="face front"><span class="front-heart">♥</span>' +
        '<span class="front-label">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="front-hint">tap to open</span></span>' +
        '<span class="face back"><span class="back-text">' + esc(fill(txt)) + '</span></span>' +
      '</span>';
    b.addEventListener('click', () => {
      const on = b.classList.toggle('flipped');
      b.setAttribute('aria-pressed', String(on));
    });
    grid.append(b);
  });

  /* ---------- optional memories ---------- */
  const mem = C.memories || {};
  if (mem.items && mem.items.length) {
    $('#memories').classList.remove('hidden');
    setText('memEyebrow', mem.eyebrow);
    setText('memTitle', mem.title);
    setText('memSub', mem.subtitle);
    const list = $('#memList');
    mem.items.forEach((m) => {
      const d = el('div', 'glass mem reveal');
      d.innerHTML = '<h3>' + esc(fill(m.title)) + '</h3><p>' + esc(fill(m.text)) + '</p>';
      list.append(d);
    });
    // make the previous section's arrow point to memories (already does)
  } else {
    // skip the hidden section when following the letter's arrow
    const cue = $('#letter .scroll-cue');
    if (cue) cue.setAttribute('href', '#reasons');
  }

  /* ---------- reveal on scroll (after dynamic content exists) ---------- */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((n) => revealObs.observe(n));

  /* ---------- 5. carousel ---------- */
  const items = reasons.items || [];
  const track = $('#carouselTrack');
  const dotsWrap = $('#dots');
  const counter = $('#counter');
  let idx = 0;

  items.forEach((r, i) => {
    const s = el('div', 'slide');
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', (i + 1) + ' of ' + items.length);
    s.innerHTML =
      '<div class="glass slide-card"><span class="slide-heart">♥</span>' +
      '<h3 class="slide-title">' + esc(fill(r.title)) + '</h3>' +
      '<p class="slide-text">' + esc(fill(r.text)) + '</p></div>';
    track.append(s);

    const d = el('button', 'dot', '♥');
    d.type = 'button';
    d.setAttribute('aria-label', 'Reason ' + (i + 1));
    d.addEventListener('click', () => go(i));
    dotsWrap.append(d);
  });

  function go(n) {
    if (!items.length) return;
    idx = (n + items.length) % items.length;
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    $$('.dot', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === idx));
    $$('.slide', track).forEach((s, i) => s.setAttribute('aria-hidden', String(i !== idx)));
    counter.textContent = (idx + 1) + ' / ' + items.length;
  }
  $('#prevBtn').addEventListener('click', () => go(idx - 1));
  $('#nextBtn').addEventListener('click', () => go(idx + 1));
  $('#carousel').addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(idx - 1);
    if (e.key === 'ArrowRight') go(idx + 1);
  });

  // swipe
  (function () {
    const vp = $('#carouselViewport');
    let sx = null;
    vp.addEventListener('pointerdown', (e) => { sx = e.clientX; });
    vp.addEventListener('pointerup', (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx;
      if (Math.abs(dx) > 45) go(idx + (dx < 0 ? 1 : -1));
      sx = null;
    });
    vp.addEventListener('pointercancel', () => { sx = null; });
  })();
  go(0);

  /* ---------- background: stars + floating hearts ---------- */
  const bgC = $('#bg'), fxC = $('#fx');
  const bctx = bgC.getContext('2d'), fctx = fxC.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  const bgParts = [];
  const PALETTE = ['255,138,176', '200,170,240', '255,190,205', '240,120,170', '255,214,227'];

  function heartPath(ctx, x, y, s) {
    ctx.beginPath();
    ctx.moveTo(x, y + s * 0.35);
    ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x - s * 0.5, y + s * 0.65, x, y + s * 0.8, x, y + s * 1.05);
    ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.65, x + s * 0.5, y + s * 0.3);
    ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.35);
    ctx.closePath();
  }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    [bgC, fxC].forEach((c) => {
      c.width = W * DPR; c.height = H * DPR;
      c.style.width = W + 'px'; c.style.height = H + 'px';
    });
    bctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initBg();
  }

  function initBg() {
    bgParts.length = 0;
    const small = W < 700;
    const stars = small ? 36 : 68, hearts = small ? 9 : 16;
    for (let i = 0; i < stars; i++) {
      bgParts.push({ t: 's', x: rand(0, W), y: rand(0, H), r: rand(0.7, 2.1), tw: rand(0, 6.28), sp: rand(0.01, 0.035) });
    }
    for (let i = 0; i < hearts; i++) {
      bgParts.push({
        t: 'h', x: rand(0, W), y: rand(0, H), s: rand(10, 30), vy: rand(0.15, 0.4),
        sw: rand(0, 6.28), sws: rand(0.004, 0.011), amp: rand(10, 28),
        a: rand(0.16, 0.38), c: PALETTE[Math.floor(rand(0, PALETTE.length))]
      });
    }
  }

  function drawBg() {
    bctx.clearRect(0, 0, W, H);
    for (const p of bgParts) {
      if (p.t === 's') {
        p.tw += p.sp;
        const a = 0.3 + 0.7 * (Math.sin(p.tw) + 1) / 2;
        bctx.shadowColor = 'rgba(240,138,176,0.9)';
        bctx.shadowBlur = 8;
        bctx.fillStyle = 'rgba(255,255,255,' + a.toFixed(3) + ')';
        bctx.beginPath(); bctx.arc(p.x, p.y, p.r, 0, 6.2832); bctx.fill();
        bctx.shadowBlur = 0;
      } else {
        if (!reduceMotion) { p.y -= p.vy; p.sw += p.sws; }
        if (p.y < -40) { p.y = H + 30; p.x = rand(0, W); }
        const x = p.x + Math.sin(p.sw) * p.amp;
        bctx.fillStyle = 'rgba(' + p.c + ',' + p.a + ')';
        heartPath(bctx, x, p.y, p.s);
        bctx.fill();
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawBg);
  }

  window.addEventListener('resize', () => { resize(); if (reduceMotion) drawBg(); });
  resize();
  drawBg();

  /* ---------- scroll: the page slowly warms from dusk to blush ---------- */
  const STOPS = [['#cdbfe3', '#e7d3e6'], ['#d8c6ea', '#f1d5e6'], ['#e6cbe8', '#fdddE8'], ['#f4d1e2', '#ffe8ea'], ['#ffd6e3', '#fff0e8']]
    .map((pair) => pair.map((h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))));
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  let opened = false, ticking = false;

  function updateBg() {
    ticking = false;
    if (!opened) return;
    const finale = $('#finale');
    const max = Math.max(1, finale.offsetTop - window.innerHeight * 0.6);
    const f = clamp(window.scrollY / max, 0, 1) * (STOPS.length - 1);
    const i = Math.min(Math.floor(f), STOPS.length - 2), t = f - i;
    const a = mix(STOPS[i][0], STOPS[i + 1][0], t), b = mix(STOPS[i][1], STOPS[i + 1][1], t);
    const root = document.documentElement.style;
    root.setProperty('--bg-a', 'rgb(' + a.join(',') + ')');
    root.setProperty('--bg-b', 'rgb(' + b.join(',') + ')');

    // music button adapts when we're over the dark finale
    const overDark = window.scrollY + 40 > finale.offsetTop + window.innerHeight * 0.2;
    musicBtn.classList.toggle('on-dark', overDark);
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateBg); }
  }, { passive: true });

  /* ---------- opening the website ---------- */
  const musicBtn = $('#musicBtn');
  const introEl = $('#intro');
  const mainEl = $('#main');

  $('#openBtn').addEventListener('click', () => {
    music.start();                       // only starts because of this click
    musicBtn.classList.remove('hidden');
    mainEl.classList.remove('hidden');
    document.body.classList.remove('locked');
    window.scrollTo(0, 0);
    introEl.classList.add('leaving');
    requestAnimationFrame(() => requestAnimationFrame(() => mainEl.classList.add('visible')));
    setTimeout(() => introEl.classList.add('hidden'), 1500);
    opened = true;
    updateBg();
  });

  musicBtn.addEventListener('click', () => {
    const muted = music.toggle();
    musicBtn.classList.toggle('muted', muted);
    musicBtn.setAttribute('aria-pressed', String(muted));
    musicBtn.setAttribute('aria-label', muted ? 'Unmute music' : 'Mute music');
  });

  /* ---------- 6. finale: glowing hearts + slow reveal ---------- */
  (function () {
    const layer = $('#glowLayer');
    const n = window.innerWidth < 700 ? 12 : 22;
    for (let i = 0; i < n; i++) {
      const h = el('span', 'glow-heart', '♥');
      h.style.left = rand(2, 96) + '%';
      h.style.fontSize = rand(12, 34) + 'px';
      h.style.animationDuration = rand(10, 20) + 's';
      h.style.animationDelay = (-rand(0, 20)) + 's';
      layer.append(h);
    }
  })();

  const finaleItems = $$('.f-item');
  onceVisible($('#finaleSeq'), () => {
    finaleItems.forEach((it) => {
      const d = reduceMotion ? 0 : Number(it.dataset.delay || 0);
      setTimeout(() => it.classList.add('show'), d);
    });
  }, 0.25);

  /* ---------- 7. the hug: heart explosion ---------- */
  const fx = [];
  let fxRunning = false;

  function addHeart(o) {
    fx.push(Object.assign({ x: 0, y: 0, vx: 0, vy: 0, g: 0, size: 16, life: 0, max: 160, ang: rand(-0.6, 0.6), rot: rand(-0.04, 0.04), c: PALETTE[Math.floor(rand(0, PALETTE.length))] }, o));
  }

  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = rand(0, 6.2832), sp = rand(3, 11);
      addHeart({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 2, g: 0.14, size: rand(12, 30), max: rand(110, 200) });
    }
    runFx();
  }

  function rain(ms) {
    const end = performance.now() + ms;
    (function spawn() {
      if (performance.now() > end) return;
      for (let i = 0; i < 3; i++) {
        addHeart({ x: rand(0, W), y: H + 30, vx: rand(-0.7, 0.7), vy: -rand(1.6, 3.6), size: rand(14, 34), max: rand(300, 460) });
      }
      runFx();
      setTimeout(spawn, 100);
    })();
  }

  function runFx() {
    if (fxRunning) return;
    fxRunning = true;
    (function frame() {
      fctx.clearRect(0, 0, W, H);
      for (let i = fx.length - 1; i >= 0; i--) {
        const p = fx[i];
        p.x += p.vx; p.y += p.vy; p.vy += p.g; p.vx *= 0.995; p.ang += p.rot; p.life++;
        const k = p.life / p.max;
        if (k >= 1 || p.y < -60) { fx.splice(i, 1); continue; }
        fctx.save();
        fctx.translate(p.x, p.y);
        fctx.rotate(p.ang);
        fctx.shadowColor = 'rgba(255,100,160,0.8)';
        fctx.shadowBlur = 12;
        fctx.fillStyle = 'rgba(' + p.c + ',' + (1 - k * k).toFixed(3) + ')';
        heartPath(fctx, 0, -p.size / 2, p.size);
        fctx.fill();
        fctx.restore();
      }
      if (fx.length) requestAnimationFrame(frame);
      else { fctx.clearRect(0, 0, W, H); fxRunning = false; }
    })();
  }

  let hugged = false;
  $('#hugBtn').addEventListener('click', (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, 110);
    setTimeout(() => burst(W / 2, H * 0.45, 90), 260);
    if (!reduceMotion) rain(6500);
    $('#hugMsg').classList.add('show');
    if (!hugged) {
      hugged = true;
      e.currentTarget.textContent = 'One more hug? 🤗';
    }
  });

})();
