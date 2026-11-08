const plural = (count) => (count === 1 ? '' : 's')

const describeFreshness = ({ when, branch, base, behind, skillsBehind, fetchFailed }) => {
  const stale = fetchFailed ? ' (origin unreachable; from the last fetch)' : ''
  if (skillsBehind > 0) {
    const fix = branch === base ? 'pull' : `merge origin/${base} into this branch`
    const text = `On ${branch}, ${behind} commit${plural(behind)} behind origin/${base}, ${skillsBehind} of them changing .claude/skills${stale}. The skills here are older than ${base}'s: ${fix} before relying on them.`
    return { user: text, context: `${text} Tell the user before following a skill.` }
  }
  if (when !== 'session') return { user: null, context: null }
  const text = behind > 0
    ? `On ${branch}, ${behind} commit${plural(behind)} behind origin/${base}, none changing .claude/skills${stale}.`
    : `On ${branch}, up to date with origin/${base}${stale}.`
  return { user: text, context: text }
}

export { describeFreshness }
