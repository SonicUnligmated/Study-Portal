# Quiz rules (Study Portal)

Plain-language notes on how the quiz behaves. It is a copy of the Med Physics
PT1 quiz, with the Study Portal extras kept on top.

## 1. Hub cards: how questions are grouped

- **Several topics in a bank:** each topic (`cat` in the bank file) gets its own card, in the order the topics first appear.
- **One topic with 100 questions or fewer:** one card.
- **One topic with more than 100 questions:** the topic is split into parts of
  roughly 40 questions, with the parts kept the same size (each is always between 20 and 50).
  They are labelled "topic · Part 1 (1–40)", "Part 2 (41–80)" and so on.
  A stepped question counts as one question.
- Nothing is hard-coded. The cards come straight from the bank file, so a new bank needs no code change.
- Old banks still work. They still have Forms A–H inside the file; forms are now
  only a storage detail, and the cards follow the topics.

### Your own card grouping (PT1 "category mode")

A bank (or its material in `data/catalog.json`) can list the cards itself.
This replaces the one-card-per-topic rule above:

```json
"cards": [
  { "id": "ch1-matter", "title": "Chapter 1: Matter and Mechanical Properties",
    "cats": ["Chapter 1: Matter and Mechanical Properties"] },
  { "id": "ch2", "title": "Chapter 2: Fluids at Rest",
    "cats": ["Chapter 2: Density", "Chapter 2: Pressure in Fluids", "…"] }
]
```

- Each entry is one card holding every question whose `cat` is in its `cats` list. This is PT1's `QUIZ_FORMS` / `poolForForm`.
- Cards appear in the order listed. `id` is optional, but keep it stable,
  because progress, runs and Mastery for the card are saved under `grp:<id>`.
- If the catalog material has `cards`, they win over the bank's `cards`.
- A topic that no entry names still gets its own card after the listed ones, so no question can go missing.
- Medical Physics PT1 uses this: four cards, the same as PT1.

Each card shows:
- the PT1 line "N linking · M choice", plus "K stepped" when the card has stepped questions;
- "X left", meaning questions not solved yet;
- "solved / total", with "· in progress" when a run was left half-done;
- your mood stamp;
- the Mastery badge.

## 2. Solved questions and resets (the PT1 "solved set")

- A question counts as **solved** once you answer it correctly. Solved questions
  do not come back in later runs of that card, so each new run only has what is left.
- A card with nothing left is dimmed.
  - Click it once and you get "Click again to reset this set".
  - Click it again within 0.9 s and PT1's dialog opens ("Reset <card>?").
  - Confirming clears that card's solved list, and all its questions come back.
- **Restart** on the results screen starts a new run of what is still left. If
  nothing is left, it opens the same reset dialog and then starts the new run.
- **Mastery / Mastery+ / "do not show again"** are kept separately, by question
  id, and a reset does not touch them. A Mastery+ run uses its own list (questions not yet cleared at your current Mastery+ level),
  so it works even when the card's solved list is empty.

## 3. Runs: leaving, coming back, finishing

- **Esc** or "← Return to interface" goes back to the hub. On the way out the
  run is saved and the clock stops.
- Clicking a card with a half-done run **resumes** it: same order, same shuffled choices, same answers, same linking lines.
  The clock continues from where it stopped.
- When every question is answered, the results screen opens by itself after 0.7 s. It shows:
  - the score, percentage and time taken;
  - every question, with each step listed separately;
  - the mood stamp row;
  - the Mastery box;
  - the buttons "Stay & review answers", "Restart" and "Return to interface".

## 4. Moving around

- The round number pills at the top jump to any question.
  - A question you passed without answering gets the moving "skip" shine.
  - The **Back** button shines while there are skipped questions behind you.
  - On the last question, the earlier unanswered ones are marked in red. Next then
    becomes "Return to first unanswered" and keeps jumping to the next open question.
- **← / →** move one question.
- **Enter** = Next, but only during a run, and not while a button has focus (that
  press already "clicks" the button).
