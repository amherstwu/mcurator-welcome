/**
 * About MCurator — atmospheric floating particles (Framer-style).
 * Dark, slow, museum-grade; pointer-events none; pauses when tab hidden / phase stopped / reduced motion.
 */
(function (global) {
  var rafId = null;
  var canvas = null;
  var ctx = null;
  var particles = [];
  var running = false;
  var cw = 0;
  var ch = 0;
  var dpr = 1;
  var reduceMotion = false;
  var mouseX = 0;
  var mouseY = 0;
  var mouseOn = false;
  var resizeTimer = null;
  var boundResize = null;
  var boundVis = null;
  var boundMove = null;
  var boundLeave = null;
  var lastTickSec = 0;

  function prefersReducedMotion() {
    try {
      return global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function isCoarsePointer() {
    try {
      return global.matchMedia && global.matchMedia('(pointer: coarse)').matches;
    } catch (e) {
      return false;
    }
  }

  function isNarrow() {
    try {
      return global.matchMedia && global.matchMedia('(max-width: 768px)').matches;
    } catch (e) {
      return false;
    }
  }

  function particleCount() {
    var area = Math.max(320, cw) * Math.max(480, ch);
    var base = Math.floor(area / 42000);
    var n = Math.max(14, Math.min(isNarrow() ? 48 : 88, base));
    if (isNarrow()) n = Math.max(10, Math.floor(n * 0.5));
    return n;
  }

  function rebuildParticles() {
    particles.length = 0;
    var n = particleCount();
    var i;
    for (i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * cw,
        y: Math.random() * ch,
        r: 0.4 + Math.random() * 1.15,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        o: 0.07 + Math.random() * 0.16,
        ph: Math.random() * Math.PI * 2,
        sp: 0.35 + Math.random() * 0.55,
      });
    }
  }

  function resize() {
    if (!canvas || !ctx) return;
    dpr = Math.min(2, global.devicePixelRatio || 1);
    cw = global.innerWidth || 800;
    ch = global.innerHeight || 600;
    canvas.width = Math.floor(cw * dpr);
    canvas.height = Math.floor(ch * dpr);
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    rebuildParticles();
  }

  function onResize() {
    if (resizeTimer) global.clearTimeout(resizeTimer);
    resizeTimer = global.setTimeout(function () {
      resizeTimer = null;
      resize();
    }, 160);
  }

  function onVisibility() {
    if (global.document && global.document.hidden) {
      if (rafId) {
        global.cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (running) {
      tick();
    }
  }

  function onMove(e) {
    if (isCoarsePointer()) return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouseOn = true;
  }

  function onLeave() {
    mouseOn = false;
  }

  function tick(now) {
    if (!running || !ctx || !canvas) return;
    if (global.document && global.document.hidden) return;
    var t = (typeof now === 'number' ? now : 0) * 0.001;
    if (!lastTickSec) lastTickSec = t;
    var dt = Math.min(0.05, Math.max(0, t - lastTickSec));
    lastTickSec = t;

    var mx = 0;
    var my = 0;
    if (mouseOn && !isCoarsePointer()) {
      mx = ((mouseX / cw) - 0.5) * 10;
      my = ((mouseY / ch) - 0.5) * 10;
    }

    ctx.clearRect(0, 0, cw, ch);
    var i;
    for (i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.ph += dt * p.sp * 0.35;
      p.x += p.vx * (60 * dt) + mx * 0.012;
      p.y += p.vy * (60 * dt) + my * 0.012;
      p.vx += Math.sin(p.ph) * 0.0008;
      p.vy += Math.cos(p.ph * 0.9) * 0.0008;
      if (p.x < -20) p.x = cw + 20;
      if (p.x > cw + 20) p.x = -20;
      if (p.y < -20) p.y = ch + 20;
      if (p.y > ch + 20) p.y = -20;

      var pulse = 0.85 + 0.15 * Math.sin(p.ph);
      var o = p.o * pulse;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(218, 186, 112, ' + (o * 0.55).toFixed(3) + ')';
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(244, 239, 226, ' + (o * 0.22).toFixed(3) + ')';
      ctx.arc(p.x - 0.2, p.y - 0.2, p.r * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = global.requestAnimationFrame(tick);
  }

  function start() {
    canvas = global.document.getElementById('aboutParticlesCanvas');
    if (!canvas) return;
    reduceMotion = prefersReducedMotion();
    if (reduceMotion) {
      canvas.style.display = 'none';
      return;
    }
    canvas.style.display = 'block';
    ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    running = true;
    lastTickSec = 0;
    resize();
    boundResize = boundResize || onResize;
    boundVis = boundVis || onVisibility;
    boundMove = boundMove || onMove;
    boundLeave = boundLeave || onLeave;
    global.addEventListener('resize', boundResize, { passive: true });
    global.document.addEventListener('visibilitychange', boundVis);
    if (!isCoarsePointer()) {
      global.document.addEventListener('mousemove', boundMove, { passive: true });
      global.document.addEventListener('mouseleave', boundLeave, { passive: true });
    }
    if (rafId) global.cancelAnimationFrame(rafId);
    rafId = global.requestAnimationFrame(tick);
  }

  function stop() {
    running = false;
    if (rafId) {
      global.cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (boundResize) global.removeEventListener('resize', boundResize);
    if (boundVis) global.document.removeEventListener('visibilitychange', boundVis);
    if (boundMove) global.document.removeEventListener('mousemove', boundMove);
    if (boundLeave) global.document.removeEventListener('mouseleave', boundLeave);
    boundResize = null;
    boundVis = null;
    boundMove = null;
    boundLeave = null;
    if (ctx && canvas && cw > 0 && ch > 0) {
      try {
        ctx.clearRect(0, 0, cw, ch);
      } catch (e0) {}
    }
    ctx = null;
  }

  global.MCAboutParticles = { start: start, stop: stop };
})(typeof window !== 'undefined' ? window : this);
