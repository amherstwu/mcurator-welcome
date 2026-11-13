/**
 * ORIGIN intro — spatial coverflow over a living hall film.
 * Pointer pans the film and spotlight; cards do not tilt.
 * Scoped to #welcomeOriginIntroSection. Not the landing hero.
 */
(function () {
  'use strict';

  var MODS = ['atlas', 'pulse', 'studio'];

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var root = document.getElementById('welcomeOriginIntroSection');
    if (!root) return;

    var hall = root.querySelector('.welcome-origin-intro');
    var shots = root.querySelector('.welcome-origin-intro__shots');
    if (!shots) return;

    var coarse = window.matchMedia('(pointer: coarse)');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    var buttons = shots.querySelectorAll('.welcome-origin-intro__shot');
    var picks = root.querySelectorAll('[data-origin-pick]');
    var panels = root.querySelectorAll('[data-origin-story-panel]');
    var plates = root.querySelectorAll('[data-origin-plate]');
    var plateLayer = root.querySelector('[data-origin-plates]');
    var film = root.querySelector('[data-origin-film]');
    var spot = root.querySelector('[data-origin-spot]');
    var veil = root.querySelector('[data-origin-mask]');
    var lastArmed = null;
    var activeShot = null;
    var tx = 0;
    var ty = 0;
    var ox = 0;
    var oy = 0;
    var ticking = false;

    function shotByMod(mod) {
      return shots.querySelector('.welcome-origin-intro__shot[data-origin-mod="' + mod + '"]');
    }

    function setSlots(mod) {
      var index = MODS.indexOf(mod);
      if (index < 0) index = 1;
      var left = MODS[(index + 2) % 3];
      var right = MODS[(index + 1) % 3];
      buttons.forEach(function (el) {
        var current = el.getAttribute('data-origin-mod');
        var slot = current === mod ? 'center' : current === left ? 'left' : 'right';
        el.setAttribute('data-slot', slot);
      });
    }

    function setWorld(mod) {
      root.setAttribute('data-world-mod', mod);
      plates.forEach(function (plate) {
        plate.classList.toggle('is-on', plate.getAttribute('data-origin-plate') === mod);
      });
    }

    function playFilm() {
      if (!film || reduced.matches) return;
      var playAttempt = film.play();
      if (playAttempt && typeof playAttempt.catch === 'function') {
        playAttempt.catch(function () {});
      }
    }

    function pauseFilm() {
      if (film) film.pause();
    }

    function setActive(shot, fromHover) {
      if (!shot) return;
      var same = activeShot === shot;
      activeShot = shot;
      var mod = shot.getAttribute('data-origin-mod') || 'pulse';
      buttons.forEach(function (el) {
        el.classList.toggle('is-active', el === shot);
        if (el !== shot) el.classList.remove('is-pop');
      });
      setSlots(mod);
      setWorld(mod);
      shots.setAttribute('data-active', mod);
      if (hall) hall.setAttribute('data-active-mod', mod);
      picks.forEach(function (pick) {
        var on = pick.getAttribute('data-origin-pick') === mod;
        pick.classList.toggle('is-active', on);
        pick.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      panels.forEach(function (panel) {
        panel.hidden = panel.getAttribute('data-origin-story-panel') !== mod;
      });
      if (!fromHover && !same && !reduced.matches) {
        shot.classList.remove('is-pop');
        void shot.offsetWidth;
        shot.classList.add('is-pop');
      }
    }

    function panTick() {
      ox += (tx - ox) * 0.08;
      oy += (ty - oy) * 0.08;
      if (plateLayer) {
        plateLayer.style.setProperty('--ox', ox.toFixed(2) + 'px');
        plateLayer.style.setProperty('--oy', oy.toFixed(2) + 'px');
      }
      if (spot) {
        spot.style.setProperty('--sx', (ox * 8).toFixed(1) + 'px');
        spot.style.setProperty('--sy', (oy * 6).toFixed(1) + 'px');
      }
      if (veil) {
        veil.style.setProperty('--mx', (ox * 4).toFixed(1) + 'px');
        veil.style.setProperty('--my', (oy * 3).toFixed(1) + 'px');
      }
      if (Math.abs(tx - ox) < 0.08 && Math.abs(ty - oy) < 0.08) {
        ticking = false;
        return;
      }
      ticking = true;
      window.requestAnimationFrame(panTick);
    }

    function startPan() {
      if (ticking || reduced.matches) return;
      ticking = true;
      window.requestAnimationFrame(panTick);
    }

    var hoverTimer = 0;
    var opening = false;

    function goRoute(route) {
      if (window.MCRouter && typeof window.MCRouter.go === 'function') {
        window.MCRouter.go(route);
      }
    }

    function openSystem(mod, route) {
      if (opening || !route) return;
      opening = true;
      window.clearTimeout(hoverTimer);
      var target = shotByMod(mod);
      if (target) {
        lastArmed = target;
        setActive(target);
        target.classList.add('is-opening');
      }
      root.classList.add('is-opening');
      try {
        sessionStorage.setItem('mcOriginPortalEnter', String(mod || ''));
      } catch (eStore) {}
      var portal = root.querySelector('[data-origin-portal]');
      var nameEl = root.querySelector('[data-origin-portal-name]');
      if (nameEl) nameEl.textContent = String(mod || '').toUpperCase();
      if (portal) {
        portal.hidden = false;
        portal.setAttribute('data-mod', mod);
        portal.setAttribute('aria-hidden', 'false');
        window.requestAnimationFrame(function () {
          portal.classList.add('is-open');
        });
      }
      var wait = reduced.matches ? 0 : 1080;
      window.setTimeout(function () {
        goRoute(route);
      }, wait);
    }

    buttons.forEach(function (shot) {
      shot.addEventListener('pointerenter', function () {
        if (coarse.matches || opening) return;
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(function () {
          setActive(shot, true);
        }, 16);
      });
      shot.addEventListener('focus', function () {
        if (!opening) setActive(shot, true);
      });
      shot.addEventListener('pointerdown', function () {
        shot.classList.add('is-press');
      });
    });

    window.addEventListener('pointerup', function () {
      buttons.forEach(function (el) {
        el.classList.remove('is-press');
      });
    });

    picks.forEach(function (pick) {
      pick.addEventListener('pointerenter', function () {
        if (coarse.matches || opening) return;
        var shot = shotByMod(pick.getAttribute('data-origin-pick') || '');
        if (shot) setActive(shot, true);
      });
    });

    root.addEventListener(
      'click',
      function (event) {
        if (opening) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        var pick = event.target && event.target.closest ? event.target.closest('[data-origin-pick]') : null;
        var shot = event.target && event.target.closest ? event.target.closest('.welcome-origin-intro__shot') : null;
        var routeEl = event.target && event.target.closest ? event.target.closest('[data-route]') : null;
        var mod = '';
        var route = '';

        if (pick && root.contains(pick)) {
          mod = pick.getAttribute('data-origin-pick') || '';
          route = mod ? '/origin/' + mod : '';
        } else if (shot && shots.contains(shot)) {
          mod = shot.getAttribute('data-origin-mod') || '';
          route = shot.getAttribute('data-route') || (mod ? '/origin/' + mod : '');
        } else if (routeEl && root.contains(routeEl)) {
          route = routeEl.getAttribute('data-route') || '';
          var match = route.match(/^\/origin\/(atlas|pulse|studio)/);
          if (!match) return;
          mod = match[1];
        } else {
          return;
        }

        if (!mod || !route || MODS.indexOf(mod) < 0) return;
        event.preventDefault();
        event.stopPropagation();
        openSystem(mod, route);
      },
      true
    );

    function resetCardLook() {
      buttons.forEach(function (el) {
        el.style.setProperty('--lx', '0px');
        el.style.setProperty('--ly', '0px');
      });
    }

    function setCardLook(shot, event) {
      var box = shot.getBoundingClientRect();
      if (!box.width || !box.height) return;
      var nx = (event.clientX - box.left) / box.width - 0.5;
      var ny = (event.clientY - box.top) / box.height - 0.5;
      shot.style.setProperty('--lx', (nx * 14).toFixed(2) + 'px');
      shot.style.setProperty('--ly', (ny * 12).toFixed(2) + 'px');
    }

    root.addEventListener('pointermove', function (event) {
      if (reduced.matches || coarse.matches || event.pointerType === 'touch') return;
      var box = root.getBoundingClientRect();
      if (!box.width || !box.height) return;
      tx = ((event.clientX - box.left) / box.width - 0.5) * 40;
      ty = ((event.clientY - box.top) / box.height - 0.5) * 24;
      startPan();
      var hot = event.target && event.target.closest ? event.target.closest('.welcome-origin-intro__shot') : null;
      buttons.forEach(function (el) {
        if (el === hot && shots.contains(el)) setCardLook(el, event);
        else {
          el.style.setProperty('--lx', '0px');
          el.style.setProperty('--ly', '0px');
        }
      });
    });

    root.addEventListener('pointerleave', function () {
      tx = 0;
      ty = 0;
      startPan();
      resetCardLook();
    });

    root.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      var list = Array.prototype.slice.call(buttons);
      if (!list.length) return;
      var index = list.indexOf(activeShot);
      if (index < 0) index = 1;
      if (event.key === 'ArrowLeft') index = (index + list.length - 1) % list.length;
      else index = (index + 1) % list.length;
      lastArmed = list[index];
      setActive(list[index]);
      list[index].focus();
      event.preventDefault();
    });

    setActive(shotByMod('pulse') || buttons[1] || buttons[0]);

    if (reduced.matches) {
      root.classList.add('is-inview');
      pauseFilm();
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              root.classList.add('is-inview');
              playFilm();
            } else {
              pauseFilm();
            }
          });
        },
        { threshold: 0.18 }
      );
      io.observe(root);
    } else {
      root.classList.add('is-inview');
      playFilm();
    }
  });
})();
