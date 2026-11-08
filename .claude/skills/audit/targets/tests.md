# Audit the test suite

Goal: a faster suite that proves only what the live code does. A run that cuts cases and adds none is the expected shape.
CRITICAL: add no browser case, and change no app behaviour; a place the app looks broken is an issue, not a fix.

## Rulings
- A test that disagrees with the code is stale (fix the test) or has found a bug (record an issue, leave the code).
- Delete a regression case: it guards a past bug or pins old behaviour; its title often names a bug, "still", "no longer" or "does not regress".
- Delete an invented case: a permutation no journey takes, behaviour the code lacks, a check that retired UI is absent, a gallery path, or a mapping a unit test pins.
- Keep one journey per flow and fold repeats into it as steps; keep one component case per real behaviour.
- Move a copy map, rule map or pure function to a colocated unit test, one row per branch, keeping one browser step for the wiring. A symbol local to a component module moves unchanged into a sibling `<name>.util.ts` or `use<Name>.ts`: the only app change allowed.
- Add a unit row only for a branch a cut browser case asserted and no unit test pins.

## Procedure
1. Branch from the base branch. Count the cases and time one local browser run.
2. Audit, research only, one feature folder per batch (forked when large), slowest first. Per test file: its flows; each case as keep, fold (into which, which steps survive), delete-regression or delete-invented, with why; unit moves; stale titles; risk. Prove each coverage claim by quoting the other file's `it` title.
3. Record each place the app looks broken: where (file and symbol), what looks wrong, why it matters, the proposed change and why.
4. Ask the user once, in one batch, about high-risk folds and anything the rulings do not settle.
5. Fix, one folder at a time: apply the cuts and folds, write the unit moves, run each changed file alone, and diff `describe` and `it` titles against the base to prove only planned cases went. A failure that passes on one re-run is a flake: list it and go on.
6. Run `npm run validate` once; report the before and after counts and times, the flakes, and the issues for the user to mark yes or no.
