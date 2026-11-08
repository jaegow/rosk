---
id: ux/action/upload
kind: rule
status: settled
---
# Upload

- Use a visually hidden `<input type="file">` whose `<label>` is the control; in a slot with its own CTA look, render that CTA as the label.
- Start the upload on selection, show it pending inline, and toast a rejection or failure.
