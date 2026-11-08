---
id: dx/service/args
kind: rule
status: settled
---
# Args

- An entry takes one argument; several values make it an object. The domain hook keys its query on that argument's type, taken from the entry.
- A domain hook reads nothing ambient (no route, storage, context or store) beyond the query client; the caller passes every value as an argument.
  Why: an ambient read is invisible at the call site and binds the hook to one screen.
- A mutation takes its scope (a parent id) in its variables.