- **F** = fullscreen.
- With "reduce motion" switched on in your system, the shines stop moving.

## 5. Question types

| Type | In the bank file | How it plays |
| --- | --- | --- |
| Choice (`mcq`) | `q, options[], correct, explain` | Wrong pick: shake + "not that one · try again", then try again. Right pick: green, ✓ explanation, celebration. |
| Linking (`matching`) | `q, leftItems[{id,text}], rightItems[{id,text}], correct_pairs{left:right}, explain` | Hold a term or meaning, drag the thread and let go on the other side. Correct links lock and glow. Wrong ones stay as loose lines. "Clear drawings" removes some loose lines but never locked ones. The lines stay attached to their boxes when the window size changes. |
| Stepped (`stepped`) | `q, explain, steps[{id,prompt,options,correct}]` | See section 6. |
| Labeling (`label`) | `q, image, alt, labels[{id, answer, accept[], x, y, w, h}], explain` (optional `credit`, `creditUrl`) | Put every label on the picture by dragging (or typing). See section 14. |
| Ordering (`order`) | `q, title, stages[{id, text, part}], explain` (stages listed in the right order) | Shuffled cards; drag them or use ▲▼, then **Check**. See section 15. |
| Short answer (`saq`) | `q, answer, explain` (optional `accept[]` for other exact forms) | A text box and a **Check** button. See section 13. |

A question without an explanation just shows ✓ (never "undefined").

## 6. Stepped ("bone") questions

- Each step is its own numbered question, so a 3-step question takes numbers 21, 22 and 23.
- The navigator shows **one pill "🦴 21–23"**. Hover over it (or tab to it) and it
  opens into one pill per step.
- The steps must be answered in order. Later steps are **locked** (dimmed, cannot be
  clicked) until the earlier ones are answered. Arrows, Next and Back jump over locked steps.
- If you leave a stepped question half done, the whole question counts as skipped:
  its pill and the Back button get the skip shine.
- The choices of each step are shuffled separately.
- A wrong pick on a step works exactly like a wrong choice answer.
- Each correct step gets the full reward: celebration, the answer counter and
  achievements. Before the last step you see "✓ step k of n · next step unlocked".
- The explanation appears after the **last** step. Only then is the question
  solved, both for the card and for Mastery.
- **Series recap:** when the last open step of a stepped question is answered
  correctly, a "Series recap" card appears under the explanation. It lists every step
  in order, each with its prompt ("Step 1 …") and its correct answer in the success
  colour, joined by ↓ arrows like a small flowchart. The usual explanation, celebration
  and reward still happen. The recap shows again whenever you revisit any step of a
  finished series (Back, the navigator, or a resumed saved run). It never shows while
  a step is still open, and not for one-step questions. The results list shows the same
  recap under each finished stepped question. It uses the theme colours, so it follows
  the mood themes and light/dark mode, and it wraps to fit narrow phone screens.
- The `group` / `groupOrder` fields are ignored, so stepped questions shuffle like any other question.
- A stepped question with **only one step** behaves like a normal question: one plain
  numbered pill (no 🦴 range), no "Step 1 / 1" badge and no "stepped ·" tag. It is
  solved, and its explanation shows, after that one step. It still counts as
  "stepped" on the card line. Lecture 10 of Periodic Test 2 has 14 of these.
- Party/split mode leaves out linking, stepped and short-answer questions and plays
  only choice questions. Party panes have no room for drawing, steps or typing.

## 7. Shuffle settings

"⚙ Quiz settings" on the hub has three switches. All are on by default and saved on this device:
- **Shuffle questions**
- **Shuffle choices** (for stepped questions, per step)
- **Insert linking questions randomly** (linking questions are dropped at random places in the run)

## 8. Saving by question id, and the move from the old saves

