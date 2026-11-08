---
id: dx/service/contract
kind: rule
status: settled
---
# Contract

- Settle what an endpoint accepts and returns from the server's own source of truth (its schema or serializer at its main branch), never from a plan, a type in this repo or a green test.
- A fixture copies a real response's shape and never invents a field.
