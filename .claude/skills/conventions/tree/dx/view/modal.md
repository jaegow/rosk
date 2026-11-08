---
id: dx/view/modal
kind: rule
status: open
provisional: The modal ships no copy part and no gate; write a modal's plain text as its content's children and show a commit's wait on its foot CTA's loading until those parts are built.
---
# Modal call site

- Split a modal's content into its own component; a content worth reviewing alone is [presentational](presentational.md), wired by a container that mounts on open.
- Keep other content in the modal's file, and never pass it data it could query itself.
- Each run of plain text in a modal is the modal's copy part, never a styled `<p>`.
- A prompt holds only what ux prompts allow; a confirm that outgrows it is a content-height modal, never a widened prompt.
- A prompt's state about its subject is its head status; a foot message holds only a consequence of the press.
- A prompt takes the read it confirms as a prop, already answered by its opener.
