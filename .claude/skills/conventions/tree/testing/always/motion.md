---
id: testing/always/motion
kind: rule
status: settled
---
# Motion

The browser suite runs under reduced motion, where the stylesheet turns animation off.

- Assert the state a motion ends in, never that something moved, and never pin a class, keyframe, duration or easing.
- Turn motion on only for logic that runs mid-animation, and restore reduced motion when the case ends.
- If a test passes with motion and fails without it, suspect a race the animation was hiding in the app.
