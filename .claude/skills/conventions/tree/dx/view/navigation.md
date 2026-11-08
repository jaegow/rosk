---
id: dx/view/navigation
kind: rule
status: settled
---
# Moving within a view

- Compare a URL write's "already there" guard with the last value the view wrote, never the param the render read: the URL runs ahead of the render.
- Drop a focus or scroll deferred past a move when another move lands before it runs.
