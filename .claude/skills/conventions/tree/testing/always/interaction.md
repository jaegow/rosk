---
id: testing/always/interaction
kind: rule
status: settled
---
# Interaction

- CRITICAL: drive every interaction through `userEvent`; never `fireEvent` or `dispatchEvent`, which skip focus, hover and key sequencing.
- In a browser test, import `userEvent` from `vitest/browser` and call no `setup()` except for keyboard state held across steps.
- In a jsdom test, create `userEvent.setup()` fresh per test.
- Hold Shift for a modified click; Control-click on macOS is a secondary click and fires no `click`.
- A press on a control whose focus changes state can land between renders: focus it, wait for the render, re-read it, then press.
- Playwright refuses to click an `aria-disabled` control, timing out as not enabled: press an `unavailable` control from the keyboard (focus it, then Enter or Space), and reach for `force` only where the keyboard cannot.
