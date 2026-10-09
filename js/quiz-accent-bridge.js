/* Study Portal — mood → PT1 accent bridge.
 * PT1's quiz CSS is written against --accent-0..6 and --accent-N-rgb (set by
 * PT1's colorizer). The portal has no colorizer; its mood themes set --cyan,
 * --cyan-bright, --teal, --gold, --violet. This bridge reads the live mood
 * colours and publishes the PT1 accent variables ONLY on the quiz containers
 * (.pt1q), so portal chrome, cursors and mood themes are untouched.
 * Re-runs whenever <html> class / data-skin / data-quality / style changes.
 */
(function (global) {
  var STYLE_ID = 'pt1-accent-bridge';
  var probe = null;

  function toRgb(value, fallback) {
    var v = String(value || '').trim();
    if (!v) v = fallback;
    if (!probe) {
      probe = document.createElement('span');
      probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none';
      (document.body || document.documentElement).appendChild(probe);
    }
    probe.style.color = '';
    probe.style.color = v;
    var c = getComputedStyle(probe).color || '';
    var m = c.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (!m) {
      probe.style.color = fallback;
      c = getComputedStyle(probe).color || '';
      m = c.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    }
    if (!m) return [34, 211, 238];
    return [Math.round(+m[1]), Math.round(+m[2]), Math.round(+m[3])];
  }
  function hex(rgb) {
    return '#' + rgb.map(function (n) { return Math.max(0, Math.min(255, n | 0)).toString(16).padStart(2, '0'); }).join('');
  }
  function darken(rgb, f) {
    return rgb.map(function (n) { return Math.round(n * (1 - f)); });
  }

  var last = '';
  function compute() {
    var cs = getComputedStyle(document.documentElement);
    var get = function (n) { return cs.getPropertyValue(n); };
    var a0 = toRgb(get('--cyan'), '#22d3ee');
    var a1 = toRgb(get('--cyan-bright'), '#67e8f9');
    var a2 = toRgb(get('--teal'), '#2dd4bf');
    var a3 = toRgb(get('--gold'), '#fbbf24');
    var a4 = darken(a0, 0.38);
    var a5 = toRgb(get('--violet'), '#a78bfa');
    var a6 = toRgb(get('--gold'), '#fbbf24');
    var list = [a0, a1, a2, a3, a4, a5, a6];
    return list;
  }
  function apply() {
    var list = compute();
    var body = list.map(function (rgb, i) {
      return '--accent-' + i + ':' + hex(rgb) + ';--accent-' + i + '-rgb:' + rgb.join(',') + ';';
    }).join('');
    if (body === last) return list;
    last = body;
    var el = document.getElementById(STYLE_ID);
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = '.pt1q{' + body + '}';
    try { global.dispatchEvent(new CustomEvent('pt1-accents-changed', { detail: { colors: list.map(hex) } })); } catch (e) {}
    return list;
  }
  function colors() {
    return compute().map(hex);
  }

  var raf = 0;
  function schedule() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = 0; apply(); });
  }
  function start() {
    apply();
    try {
      new MutationObserver(schedule).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-skin', 'data-quality', 'style', 'data-cursor']
      });
    } catch (e) {}
    global.addEventListener('study-prefs-changed', schedule);
  }

  global.StudyAccentBridge = { apply: apply, colors: colors, start: start };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})(window);
