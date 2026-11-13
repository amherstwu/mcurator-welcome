/**
 * Passport hero Earth — franky-adl/threejs-earth (same stack as mc-welcome-hero-earth-three.js).
 * @see https://github.com/franky-adl/threejs-earth
 */
(function (global) {
  'use strict';

  var GH = 'https://raw.githubusercontent.com/franky-adl/threejs-earth/main/src/assets/';
  var CDN = 'https://cdn.jsdelivr.net/gh/franky-adl/threejs-earth@main/src/assets/';
  var SPIN = 0.00042;
  var RADIUS = 10;
  var MAX_ATTEMPTS = 160;

  function prefersReducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  function localBase() {
    var scripts = document.getElementsByTagName('script');
    var i;
    for (i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (src.indexOf('mc-hero-earth-three') !== -1) {
        return src.replace(/mc-hero-earth-three\.js.*$/, 'assets/earth/');
      }
    }
    return 'assets/earth/';
  }

  function isFileProtocol_() {
    try {
      return !!(window.location && window.location.protocol === 'file:');
    } catch (e) {
      return false;
    }
  }

  function loadTex(loader, file, onOk) {
    var urls = isFileProtocol_()
      ? [GH + file, CDN + file]
      : [CDN + file, GH + file, localBase() + file];
    var n = 0;

    function next() {
      if (n >= urls.length) {
        onOk(null);
        return;
      }
      loader.load(
        urls[n],
        function (tex) {
          onOk(tex);
        },
        undefined,
        function () {
          n += 1;
          next();
        }
      );
    }

    next();
  }

  function mount() {
    if (typeof THREE === 'undefined') return false;

    var hero = document.querySelector('#mcWelcomeHero[data-hero-version="passport-hero-rebuild-v3"]');
    var host = document.getElementById('mcHeroEarthHost');
    if (!hero || !host || host.getAttribute('data-mc-three-ready') === '1') return false;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      return false;
    }
    if (!renderer.getContext()) return false;

    host.setAttribute('data-mc-three-ready', '1');
    hero.setAttribute('data-mc-earth-three-live', '1');

    THREE.ColorManagement.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    var canvas = renderer.domElement;
    canvas.className = 'mc-hero-v2__earth-gl';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText =
      'display:block;width:100%;height:100%;outline:none;border-radius:50%;opacity:0;transform:translateZ(0)';
    host.appendChild(canvas);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 26);

    var group = new THREE.Group();
    group.rotation.z = (23.5 / 360) * 2 * Math.PI;
    scene.add(group);

    var sun = new THREE.DirectionalLight(0xffffff, 2.05);
    sun.position.set(-58, 10, 28);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xd4dce8, 0.06));

    var earthMat = new THREE.MeshStandardMaterial({
      color: 0x0a2820,
      roughness: 0.88,
      metalness: 0.06,
    });
    var earth = new THREE.Mesh(new THREE.SphereGeometry(RADIUS, 64, 64), earthMat);
    earth.rotation.y = 2.02;
    group.add(earth);

    var clouds = null;
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    var pending = 3;

    function ready(texName) {
      pending -= 1;
      if (pending > 0) return;
      canvas.style.opacity = '1';
      hero.setAttribute('data-mc-earth-textures', 'ready');
      hero.setAttribute('data-mc-earth-source', 'threejs-earth');
    }

    loadTex(loader, 'Albedo.jpg', function (tex) {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(16, renderer.capabilities.getMaxAnisotropy());
        earthMat.map = tex;
        earthMat.color.setHex(0xffffff);
        earthMat.needsUpdate = true;
        var img = tex.image;
        var w = img && (img.width || img.naturalWidth) ? img.width || img.naturalWidth : 0;
        hero.setAttribute('data-mc-earth-tex-w', String(w));
      }
      ready('albedo');
    });

    loadTex(loader, 'Bump.jpg', function (tex) {
      if (tex) {
        earthMat.bumpMap = tex;
        earthMat.bumpScale = 0.035;
        earthMat.needsUpdate = true;
      }
      ready('bump');
    });

    loadTex(loader, 'Clouds.png', function (tex) {
      if (tex) {
        tex.colorSpace = THREE.SRGBColorSpace;
        clouds = new THREE.Mesh(
          new THREE.SphereGeometry(RADIUS * 1.006, 64, 64),
          new THREE.MeshStandardMaterial({
            alphaMap: tex,
            transparent: true,
            depthWrite: false,
          })
        );
        clouds.rotation.y = earth.rotation.y;
        group.add(clouds);
      }
      ready('clouds');
    });

    function resize() {
      var w = Math.max(120, Math.floor(host.clientWidth || 0));
      var h = Math.max(120, Math.floor(host.clientHeight || 0));
      var size = Math.min(w, h);
      if (size < 100) {
        requestAnimationFrame(resize);
        return;
      }
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      renderer.setPixelRatio(dpr);
      renderer.setSize(size, size, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      hero.setAttribute('data-mc-earth-render', canvas.width + 'x' + canvas.height);
      hero.setAttribute('data-mc-earth-display', String(size));
    }

    resize();
    if (window.ResizeObserver) {
      new ResizeObserver(resize).observe(host);
    } else {
      window.addEventListener('resize', resize, { passive: true });
    }

    var reduced = prefersReducedMotion();
    var running = true;
    document.addEventListener('visibilitychange', function () {
      running = document.visibilityState !== 'hidden';
    });

    function tick() {
      requestAnimationFrame(tick);
      if (!running) return;
      if (!reduced) earth.rotation.y += SPIN;
      if (clouds) clouds.rotation.y = earth.rotation.y;
      camera.position.z += (RADIUS + 16 - camera.position.z) * 0.08;
      renderer.render(scene, camera);
    }
    tick();
    return true;
  }

  function boot(n) {
    if (mount()) return;
    if (n > MAX_ATTEMPTS) return;
    setTimeout(function () {
      boot(n + 1);
    }, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      boot(0);
    });
  } else {
    boot(0);
  }
})(typeof window !== 'undefined' ? window : globalThis);
