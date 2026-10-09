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
- The `group` / `groupOrder` fields are ignored, so stepped questions shuffle like any other question.
- Party/split mode leaves out linking and stepped questions and plays only choice
  questions. Party panes have no room for drawing or steps.

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

## 13. Adding a question type

Add a check next to `isMatching` / `isStepped` in `js/quiz-engine.js` and add it to `qType()`. Then:
- give `renderQuestion()` a renderer;
- make `isAnswered()` able to tell when it is answered;
- give `resultItemHTML()` a results line.

Save the answer under the question id (see `serializeAnswers` / `restoreRun`).
Party mode only plays types whose shape it knows.

---
Note: the Medical Terminology bank says `subjectId: "medical_terminology"`, while
the catalog uses the id `medterm`. The catalog id was kept so nothing else breaks.
Progress is saved under the file path (`medterm/lecture-11-msk`), so the mismatch does not matter.