- All progress is saved by **question id**: solved questions, runs, Mastery and
  "do not show again". Position in a form is no longer used.
  - Every id in a bank should be unique.
  - A missing id falls back to PT1's `qid()` (start of the question text + position).
  - Duplicates get a "~2" suffix and are reported in the browser console.
  - If a question keeps its id but **changes type** (for example MT18009, which went
    from a choice question to a 2-step question), a half-finished run still resumes.
    A saved answer of the wrong shape is ignored, so the question just shows as
    unanswered. Steps are saved as `<id>#<step id>`, so an old choice answer saved
    under the plain id never fills a step. Solved marks and Mastery counts stay,
    because they are kept by id.
- Local storage: one key per bank, `sp_bank_v1:<bank>` (for example `sp_bank_v1:medphys/pt1`).
- Cloud: inside the existing `forms` part of your profile as `b_<bank>` entries
  (the database rules only allow the old top-level fields). The drawn linking
  lines are not uploaded. On another device the locked links are redrawn as clean straight lines.
- **Old saves (`pt1_form_A…H_*`)** are converted automatically the first time a bank opens:
  - A form marked done or 100% → all of that form's questions count as solved.
    It is credited to Medical Physics, which originally owned these keys, or to
    Study Skills when the saved answers have 21 entries (its forms have 21 questions).
  - A half-done form → only the answers that match that bank's correct option
    are counted. Anything that matches no question is skipped quietly.
  - Old Mastery data (counts by position) and "do not show again" marks are converted to ids the same way.
  - The old keys are never deleted. The conversion runs again only if they change.
  - Old per-form mood stamps are not carried over, because the form cards no longer exist.

### When a bank is replaced by a newer one

The new bank can say where it came from:

```json
"legacy": { "bank": "banks/medphys/pt1-v1.json", "idMap": { "<old id>": "<new id>" } }
```

- Every time the bank opens, saved progress under old ids is moved to the new
  ids: the solved list, Mastery clears and "do not show again".
  - Old ids with no entry in `idMap` are dropped, because the question no longer exists or has changed.
  - Half-done runs of cards that no longer exist are dropped.
  - This is safe to repeat. Old ids that come back from an older cloud copy are moved again.
- Old position-based saves (`pt1_form_A…H_*`, Mastery v1) are read against the
  old bank file (`legacy.bank`) and then translated through `idMap`.
- Medical Physics PT1 (October 2026) was replaced by PT1's own bank. The map was built by question text:
  - same text: 79 questions;
  - reworded with the same correct answer: 8 questions;
  - total: 84 old ids mapped.
  - Old questions whose numbers or answers changed, and the 2 old Bernoulli questions, are not carried over.

## 9. Buttons in the top corners

The connection pill (top right) and your profile chip (top left) float over the
page. If one of them would cover the page title, PT1's gear rule moves it:
- the right-side pill moves onto the title's second line, on the right;
- the left-side chip pushes the title down so it sits above it.

The check runs again after resizes, after fonts load, and when the pill or chip changes.

## 10. PT1 theme settings

PT1's theme window, colours and fonts are in `pt1-theme/` and in an inert
`<template>` in `index.html`. They are **hidden and not active**; the mood themes,
skins and cursor randomiser control the look. The quiz takes its PT1 accent
colours from the current mood (`js/quiz-accent-bridge.js`).

`window.BgQuizFx` (from PT1) can switch background layers on and off: streams,
orbs, fireworks, glow and skin pattern.

## 11. Adding a bank

1. Put the JSON at `banks/<subject>/<name>.json` in this shape:
   `{ id, subject, title, forms:["A"], bank:{ A:[ …questions… ] } }`.
2. Give every question a unique `id` and a `cat` (topic).
3. Add a material to `data/catalog.json` with `"bank": "banks/<subject>/<name>.json"`, and unlock the subject.

That is all: the cards, counts and progress come from the file.

### Lecture sets: one card per lecture (Medical Terminology Periodic Test 2)

A material can list its lectures instead of having one `bank`. The hub then shows
**one card per lecture, in the order listed**, and each lecture keeps its own
progress, run, Mastery and mood stamp (saved under its own file path, for example
`medterm/pt2/lecture-11`).

