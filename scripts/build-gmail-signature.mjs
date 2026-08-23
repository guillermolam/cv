import fs from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_SOURCE =
  '/Users/guillermolammartin/Pictures/ME/guillermo_lam_gmail_signature_final.html';
const CDN_BASE = 'https://guillermolam.github.io/cv/images/gmail-signature/';
const IMAGE_NAMES = [
  'portrait.png',
  'icon-email.png',
  'icon-github.png',
  'icon-linkedin.png',
  'icon-website.png',
  'icon-phone.png',
  'logo-gl.png',
  'role-devsecops.png',
  'role-platform.png',
  'role-sre.png',
  'role-purple-team.png',
  'role-ai-security.png',
  'banner.png',
];

const projectRoot = path.resolve(import.meta.dirname, '..');
const imagesDir = path.join(projectRoot, 'public/images/gmail-signature');
const outputHtml = path.join(projectRoot, 'public/gmail-signature.html');

function parseArgs(argv) {
  let source = DEFAULT_SOURCE;
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source' && argv[i + 1]) {
      source = argv[i + 1];
      i += 1;
    }
  }
  return { source: path.resolve(source) };
}

function extractSignatureTable(html) {
  const start = html.indexOf('<table role="presentation"');
  const end = html.indexOf('</table>', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate signature table in source HTML');
  }
  return html.slice(start, end + '</table>'.length);
}

async function main() {
  const { source } = parseArgs(process.argv.slice(2));
  const html = await fs.readFile(source, 'utf8');

  const imgRegex = /src="data:image\/([^;]+);base64,([^"]+)"/g;
  const matches = [...html.matchAll(imgRegex)];

  if (matches.length !== IMAGE_NAMES.length) {
    throw new Error(
      `Expected ${IMAGE_NAMES.length} embedded images, found ${matches.length}`,
    );
  }

  await fs.mkdir(imagesDir, { recursive: true });

  let optimized = html;
  for (let i = 0; i < matches.length; i += 1) {
    const [fullMatch, format, base64] = matches[i];
    const filename = IMAGE_NAMES[i];
    const bytes = Buffer.from(base64, 'base64');
    const outPath = path.join(imagesDir, filename);
    await fs.writeFile(outPath, bytes);

    const url = `${CDN_BASE}${filename}`;
    optimized = optimized.replace(fullMatch, `src="${url}"`);

    console.log(`  ${filename}: ${format}, ${bytes.length} bytes → ${url}`);
  }

  await fs.writeFile(outputHtml, optimized, 'utf8');

  const signatureTable = extractSignatureTable(optimized);
  const totalChars = optimized.length;
  const tableChars = signatureTable.length;

  console.log('');
  console.log(`Source: ${source}`);
  console.log(`Output: ${outputHtml}`);
  console.log(`Full HTML: ${totalChars} characters`);
  console.log(`Signature table (paste into Gmail): ${tableChars} characters`);
  console.log(
    tableChars <= 10000
      ? '✓ Under Gmail 10,000 character limit'
      : '✗ EXCEEDS Gmail 10,000 character limit',
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
