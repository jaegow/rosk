---
id: dx/always/sitemap-keys
kind: rule
status: settled
---
# Sitemap keys

- Key every piece of per-route chrome (nav rows, crumbs, tabs, counts, their words) by the sitemap's route identifiers.
- The sitemap is the one place that names routes, views and tabs; a page keeps only each view's words and what it renders.
- Feed chrome through the shared route-keyed pieces, never a helper named for one feature.
  Why: a helper per feature is a second list of routes that drifts from the sitemap.
- A label switch over route identifiers is exhaustive with no default; adding a param-less route then fails the compile until its label gains a case, which is the tell to add its copy.
