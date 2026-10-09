# Medical Physics PT1 bank: source and changes

`pt1.json` is PT1's `data/bank.json` (medphysics-pt1, commit 75cf785; 196 questions, 17 linking).
It is copied exactly, apart from the changes below. The result has 185 questions, 15 of them linking.

Metadata changed so the portal title reads correctly:
- `id` is `pt1`, `subjectId` is `medphys`, `title` is `Periodic Test 1` and `formSize` is 185;
- `cards` (PT1 QUIZ_FORMS grouping, with Ch3 renamed) and `legacy` (the id map) were added.

## Removed: Bernoulli (not in the PT1 exam), 11 questions

All 11 had the category "Chapter 3: Bernoulli's Equation".

| id | type | question |
|---|---|---|
| PHY00110 | mcq | For steady, incompressible, frictionless streamline flow, Bernoulli's principle keeps which three energy terms constant per unit volume? |
| PHY00111 | mcq | Which of the following is the correct form of Bernoulli's equation? |
| PHY00113 | mcq | In a narrowed artery, Bernoulli's principle predicts: |
| PHY00205 | mcq | For an ideal fluid, keeps which sum constant along a streamline? |
| PHY00206 | mcq | Which set of conditions is assumed when Bernoulli's equation is applied? |
| PHY00208 | mcq | A Venturi mask controls the oxygen fraction by using which relation? |
| PHY00209 | mcq | A murmur heard over a narrowed valve is produced by which change? |
| PHY00210 | mcq | Doppler ultrasound is used to measure which feature of blood flow? |
| PHY00218 | matching | Match each relation to the job it does in a narrowed vessel. |
| PHY00223 | matching | Match each flow formula to the statement it makes. |
| PHY00238 | mcq | In the Bernoulli sum, which term is kinetic energy per unit volume, and which is potential energy per unit volume? |

## Edited: continuity questions that used Bernoulli as a wrong option or in the explanation

- **PHY00107** "The equation of continuity in its general form is:"
  - wrong option `P₁ + ½ ρ v₁² = P₂ + ½ ρ v₂²` (a Bernoulli fragment) became `ρ₁ / A₁ = ρ₂ / A₂`;
  - the explanation sentence about Bernoulli was replaced.
  - The correct answer is unchanged: `ρ₁ A₁ v₁ = ρ₂ A₂ v₂`.
- **PHY00204** "In carotid stenosis, why does blood speed rise in the narrowed segment?"
  - wrong option "Bernoulli's relation lowers pressure, and speed follows pressure" became "Hooke's relation stretches the wall, and speed follows the stretch";
  - the explanation sentence "Bernoulli then accounts for the pressure drop…" was removed.
  - The correct answer is unchanged.

No other question mentions Bernoulli, Venturi or ½ρv².
I checked the question text, options, linking items and explanations of every question.
The ρgh formulas in Chapter 2 are about pressure at depth, not Bernoulli, and stay.

## Chapter 3 notes (`content/medphys/pt1/chapter-3.md`)

Removed whole sections:
- §6 "Bernoulli's equation" (assumptions, statement, how it is built, terms table, same-height trade-off, linking continuity and Bernoulli at a stenosis);
- §7 "Medical applications of Bernoulli" (stenosis/TIA framing, Venturi mask, heart murmurs, Doppler ultrasound, conclusion).
  - Murmurs and turbulence are still covered in §3.

Removed lines:
- overview table row `Bernoulli | P + ½ρv² + ρgh = constant`;
- the "Link continuity → Bernoulli" line;
- the formula sheet lines `Bernoulli: P + ½ ρ v² + ρ g h = constant` and "At same height: higher speed means lower pressure";
- checklist rows "Lower pressure in that segment | Bernoulli…", "Controlled O₂ mask | Venturi / Bernoulli" and "Velocity imaging of vessels | Doppler ultrasound".

Edited:
- the title is now "Fluid Flow (mass flow & continuity)";
- the overview row "Medical" now reads "Stenosis (faster flow), turbulence, murmurs";
- the "(Bernoulli)" endings were cut from the two stenosis sentences in §5;
- the formula sheet and checklist were renumbered §6 and §7.
