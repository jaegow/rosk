---
id: ux/feedback/message/chip
kind: rule
status: settled
---
# Chip

A chip is a label on the thing beside it, never a control.

- It takes no press and no selected state, and hover changes neither its look nor the cursor; its only interaction is its help on hover or focus. The one exception is a multi-pick's picks, whose remove is a button inside.
- Anything pressable is a CTA, the smallest one, never a chip.
- A light tint of its tone, no edge, no icon; its words name the state alone.
- One size everywhere, drawn by `Chip` only.
- Place it by what it describes: the record's in the page head, a card's in the card head, a row's in the row, a tab's on the tab, a value's beside it.
- Say a status once; why it holds is the chip's help, unless the reader must act on it, then it is an [alert](alert.md).
