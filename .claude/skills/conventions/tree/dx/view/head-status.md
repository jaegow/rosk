---
id: dx/view/head-status
kind: rule
status: settled
---
# Head statuses and foot messages

- A page, a modal and a card each own one status host in their head; it shows the most urgent status held (danger, then warning, info, success) as one band after every other head part, clips a long message, and the rest surface once it clears. Never draw a status band by hand.
- A status is configuration written as the head's `Status` part, anywhere among the head's children; it never renders where written.
- A foot message is the form foot's `message`, never a line written into the foot.
- A field's own helper or error text is the field's message, not a foot message.
