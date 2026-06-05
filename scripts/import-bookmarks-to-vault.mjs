#!/usr/bin/env node
/**
 * import-bookmarks-to-vault.mjs
 *
 * Parses Chrome bookmarks JSON and writes curated professional categories as
 * Obsidian-compatible Markdown notes into the VaultCMS Obsidian vault.
 *
 * Each bookmark becomes a note with YAML frontmatter (compatible with both
 * Obsidian and Astro content collections) plus a Markdown body.
 *
 * Category MOC (Map of Content) files are generated at each folder level.
 *
 * Usage:  node scripts/import-bookmarks-to-vault.mjs [--dry-run]
 */
import fs from 'node:fs/promises'
import path from 'node:path'

// ── Config ──────────────────────────────────────────────────────────────────
const BOOKMARKS_PATH = path.join(
  process.env.HOME ?? '/Users/guillermolammartin',
  'Library/Application Support/Google/Chrome/Default/Bookmarks',
)
const VAULT_ROOT = path.resolve(
  process.env.HOME ?? '/Users/guillermolammartin',
  'Git/guillermolam/ObsidianVaultGuillermo/ObsidianVaultGuillermo',
)

// Only import these top-level Chrome folders (case-insensitive match)
const CURATED_FOLDERS = new Set([
  'ai', 'devsecops', 'dev', 'cloud', 'clouds', 'architecture',
  'agile', 'browsers', 'data', 'os', 'ux',
])

// Also import these subfolder paths from --ME
const ME_SUBFOLDERS = new Set([
  'elearning', 'projects', 'cv | resume',
])

const DRY_RUN = process.argv.includes('--dry-run')

