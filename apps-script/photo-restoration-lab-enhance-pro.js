/**
 * Specimen plate enhancement (canvas) — on-device ops for Photo Restoration Lab.
 * Algorithms inspired by OSS: CamanJS white-balance (MIT), CanvasEffects adjustments (MIT),
 * CLAHE-style levels, highlight recovery for glare reduction.
 */
(function (global) {
  'use strict';

  var DEFAULT_GRADE = {
    temperature: 0,
    tint: 0,
    saturation: 0,
    contrast: 0,
    vibrance: 0,
    shadows: 0,
    highlights: 0
  };

  function mergeGradeParams(params) {
    var p = params || {};
    var out = {};
    var k;
    for (k in DEFAULT_GRADE) {
      if (Object.prototype.hasOwnProperty.call(DEFAULT_GRADE, k)) {
        out[k] = p[k] != null ? Number(p[k]) : DEFAULT_GRADE[k];
      }
    }
    return out;
  }

  function blobFromUrl(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error('fetch failed');
      return r.blob();
    });
  }

  function canvasToJpeg(canvas, quality) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(
        function (b) {
          if (b) resolve(b);
          else reject(new Error('encode failed'));
        },
        'image/jpeg',
        quality != null ? quality : 0.92
      );
    });
  }

  function loadImageBlob(blob) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      var url = URL.createObjectURL(blob);
      img.onload = function () {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = function () {
        URL.revokeObjectURL(url);
        reject(new Error('decode failed'));
      };
      img.src = url;
    });
  }

  function drawToCanvas(img, maxSide) {
    var w = img.naturalWidth || img.width;
    var h = img.naturalHeight || img.height;
    var scale = Math.min(1, (maxSide || 2560) / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale));
    var ch = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement('canvas');
    canvas.width = cw;
    canvas.height = ch;
    var ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    return canvas;
  }

  function percentileLuma(hist, p, total) {
    var need = (total * p) / 100;
    var acc = 0;
    for (var i = 0; i < 256; i++) {
      acc += hist[i];
      if (acc >= need) return i;
    }
    return 255;
  }

  function clamp255(v) {
    return Math.max(0, Math.min(255, v));
  }

  /** Map UI 0–100 to stronger internal drive (effects were too subtle at mid slider). */
  function ampStrength(strength, extra) {
    var s = strength == null ? 82 : strength;
    var boost = extra != null ? extra : 1.58;
    return Math.min(100, Math.round(s * boost + 10));
  }

  /** Kelvin to RGB (Tanner Helland / CamanJS-style, MIT-licensed implementations). */
  function kelvinToRgb(kelvin) {
    var temp = kelvin / 100;
    var r;
    var g;
    var b;
    if (temp <= 66) {
      r = 255;
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;
      if (temp <= 19) {
        b = 0;
      } else {
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
      }
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      b = 255;
    }
    return {
      r: clamp255(r),
      g: clamp255(g),
      b: clamp255(b)
    };
  }

  function boxBlurChannel(src, w, h, radius) {
    var out = new Float32Array(src.length);
    var tmp = new Float32Array(src.length);
    var i;
    var x;
    var y;
    var r = Math.max(1, radius | 0);
    var div = 2 * r + 1;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        var sum = 0;
        for (i = -r; i <= r; i++) {
          var cx = Math.max(0, Math.min(w - 1, x + i));
          sum += src[y * w + cx];
        }
        tmp[y * w + x] = sum / div;
      }
    }
    for (x = 0; x < w; x++) {
      for (y = 0; y < h; y++) {
        sum = 0;
        for (i = -r; i <= r; i++) {
          var cy = Math.max(0, Math.min(h - 1, y + i));
          sum += tmp[cy * w + x];
        }
        out[y * w + x] = sum / div;
      }
    }
    return out;
  }

  function unsharpImageData(id, amount) {
    var w = id.width;
    var h = id.height;
    var src = id.data;
    var tmp = new Uint8ClampedArray(src.length);
    var i;
    for (i = 0; i < src.length; i++) tmp[i] = src[i];
    var blur = new Uint8ClampedArray(src.length);
    var x;
    var y;
    var ky;
    var kx;
    var r;
    var g;
    var b;
    var n;
    var idx;
    for (y = 1; y < h - 1; y++) {
      for (x = 1; x < w - 1; x++) {
        idx = (y * w + x) * 4;
        r = g = b = n = 0;
        for (ky = -1; ky <= 1; ky++) {
          for (kx = -1; kx <= 1; kx++) {
            var j = ((y + ky) * w + (x + kx)) * 4;
            r += src[j];
            g += src[j + 1];
            b += src[j + 2];
            n++;
          }
        }
        blur[idx] = (r / n) | 0;
        blur[idx + 1] = (g / n) | 0;
        blur[idx + 2] = (b / n) | 0;
        blur[idx + 3] = src[idx + 3];
      }
    }
    var amt = Math.max(0, Math.min(2.5, amount || 1));
    for (i = 0; i < src.length; i += 4) {
      tmp[i] = clamp255(src[i] + amt * (src[i] - blur[i]));
      tmp[i + 1] = clamp255(src[i + 1] + amt * (src[i + 1] - blur[i + 1]));
      tmp[i + 2] = clamp255(src[i + 2] + amt * (src[i + 2] - blur[i + 2]));
    }
    id.data.set(tmp);
  }

  function applyAutoLevels(id, strength, liftExtra) {
    var s = Math.max(0, Math.min(100, strength == null ? 55 : strength)) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var pixels = w * h;
    var hist = new Array(256);
    var i;
    for (i = 0; i < 256; i++) hist[i] = 0;
    for (i = 0; i < d.length; i += 4) {
      var lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
      hist[Math.min(255, lum | 0)]++;
    }
    var lo = percentileLuma(hist, 1, pixels);
    var hi = percentileLuma(hist, 99, pixels);
    var range = Math.max(14, hi - lo);
    var gamma = 1 - s * 0.28;
    var sat = 1 + s * 0.52;
    var lift = (liftExtra || 0) + s * 28;
    for (i = 0; i < d.length; i += 4) {
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      r = ((r - lo) * 255) / range + lift;
      g = ((g - lo) * 255) / range + lift;
      b = ((b - lo) * 255) / range + lift;
      r = 255 * Math.pow(Math.max(0, Math.min(255, r)) / 255, gamma);
      g = 255 * Math.pow(Math.max(0, Math.min(255, g)) / 255, gamma);
      b = 255 * Math.pow(Math.max(0, Math.min(255, b)) / 255, gamma);
      var avg = (r + g + b) / 3;
      r = avg + (r - avg) * sat;
      g = avg + (g - avg) * sat;
      b = avg + (b - avg) * sat;
      d[i] = clamp255(r);
      d[i + 1] = clamp255(g);
      d[i + 2] = clamp255(b);
    }
  }

  function applyGrayWorldBalance(id, strength) {
    var s = ampStrength(strength, 1.3) / 100;
    var d = id.data;
    var n = d.length / 4;
    var rs = 0;
    var gs = 0;
    var bs = 0;
    var i;
    for (i = 0; i < d.length; i += 4) {
      rs += d[i];
      gs += d[i + 1];
      bs += d[i + 2];
    }
    var avg = (rs + gs + bs) / (3 * n);
    var kr = avg / (rs / n + 1e-6);
    var kg = avg / (gs / n + 1e-6);
    var kb = avg / (bs / n + 1e-6);
    var mix = 0.5 + s * 0.48;
    for (i = 0; i < d.length; i += 4) {
      d[i] = clamp255(d[i] * (1 - mix) + d[i] * kr * mix);
      d[i + 1] = clamp255(d[i + 1] * (1 - mix) + d[i + 1] * kg * mix);
      d[i + 2] = clamp255(d[i + 2] * (1 - mix) + d[i + 2] * kb * mix);
    }
  }

  function applyColorGrade(id, grade, strength) {
    var g = mergeGradeParams(grade);
    var s = ampStrength(strength, 1.25) / 100;
    var slide = 1.55;
    var d = id.data;
    var kelvin = 5500 + (g.temperature / 100) * 3200 * slide;
    var target = kelvinToRgb(kelvin);
    var tintG = (g.tint / 100) * 28 * slide;
    var satMul = 1 + (g.saturation / 100) * 0.95 * s * slide + s * 0.18;
    var contrast = 1 + (g.contrast / 100) * 0.75 * s * slide;
    var vibrance = (g.vibrance / 100) * 1.15 * s * slide;
    var shadows = (g.shadows / 100) * 58 * s * slide;
    var highlights = (g.highlights / 100) * 52 * s * slide;
    var i;
    var r;
    var gch;
    var b;
    var lum;
    var maxC;
    var minC;
    var gray;
    for (i = 0; i < d.length; i += 4) {
      r = d[i];
      gch = d[i + 1];
      b = d[i + 2];
      r = r * (target.r / 255);
      gch = gch * (target.g / 255);
      b = b * (target.b / 255);
      gch = gch + tintG * 18;
      lum = 0.299 * r + 0.587 * gch + 0.114 * b;
      r = lum + (r - lum) * satMul;
      gch = lum + (gch - lum) * satMul;
      b = lum + (b - lum) * satMul;
      maxC = Math.max(r, gch, b);
      minC = Math.min(r, gch, b);
      gray = (maxC + minC) / 2;
      var chroma = maxC - minC;
      if (chroma > 18) {
        var vib = 1 + vibrance * (1 - chroma / 255);
        r = gray + (r - gray) * vib;
        gch = gray + (gch - gray) * vib;
        b = gray + (b - gray) * vib;
      }
      r = (r - 128) * contrast + 128;
      gch = (gch - 128) * contrast + 128;
      b = (b - 128) * contrast + 128;
      lum = 0.299 * r + 0.587 * gch + 0.114 * b;
      if (lum < 128) {
        var sh = shadows * (1 - lum / 128);
        r += sh;
        gch += sh;
        b += sh;
      } else {
        var hi = highlights * ((lum - 128) / 127);
        r -= hi;
        gch -= hi;
        b -= hi;
      }
      d[i] = clamp255(r);
      d[i + 1] = clamp255(gch);
      d[i + 2] = clamp255(b);
    }
  }

  function applyGlareReduction(id, strength) {
    var s = ampStrength(strength, 1.5) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var lum = new Float32Array(w * h);
    var i;
    var x;
    var y;
    var idx;
    var px;
    for (i = 0; i < d.length; i += 4) {
      px = (i / 4) | 0;
      lum[px] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    var blurL = boxBlurChannel(lum, w, h, 5);
    var thresh = 175 + (1 - s) * 25;
    var compress = 0.58 + s * 0.42;
    for (y = 1; y < h - 1; y++) {
      for (x = 1; x < w - 1; x++) {
        px = y * w + x;
        idx = px * 4;
        var L = lum[px];
        var r = d[idx];
        var g = d[idx + 1];
        var b = d[idx + 2];
        var spec =
          L > thresh &&
          (Math.min(r, g, b) > 140 || L > thresh + 25) &&
          Math.max(r, g, b) - Math.min(r, g, b) < 72;
        if (!spec) continue;
        var local = blurL[px];
        var t = Math.min(1, (L - thresh) / (255 - thresh + 1e-6));
        var blend = compress * t;
        d[idx] = clamp255(r * (1 - blend) + local * blend);
        d[idx + 1] = clamp255(g * (1 - blend) + local * blend);
        d[idx + 2] = clamp255(b * (1 - blend) + local * blend);
      }
    }
  }

  function applyDenoise(id, strength, radius) {
    var s = ampStrength(strength, 1.2) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var n = w * h;
    var rC = new Float32Array(n);
    var gC = new Float32Array(n);
    var bC = new Float32Array(n);
    var i;
    for (i = 0; i < d.length; i += 4) {
      var p = (i / 4) | 0;
      rC[p] = d[i];
      gC[p] = d[i + 1];
      bC[p] = d[i + 2];
    }
    var rad = radius != null ? radius : 2 + Math.round(s * 2);
    var br = boxBlurChannel(rC, w, h, rad);
    var bg = boxBlurChannel(gC, w, h, rad);
    var bb = boxBlurChannel(bC, w, h, rad);
    var mix = 0.28 + s * 0.52;
    for (i = 0; i < d.length; i += 4) {
      var p2 = (i / 4) | 0;
      d[i] = clamp255(d[i] * (1 - mix) + br[p2] * mix);
      d[i + 1] = clamp255(d[i + 1] * (1 - mix) + bg[p2] * mix);
      d[i + 2] = clamp255(d[i + 2] * (1 - mix) + bb[p2] * mix);
    }
  }

  function median3x3Float(src, w, h) {
    var out = new Float32Array(w * h);
    var x;
    var y;
    var kx;
    var ky;
    var buf = new Array(9);
    var bi;
    for (y = 1; y < h - 1; y++) {
      for (x = 1; x < w - 1; x++) {
        bi = 0;
        for (ky = -1; ky <= 1; ky++) {
          for (kx = -1; kx <= 1; kx++) {
            buf[bi++] = src[(y + ky) * w + (x + kx)];
          }
        }
        buf.sort(function (a, b) {
          return a - b;
        });
        out[y * w + x] = buf[4];
      }
    }
    return out;
  }

  /**
   * Dust / speck removal: dark and bright outliers vs local median (salt-and-pepper style).
   */
  function applyDustRemoval(id, strength) {
    var s = ampStrength(strength, 1.45) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var n = w * h;
    var lum = new Float32Array(n);
    var rC = new Float32Array(n);
    var gC = new Float32Array(n);
    var bC = new Float32Array(n);
    var i;
    var p;
    for (i = 0; i < d.length; i += 4) {
      p = (i / 4) | 0;
      rC[p] = d[i];
      gC[p] = d[i + 1];
      bC[p] = d[i + 2];
      lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    var medL = median3x3Float(lum, w, h);
    var medR = median3x3Float(rC, w, h);
    var medG = median3x3Float(gC, w, h);
    var medB = median3x3Float(bC, w, h);
    var blurL = boxBlurChannel(lum, w, h, 5);
    var darkTh = 10 + s * 28;
    var brightTh = 12 + s * 32;
    var maxChroma = 48 + (1 - s) * 20;
    for (i = 0; i < d.length; i += 4) {
      p = (i / 4) | 0;
      var r = d[i];
      var g = d[i + 1];
      var b = d[i + 2];
      var L = lum[p];
      var mL = medL[p] || L;
      var chroma = Math.max(r, g, b) - Math.min(r, g, b);
      var deltaMed = L - mL;
      var deltaBlur = L - blurL[p];
      var darkSpeck = deltaMed < -darkTh || (deltaBlur < -darkTh - 6 && chroma < maxChroma + 15);
      var brightSpeck =
        chroma < maxChroma &&
        (deltaMed > brightTh || (deltaBlur > brightTh + 4 && L > mL + 8));
      if (!darkSpeck && !brightSpeck) continue;
      var t = Math.min(1, (Math.abs(deltaMed) - darkTh * 0.35) / (55 + s * 40));
      if (t <= 0) t = Math.min(1, Math.abs(deltaBlur) / (48 + s * 35));
      var blend = (0.55 + s * 0.42) * Math.max(0.35, t);
      d[i] = clamp255(r * (1 - blend) + medR[p] * blend);
      d[i + 1] = clamp255(g * (1 - blend) + medG[p] * blend);
      d[i + 2] = clamp255(b * (1 - blend) + medB[p] * blend);
    }
    applyDenoise(id, strength, 1);
    unsharpImageData(id, 0.12 + s * 0.28);
  }

  function applyJpegCleanup(id, strength) {
    var s = Math.max(0, Math.min(100, strength == null ? 55 : strength)) / 100;
    applyDenoise(id, s * 0.85, 1);
    unsharpImageData(id, 0.15 + s * 0.25);
  }

  function applyDerain(id, strength) {
    var s = ampStrength(strength, 1.35) / 100;
    var d = id.data;
    var i;
    applyAutoLevels(id, 40 + s * 48, 6);
    for (i = 0; i < d.length; i += 4) {
      d[i + 2] = clamp255(d[i + 2] * (1 - s * 0.16) + 128 * s * 0.08);
    }
    applyDehaze(id, strength);
    applyDenoise(id, s * 0.42, 2);
    unsharpImageData(id, 0.32 + s * 0.55);
  }

  function buildClaheLut_(lum, w, h, x0, y0, x1, y1, clipLimit) {
    var hist = new Array(256);
    var j;
    for (j = 0; j < 256; j++) hist[j] = 0;
    var count = 0;
    var y;
    var x;
    for (y = y0; y < y1; y++) {
      for (x = x0; x < x1; x++) {
        hist[Math.min(255, lum[y * w + x] | 0)]++;
        count++;
      }
    }
    var lut = new Float32Array(256);
    if (!count) {
      for (j = 0; j < 256; j++) lut[j] = j;
      return lut;
    }
    var excess = 0;
    var clipPer = (clipLimit * count) / 256;
    for (j = 0; j < 256; j++) {
      if (hist[j] > clipPer) {
        excess += hist[j] - clipPer;
        hist[j] = clipPer;
      }
    }
    var redist = excess / 256;
    for (j = 0; j < 256; j++) hist[j] += redist;
    var acc = 0;
    var cdfMax = count;
    for (j = 0; j < 256; j++) {
      acc += hist[j];
      lut[j] = (acc / cdfMax) * 255;
    }
    return lut;
  }

  function sampleClaheLut_(lut, L) {
    var li = Math.max(0, Math.min(255, L | 0));
    return lut[li];
  }

  /**
   * CLAHE with bilinear tile blending (avoids rectangular block seams on smooth shells).
   */
  function applyClahe(id, strength, tilePx) {
    var s = ampStrength(strength, 1.05) / 100;
    var w = id.width;
    var h = id.height;
    var d = id.data;
    var tile = tilePx || Math.max(56, Math.round(Math.min(w, h) / 7));
    var clipLimit = 1.8 + s * 2.4;
    var lum = new Float32Array(w * h);
    var i;
    var p;
    for (i = 0; i < d.length; i += 4) {
      p = (i / 4) | 0;
      lum[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    var tilesX = Math.max(2, Math.ceil(w / tile));
    var tilesY = Math.max(2, Math.ceil(h / tile));
    var luts = new Array(tilesX * tilesY);
    var gy;
    var gx;
    var half = tile * 0.5;
    for (gy = 0; gy < tilesY; gy++) {
      for (gx = 0; gx < tilesX; gx++) {
        var cx = Math.min(w - 1, gx * tile + half);
        var cy = Math.min(h - 1, gy * tile + half);
        var x0 = Math.max(0, Math.floor(cx - half));
        var y0 = Math.max(0, Math.floor(cy - half));
        var x1 = Math.min(w, Math.ceil(cx + half));
        var y1 = Math.min(h, Math.ceil(cy + half));
        luts[gy * tilesX + gx] = buildClaheLut_(lum, w, h, x0, y0, x1, y1, clipLimit);
      }
    }
    var y;
    var x;
    var L;
    var blend;
    var txf;
    var tyf;
    var gx0;
    var gy0;
    var gx1;
    var gy1;
    var m00;
    var m10;
    var m01;
    var m11;
    var target;
  for (y = 0; y < h; y++) {
      tyf = y / tile;
      gy0 = Math.min(tilesY - 2, Math.max(0, Math.floor(tyf)));
      gy1 = gy0 + 1;
      var fy = tyf - gy0;
      for (x = 0; x < w; x++) {
        p = y * w + x;
        L = lum[p];
        txf = x / tile;
        gx0 = Math.min(tilesX - 2, Math.max(0, Math.floor(txf)));
        gx1 = gx0 + 1;
        var fx = txf - gx0;
        m00 = sampleClaheLut_(luts[gy0 * tilesX + gx0], L);
        m10 = sampleClaheLut_(luts[gy0 * tilesX + gx1], L);
        m01 = sampleClaheLut_(luts[gy1 * tilesX + gx0], L);
        m11 = sampleClaheLut_(luts[gy1 * tilesX + gx1], L);
        target = m00 * (1 - fx) * (1 - fy) + m10 * fx * (1 - fy) + m01 * (1 - fx) * fy + m11 * fx * fy;
        if (L < 1) continue;
        blend = 1 + ((target / L) - 1) * Math.min(1, s * 0.78);
        i = p * 4;
        d[i] = clamp255(d[i] * blend);
        d[i + 1] = clamp255(d[i + 1] * blend);
        d[i + 2] = clamp255(d[i + 2] * blend);
      }
    }
  }

  /** Surgical orange JPEG speckle fix — does not touch iridescent shell pixels. */
  function applyOrangeSpeckleFix(id, strength) {
    var s = Math.min(strength == null ? 55 : strength, 70) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var i;
    var p;
    var x;
    var y;
    var r;
    var g;
    var b;
    var L;
    var ar;
    var ag;
    var ab;
    var n;
    for (y = 1; y < h - 1; y++) {
      for (x = 1; x < w - 1; x++) {
        p = (y * w + x) * 4;
        r = d[p];
        g = d[p + 1];
        b = d[p + 2];
        L = 0.299 * r + 0.587 * g + 0.114 * b;
        if (!(r > 100 && g > 58 && b < r * 0.7 && L < 200 && L > 25)) continue;
        ar = ag = ab = n = 0;
        var kx;
        var ky;
        for (ky = -1; ky <= 1; ky++) {
          for (kx = -1; kx <= 1; kx++) {
            if (kx === 0 && ky === 0) continue;
            var j = ((y + ky) * w + (x + kx)) * 4;
            ar += d[j];
            ag += d[j + 1];
            ab += d[j + 2];
            n++;
          }
        }
        if (!n) continue;
        var blend = 0.55 * s;
        d[p] = clamp255(r * (1 - blend) + (ar / n) * blend);
        d[p + 1] = clamp255(g * (1 - blend) + (ag / n) * blend);
        d[p + 2] = clamp255(b * (1 - blend) + (ab / n) * blend);
      }
    }
  }

  /**
   * Quick edit — light polish for specimen product shots.
   * No CLAHE, no gray-world, no median heal (avoids purple/neon artifacts on beetles).
   */
  function applyQuickEdit(id, strength) {
    var raw = strength == null ? 55 : strength;
    var s = Math.min(Math.max(raw, 42), 60) / 100;
    applyDenoise(id, s * 52, 1);
    applyAutoLevels(id, s * 62, 1);
    applyOrangeSpeckleFix(id, s * 100);
    unsharpImageData(id, 0.1 + s * 0.2);
  }

  /** Gentle product-shot path — no CLAHE (prevents iridescent shell block artifacts). */
  function applySpecimenPlate(id, strength, options) {
    options = options || {};
    var raw = strength == null ? 55 : strength;
    var s = Math.min(Math.max(raw, 40), 65) / 100;
    applyDenoise(id, s * 48, 1);
    applyAutoLevels(id, s * 58, 2);
    applyOrangeSpeckleFix(id, s * 100);
    unsharpImageData(id, 0.14 + s * 0.26);
  }

  /** Dark-channel prior lite — field haze / fog reduction. */
  function applyDehaze(id, strength) {
    var s = ampStrength(strength, 1.42) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var n = w * h;
    var dark = new Float32Array(n);
    var i;
    var p;
    var r;
    var g;
    var b;
    for (i = 0; i < d.length; i += 4) {
      p = (i / 4) | 0;
      r = d[i];
      g = d[i + 1];
      b = d[i + 2];
      dark[p] = Math.min(r, g, b);
    }
    var blurD = boxBlurChannel(dark, w, h, 7);
    var air = 0;
    var sample = 0;
    for (p = 0; p < n; p += 17) {
      air += blurD[p];
      sample++;
    }
    air = sample ? air / sample : 200;
    air = Math.max(120, Math.min(245, air));
    var omega = 0.88 + s * 0.08;
    var tMin = 0.12 + (1 - s) * 0.08;
    for (i = 0; i < d.length; i += 4) {
      p = (i / 4) | 0;
      r = d[i];
      g = d[i + 1];
      b = d[i + 2];
      var trans = 1 - omega * (blurD[p] / air);
      trans = Math.max(tMin, Math.min(1, trans));
      var recover = (1 - trans) * 0.85 * s;
      d[i] = clamp255((r - air * (1 - trans)) / trans + recover * (r - air));
      d[i + 1] = clamp255((g - air * (1 - trans)) / trans + recover * (g - air));
      d[i + 2] = clamp255((b - air * (1 - trans)) / trans + recover * (b - air));
    }
    applyGrayWorldBalance(id, Math.min(100, strength + 6));
  }

  function applyClarity(id, strength) {
    var s = ampStrength(strength, 1.48) / 100;
    applyClahe(id, strength, null);
    applyAutoLevels(id, strength, 4);
    unsharpImageData(id, 0.65 + s * 1.25);
    applyColorGrade(
      id,
      mergeGradeParams({ contrast: 16, vibrance: 12, saturation: 8 }),
      strength
    );
  }

  function applyVignetteRemoval(id, strength) {
    var s = ampStrength(strength, 1.35) / 100;
    var d = id.data;
    var w = id.width;
    var h = id.height;
    var cx = w / 2;
    var cy = h / 2;
    var maxR = Math.sqrt(cx * cx + cy * cy);
    var i;
    var x;
    var y;
    var p;
    var r;
    var lift;
    for (y = 0; y < h; y++) {
      for (x = 0; x < w; x++) {
        p = (y * w + x) * 4;
        r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) / maxR;
        if (r < 0.55) continue;
        lift = ((r - 0.55) / 0.45) * s * 42;
        d[p] = clamp255(d[p] + lift);
        d[p + 1] = clamp255(d[p + 1] + lift);
        d[p + 2] = clamp255(d[p + 2] + lift);
      }
    }
  }

  function applyExposureLift(id, strength) {
    var s = ampStrength(strength, 1.4) / 100;
    applyAutoLevels(id, strength, 16 + s * 24);
    applyColorGrade(
      id,
      mergeGradeParams({ shadows: 38, highlights: -14, contrast: 10, vibrance: 8 }),
      strength
    );
    applyVignetteRemoval(id, strength * 0.7);
  }

  function applySharpenPass(id, strength) {
    var s = ampStrength(strength, 1.5) / 100;
    applyAutoLevels(id, strength * 0.35, 0);
    unsharpImageData(id, 0.95 + s * 1.45);
    applyClahe(id, strength * 0.5, null);
  }

  function applyWhiteBalance(id, strength) {
    var s = ampStrength(strength, 1.45);
    applyGrayWorldBalance(id, s);
    applyAutoLevels(id, s * 0.75, 6);
    applyColorGrade(id, mergeGradeParams({ temperature: 6, saturation: 6 }), s);
  }

  /** Reduce yellow / sepia cast common in aged collection prints. */
  function applyCastRemoval(id, strength) {
    var s = ampStrength(strength, 1.38) / 100;
    var d = id.data;
    var i;
    var r;
    var g;
    var b;
    var y;
    for (i = 0; i < d.length; i += 4) {
      r = d[i];
      g = d[i + 1];
      b = d[i + 2];
      y = (r + g) * 0.5 - b;
      if (y > 8) {
        var cut = y * s * 0.42;
        d[i] = clamp255(r - cut * 0.35);
        d[i + 1] = clamp255(g - cut * 0.45);
        d[i + 2] = clamp255(b + cut * 0.55);
      }
    }
    applyGrayWorldBalance(id, strength);
    applyColorGrade(id, mergeGradeParams({ temperature: -10, tint: -4, saturation: 8 }), strength);
  }

  function applyArchiveRestore(id, strength, options) {
    options = options || {};
    var s = Math.min(ampStrength(strength, 1.15), 82);
    applyAutoLevels(id, s, 8);
    applyClahe(id, s * 0.55, null);
    applyDehaze(id, s * 0.65);
    applyGrayWorldBalance(id, s);
    applyGlareReduction(id, s * 0.75);
    applyDenoise(id, s, null);
    applyColorGrade(
      id,
      mergeGradeParams({
        temperature: (options.gradeParams && options.gradeParams.temperature) || 12,
        saturation: 14,
        contrast: 12,
        vibrance: 10,
        shadows: 18,
        highlights: -8
      }),
      s
    );
    unsharpImageData(id, 0.45 + (s / 100) * 0.75);
  }

  function applyMode(id, mode, strength, options) {
    options = options || {};
    var grade = options.gradeParams;
    mode = mode || 'enhance';
    if (mode === 'grade') {
      applyAutoLevels(id, strength, 4);
      applyColorGrade(id, grade, strength);
      unsharpImageData(id, 0.35 + (ampStrength(strength) / 100) * 0.65);
      return;
    }
    if (mode === 'glare') {
      applyAutoLevels(id, strength, 6);
      applyGlareReduction(id, strength);
      applyGlareReduction(id, strength);
      applyGrayWorldBalance(id, strength);
      unsharpImageData(id, 0.35 + (ampStrength(strength) / 100) * 0.55);
      return;
    }
    if (mode === 'correctColor') {
      applyAutoLevels(id, strength, 14 + (ampStrength(strength) / 100) * 28);
      applyGrayWorldBalance(id, strength);
      applyColorGrade(
        id,
        mergeGradeParams({
          temperature: (options.gradeParams && options.gradeParams.temperature) || 18,
          saturation: 22,
          contrast: 14,
          vibrance: 10
        }),
        strength
      );
      unsharpImageData(id, 0.4 + (ampStrength(strength) / 100) * 0.75);
      return;
    }
    if (mode === 'denoise') {
      applyAutoLevels(id, strength * 0.5, 0);
      applyDenoise(id, strength, null);
      return;
    }
    if (mode === 'dust') {
      applyAutoLevels(id, strength, 2);
      applyDustRemoval(id, strength);
      applyDustRemoval(id, Math.min(100, strength + 8));
      return;
    }
    if (mode === 'jpeg') {
      applyAutoLevels(id, strength * 0.4, 0);
      applyJpegCleanup(id, strength);
      return;
    }
    if (mode === 'derain') {
      applyDerain(id, strength);
      return;
    }
    if (mode === 'dehaze') {
      applyAutoLevels(id, strength, 8);
      applyDehaze(id, strength);
      applyClahe(id, strength, null);
      unsharpImageData(id, 0.45 + (ampStrength(strength) / 100) * 0.85);
      return;
    }
    if (mode === 'clarity') {
      applyClarity(id, strength);
      return;
    }
    if (mode === 'archive') {
      applyArchiveRestore(id, strength, options);
      return;
    }
    if (mode === 'specimen') {
      applySpecimenPlate(id, strength, options);
      return;
    }
    if (mode === 'quickEdit') {
      applyQuickEdit(id, strength);
      return;
    }
    if (mode === 'deblur') {
      applyAutoLevels(id, strength, 4);
      applyClahe(id, strength * 0.65, null);
      unsharpImageData(id, 0.85 + (ampStrength(strength) / 100) * 1.55);
      return;
    }
    if (mode === 'exposure') {
      applyExposureLift(id, strength);
      return;
    }
    if (mode === 'sharpen') {
      applySharpenPass(id, strength);
      return;
    }
    if (mode === 'whiteBalance') {
      applyWhiteBalance(id, strength);
      return;
    }
    if (mode === 'vignette') {
      applyAutoLevels(id, strength * 0.5, 2);
      applyVignetteRemoval(id, strength);
      applyGrayWorldBalance(id, strength * 0.6);
      return;
    }
    if (mode === 'castRemove') {
      applyAutoLevels(id, strength, 6);
      applyCastRemoval(id, strength);
      applyClahe(id, strength * 0.55, null);
      unsharpImageData(id, 0.35 + (ampStrength(strength) / 100) * 0.65);
      return;
    }
    if (mode === 'exportPrep') {
      applyAutoLevels(id, Math.max(strength, 72), 8);
      applyGrayWorldBalance(id, strength);
      applyColorGrade(
        id,
        mergeGradeParams({
          contrast: 12,
          saturation: 8,
          vibrance: 6,
          highlights: -6
        }),
        strength
      );
      unsharpImageData(id, 0.85 + (ampStrength(strength) / 100) * 1.1);
      return;
    }
    applySpecimenPlate(id, strength, options);
  }

  function processBlob(blob, mode, strength, options) {
    mode = mode || 'enhance';
    return loadImageBlob(blob).then(function (img) {
      var canvas = drawToCanvas(img, 2048);
      var ctx = canvas.getContext('2d');
      var id = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyMode(id, mode, strength, options);
      ctx.putImageData(id, 0, 0);
      var q = mode === 'exportPrep' ? 0.94 : 0.92;
      return canvasToJpeg(canvas, q);
    });
  }

  function processUrl(imageUrl, mode, strength, options) {
    return blobFromUrl(imageUrl)
      .then(function (blob) {
        return processBlob(blob, mode, strength, options);
      })
      .then(function (outBlob) {
        return {
          ok: true,
          imageUrl: URL.createObjectURL(outBlob),
          blob: outBlob,
          provider: 'browser-enhance',
          op: mode || 'enhance'
        };
      })
      .catch(function (err) {
        return {
          ok: false,
          provider: 'browser-enhance',
          message: String(err && err.message ? err.message : err)
        };
      });
  }

  global.MCPrlEnhancePro = {
    DEFAULT_GRADE: DEFAULT_GRADE,
    mergeGradeParams: mergeGradeParams,
    kelvinToRgb: kelvinToRgb,
    applyClahe: applyClahe,
    applyDehaze: applyDehaze,
    applyClarity: applyClarity,
    applyArchiveRestore: applyArchiveRestore,
    applySpecimenPlate: applySpecimenPlate,
    applyQuickEdit: applyQuickEdit,
    processUrl: processUrl,
    processBlob: processBlob
  };
})(typeof window !== 'undefined' ? window : this);
