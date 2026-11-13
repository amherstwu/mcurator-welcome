/**
 * Welcome hero — Three.js Earth (tutorial-based).
 * Tutorial: https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
 * Repo & textures: https://github.com/franky-adl/threejs-earth (files under src/assets/)
 */
(function () {
  'use strict';

  /** Raw GitHub assets (same tree as repo). Falls back in loader on error. */
  var ASSETS_PRIMARY = 'https://raw.githubusercontent.com/franky-adl/threejs-earth/main/src/assets/';
  var ASSETS_FALLBACK = 'https://cdn.jsdelivr.net/gh/franky-adl/threejs-earth@main/src/assets/';
  /** Rotation scale vs. article's `interval * 0.005 * speedFactor` — tuned for visible but calm spin */
  var SPEED = 1.35;
  var TARGET_FPS = 36;

  function prefersReducedMotion() {
    try {
      return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function boot() {
    if (typeof THREE === 'undefined') return;
    var host = document.getElementById('mcEarthThreeHost');
    if (!host) return;
    if (host.getAttribute('data-mc-three-ready') === '1') return;
    var heroRoot = null;
    try {
      heroRoot = host.closest('#mcWelcomeHero');
    } catch (eHr) {
      void 0;
    }
    if (heroRoot && heroRoot.getAttribute('data-mc-earth-static') === '1') {
      return;
    }
    var displayOnly = !!(heroRoot && heroRoot.getAttribute('data-mc-earth-display-only') === '1');
    var earthMenuMode = !!(heroRoot && heroRoot.getAttribute('data-mc-earth-menu') === '1');
    var reducedMotion = prefersReducedMotion();
    /** Display-only hero: keep slow auto-rotation; no drag / zoom / click nudge. */
    var IDLE_SPIN = reducedMotion ? 0 : 0.12 * SPEED;
    try {
      if (document.documentElement.classList.contains('mc-debug-no-3d')) return;
    } catch (e0) {
      void 0;
    }

    var wrap = host.closest('.mc-earth-hero-bg__globe-wrap');
    if (!wrap) return;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (eGl) {
      return;
    }
    if (!renderer.getContext()) return;

    host.setAttribute('data-mc-three-ready', '1');

    THREE.ColorManagement.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.style.cssText = 'display:block;width:100%;height:100%;outline:none;border-radius:50%;transform:translateZ(0);backface-visibility:hidden';
    host.appendChild(canvas);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 26);

    var group = new THREE.Group();
    group.rotation.z = (23.5 / 360) * 2 * Math.PI;
    scene.add(group);
    var baseTilt = group.rotation.z;

    var sun = new THREE.DirectionalLight(0xffffff, 2.05);
    sun.position.set(-58, 10, 28);
    scene.add(sun);
    var fill = new THREE.AmbientLight(0xd4dce8, 0.055);
    scene.add(fill);

    var earthGeo = new THREE.SphereGeometry(10, 64, 64);
    var earthMat = new THREE.MeshStandardMaterial({
      color: 0x0a2820,
      roughness: 0.88,
      metalness: 0.06,
    });
    var earth = new THREE.Mesh(earthGeo, earthMat);
    /** Initial longitude faces Africa / Europe toward camera (equirectangular map). */
    earth.rotation.y = 2.02;
    group.add(earth);

    var clouds = null;

    var radius = 10;

    /** Lat/lng on the textured sphere → HTML hotspot positions over the circular overlay (menu mode). */
    var hsLocal = new THREE.Vector3();
    var hsWorld = new THREE.Vector3();
    var hsProj = new THREE.Vector3();
    var earthCenterW = new THREE.Vector3();
    var hsNormal = new THREE.Vector3();
    var hsToCam = new THREE.Vector3();

    function latLonToEarthLocal(latDeg, lonDeg, r, out) {
      var lat = (latDeg * Math.PI) / 180;
      var lon = (lonDeg * Math.PI) / 180;
      out
        .set(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon))
        .multiplyScalar(r);
      return out;
    }

    function layoutMenuHotspots() {
      if (!earthMenuMode || !heroRoot) return;
      if (heroRoot.getAttribute('data-mc-earth-three-live') !== '1') return;
      var layer = document.getElementById('mcEarthHotspotsLayer');
      if (!layer) return;
      var buttons = layer.querySelectorAll('.earth-hotspot[data-mc-lat][data-mc-lng]');
      if (!buttons.length) return;

      group.updateMatrixWorld(true);
      earth.getWorldPosition(earthCenterW);

      var cw = canvas.clientWidth || 1;
      var ch = canvas.clientHeight || 1;
      var layerRect = layer.getBoundingClientRect();
      var canvasRect = canvas.getBoundingClientRect();
      if (layerRect.width < 4 || layerRect.height < 4) return;

      for (var bi = 0; bi < buttons.length; bi++) {
        var btn = buttons[bi];
        var lat = parseFloat(btn.getAttribute('data-mc-lat'));
        var lng = parseFloat(btn.getAttribute('data-mc-lng'));
        if (isNaN(lat) || isNaN(lng)) continue;

        latLonToEarthLocal(lat, lng, radius, hsLocal);
        earth.localToWorld(hsWorld.copy(hsLocal));

        hsNormal.copy(hsWorld).sub(earthCenterW).normalize();
        hsToCam.copy(camera.position).sub(hsWorld).normalize();
        var facing = hsNormal.dot(hsToCam);

        hsProj.copy(hsWorld).project(camera);

        var visible = facing > 0.05 && hsProj.z > -1.02 && hsProj.z < 1.02;
        var sx = (hsProj.x * 0.5 + 0.5) * cw;
        var sy = (-hsProj.y * 0.5 + 0.5) * ch;

        var cx = canvasRect.left + sx;
        var cy = canvasRect.top + sy;
        var pctLeft = ((cx - layerRect.left) / layerRect.width) * 100;
        var pctTop = ((cy - layerRect.top) / layerRect.height) * 100;

        btn.style.left = pctLeft.toFixed(3) + '%';
        btn.style.top = pctTop.toFixed(3) + '%';
        btn.classList.toggle('earth-hotspot--occluded', !visible);
      }
    }

    function resize() {
      var w = Math.max(80, Math.floor(host.clientWidth || wrap.clientWidth || 400));
      var h = Math.max(80, Math.floor(host.clientHeight || wrap.clientHeight || 400));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      if (earthMenuMode) layoutMenuHotspots();
    }

    resize();
    try {
      if (window.ResizeObserver) {
        var ro = new ResizeObserver(resize);
        ro.observe(wrap);
      }
    } catch (eRo) {
      void 0;
    }
    window.addEventListener('resize', resize, { passive: true });

    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    function onAlbedoLoaded(tex) {
      tex.colorSpace = THREE.SRGBColorSpace;
      earth.material.map = tex;
      earth.material.color.setHex(0xffffff);
      earth.material.needsUpdate = true;
      wrap.classList.add('mc-earth-hero-bg__globe-wrap--three-live');
      var heroRoot = host.closest('#mcWelcomeHero');
      var hr = host.closest('#mcWelcomeHero');
      if (hr) hr.setAttribute('data-mc-earth-three-live', '1');
      if (earthMenuMode) layoutMenuHotspots();
    }

    function loadTex(path, onLoad, onErr) {
      loader.load(
        ASSETS_PRIMARY + path,
        onLoad,
        undefined,
        function () {
          loader.load(
            ASSETS_FALLBACK + path,
            onLoad,
            undefined,
            function () {
              if (typeof onErr === 'function') onErr();
            }
          );
        }
      );
    }

    loadTex('Albedo.jpg', onAlbedoLoaded);

    loadTex('Bump.jpg', function (tex) {
      earth.material.bumpMap = tex;
      earth.material.bumpScale = 0.03;
      earth.material.needsUpdate = true;
    });

    loadTex('Clouds.png', function (tex) {
      var cloudGeo = new THREE.SphereGeometry(10.06, 64, 64);
      var cloudMat = new THREE.MeshStandardMaterial({
        alphaMap: tex,
        transparent: true,
        depthWrite: false,
      });
      clouds = new THREE.Mesh(cloudGeo, cloudMat);
      clouds.rotation.y = earth.rotation.y;
      group.add(clouds);
    });

    var clock = new THREE.Clock();
    var running = true;
    var inViewport = true;
    var acc = 0;
    var step = 1 / TARGET_FPS;
    var autoSpin = 0;
    var targetSpin = 0;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartY = 0;
    var dragStartSpin = 0;
    var targetTilt = baseTilt;
    var pointerTilt = 0;
    var dragLastX = 0;
    var dragLastT = 0;
    var spinVelocity = IDLE_SPIN;

    try {
      document.addEventListener('visibilitychange', function () {
        running = document.visibilityState !== 'hidden';
      });
    } catch (eVis) {
      void 0;
    }

    try {
      if (window.IntersectionObserver) {
        var io = new IntersectionObserver(
          function (entries) {
            inViewport = !!(entries && entries[0] && entries[0].isIntersecting);
          },
          { threshold: 0.02 }
        );
        io.observe(wrap);
      }
    } catch (eIo) {
      void 0;
    }

    if (earthMenuMode) {
      host.style.pointerEvents = 'none';
      host.style.touchAction = 'auto';
      host.style.cursor = 'default';
    } else if (displayOnly) {
      host.style.pointerEvents = 'none';
      host.style.touchAction = 'auto';
      host.style.cursor = 'default';
      try {
        host.setAttribute('tabindex', '-1');
      } catch (eTab) {
        void 0;
      }
    } else {
      host.style.pointerEvents = 'auto';
      host.style.touchAction = 'none';
    }

    function clamp(n, min, max) {
      return Math.max(min, Math.min(max, n));
    }

    function toClientPoint(ev) {
      if (ev && ev.touches && ev.touches[0]) return ev.touches[0];
      if (ev && ev.changedTouches && ev.changedTouches[0]) return ev.changedTouches[0];
      return ev;
    }

    function startDrag(ev) {
      var pt = toClientPoint(ev);
      if (!pt) return;
      isDragging = true;
      dragStartX = pt.clientX;
      dragStartY = pt.clientY;
      dragStartSpin = targetSpin;
      dragLastX = pt.clientX;
      dragLastT = performance.now();
      spinVelocity = 0;
      host.classList.add('is-dragging');
      if (ev && ev.pointerId != null) {
        try {
          host.setPointerCapture(ev.pointerId);
        } catch (eCapture) {
          void 0;
        }
      }
    }

    if (!displayOnly && !earthMenuMode && !reducedMotion) {
      host.addEventListener(
        'pointerdown',
        startDrag,
        { passive: true }
      );

      host.addEventListener(
        'touchstart',
        function (ev) {
          startDrag(ev);
        },
        { passive: true }
      );
    }

    function moveDrag(ev) {
      var pt = toClientPoint(ev);
      if (!pt) return;
      var rect = host.getBoundingClientRect();
      var nx = rect.width ? (pt.clientX - rect.left) / rect.width : 0.5;
      var ny = rect.height ? (pt.clientY - rect.top) / rect.height : 0.5;
      pointerTilt = (nx - 0.5) * 0.28;
      targetTilt = baseTilt + (0.5 - ny) * 0.12;
      if (!isDragging) return;
      var dx = pt.clientX - dragStartX;
      targetSpin = dragStartSpin + dx * 0.01;
      var now = performance.now();
      var dtMs = Math.max(8, now - dragLastT);
      spinVelocity = clamp(((pt.clientX - dragLastX) / dtMs) * 0.35, -2.2, 2.2);
      dragLastX = pt.clientX;
      dragLastT = now;
    }

    if (!displayOnly && !earthMenuMode && !reducedMotion) {
      host.addEventListener(
        'pointermove',
        moveDrag,
        { passive: true }
      );

      host.addEventListener(
        'touchmove',
        function (ev) {
          moveDrag(ev);
          ev.preventDefault();
        },
        { passive: false }
      );
    }

    function endDrag(ev) {
      if (!isDragging) return;
      isDragging = false;
      host.classList.remove('is-dragging');
      try {
        if (ev && ev.pointerId != null) host.releasePointerCapture(ev.pointerId);
      } catch (eRelease) {
        void 0;
      }
    }

    if (!displayOnly && !earthMenuMode && !reducedMotion) {
      host.addEventListener('pointerup', endDrag, { passive: true });
      host.addEventListener('pointercancel', endDrag, { passive: true });
      host.addEventListener('touchend', endDrag, { passive: true });
      host.addEventListener('touchcancel', endDrag, { passive: true });
      host.addEventListener(
        'click',
        function () {
          spinVelocity = clamp(spinVelocity + 0.52, -2.8, 2.8);
        },
        { passive: true }
      );
      host.addEventListener(
        'pointerleave',
        function () {
          if (!isDragging) {
            pointerTilt = 0;
            targetTilt = baseTilt;
          }
        },
        { passive: true }
      );

      host.addEventListener(
        'wheel',
        function (ev) {
          ev.preventDefault();
          radius = clamp(radius + ev.deltaY * 0.0025, 8.8, 11.5);
        },
        { passive: false }
      );
    }

    function tick() {
      requestAnimationFrame(tick);
      if (!running || !inViewport) return;
      if (earthMenuMode) {
        group.rotation.y = 0;
        group.rotation.z = baseTilt;
        if (clouds) clouds.rotation.y = earth.rotation.y;
        renderer.render(scene, camera);
        return;
      }
      var dt = clock.getDelta();
      acc += dt;
      if (acc < step) return;
      dt = acc;
      acc = 0;

      var idleTarget = IDLE_SPIN;
      if (!isDragging) {
        spinVelocity += (idleTarget - spinVelocity) * 0.03;
        autoSpin += dt * spinVelocity;
        targetSpin = autoSpin;
      } else {
        autoSpin = targetSpin;
      }
      earth.rotation.y += (targetSpin - earth.rotation.y) * 0.12;
      if (earthMenuMode) {
        group.rotation.y = 0;
        group.rotation.z = baseTilt;
        pointerTilt = 0;
        targetTilt = baseTilt;
      } else {
        group.rotation.y += (pointerTilt - group.rotation.y) * 0.08;
        group.rotation.z += (targetTilt - group.rotation.z) * 0.08;
      }
      camera.position.z += (radius + 16 - camera.position.z) * 0.15;
      if (clouds) clouds.rotation.y = earth.rotation.y;
      renderer.render(scene, camera);
    }
    tick();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