// ── Helpers ─────────────────────────────────────────────────────────────────
const kebab = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const sanitizeFilename = (name) =>
  name.replace(/[/\\:*?"<>|]/g, '-').replace(/\s+/g, ' ').trim().slice(0, 100) || 'untitled'

/**
 * Map a Chrome folder path to an Astro knowledgeResources `type` enum.
 */
const inferType = (folderPath) => {
  const lp = folderPath.toLowerCase()
  if (lp.includes('video') || lp.includes('youtube'))   return 'video'
  if (lp.includes('course') || lp.includes('elearning') || lp.includes('training')) return 'course'
  if (lp.includes('book'))                               return 'book'
  if (lp.includes('paper') || lp.includes('research'))   return 'paper'
  if (lp.includes('repo') || lp.includes('github'))      return 'repo'
  if (lp.includes('doc') || lp.includes('documentation'))return 'documentation'
  if (lp.includes('talk') || lp.includes('conference'))  return 'talk'
  if (lp.includes('tool') || lp.includes('crawler'))     return 'tool'
  return 'article'
}

/**
 * Map a Chrome folder path to Astro tagIds.
 */
const inferTags = (folderPath) => {
  const lp = folderPath.toLowerCase()
  const tags = []
  if (lp.includes('kubernetes') || lp.includes('k8s')) tags.push('kubernetes')
  if (lp.includes('aws')) tags.push('aws')
  if (lp.includes('ci/cd') || lp.includes('gitops')) tags.push('ci-cd')
  if (lp.includes('terraform') || lp.includes('iac')) tags.push('ci-cd')
  if (lp.includes('security')) tags.push('threat-detection')
  if (lp.includes('wasm') || lp.includes('webassembly')) tags.push('wasm')
  if (lp.includes('rust')) tags.push('ci-cd') // placeholder
  if (lp.includes('python')) tags.push('ci-cd')
  if (lp.includes('astro')) tags.push('astro')
  if (lp.includes('threejs') || lp.includes('three.js')) tags.push('threejs')
  return [...new Set(tags)]
}

/**
 * Map to categoryIds.
 */
const inferCategories = (folderPath) => {
  const lp = folderPath.toLowerCase()
  const cats = []
  if (lp.includes('security') || lp.includes('appsec') || lp.includes('siem')) cats.push('cloud-security')
  if (lp.includes('kubernetes') || lp.includes('k8s')) cats.push('kubernetes-platform')
  if (lp.includes('gitops') || lp.includes('argocd') || lp.includes('ci/cd')) cats.push('gitops-delivery')
  if (lp.includes('devsecops')) cats.push('devsecops')
  if (lp.includes('terraform') || lp.includes('iac') || lp.includes('infra')) cats.push('platform-engineering')
  if (lp.includes('supply') || lp.includes('sbom')) cats.push('supply-chain-security')
  if (lp.includes('frontend') || lp.includes('ux')) cats.push('creative-frontend')
  if (lp.includes('cloud') || lp.includes('aws') || lp.includes('azure')) cats.push('cloud-security')
  if (lp.includes('ai') || lp.includes('ml') || lp.includes('genai')) cats.push('ai-security')
  return [...new Set(cats)]
}

// ── Core import logic ───────────────────────────────────────────────────────
let totalNotes = 0
let totalMocs = 0

async function ensureDir(dirPath) {
  if (DRY_RUN) return
  await fs.mkdir(dirPath, { recursive: true })
}

/**
 * Write a single bookmark as an Obsidian note with dual-compatible frontmatter.
 */
async function writeBookmarkNote(bookmark, folderPath, outputDir) {
  const name = (bookmark.name || '').trim()
  const url = bookmark.url || ''
  if (!name || !url) return
  // Skip chrome:// and javascript: URLs
  if (url.startsWith('chrome://') || url.startsWith('javascript:')) return
  if (name.length < 2) return

  const resourceId = kebab(name) || `bookmark-${totalNotes}`
  const filename = sanitizeFilename(name) + '.md'
  const filepath = path.join(outputDir, filename)

  const type = inferType(folderPath)
  const tags = inferTags(folderPath)
  const categories = inferCategories(folderPath)

  // Obsidian-compatible + Astro-compatible YAML
  const frontmatter = [
    '---',
    `lang: en`,
    `resourceId: "${resourceId}"`,
    `title: "${name.replace(/"/g, '\\"')}"`,
    `type: ${type}`,
    `url: "${url}"`,
    `summary: "Imported from Chrome bookmarks: ${folderPath.replace(/"/g, '\\"')}"`,
    `status: planned`,
    tags.length ? `tagIds: [${tags.join(', ')}]` : `tagIds: []`,
    categories.length ? `categoryIds: [${categories.join(', ')}]` : `categoryIds: []`,
    `visibility: public`,
    '---',
    '',
    `# ${name}`,
    '',
    `> Imported from Chrome bookmarks → **${folderPath}**`,
    '',
    `🔗 [Open link](${url})`,
    '',
    `## Notes`,
    '',
    `_Add your notes, summaries, and key takeaways here._`,
    '',
  ].join('\n')

  if (DRY_RUN) {
    console.log(`[dry] ${filepath}`)
  } else {
    // Avoid overwriting existing notes
    try { await fs.access(filepath); return } catch { /* file doesn't exist, good */ }
    await fs.writeFile(filepath, frontmatter, 'utf8')
  }
  totalNotes++
}

/**
 * Write a MOC (Map of Content) file for a folder.
 */
async function writeMocFile(folderName, children, outputDir) {
  const filename = `_MOC ${sanitizeFilename(folderName)}.md`
  const filepath = path.join(outputDir, filename)

  const subfolders = children.filter((c) => c.type === 'folder')
  const bookmarks = children.filter((c) => c.type === 'url')

  const lines = [
    '---',
    `title: "${folderName.replace(/"/g, '\\"')}"`,
    `type: moc`,
    '---',
    '',
    `# ${folderName}`,
    '',
  ]

  if (subfolders.length > 0) {
    lines.push('## Sub-categories', '')
    for (const sf of subfolders) {
      lines.push(`- 📁 [[_MOC ${sanitizeFilename(sf.name)}|${sf.name}]] (${(sf.children ?? []).length})`)
    }
    lines.push('')
  }

  if (bookmarks.length > 0) {
    lines.push(`## Resources (${bookmarks.length})`, '')
    for (const bm of bookmarks) {
      if (bm.name?.trim()) {
        lines.push(`- [[${sanitizeFilename(bm.name)}|${bm.name}]]`)
      }
    }
    lines.push('')
  }

  if (DRY_RUN) {
    console.log(`[moc] ${filepath}`)
  } else {
    try { await fs.access(filepath); return } catch { /* doesn't exist */ }
    await fs.writeFile(filepath, lines.join('\n'), 'utf8')
  }
  totalMocs++
}

/**
 * Recursively process a Chrome bookmark folder.
 */
async function processFolder(node, parentPath, outputDir) {
  const name = node.name || 'Untitled'
  const currentPath = parentPath ? `${parentPath}/${name}` : name
  const folderDir = path.join(outputDir, sanitizeFilename(name))

  await ensureDir(folderDir)

  const children = node.children ?? []

  // Write MOC for this folder
  await writeMocFile(name, children, folderDir)

  // Process children
  for (const child of children) {
    if (child.type === 'folder') {
      await processFolder(child, currentPath, folderDir)
    } else if (child.type === 'url') {
      await writeBookmarkNote(child, currentPath, folderDir)
    }
  }
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`Reading Chrome bookmarks from: ${BOOKMARKS_PATH}`)
  const raw = await fs.readFile(BOOKMARKS_PATH, 'utf8')
  const data = JSON.parse(raw)

  const bar = data.roots?.bookmark_bar ?? {}
  const topFolders = (bar.children ?? []).filter((c) => c.type === 'folder')

  const knowledgeDir = path.join(VAULT_ROOT, 'Knowledge')
  await ensureDir(knowledgeDir)

  // Process curated top-level folders
  for (const folder of topFolders) {
    const name = (folder.name ?? '').toLowerCase().trim()
    if (CURATED_FOLDERS.has(name)) {
      console.log(`\nImporting: ${folder.name} (${(folder.children ?? []).length} items)`)
      await processFolder(folder, '', knowledgeDir)
    }

    // Special handling for --ME subfolder imports
    if (name === '--me') {
      const subfolders = (folder.children ?? []).filter((c) => c.type === 'folder')
      for (const sub of subfolders) {
        const subName = (sub.name ?? '').toLowerCase().trim()
        if (ME_SUBFOLDERS.has(subName)) {
          console.log(`\nImporting: --ME/${sub.name} (${(sub.children ?? []).length} items)`)
          await processFolder(sub, '--ME', knowledgeDir)
        }
      }
    }
  }

  // Write root MOC
  const rootMocContent = [
    '---',
    'title: Knowledge Base',
    'type: moc',
    '---',
    '',
    '# 🧠 Knowledge Base',
    '',
    '> Imported from Chrome bookmarks. Professional curated categories.',
    '',
    '## Categories',
    '',
    ...[...CURATED_FOLDERS].sort().map((f) => `- 📁 [[Knowledge/${f}|${f}]]`),
    ...['eLearning', 'Projects'].map((f) => `- 📁 [[Knowledge/${f}|${f}]]`),
    '',
  ].join('\n')

  if (!DRY_RUN) {
    await fs.writeFile(path.join(VAULT_ROOT, '_MOC Knowledge Base.md'), rootMocContent, 'utf8')
  }

  console.log(`\n✅ Done: ${totalNotes} notes, ${totalMocs} MOC files`)
  if (DRY_RUN) console.log('(dry run — no files were written)')
}

await main()
