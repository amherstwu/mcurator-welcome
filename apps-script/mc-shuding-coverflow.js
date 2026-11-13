/**
 * Apple Cover Flow effect — adapted from https://github.com/shuding/coverflow (MIT, quietshu)
 * Scroll-driven 3D arc; items follow scrollLeft continuously, rotate via CSS transition.
 */
(function (W) {
  'use strict';

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function setTransform3D(el, degree, perspective, z) {
    degree = clamp(degree, -90, 90);
    var zVal = z - 5;
    if (perspective) {
      el.style.perspective = perspective + 'px';
    } else {
      el.style.perspective = '';
    }
    el.style.transform = 'rotateY(' + degree + 'deg) translateZ(' + zVal + 'px)';
  }

  /** @param {HTMLElement[]} imgs */
  function displayIndex(imgSize, spacing, left, imgs, index, flat, width) {
    if (!imgs.length) return;
    index = clamp(index, 0, imgs.length - 1);
    var mLeft = (width - imgSize) * 0.5 - spacing * (index + 1) - imgSize * 0.5;
    var i;
    for (i = 0; i <= index; ++i) {
      imgs[i].style.left = left + i * spacing + spacing + 'px';
      imgs[i].style.marginLeft = mLeft + 'px';
      imgs[i].style.filter = 'brightness(0.65)';
      imgs[i].style.zIndex = String(i + 1);
      imgs[i].style.opacity = '1';
      imgs[i].style.pointerEvents = index - i <= 2 ? 'auto' : 'none';
      imgs[i].classList.toggle('is-active', i === index);
      setTransform3D(
        imgs[i],
        flat ? 0 : (index - i) * 10 + 45,
        300,
        flat ? -(index - i) * 10 : -(index - i) * 30 - 20
      );
    }
    imgs[index].style.filter = 'none';
    imgs[index].style.marginLeft = mLeft + imgSize * 0.5 + 'px';
    imgs[index].style.zIndex = String(imgs.length);
    imgs[index].style.opacity = '1';
    imgs[index].style.pointerEvents = 'auto';
    imgs[index].classList.add('is-active');
    setTransform3D(imgs[index], 0, 0, 5);
    for (i = index + 1; i < imgs.length; ++i) {
      imgs[i].style.left = left + i * spacing + spacing + 'px';
      imgs[i].style.marginLeft = mLeft + imgSize + 'px';
      imgs[i].style.filter = 'brightness(0.7)';
      imgs[i].style.zIndex = String(imgs.length - i);
      imgs[i].style.opacity = '1';
      imgs[i].style.pointerEvents = i - index <= 2 ? 'auto' : 'none';
      imgs[i].classList.toggle('is-active', false);
      setTransform3D(
        imgs[i],
        flat ? 0 : (index - i) * 10 - 45,
        300,
        flat ? (index - i) * 10 : (index - i) * 30 - 20
      );
    }
  }

  function collectItems(container) {
    var imgs = [];
    var nodes = container.children;
    var i;
    for (i = 0; i < nodes.length; ++i) {
      var node = nodes[i];
      if (!node.tagName) continue;
      if (node.classList && node.classList.contains('specimen-coverflow-scroll-spacer')) continue;
      imgs.push(node);
    }
    return imgs;
  }

  /**
   * @param {HTMLElement} container scroll host (.coverflow)
   * @param {{ imgSize?: number, spacing?: number, width?: number, flat?: boolean, reduceMotion?: boolean, onIndexChange?: (index:number)=>void }} options
   */
  function mount(container, options) {
    options = options || {};
    var imgSize = options.imgSize || 400;
    var spacing = options.spacing || 200;
    var flat = !!options.flat;
    var reduceMotion = !!options.reduceMotion;
    var onIndexChange = typeof options.onIndexChange === 'function' ? options.onIndexChange : null;
    var viewportWidth = options.width || container.clientWidth || 1000;

    var imgs = collectItems(container);
    var transitionStyle = reduceMotion ? 'none' : 'transform 0.4s ease, margin-left 0.4s ease, filter 0.4s ease';

    var i;
    for (i = 0; i < imgs.length; ++i) {
      imgs[i].style.position = 'absolute';
      imgs[i].style.width = imgSize + 'px';
      imgs[i].style.height = 'auto';
      imgs[i].style.bottom = '60px';
      imgs[i].style.transition = transitionStyle;
      imgs[i].style.transformStyle = 'preserve-3d';
      imgs[i].style.willChange = 'transform, margin-left, filter';
    }

    container.style.overflowX = 'auto';
    container.style.overflowY = 'hidden';
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.scrollbarWidth = 'none';
    container.style.msOverflowStyle = 'none';
    container.style.webkitOverflowScrolling = 'touch';
    container.style.touchAction = 'pan-x';

    var spacer = container.querySelector('.specimen-coverflow-scroll-spacer');
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.className = 'specimen-coverflow-scroll-spacer';
      spacer.setAttribute('aria-hidden', 'true');
      container.appendChild(spacer);
    }
    spacer.style.width = viewportWidth * 2 + 'px';
    spacer.style.height = '1px';
    spacer.style.pointerEvents = 'none';

    setTransform3D(container, 0, 600, 0);

    var lastIndex = -1;
    var drag = null;
    var suppressClick = false;

    function viewportW_() {
      return container.clientWidth || viewportWidth;
    }

    function indexFromScroll_() {
      var w = viewportW_();
      if (!w || !imgs.length) return 0;
      var p = container.scrollLeft / w;
      return clamp(Math.floor(p * imgs.length), 0, imgs.length - 1);
    }

    function repaint_() {
      var w = viewportW_();
      var index = indexFromScroll_();
      displayIndex(imgSize, spacing, container.scrollLeft, imgs, index, flat, w);
      if (index !== lastIndex) {
        lastIndex = index;
        if (onIndexChange) onIndexChange(index);
      }
    }

    function scrollToIndex(index, smooth) {
      if (!imgs.length) return;
      index = clamp(index, 0, imgs.length - 1);
      var w = viewportW_();
      var target = imgs.length <= 1 ? 0 : (index / (imgs.length - 1)) * w;
      if (smooth && !reduceMotion && typeof container.scrollTo === 'function') {
        container.scrollTo({ left: target, behavior: 'smooth' });
      } else {
        container.scrollLeft = target;
      }
    }

    function snapNearest_(smooth) {
      if (!imgs.length) return;
      var w = viewportW_();
      var p = w ? container.scrollLeft / w : 0;
      var index = clamp(Math.round(p * Math.max(1, imgs.length - 1)), 0, imgs.length - 1);
      scrollToIndex(index, smooth !== false && !reduceMotion);
    }

    function onScroll() {
      repaint_();
    }

    container.addEventListener('scroll', onScroll, { passive: true });

    container.addEventListener(
      'wheel',
      function (e) {
        if (reduceMotion) return;
        var dy = e.deltaY;
        var dx = e.deltaX;
        var delta = Math.abs(dx) > Math.abs(dy) ? dx : dy;
        if (Math.abs(delta) < 0.5) return;
        e.preventDefault();
        container.scrollLeft += delta;
      },
      { passive: false }
    );

    container.addEventListener('pointerdown', function (e) {
      if (e.button !== 0) return;
      drag = { x: e.clientX, sl: container.scrollLeft, moved: false };
      try {
        container.setPointerCapture(e.pointerId);
      } catch (err) {
        void err;
      }
    });

    container.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (Math.abs(dx) > 4) drag.moved = true;
      if (!drag.moved) return;
      container.scrollLeft = drag.sl - dx;
    });

    function endDrag_(e) {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      if (e) {
        try {
          container.releasePointerCapture(e.pointerId);
        } catch (err) {
          void err;
        }
      }
      if (moved) {
        suppressClick = true;
        W.setTimeout(function () {
          suppressClick = false;
        }, 0);
        snapNearest_(true);
      }
    }

    container.addEventListener('pointerup', endDrag_);
    container.addEventListener('pointercancel', endDrag_);

    container.addEventListener('click', function (e) {
      if (suppressClick) {
        suppressClick = false;
        e.preventDefault();
        e.stopPropagation();
      }
    });

    repaint_();

    return {
      destroy: function () {
        container.removeEventListener('scroll', onScroll);
        drag = null;
      },
      scrollToIndex: scrollToIndex,
      snapNearest: snapNearest_,
      getIndex: function () {
        return lastIndex;
      },
      refresh: function () {
        viewportWidth = viewportW_();
        imgs = collectItems(container);
        spacer.style.width = viewportWidth * 2 + 'px';
        imgSize = options.imgSize || imgSize;
        repaint_();
      },
      repaint: repaint_,
      wasDragging: function () {
        return suppressClick;
      },
    };
  }

  W.MCShudingCoverflow = {
    mount: mount,
    displayIndex: displayIndex,
  };
})(window);
