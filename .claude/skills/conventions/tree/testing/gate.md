---
id: testing/gate
kind: question
status: settled
question: What is the cheapest layer that fails when this behaviour breaks?
default: browser/journey.md
---
# Which layer?

The pyramid: many unit-node tests, fewer jsdom tests, fewest browser tests. Check the existing cases first, then take the first rung that can prove it.

- An existing case already proves it, or the change is layout, order or styling alone → [add nothing](always/scope.md)
- Pure logic: a util, a reducer, a derivation, a resolver's outcome, service request building, a script → [unit-node](unit/node.md)
- A hook, a context, a store with DOM events, or a light render whose output is text and roles, with no layout or real focus → [unit jsdom](unit/jsdom.md)
- A component's own contract that needs a real browser: layout, overflow, geometry, real focus, portals, pointer → [browser component](browser/component.md)
- Behaviour that exists only across a page or a route: one more step in that flow's journey → [browser journey](browser/journey.md)
