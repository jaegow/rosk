---
id: testing/browser/waits
kind: rule
status: settled
---
# Waits

- After an action, read by polling (`expect.poll(() => locator.query())`) or a harness wait, never a one-shot read.
- A one-shot read proves only absence, after a positive wait showed the state settled and the request's spy was called.
- After a navigation, wait on something only the destination renders; the page being left is still mounted, and a URL change lands before the render.
- After a refetch, poll on what only the new data has.
- Anything read once right after a router or history call races it: poll the read.
- Count elements with an un-nth'd locator; `.nth(n).elements()` returns at most one.
