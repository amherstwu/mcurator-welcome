/**
 * Husbandry Log — centralized action registry (single dispatch entry).
 * Handlers may be sync or return a Promise.
 */
(function (global) {
  'use strict';

  var registry = Object.create(null);
  var aliases = Object.create(null);
  var busy = Object.create(null);
  var modules = [];

  function isDevMode_() {
    try {
      if (global.MC_HUSBANDRY_DEBUG) return true;
      if (global.localStorage && global.localStorage.getItem('mc_hl_debug') === '1') return true;
      if (global.location && /[?&]hlDebug=1(?:&|$)/.test(String(global.location.search || ''))) return true;
    } catch (e) {}
    return false;
  }

  function setLoading_(el, on) {
    if (!el || !el.setAttribute) return;
    if (on) {
      el.setAttribute('disabled', 'disabled');
      el.classList.add('is-loading');
      el.setAttribute('aria-busy', 'true');
    } else {
      el.removeAttribute('disabled');
      el.classList.remove('is-loading');
      el.removeAttribute('aria-busy');
    }
  }

  function register(name, handler) {
    if (!name || typeof handler !== 'function') {
      throw new Error('[husbandry-actions] register requires name + function');
    }
    if (registry[name]) {
      console.warn('[husbandry-actions] duplicate registration overwritten:', name);
    }
    registry[name] = handler;
  }

  function alias(from, to) {
    if (!from || !to) return;
    aliases[from] = to;
  }

  /**
   * Local module registry (wizard / breeding / care-guide).
   * handle(act, ctx) must return true when handled.
   */
  function registerModule(opts) {
    if (!opts || !opts.prefix || typeof opts.handle !== 'function') {
      throw new Error('[husbandry-actions] registerModule requires prefix + handle');
    }
    modules.push({
      prefix: opts.prefix,
      name: opts.name || opts.prefix,
      handle: opts.handle,
    });
  }

  function resolve(name) {
    if (!name) return '';
    var cur = String(name);
    var guard = 0;
    while (aliases[cur] && guard < 8) {
      cur = aliases[cur];
      guard += 1;
    }
    return cur;
  }

  function has(name) {
    var resolved = resolve(name);
    if (registry[resolved]) return true;
    for (var i = 0; i < modules.length; i += 1) {
      if (resolved.indexOf(modules[i].prefix) === 0) return true;
    }
    return false;
  }

  function listRegistered() {
    return Object.keys(registry).sort();
  }

  function listAliases() {
    return Object.assign({}, aliases);
  }

  function listModules() {
    return modules.map(function (m) {
      return { prefix: m.prefix, name: m.name };
    });
  }

  function warnUnknown_(act, resolved) {
    var msg = '[husbandry-actions] unregistered action: ' + act +
      (resolved && resolved !== act ? ' (resolved: ' + resolved + ')' : '');
    console.warn(msg);
    if (isDevMode_() && global.console && console.error) {
      console.error(msg);
    }
  }

  function dispatch(act, ctx) {
    ctx = ctx || {};
    var resolved = resolve(act);
    var handler = registry[resolved];

    if (!handler) {
      for (var i = 0; i < modules.length; i += 1) {
        var mod = modules[i];
        if (resolved.indexOf(mod.prefix) !== 0) continue;
        try {
          if (mod.handle(resolved, ctx)) return true;
        } catch (modErr) {
          console.error('[husbandry-actions] module "' + mod.name + '" failed for', resolved, modErr);
          if (typeof ctx.onError === 'function') ctx.onError(modErr, resolved);
          return false;
        }
      }
      warnUnknown_(act, resolved);
      if (typeof ctx.onUnknown === 'function') ctx.onUnknown(act, resolved);
      return false;
    }

    if (busy[resolved]) return false;
    busy[resolved] = true;
    setLoading_(ctx.el, true);

    var finished = false;
    function done() {
      if (finished) return;
      finished = true;
      busy[resolved] = false;
      setLoading_(ctx.el, false);
    }

    try {
      var result = handler(ctx);
      if (result && typeof result.then === 'function') {
        result.then(function () {
          done();
        }).catch(function (err) {
          done();
          console.error('[husbandry-actions] async action failed:', resolved, err);
          if (typeof ctx.onError === 'function') ctx.onError(err, resolved);
        });
        return true;
      }
      done();
      return true;
    } catch (err) {
      done();
      console.error('[husbandry-actions] action failed:', resolved, err);
      if (typeof ctx.onError === 'function') ctx.onError(err, resolved);
      return false;
    }
  }

  /** Test / audit helper: clear all (does not remove modules unless requested). */
  function _resetForTests(clearModules) {
    registry = Object.create(null);
    aliases = Object.create(null);
    busy = Object.create(null);
    if (clearModules) modules = [];
  }

  global.MCHusbandryActionRegistry = {
    register: register,
    alias: alias,
    registerModule: registerModule,
    resolve: resolve,
    has: has,
    listRegistered: listRegistered,
    listAliases: listAliases,
    listModules: listModules,
    dispatch: dispatch,
    isDevMode: isDevMode_,
    _resetForTests: _resetForTests,
  };
})(typeof window !== 'undefined' ? window : this);
