import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { changedFiles, resolveBase } from './changedFiles.js'

const repo = { root: '' }

const git = (...args: string[]) => {
  const result = spawnSync('git', args, { cwd: repo.root, encoding: 'utf8' })
  if (result.status !== 0) throw new Error(result.stderr)
  return result.stdout
}

const write = (file: string, content = 'x') => {
  mkdirSync(path.dirname(path.join(repo.root, file)), { recursive: true })
  writeFileSync(path.join(repo.root, file), content)
}

beforeEach(() => {
  repo.root = mkdtempSync(path.join(tmpdir(), 'rosk-changed-'))
  git('init', '--quiet', '--initial-branch=master')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  git('config', 'commit.gpgsign', 'false')
  write('src/kept.ts')
  write('src/removed.ts')
  git('add', '.')
  git('commit', '--quiet', '-m', 'base')
  git('checkout', '--quiet', '-b', 'feature')
})

afterEach(() => {
  rmSync(repo.root, { recursive: true, force: true })
})

describe('resolveBase', () => {
  it('falls back to master when there is no origin/master', () => {
    expect(resolveBase({ root: repo.root, base: undefined })).toBe('master')
  })

  it('prefers origin/master when it exists', () => {
    git('update-ref', 'refs/remotes/origin/master', 'HEAD')
    expect(resolveBase({ root: repo.root, base: undefined })).toBe('origin/master')
  })

  it('uses an explicit base and fails loudly when it does not exist', () => {
    expect(resolveBase({ root: repo.root, base: 'feature' })).toBe('feature')
    expect(() => resolveBase({ root: repo.root, base: 'nope' })).toThrow('tried nope')
  })
})

describe('changedFiles', () => {
  it('lists committed, unstaged and untracked changes with the given extensions', () => {
    write('src/committed.tsx')
    git('add', '.')
    git('commit', '--quiet', '-m', 'feature work')
    write('src/kept.ts', 'edited')
    write('src/untracked.js')
    write('notes.md')
    rmSync(path.join(repo.root, 'src/removed.ts'))

    expect(changedFiles({ root: repo.root, base: undefined, extensions: ['.ts', '.tsx', '.js'] })).toEqual([
      'src/committed.tsx',
      'src/kept.ts',
      'src/untracked.js',
    ])
  })

  it('is empty on a branch with no changes', () => {
    expect(changedFiles({ root: repo.root, base: undefined, extensions: ['.ts'] })).toEqual([])
  })
})
