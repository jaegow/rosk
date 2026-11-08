---
id: testing/always/clocks
kind: rule
status: settled
---
# Clocks

A test runs on three clocks: vitest's fake timers, `userEvent`'s own delays, and the real clock that `expect.poll` and harness waits poll on.

- Prefer real timers. Fake only the APIs the case needs (`toFake: ['setInterval', 'clearInterval']`), install them before mount so the scheduled timer lands on the fake, and restore real timers in `afterEach`.
- Under fake timers in jsdom, pass `shouldAdvanceTime: true` and give `userEvent.setup` `advanceTimers: vi.advanceTimersByTime`; otherwise its zero-delay waits never resolve.
- Never poll with `expect.poll` or a harness wait on a clock you faked whole.
- A UI timing constant computes both values inline off `import.meta.env.MODE === 'test'`, with no `.env`.
- A debounce shorter than the typing is a guaranteed flake: assert the last call once typing stops with `expect.poll`, never by lengthening the window.
- Never pad a race with a sleep; remove the collision.
