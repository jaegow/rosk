---
id: dx/service/bulk-write
kind: rule
status: settled
---
# Bulk write

- Send a bulk action over a selection as one call with one `mutate`.
- Prefer skip-and-report: one result per row in input order, each with its error; all-or-nothing only when rows depend on each other.
- Read the outcome from the per-row results, keep failed rows selected, and on settle invalidate the list domain and each succeeded row's detail.