```json
{ "id": "pt2", "title": "Periodic Test 2", "draft": true,
  "lectures": [
    { "id": "lec09", "title": "Lecture 9 – Combining Forms (Part 2 of 2)",
      "bank": "banks/medterm/pt2/lecture-09.json", "status": "ready", "draft": false },
    { "id": "lec16-17", "title": "Lectures 16 & 17 – Respiratory System",
      "bank": "banks/medterm/pt2/lecture-16-17.json", "status": "ready", "draft": true } ] }
```

Periodic Test 2 now has all seven lecture sets (Lectures 9 to 20, 670 questions).
Lectures 14 & 15, 16 & 17 and 18–20 are marked Draft. No card is "coming soon" at
the moment, but the option is still there for future lectures:

- `status: "ready"` needs a `bank`. Its card shows the counts per type and plays as usual.
- `status: "soon"` (or `bank: null`) gives a dimmed "Coming soon" card that
  **cannot be clicked**. It shows only the title and its badges. Example:
  `{ "id": "lec21", "title": "Lecture 21", "bank": null, "status": "soon", "draft": true }`.
- `note` is optional and only for people editing the catalog.
- To add a lecture later, put its file in `banks/medterm/pt2/`, set `bank`, and
  change `status` to `"ready"`.
- Question ids must be unique across **all** lectures of the set. The loader checks
  this and reports any duplicates in `StudyQuiz.idReport()`.
- The bank picker (party/lobby) lists each ready lecture as "Periodic Test 2 · Lecture …".

### Draft marks

- `"draft": true` on a **material** puts a gold "Draft" badge on its portal card.
  The card stays clickable.
- `"draft": true` on a **lecture** puts a "Draft" badge on its hub card. A lecture
  that is both draft and "soon" shows "Draft" and "Coming soon".
- To clear a mark, set `draft` to `false` (or delete it). Nothing else changes.
- The badges use the theme's accent colours, so they follow the mood themes.

### Moving progress to a new file or new ids (`migrateFrom`)

When a bank moves into a lecture set, add `migrateFrom` to its lecture entry, so
earlier progress is not lost:

```json
"migrateFrom": { "bankKey": "medterm/lecture-11-msk",
                 "idPrefix": ["MSK11", "MT11"], "cardId": "cat:MSK11_lec11" }
```

On first load this copies solved questions, the saved run, the card's mood stamp,
Mastery counts and "do not show again" marks from the old key to the new one,
renaming the ids (`idPrefix` changes the start of each id; `idMap` can list ids
one by one instead). It runs once per pair and leaves the old data as it was.
Ids that have no match in the new bank are dropped.

Lecture 11 (Musculoskeletal) used to be a material of its own
(`banks/medterm/lecture-11-msk.json`, ids `MSK11001`…, topic `MSK11_lec11`). It now
lives only inside Periodic Test 2 as `banks/medterm/pt2/lecture-11.json`, with ids
`MT11001`… and topic `MT_lec11`; nothing else in it changed.

## 12. Study notes (PT1 study interface)

A material can have study notes next to its quiz:

```json
"study": { "title": "Study Interface",
  "chapters": [ { "id": "ch1", "src": "content/medphys/pt1/chapter-1.md",
                  "title": "Chapter 1 · Matter & mechanics", "meta": "Units · phases · …" } ] }
```

- The material card gets a **📖 Study** button and the practice hub gets a
  **📖 Study notes** button. Both open the notes inside the portal page, so mood themes apply.
- The notes view is PT1's `study.html` page. It shows one foldable card per
  chapter, and a chapter loads the first time you open it.
- The notes are written in Markdown and shown by PT1's own renderer (`js/study-app.js`). It handles:
  - headings, lists, tables, code/formula blocks and quotes;
  - HTML blocks such as the phase diagram.
- **Esc** or **Backspace** goes back to wherever the notes were opened from.
  "Open Quiz" opens the material's practice hub.
- Medical Physics PT1 notes are in `content/medphys/pt1/`.
  - Chapters 1 and 2 are PT1's files, unchanged.
  - Chapter 3 has the Bernoulli parts removed: they were not in the PT1 exam.

