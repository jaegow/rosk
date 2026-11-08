---
id: dx/push
kind: rule
status: open
provisional: The starter ships no push transport; build the one subscriber component with the first push feature, then apply these rules.
---
# Server push

- Keep every subscription in the app's one push subscriber component; a domain never subscribes itself.
- A domain's handler is a `usePush_<Event>` hook in `use<Domain>.ts` under `push`, returning a callback that depends on the query client alone.
- The subscriber passes the current selection to the callback at call time (a store's snapshot getter, or a ref), never through deps, which would resubscribe on every navigation.
- Decide by comparing the payload with that selection, never by which channel delivered it.
- A handler never words a toast; the subscriber passes `t`-built words in.
- With an ids-only payload, invalidate the list views it can change by predicate and each id's detail; merge into the cache only a full entity.
- Coalesce a burst so each view has at most one read in flight and one queued.
