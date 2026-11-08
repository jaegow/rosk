---
id: ux/feedback/message/banner
kind: rule
status: settled
---
# Banner

- App-wide state tied to no record (a new version, a scope the reader is working in) is a `Banner`, never anything about the record in view.
- A scope banner takes the warning tone and stacks above every other banner, then warning above info, in DOM order.
- A banner centres its message, keeps its CTAs at the trailing edge and carries no icon.
