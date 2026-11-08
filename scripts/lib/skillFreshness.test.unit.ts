import { describe, expect, it } from 'vitest'

import { describeFreshness } from './skillFreshness.js'

describe('describeFreshness', () => {
  it('tells a session its branch when the skills are current', () => {
    expect(describeFreshness({ when: 'session', branch: 'feature', base: 'main', behind: 2, skillsBehind: 0, fetchFailed: false })).toEqual({
      user: 'On feature, 2 commits behind origin/main, none changing .claude/skills.',
      context: 'On feature, 2 commits behind origin/main, none changing .claude/skills.',
    })
  })

  it('stays quiet before a skill runs when the skills are current', () => {
    expect(describeFreshness({ when: 'skill', branch: 'feature', base: 'main', behind: 0, skillsBehind: 0, fetchFailed: false })).toEqual({ user: null, context: null })
  })

  it('warns before a skill runs when the base branch has newer skills', () => {
    const text = "On feature, 1 commit behind origin/main, 1 of them changing .claude/skills (origin unreachable; from the last fetch). The skills here are older than main's: merge origin/main into this branch before relying on them."
    expect(describeFreshness({ when: 'skill', branch: 'feature', base: 'main', behind: 1, skillsBehind: 1, fetchFailed: true })).toEqual({
      user: text,
      context: `${text} Tell the user before following a skill.`,
    })
  })
})
