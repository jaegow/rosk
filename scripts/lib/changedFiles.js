import { spawnSync } from 'node:child_process'
import path from 'node:path'

const DEFAULT_BASES = ['origin/master', 'master']

const git = (root, args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' })

const lines = (output) => output.split('\n').map((line) => line.trim()).filter(Boolean)

const resolveBase = ({ root, base }) => {
  const candidates = base === undefined ? DEFAULT_BASES : [base]
  const found = candidates.find((candidate) => git(root, ['rev-parse', '--verify', '--quiet', `${candidate}^{commit}`]).status === 0)
  if (found === undefined) throw new Error(`no git ref to compare against: tried ${candidates.join(', ')}`)
  return found
}

const changedFiles = ({ root, base, extensions }) => {
  const resolved = resolveBase({ root, base })
  const mergeBase = git(root, ['merge-base', resolved, 'HEAD'])
  const since = mergeBase.status === 0 ? lines(mergeBase.stdout)[0] : resolved
  const tracked = git(root, ['diff', '--name-only', '--diff-filter=ACMR', since])
  const untracked = git(root, ['ls-files', '--others', '--exclude-standard'])
  if (tracked.status !== 0) throw new Error(`git diff against ${resolved} failed: ${tracked.stderr.trim()}`)
  const files = new Set([...lines(tracked.stdout), ...lines(untracked.stdout)])
  return [...files].filter((file) => extensions.includes(path.extname(file))).sort()
}

export { changedFiles, DEFAULT_BASES, resolveBase }
