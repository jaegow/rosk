import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { checkReferences, checkTree, findSkillTrees } from './skillTree.js'

let skillsDir: string

const write = (relative: string, text: string) => {
  const file = path.join(skillsDir, relative)
  mkdirSync(path.dirname(file), { recursive: true })
  writeFileSync(file, text)
}

const rule = (id: string, body = '', extra = '') => `---\nid: ${id}\nkind: rule\nstatus: settled\n${extra}---\n# ${id}\n${body}`

const question = (id: string, defaultTarget: string, bullets: string[]) =>
  `---\nid: ${id}\nkind: question\nstatus: settled\nquestion: Which?\ndefault: ${defaultTarget}\n---\n# ${id}\n${bullets.map((bullet) => `- ${bullet}`).join('\n')}\n`

const messages = (skill: string) => checkTree(path.join(skillsDir, skill, 'tree')).errors.map(({ node, message }) => `${node}: ${message}`)

const writeValidTree = () => {
  write('alpha/SKILL.md', '# Alpha\n')
  write('alpha/tree/index.md', '---\nkind: index\n---\n# Index\n- [Root](dx/root.md)\n')
  write('alpha/tree/dx/root.md', question('dx/root', 'one.md', ['[One](one.md)', '[Two](two.md)']))
  write('alpha/tree/dx/one.md', rule('dx/one', '\n## Also\n- [Two](two.md)\n'))
  write('alpha/tree/dx/two.md', rule('dx/two'))
}

beforeEach(() => {
  skillsDir = mkdtempSync(path.join(tmpdir(), 'skill-tree-'))
})

afterEach(() => {
  rmSync(skillsDir, { recursive: true, force: true })
})

describe('checkTree', () => {
  it('accepts a tree whose every node is shaped, linked and reachable', () => {
    writeValidTree()
    expect(findSkillTrees(skillsDir)).toEqual([{ skill: 'alpha', treeDir: path.join(skillsDir, 'alpha', 'tree') }])
    expect(messages('alpha')).toEqual([])
  })

  it('rejects an id that does not match the path, an unknown status and a key outside the frontmatter shape', () => {
    writeValidTree()
    write('alpha/tree/dx/two.md', '---\nid: dx/other\nkind: rule\nstatus: maybe\ncolour: red\n---\n# Two\n')
    expect(messages('alpha')).toEqual([
      'dx/two: unknown frontmatter key "colour"',
      'dx/two: id "dx/other" does not match its path "dx/two"',
      'dx/two: status "maybe" is not settled, open or conflict',
    ])
  })

  it('requires a provisional on a node that is not settled', () => {
    writeValidTree()
    write('alpha/tree/dx/two.md', '---\nid: dx/two\nkind: rule\nstatus: open\n---\n# Two\n')
    expect(messages('alpha')).toEqual(['dx/two: status "open" needs a provisional'])
  })

  it('rejects a question whose default is not one of its branches', () => {
    writeValidTree()
    write('alpha/tree/dx/root.md', question('dx/root', 'three.md', ['[One](one.md)', '[Two](two.md)']))
    expect(messages('alpha')).toEqual(['dx/root: default "three.md" is not one of its branches'])
  })

  it('rejects a broken link and an orphan node', () => {
    writeValidTree()
    write('alpha/tree/dx/one.md', rule('dx/one', '\n## Also\n- [Gone](gone.md)\n'))
    write('alpha/tree/dx/three.md', rule('dx/three'))
    expect(messages('alpha')).toEqual(['dx/one: links to missing file "gone.md"', 'dx/three: unreachable from tree/index.md'])
  })

  it('rejects a branch folder the index never lists', () => {
    writeValidTree()
    write('alpha/tree/ux/lone.md', rule('ux/lone'))
    write('alpha/tree/dx/two.md', rule('dx/two', '\n## Also\n- [Lone](../ux/lone.md)\n'))
    expect(messages('alpha')).toEqual(['index: does not list any node of branch "ux"'])
  })
})

describe('checkReferences', () => {
  const errorsOf = () => checkReferences(skillsDir).errors.map(({ node, message }) => `${node}: ${message}`)

  it('allows a REQUIRED SUB-SKILL line naming a skill that exists', () => {
    write('alpha/SKILL.md', '**REQUIRED SUB-SKILL:** use `beta` first.\n')
    write('beta/SKILL.md', '# Beta\n')
    expect(errorsOf()).toEqual([])
  })

  it('rejects a sub-skill that does not exist, a mention outside that line and a link into another skill', () => {
    write('alpha/SKILL.md', '**REQUIRED SUB-SKILL:** use `gamma` first.\nSee `beta` for more.\n[Beta](../beta/SKILL.md)\n')
    write('beta/SKILL.md', '# Beta\n')
    const owner = path.basename(skillsDir)
    expect(errorsOf()).toEqual([
      `${owner}/alpha/SKILL.md: links into another skill, "beta"`,
      `${owner}/alpha/SKILL.md: requires missing skill "gamma"`,
      `${owner}/alpha/SKILL.md: mentions skill "beta" outside a REQUIRED SUB-SKILL line`,
    ])
  })

  it('rejects a pointer to a skill folder that does not exist from a file outside the skills', () => {
    write('alpha/SKILL.md', '# Alpha\n')
    const outside = path.join(skillsDir, '..', `${path.basename(skillsDir)}-CLAUDE.md`)
    writeFileSync(outside, 'Follow `.claude/skills/ghost/SKILL.md`.\n')
    expect(checkReferences(skillsDir, [outside]).errors.map(({ message }) => message)).toEqual(['names missing skill "ghost"'])
    rmSync(outside)
  })
})