## 13. Short-answer questions (`saq`)

```json
{ "id": "MT12045", "type": "saq", "cat": "…", "q": "…", "answer": "Thromb/o", "explain": "…" }
```

- The student types into a box and presses **Check** or **Enter**.
- Grading is **strict**: capital letters, punctuation and slashes all count. For the
  answer "Thromb/o", only `Thromb/o` is right; `thromb/o`, `Thrombo`, `thrombo`,
  `THROMB/O`, `Thromb/o.` and `Thromb / o` are all wrong.
  The only thing forgiven is spacing: spaces before and after are ignored, and several
  spaces in a row count as one (`  Thromb/o ` is right, and `Phleb/o,   vein` matches
  `Phleb/o, vein`).
- `answer` can also be a list, and `accept[]` can add other exact forms. Each is
  graded the same strict way.
- A wrong answer works like a wrong choice: the box shakes, a short message shows in
  the feedback line, and the text is selected for another try. Tries are unlimited
  and the answer is **never shown**. The message gives a hint when the attempt is close:

  | Attempt (answer "Thromb/o") | Message |
  | --- | --- |
  | only the capital letters differ (`thromb/o`, `THROMB/O`) | `wrong capitalization · try again` |
  | right once the answer's `/` is dropped (`Thrombo`) | `missing slash · try again` |
  | both (`thrombo`, `THROMBO`) | `missing slash and wrong capitalization · try again` |
  | anything else (`thrombus`, `Thromb o`, `Thromb-o`) | `not that one · try again` |

  The messages are always lower case, in the same spot and style as the choice
  questions' "not that one · try again". The checks run in the order of the table.
  Spacing is trimmed first, as above. When `accept[]` is used, a hint is given if
  any accepted form is close.
- A right answer locks the box and turns it green. It gets the full reward
  (celebration, counter, achievements) and the ✓ explanation, and the question is solved.
- The Enter that checks the answer does **not** also go to the next question. Once
  the box is locked, Enter (or →) moves on as usual. PT1's keyboard guards still apply.
- The navigator pill shows ✎. Cards count these as "N short answer".
- The results list shows what was typed ("Your answer: …") and the answer.
- The typed answer is saved with the run, so leaving and coming back keeps it.
- Party mode leaves `saq` out (section 6), `label` (section 14) and `order` (section 15) too.

## 14. Labeling questions (`label`)

```json
{ "id": "MT12096", "type": "label", "cat": "MT_lec12-13", "q": "Label the structures of the heart.",
  "image": "banks/medterm/img/mt12-label-2.png", "alt": "…",
  "labels": [ { "id": "q2-L1", "answer": "Superior Vena Cava", "accept": ["SVC"],
                "x": 3.1, "y": 5.2, "w": 18.0, "h": 4.4 } ],
  "explain": "…" }
```

- `x`, `y`, `w`, `h` are **percents of the picture**, so the blank slots stay in place
  at any size. Images live in `banks/<subject>/img/`. `anchor` (a leader-line point)
  may be kept in the data, but the lines are already drawn in the picture.
- `credit` (with an optional `creditUrl`) is shown as a small caption under the
  picture. Lectures 12 & 13 use it for the three CC BY-SA 3.0 Wikimedia Commons
  pictures (MT12097–MT12099).
- **Dragging (default):** a shuffled word bank shows one chip per label. A label that
  appears twice (for example the two "Pulmonary Veins") gives two chips, and either
  chip fits either slot. Drag a chip onto a slot with the mouse or a finger, or tap
  a chip and then tap a slot. Dragging near the top or bottom edge scrolls the page.
  A wrong drop bounces the chip back with the usual shake and "not that one · try again".
