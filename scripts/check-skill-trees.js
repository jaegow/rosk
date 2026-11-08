import path from 'node:path'

import { checkReferences, checkTree, findSkillTrees } from './lib/skillTree.js'

const root = process.cwd()
const skillsDir = path.resolve(root, '.claude/skills')
const extraFiles = ['CLAUDE.md', '.claude/rules/dx.md', '.claude/rules/ux.md', '.claude/rules/testing.md'].map((file) => path.resolve(root, file))

const problems = []
for (const { skill, treeDir } of findSkillTrees(skillsDir)) {
  const { errors, warnings } = checkTree(treeDir)
  for (const { node, message } of warnings) console.warn(`[skill-trees] warning ${skill}/${node}: ${message}`)
  for (const { node, message } of errors) problems.push(`${skill}/${node}: ${message}`)
}
for (const { node, message } of checkReferences(skillsDir, extraFiles).errors) problems.push(`${node}: ${message}`)

for (const line of problems) console.error(`[skill-trees] ${line}`)
if (problems.length > 0) {
  console.error(`[skill-trees] ${problems.length} problem(s)`)
  process.exit(1)
}
console.log('[skill-trees] ok')
