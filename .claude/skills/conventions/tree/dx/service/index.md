---
id: dx/service
kind: rule
status: settled
---
# Service

Every service entry and domain hook.

- An entry that reads a list page by page → [pagination](pagination.md); records for many ids → [batch read](batch-read.md); one action writing many records → [bulk write](bulk-write.md).
- A `queryFn` or `mutationFn` is an arrow calling the entry in its body, never the bare `service['KEY']` reference, which a test cannot repoint after mount.
- After a mutation, merge its full-entity response into that record's detail cache and invalidate the entity's list domain; never patch a list.
  Why: membership, order and counts are the server's, and a patched list hides a write the server refused.
- A domain hook is an object of three buckets, `query`, `mutate` and `sync`, whose members are hooks named `use<Verb><Resource>`; a view calls `use<Resource>.<bucket>.use<Verb><Resource>(arg)`.
  CRITICAL: never key a bucket member by its service key (`query['GET.Items']`); the React Compiler treats a call not named `use…` as a plain function and caches it, and the tell is "Rendered fewer hooks than expected" once the cached call skips its hooks.
- A cache operation that is nobody's mutation is a hook in the `sync` bucket; a view never touches a query key.
- A seed primes a detail cache from a row already held with `setQueryData`.

## Also
- [Key](key.md)
- [Args](args.md)
- [Contract](contract.md)
