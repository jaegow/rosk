import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'

const NODE_KINDS = new Set(['rule', 'question'])
const STATUSES = new Set(['settled', 'open', 'conflict'])
const FRONTMATTER_KEYS = new Set(['id', 'kind', 'status', 'question', 'default', 'provisional'])
const MAX_NODE_LINES = 60

const listMarkdown = (dir) =>
  readdirSync(dir)
    .sort()
    .flatMap((entry) => {
      const full = path.join(dir, entry)
      if (statSync(full).isDirectory()) return listMarkdown(full)
      return full.endsWith('.md') ? [full] : []
    })

const readFrontmatter = (text) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/.exec(text)
  if (!match) return { data: null, body: text, badLines: [] }
  const data = {}
  const badLines = []
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === '') continue
    const pair = /^([a-z]+):\s*(.*)$/.exec(line)
    if (pair) data[pair[1]] = pair[2].trim()
    else badLines.push(line)
  }
  return { data, body: match[2], badLines }
}

const withoutFences = (text) => text.replace(/^\s*```[\s\S]*?^\s*```[^\n]*$/gm, '')

const localLinks = (text) =>
  [...withoutFences(text).matchAll(/\[[^\]]*\]\(([^)\s]+)\)/g)]
    .map((match) => match[1])
    .filter((target) => !/^[a-z][a-z0-9+.-]*:/i.test(target) && !target.startsWith('#'))
    .map((target) => target.split('#')[0])

const nodeId = (treeDir, file) =>
  path.relative(treeDir, file).split(path.sep).join('/').replace(/\.md$/, '').replace(/(^|\/)index$/, '')

const readNode = (treeDir, file) => {
  const text = readFileSync(file, 'utf8')
  const { data, body, badLines } = readFrontmatter(text)
  const dir = path.dirname(file)
  const bulletTargets = withoutFences(body)
    .split(/\r?\n/)
    .filter((line) => /^\s*[-*]\s/.test(line))
    .map((line) => localLinks(line)[0])
    .filter((target) => target !== undefined)
  return {
    file,
    name: nodeId(treeDir, file) || 'index',
    expectedId: nodeId(treeDir, file),
    lines: text.split(/\r?\n/).length,
    data,
    badLines,
    body,
    edges: localLinks(body).map((raw) => ({ raw, target: path.resolve(dir, raw) })),
    branches: bulletTargets.map((raw) => path.resolve(dir, raw)),
  }
}

const checkFrontmatter = (node, isRoot, fail) => {
  const { data } = node
  if (!data) return fail('missing frontmatter')
  for (const line of node.badLines) fail(`frontmatter line "${line}" is not a flat key: value pair`)
  for (const key of Object.keys(data)) if (!FRONTMATTER_KEYS.has(key)) fail(`unknown frontmatter key "${key}"`)
  if (isRoot) {
    if (data.kind !== 'index') fail('tree/index.md must be kind "index"')
    return
  }
  if (!NODE_KINDS.has(data.kind)) fail(`kind "${data.kind ?? ''}" is not rule or question`)
  if (data.id !== node.expectedId) fail(`id "${data.id ?? ''}" does not match its path "${node.expectedId}"`)
  if (!STATUSES.has(data.status)) fail(`status "${data.status ?? ''}" is not settled, open or conflict`)
  else if (data.status !== 'settled' && !data.provisional) fail(`status "${data.status}" needs a provisional`)
  if (data.kind !== 'question' && (data.question || data.default)) fail('only a question node takes question and default')
}

