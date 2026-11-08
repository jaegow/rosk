---
id: ux/surface
kind: question
status: settled
question: What kind of surface is this route?
default: ../record/index.md
---
# Surface

Every surface also follows [frame](frame.md).

- A page outside the app shell with no permission gate → [public](public.md)
- A group route with no content, resolving to the first tab the reader holds → [landing](landing.md)
- Like destinations sharing one nav row as tabs → [tab group](tab-group.md)
- One record with several tabs → [workspace](workspace.md)
- App-wide configuration → [settings](settings.md)
- A multi-step flow → [wizard](wizard.md)
- Many records → [collection](../collection/index.md)
- One record → [record](../record/index.md)

A route fitting none is most often one record.
