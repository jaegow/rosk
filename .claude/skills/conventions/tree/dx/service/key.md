---
id: dx/service/key
kind: rule
status: settled
---
# Key

- A service key is `'VERB.Resource[.qualifier]'`, the name of a service entry, and a query key is `['VERB.Resource[.qualifier]', arg]`, the service key plus the entry's argument when it takes one: verb `GET`, `POST`, `PUT`, `PATCH`, `DELETE` or `SAVE`, a PascalCase resource, an optional camelCase qualifier that never repeats the verb.
- A singular resource reads one record, a plural reads a list; `SAVE` is only an upsert.
- Name a service for the server resource it calls, in folder, files and key; name a view for what its reader sees.
- Keep a key unique across services; search before naming one.
- The service key names service entries and query keys only; a domain hook's members carry hook names, per the service node.
- A hook entry that calls an existing entry with other options, or selects from it, is keyed by that entry's key plus a qualifier and caches under it.