const checkQuestion = (node, fail) => {
  if (node.data?.kind !== 'question') return
  if (!node.data.question) fail('question node has no question')
  if (node.branches.length < 2) fail(`question node has ${node.branches.length} branch(es), needs at least 2`)
  if (!node.data.default) fail('question node has no default')
  else if (!node.branches.includes(path.resolve(path.dirname(node.file), node.data.default))) {
    fail(`default "${node.data.default}" is not one of its branches`)
  }
  if (/^##\s+Also\b/m.test(node.body)) fail('question node may not have an "## Also" section')
}

const reachableFrom = (start, nodes) => {
  const seen = new Set([start])
  const queue = [start]
  while (queue.length > 0) {
    for (const { target } of nodes.get(queue.shift()).edges) {
      if (nodes.has(target) && !seen.has(target)) {
        seen.add(target)
        queue.push(target)
      }
    }
  }
  return seen
}

const questionCycles = (nodes) => {
  const found = []
  const isQuestion = (file) => nodes.get(file)?.data?.kind === 'question'
  const state = new Map()
  const visit = (file, trail) => {
    state.set(file, 'active')
    for (const { target } of nodes.get(file).edges) {
      if (!isQuestion(target)) continue
      if (state.get(target) === 'active') found.push([...trail, target].map((f) => nodes.get(f).name).join(' -> '))
      else if (!state.has(target)) visit(target, [...trail, target])
    }
    state.set(file, 'done')
  }
  for (const file of nodes.keys()) if (isQuestion(file) && !state.has(file)) visit(file, [file])
  return found
}

const checkTree = (treeDir) => {
  const errors = []
  const warnings = []
  const indexFile = path.join(treeDir, 'index.md')
  if (!existsSync(indexFile)) return { errors: [{ node: 'index', message: 'tree/index.md is missing' }], warnings }
  const nodes = new Map(listMarkdown(treeDir).map((file) => [file, readNode(treeDir, file)]))

  for (const node of nodes.values()) {
    const fail = (message) => errors.push({ node: node.name, message })
    checkFrontmatter(node, node.file === indexFile, fail)
    checkQuestion(node, fail)
    for (const { raw, target } of node.edges) {
      if (!existsSync(target)) fail(`links to missing file "${raw}"`)
      else if (!path.relative(treeDir, target).startsWith('..') && !target.endsWith('.md')) fail(`links to "${raw}", which is not a node`)
    }
    if (node.lines > MAX_NODE_LINES) warnings.push({ node: node.name, message: `${node.lines} lines; keep a node under ${MAX_NODE_LINES}` })
  }

  const linkedFromIndex = new Set(nodes.get(indexFile).edges.map(({ target }) => target))
  for (const entry of readdirSync(treeDir).sort()) {
    const full = path.join(treeDir, entry)
    if (!statSync(full).isDirectory()) continue
    const listed = [...linkedFromIndex].some((target) => !path.relative(full, target).startsWith('..'))
    if (!listed) errors.push({ node: 'index', message: `does not list any node of branch "${entry}"` })
  }

  const reached = reachableFrom(indexFile, nodes)
  for (const node of nodes.values()) {
    if (!reached.has(node.file)) errors.push({ node: node.name, message: 'unreachable from tree/index.md' })
  }
  for (const cycle of questionCycles(nodes)) errors.push({ node: 'index', message: `question cycle: ${cycle}` })
  return { errors, warnings }
}

const skillNames = (skillsDir) =>
  readdirSync(skillsDir)
    .filter((entry) => statSync(path.join(skillsDir, entry)).isDirectory())
    .sort()

const skillOf = (skillsDir, file) => {
  const relative = path.relative(skillsDir, file)
  if (relative.startsWith('..')) return null
  const [first] = relative.split(path.sep)
  return first === path.basename(file) ? null : first
}

const checkReferences = (skillsDir, extraFiles = []) => {
  const errors = []
  const names = skillNames(skillsDir)
  const known = new Set(names)
  const skillFiles = listMarkdown(skillsDir)
  const files = [...skillFiles, ...extraFiles.filter((file) => existsSync(file))]
  for (const file of files) {
    const owner = skillOf(skillsDir, file)
    const label = path.relative(path.dirname(skillsDir), file).split(path.sep).join('/')
    const fail = (message) => errors.push({ node: label, message })
    const text = readFileSync(file, 'utf8')
    const shared = owner === null
    for (const raw of localLinks(text)) {
      const target = path.resolve(path.dirname(file), raw.split('#')[0])
      if (!existsSync(target)) fail(`links to missing file "${raw}"`)
      const targetSkill = skillOf(skillsDir, target)
      if (owner && targetSkill && targetSkill !== owner) fail(`links into another skill, "${targetSkill}"`)
    }
    for (const match of text.matchAll(/\.claude\/skills\/([a-z0-9-]+)\//g)) {
      if (!known.has(match[1])) fail(`names missing skill "${match[1]}"`)
      else if (owner && match[1] !== owner) fail(`points into another skill, "${match[1]}"`)
    }
    for (const line of text.split(/\r?\n/)) {
      const subSkill = /REQUIRED SUB-SKILL:\*\*\s+use\s+`([a-z0-9:-]+)`/.exec(line)
      if (subSkill) {
        if (!known.has(subSkill[1])) fail(`requires missing skill "${subSkill[1]}"`)
        continue
      }
      if (shared || !owner) continue
      for (const token of line.matchAll(/`([a-z0-9-]+)`/g)) {
        if (known.has(token[1]) && token[1] !== owner) fail(`mentions skill "${token[1]}" outside a REQUIRED SUB-SKILL line`)
      }
    }
  }
  return { errors, names }
}

const findSkillTrees = (skillsDir) =>
  skillNames(skillsDir)
    .map((skill) => ({ skill, treeDir: path.join(skillsDir, skill, 'tree') }))
    .filter(({ treeDir }) => existsSync(treeDir) && statSync(treeDir).isDirectory())

export { checkReferences, checkTree, findSkillTrees, readFrontmatter }
