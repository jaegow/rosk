import { execFileSync } from 'node:child_process'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { describeFreshness } from './lib/skillFreshness.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const fetchIntervalMs = 5 * 60 * 1000
const fetchTimeoutMs = 5000
const hookEvents = { session: 'SessionStart', prompt: 'UserPromptSubmit', skill: 'PreToolUse' }

const git = (args, options = {}) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...options }).trim()

const baseBranch = () => {
  try {
    return git(['symbolic-ref', '--quiet', '--short', 'refs/remotes/origin/HEAD']).replace(/^origin\//, '')
  } catch {
    return ['main', 'master'].find((name) => {
      try {
        git(['rev-parse', '--verify', '--quiet', `refs/remotes/origin/${name}`])
        return true
      } catch {
        return false
      }
    })
  }
}

const fetchBase = (base) => {
  const stamp = path.resolve(root, git(['rev-parse', '--git-common-dir']), 'skill-freshness-fetch')
  const fetchedAt = (() => {
    try {
      return statSync(stamp).mtimeMs
    } catch {
      return 0
    }
  })()
  if (Date.now() - fetchedAt < fetchIntervalMs) return true
  try {
    git(['fetch', '--quiet', 'origin', base], { timeout: fetchTimeoutMs })
    writeFileSync(stamp, '')
    return true
  } catch {
    return false
  }
}

const promptIsSlashCommand = () => {
  try {
    const input = JSON.parse(readFileSync(0, 'utf8'))
    return typeof input.prompt === 'string' && input.prompt.trimStart().startsWith('/')
  } catch {
    return false
  }
}

const run = () => {
  const when = process.argv[2]
  if (!(when in hookEvents)) return
  if (when === 'prompt' && !promptIsSlashCommand()) return
  const base = baseBranch()
  if (!base) return
  const fetchFailed = !fetchBase(base)
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD'])
  const behind = Number(git(['rev-list', '--count', `HEAD..origin/${base}`]))
  const skillsBehind = Number(git(['rev-list', '--count', `HEAD..origin/${base}`, '--', '.claude/skills']))
  const said = describeFreshness({ when, branch, base, behind, skillsBehind, fetchFailed })
  if (!said.user) return
  process.stdout.write(JSON.stringify({
    systemMessage: said.user,
    hookSpecificOutput: { hookEventName: hookEvents[when], additionalContext: said.context },
  }))
}

try {
  run()
} catch {
  process.exitCode = 0
}
