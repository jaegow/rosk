---
id: ux/access/page
kind: rule
status: open
provisional: The starter ships the page gate but no sign-in shell or access answer; pass the gate a fixed access until the first gated page builds them, then apply these rules.
---
# Page

- Authentication belongs to the shell: its sign-in wait and redirect come before any page.
- A boot failure after sign-in renders inside the shell, its chrome kept, with a line naming what failed and Retry.
- Gate every page in the page itself, from one answer read at its root, handed to the page gate; never a route-level wrapper, never an early return.
- While access resolves or is denied, render nothing the page owns outside its content area.
- Never hold reads back on access; the server is the security boundary.
- Deny the page when the reader may not read the record; a reader who may read but not write gets [read-only](../record/place/read-only.md).
- Drive the page gate and every control gate from one answer.
- A page that waits on several reads hands the gate all of them; the gate takes the worst (a failure, then a wait, then success), and its Retry refetches only the reads that failed.
