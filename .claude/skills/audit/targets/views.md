# Audit the views

Review each view as the person who came to it: the page, and each dialog or drawer opened on it. Run the dev server, navigate only, and never press a CTA that saves, submits or deletes.

1. Name the view's tasks, two to five, from its primary CTAs, tabs and the record it shows.
2. For each task count Reach, the steps from the nav to where the task happens (a click, a load, a tab, a dialog, a screen of scrolling), and Confusion, each point a person could take a wrong turn: two controls that could lead there, a label that does not name where it goes, the place below the fold or behind an unnamed tab, a label changing along the path, a count that names no destination.
3. Weight = Reach + 2 × Confusion. A weight of 6 or more is a finding; so is any wrong turn on the main task.
4. Repeated copy: a title repeated in a heading or band, a status shown as a chip and again in words, a helper restating its label, an intro saying what the layout shows. Repeats that disagree come first.
5. Duplicated or confusing UI: two controls doing one thing, one label for two things, a control that looks main but is not, two ways into one place landing in different states, two near-identical tables.
6. A view that asks for a decision says what to decide near the top, sets read-only facts apart from the form, and groups short facts into one short card.
7. Count communication points (messages, bands, chips, hints, tooltips, toasts, empty states); one that tells the person nothing they need, or nothing the view does not already show, is unnecessary.
8. Also record: raw keys or codes a person reads, controls with no accessible name, clipped text with no way to read it, sideways page scroll, layout shift, dead links, a blank content area.

Name the tree node each finding breaks, or `no node`. Write rows of `View | Task | Reach | Confusion | Weight | Finding | Node` to one dated `*.scratch.audit.*` folder, then walk the user through them page by page.