- **Typing:** the "⌨ type labels" button hides the word bank and turns every open slot
  into a text box ("✋ drag labels" switches back; the choice is remembered). Typing is
  graded **strictly**, like short answers: capital letters and spelling must match the
  answer or one of the `accept` forms exactly. Only spaces at the start and end, and
  repeated spaces, are forgiven. While you type, a small note under the slot repeats
  what you typed, letter by letter, and marks every letter with the wrong capital or
  the wrong letter with a highlighter in the theme accent colour. It compares with the
  answer (or accepted form) that matches the most letters from the start. Enter on a
  wrong text shows the same lower-case hints as short answers (for example
  "wrong capitalization · try again") and never goes to the next question.
- The moment a slot is right (dropped or typed) it gets its own celebration and
  reward, and it **locks for good**. It cannot be removed or edited.
- The question is solved when every slot is filled. Then the explanation shows.
- Progress is saved after every slot, under the question id with one entry per label
  id. Coming back to a half-done picture restores the locked labels.
- The navigator pill shows 🏷, and cards count these as "N labeling".
- The results list shows the picture with the placed labels (labels never placed are
  shown in red).
- On narrow phones the picture keeps a readable minimum size and scrolls sideways
  inside its frame, so the slots stay tappable. Pinch-zoom still works.
- Party mode leaves labeling questions out. The Study screen only shows study notes
  (Medical Physics), so it has no labeling pictures yet.

## 15. Ordering questions (`order`) — "put the stages in order"

```json
{"id":"MT12100","type":"order","cat":"MT_lec12-13","title":"Pulmonary Circulation",
 "q":"Pulmonary circulation: put the stages in the order blood flows ...",
 "stages":[{"id":"s1","text":"Right Ventricle","part":"rv"}, ...],
 "explain":"..."}
```

- The bank lists `stages` in the right order. The run shows them as shuffled cards, and
  the shuffle never starts in the right order.
- Move a card by dragging it (mouse: anywhere on the card; touch: the ⠿ grip, so the
  rest of the card still scrolls the page) or with its ▲ / ▼ buttons.
- **Check** grades the order. Cards in the right place lock (🔒, green) and celebrate
  like a right PT1 answer. Wrong cards shake with "not that one · try again" and stay
  movable. Locked cards never move; the other cards move around them.
- When every card is locked the question is solved: ✓ explanation, celebration, and the
  blood-flow animation.
- **Animation.** Our own schematic heart (four chambers, the four valves, vena cava,
  pulmonary arteries and veins, aorta, coronary arteries, myocardium, and "Lungs" /
  "Body Tissues" boxes). A pulse travels the question's own stages only (each stage's
  `part` names the drawing piece: `body, vc, ra, tv, rv, psv, pa, lungs, pvn, la, mv, lv,
  av, aorta, cor, myo`). It is blue (deoxygenated) until it leaves the lungs and red
  (oxygenated) after; it turns blue again after the body tissues or the myocardium. The
  current stage's card and drawing piece light up together. **↻ replay** plays it again.
  Revisiting a solved question shows the whole path without playing.
- With `prefers-reduced-motion` there is no moving pulse: the whole path is shown at once
  (blue and red lines, the question's parts highlighted).
- Progress is saved under the question id after every move and every Check: the current
  arrangement and the locked cards. Coming back restores both (a lock only counts if that
  card really is in its right place).
- The navigator pill shows ⇅, and cards count these as "N ordering". The results list
  shows the correct order. Party mode leaves ordering questions out.
- Lectures 12 & 13 have six: Pulmonary Circulation, Systemic Circulation, Full Loop,
  Heart Valves, Heart Chambers, Coronary Circulation.

## 16. Adding a question type

Add a check next to `isMatching` / `isStepped` in `js/quiz-engine.js` and add it to `qType()`. Then:
- give `renderQuestion()` a renderer;
- make `isAnswered()` able to tell when it is answered;
- give `resultItemHTML()` a results line.

Save the answer under the question id (see `serializeAnswers` / `restoreRun`).
Party mode only plays types whose shape it knows.

---
Note: the Medical Terminology bank says `subjectId: "medical_terminology"`, while
the catalog uses the id `medterm`. The catalog id was kept so nothing else breaks.
Progress is saved under the file path (`medterm/pt2/lecture-11` etc.), so the mismatch does not matter.
