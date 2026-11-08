---
id: dx/service/batch-read
kind: rule
status: settled
---
# Batch read

- Fetch many ids in one call, never one request per id; a sequential `for … await` is the same fan-out.
- Until a batch endpoint exists, a domain hook entry runs `useQueries`, one query per id under the single-read key, so one failure cannot empty the rest; never `useQueries` inline in a component.
