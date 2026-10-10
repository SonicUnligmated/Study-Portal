/* PICTURE STUDY (Medical Terminology PT2): the PT1 study screen, with pictures.
 * Each lecture is a chapter (the same foldable chapter cards as the Medical Physics notes),
 * each picture is a section: title, picture, teaching caption, credit line.
 * 👁 hides the labels: the blank picture gets a typing slot at every hotspot, graded with the
 * quiz engine's labeling logic (labelMatches / labelEchoHTML / saqHint: strict capitals and
 * spelling, `accept` alternatives, live letter-by-letter highlighter, lowercase hints) and the
 * PT1 celebration; a right slot locks for good. ↺ (bottom right of the picture, once a slot is
 * solved) clears that picture only. Progress: localStorage, per picture + label, separate
 * from quiz progress. */
(function () {
  'use strict';
  const STORE = 'sp_study_images_v1';
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const norm = s => (typeof saqNorm === 'function') ? saqNorm(s) : String(s == null ? '' : s).trim().replace(/\s+/g, ' ');
  const cands = l => [l.answer].concat(Array.isArray(l.accept) ? l.accept : []).filter(x => x != null && String(x).trim() !== '');
  const matches = (l, t) => (typeof labelMatches === 'function') ? labelMatches(l, t) : (!!norm(t) && cands(l).some(c => norm(c) === norm(t)));
  const echoHTML = (l, t) => (typeof labelEchoHTML === 'function') ? labelEchoHTML(l, t) : esc(t);
  const hint = (l, t) => (typeof saqHint === 'function') ? saqHint({ answer: l.answer, accept: l.accept }, t) : 'not that one · try again';

  let DATA = null, MAT = null, dataSrc = '';
  const hidden = Object.create(null); // picture key → labels hidden (this visit only)

  function loadAll() { try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) { return {}; } }
  function saveAll(all) { try { localStorage.setItem(STORE, JSON.stringify(all)); } catch (e) {} }
  function setKey() { return (MAT && (MAT.studyKey || ('medterm/' + MAT.id))) || 'study'; }
  function slotsOf(key) { const all = loadAll(); const s = all[setKey()] || {}; return Object.assign({}, (s[key] || {}).slots || {}); }
  function writeSlots(key, slots) {
    const all = loadAll(); const s = all[setKey()] = all[setKey()] || {};
    if (slots && Object.keys(slots).length) s[key] = { slots: slots, at: Date.now() }; else delete s[key];
    saveAll(all);
  }
  const isSingle = img => img.kind === 'single-structure' || !(img.labels && img.labels.length);
  const labelsOf = img => isSingle(img) ? [{ id: 'name', answer: img.answer, accept: img.accept || [] }] : img.labels;
  function solvedCount(key, img) { const s = slotsOf(key); return labelsOf(img).filter(l => s[l.id] != null && matches(l, s[l.id])).length; }
  const keyOf = (ch, img) => ch.lecture + '/' + img.id;

  function lectureOf(id) { return ((MAT && MAT.lectures) || []).find(l => l.id === id) || {}; }
  function chapterTotals(ch) {
    let n = 0, k = 0;
    ch.images.forEach(img => { n += labelsOf(img).length; k += solvedCount(keyOf(ch, img), img); });
    return { n, k, pics: ch.images.length };
  }
  function chapterMeta(ch) { const t = chapterTotals(ch); return t.pics + ' picture' + (t.pics === 1 ? '' : 's') + ' · ' + t.k + ' / ' + t.n + ' solved'; }
  function updateSummary() {
    if (!DATA) return;
    let n = 0, k = 0;
    DATA.chapters.forEach(ch => { const t = chapterTotals(ch); n += t.n; k += t.k; });
    const el = document.getElementById('studySummary');
    if (el) { el.hidden = false; el.innerHTML = '<span class="ss-label">Progress</span><span class="ss-track"><span class="ss-fill" style="width:' + (n ? Math.round(k / n * 100) : 0) + '%"></span></span><span class="ss-count">' + k + ' / ' + n + ' labels solved</span>'; }
    document.querySelectorAll('#chapterList .chapter-card').forEach(card => {
      const ch = DATA.chapters.find(c => c.lecture === card.dataset.id); if (!ch) return;
      const t = chapterTotals(ch);
      const m = card.querySelector('.chapter-toggle .meta'); if (m) m.textContent = chapterMeta(ch);
      const bar = card.querySelector('.chapter-progress .cp-fill'); if (bar) bar.style.width = (t.n ? Math.round(t.k / t.n * 100) : 0) + '%';
      card.querySelectorAll('.simg-index-chip').forEach(chip => {
        const img = ch.images.find(i => i.id === chip.dataset.img); if (!img) return;
        const kk = solvedCount(keyOf(ch, img), img), nn = labelsOf(img).length;
        chip.querySelector('.sic-count').textContent = kk + '/' + nn; chip.classList.toggle('done', kk === nn);
      });
    });
  }

  /* —— one picture —— */
  function sectionHTML(ch, img, idx) {
    const key = keyOf(ch, img), hid = !!hidden[key], single = isSingle(img);
    const slots = slotsOf(key), labels = labelsOf(img), n = labels.length;
    const k = labels.filter(l => slots[l.id] != null && matches(l, slots[l.id])).length;
    const title = (single && hid) ? 'Name this bone' : img.title;
    let h = '<header class="simg-head"><h3 class="simg-title">' + esc(title) + '</h3>'
      + '<span class="simg-count" title="Solved labels">' + k + ' / ' + n + '</span>'
      + '<button type="button" class="simg-eye" aria-pressed="' + (hid ? 'true' : 'false') + '" title="' + (hid ? 'Show the labels' : 'Hide the labels and type them') + '">'
      + '<span aria-hidden="true">' + (hid ? '🙈' : '👁') + '</span> ' + (hid ? 'labels hidden' : 'labels shown') + '</button></header>';
    const src = (hid || !img.labeled) ? img.blank : img.labeled;
    h += '<div class="simg-frame"><div class="label-stage simg-stage' + (single ? ' single' : '') + '"><div class="label-figure simg-figure' + (single ? ' single' : '') + '">'
      + '<img class="label-img simg-img" loading="lazy" decoding="async" src="' + esc(src) + '" width="' + (img.width || '') + '" height="' + (img.height || '') + '" alt="' + esc(img.alt || img.title) + '" draggable="false">';
    if (hid && !single) {
      labels.forEach(l => {
        const style = 'left:' + l.x + '%;top:' + l.y + '%;width:' + l.w + '%;height:' + l.h + '%';
        const t = slots[l.id];
        if (t != null && matches(l, t)) h += '<div class="label-slot locked" data-id="' + esc(l.id) + '" style="' + style + '"><span class="label-slot-text">' + esc(t) + '</span></div>';
        else h += '<div class="label-slot typing" data-id="' + esc(l.id) + '" style="' + style + '"><input class="label-input" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" aria-label="Label ' + esc(l.id) + '"><div class="label-echo" aria-live="polite"></div></div>';
      });
    }
    h += '</div></div><button type="button" class="simg-restart" title="Clear this picture\'s solved labels"' + (k ? '' : ' hidden') + '>↺ restart</button></div>';
    if (single) {
      const l = labels[0], t = slots.name;
      if (!hid) h += '<p class="simg-answer">' + esc(img.answer) + '</p>';
      else if (t != null && matches(l, t)) h += '<div class="simg-name done"><span class="simg-name-label">Name this bone</span><span class="simg-name-locked">✓ ' + esc(t) + '</span></div>';
      else h += '<div class="simg-name"><label class="simg-name-label" for="sn-' + esc(key) + '">Name this bone</label><div class="saq-wrap"><input id="sn-' + esc(key) + '" class="saq-input simg-name-input" type="text" autocomplete="off" spellcheck="false" autocapitalize="off" placeholder="Type the bone"><button type="button" class="nav-btn primary simg-name-check">Check</button><div class="label-echo saq-echo simg-name-echo" aria-live="polite"></div></div></div>';
    }
    h += '<div class="feedback idle simg-fb" aria-live="polite"></div>';
    if (!(single && hid)) h += '<p class="simg-caption">' + esc(img.caption || '') + '</p>';
    const lic = img.license ? (img.licenseUrl ? '<a href="' + esc(img.licenseUrl) + '" target="_blank" rel="noopener">' + esc(img.license) + '</a>' : esc(img.license)) : '';
    // a bone's source page names it, so its link only shows with the labels shown
    const srcLink = (img.sourceUrl && !(single && hid)) ? ' · <a href="' + esc(img.sourceUrl) + '" target="_blank" rel="noopener">source</a>' : '';
    h += '<p class="simg-credit">Image: ' + esc(img.credit || '') + (lic ? ' · ' + lic : '') + srcLink + '</p>';
    return h;
  }
  function renderSection(sec, ch, img) {
    const key = keyOf(ch, img);
    sec.innerHTML = sectionHTML(ch, img);
    sec.classList.toggle('is-hidden', !!hidden[key]);
    sec.querySelector('.simg-eye').addEventListener('click', () => {
      hidden[key] = !hidden[key]; renderSection(sec, ch, img);
      if (hidden[key]) { const f = sec.querySelector('.label-input, .simg-name-input'); if (f) try { f.focus({ preventScroll: true }); } catch (e) {} }
    });
    sec.querySelector('.simg-restart').addEventListener('click', () => { writeSlots(key, {}); renderSection(sec, ch, img); updateSummary(); });
    const fb = sec.querySelector('.simg-fb');
    const say = (cls, msg, ms) => { fb.className = 'feedback ' + cls + ' simg-fb'; fb.textContent = msg; clearTimeout(fb._t); if (ms) fb._t = setTimeout(() => { fb.className = 'feedback idle simg-fb'; fb.textContent = ''; }, ms); };
    const shake = el => { el.classList.remove('soft-wrong'); void el.offsetWidth; el.classList.add('soft-wrong'); setTimeout(() => el.classList.remove('soft-wrong'), 480); };
    const lock = (l, text, el) => {
      const slots = slotsOf(key); if (slots[l.id] != null) return;
      slots[l.id] = norm(text); writeSlots(key, slots);
      const r = el.getBoundingClientRect();
      const labels = labelsOf(img), k = labels.filter(x => slots[x.id] != null).length, n = labels.length;
      const hadFocus = el.contains(document.activeElement);
      renderSection(sec, ch, img);
      const done = sec.querySelector('.label-slot.locked[data-id="' + CSS.escape(l.id) + '"], .simg-name.done');
      if (done) done.classList.add('just-locked');
      if (typeof spawnFireworkBurst === 'function') spawnFireworkBurst(r.left + r.width / 2, r.top + r.height / 2, 14);
      const fb2 = sec.querySelector('.simg-fb');
      fb2.className = 'feedback good simg-fb';
      fb2.textContent = k >= n ? ('✓ all ' + n + ' solved') : ('✓ ' + k + ' of ' + n + ' labels');
      if (k >= n) { sec.classList.add('correct-pulse'); setTimeout(() => sec.classList.remove('correct-pulse'), 650); if (typeof pt1Confetti === 'function') pt1Confetti(); }
      updateSummary();
      if (hadFocus) { const nx = sec.querySelector('.label-slot.typing input'); if (nx) try { nx.focus({ preventScroll: true }); } catch (e) {} }
    };
    sec.querySelectorAll('.label-slot.typing').forEach(slot => {
      const input = slot.querySelector('input'), echo = slot.querySelector('.label-echo');
      const l = img.labels.find(x => x.id === slot.dataset.id);
      input.addEventListener('input', () => {
        echo.innerHTML = echoHTML(l, input.value);
        slot.classList.toggle('has-echo', !!echo.innerHTML);
        if (matches(l, input.value)) lock(l, input.value, slot);
      });
      input.addEventListener('keydown', e => {
        if (e.key !== 'Enter') return;
        e.preventDefault(); e.stopPropagation();
        if (!norm(input.value)) return;
        if (matches(l, input.value)) lock(l, input.value, slot);
        else { shake(input); say('soft', hint(l, input.value), 1400); }
      });
    });
    const ni = sec.querySelector('.simg-name-input');
    if (ni) {
      const l = labelsOf(img)[0], echo = sec.querySelector('.simg-name-echo');
      const check = () => {
        if (!norm(ni.value)) { ni.focus(); return; }
        if (matches(l, ni.value)) lock(l, ni.value, ni.closest('.simg-name'));
        else { shake(ni); say('soft', hint(l, ni.value), 1400); ni.select(); }
      };
      ni.addEventListener('input', () => { echo.innerHTML = echoHTML(l, ni.value); });
      ni.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); check(); } });
      sec.querySelector('.simg-name-check').addEventListener('click', check);
    }
  }
  function renderChapterBody(body, ch) {
    const md = body.querySelector('.md') || body;
    md.className = 'md simg-chapter';
    let idx = '<nav class="simg-index" aria-label="Pictures in this chapter">';
    let b = 0;
    ch.images.forEach(img => {
      const name = isSingle(img) ? ('Bone ' + (++b)) : img.title;
      idx += '<button type="button" class="simg-index-chip" data-img="' + esc(img.id) + '"><span class="sic-name">' + esc(name) + '</span><span class="sic-count"></span></button>';
    });
    md.innerHTML = idx + '</nav><div class="simg-list"></div>';
    const list = md.querySelector('.simg-list');
    ch.images.forEach(img => {
      const sec = document.createElement('section');
      sec.className = 'simg-card' + (isSingle(img) ? ' single' : '');
      sec.dataset.key = keyOf(ch, img); sec.dataset.img = img.id;
      list.appendChild(sec);
      renderSection(sec, ch, img);
    });
    md.querySelectorAll('.simg-index-chip').forEach(chip => chip.addEventListener('click', () => {
      const s = list.querySelector('.simg-card[data-img="' + CSS.escape(chip.dataset.img) + '"]');
      if (s) s.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }));
    updateSummary();
  }

  /* build the chapter list (same chapter cards as the notes) */
  async function build(listEl, material, opts) {
    MAT = material; opts = opts || {};
    const src = material.study.images;
    if (!DATA || dataSrc !== src) {
      listEl.innerHTML = '<p class="simg-loading">Loading pictures…</p>';
      const res = await fetch(src, { cache: 'no-store' });
      if (!res.ok) throw new Error(src + ' → ' + res.status);
      DATA = await res.json(); dataSrc = src;
    }
    listEl.innerHTML = '';
    DATA.chapters.forEach(ch => {
      const lec = lectureOf(ch.lecture);
      const card = document.createElement('article');
      card.className = 'chapter-card simg-chapter-card'; card.dataset.id = ch.lecture;
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'chapter-toggle'; btn.setAttribute('aria-expanded', 'false');
      btn.innerHTML = '<span class="chev" aria-hidden="true">›</span><span class="title">' + esc(lec.title || ch.lecture)
        + (lec.draft ? '<span class="draft-badge study-draft" title="Unfinished · still being written">Draft</span>' : '') + '</span><span class="meta">' + esc(chapterMeta(ch)) + '</span>';
      const prog = document.createElement('div'); prog.className = 'chapter-progress'; prog.innerHTML = '<span class="cp-fill"></span>';
      const body = document.createElement('div'); body.className = 'chapter-body';
      body.innerHTML = '<article class="md"></article>';
      btn.addEventListener('click', () => {
        const open = card.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open && body.dataset.loaded !== '1') { renderChapterBody(body, ch); body.dataset.loaded = '1'; }
      });
      card.append(btn, prog, body);
      listEl.appendChild(card);
    });
    updateSummary();
    if (opts.focus) {
      const card = listEl.querySelector('.chapter-card[data-id="' + CSS.escape(opts.focus) + '"]');
      if (card) { card.querySelector('.chapter-toggle').click(); setTimeout(() => card.scrollIntoView({ block: 'start' }), 30); }
    }
  }
  function chapterIds(material) { return (DATA && material && material.study && dataSrc === material.study.images) ? DATA.chapters.map(c => c.lecture) : null; }
  window.StudyImages = { build, storeKey: STORE, chapterIds, _data: () => DATA };
})();
