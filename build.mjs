// Contoso company profile - static site builder.
// Renders every EJS page in src/pages with the JSON files in src/data, then copies the assets.
import { readFile, writeFile, mkdir, readdir, cp, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ejs from 'ejs';

const root = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(root, 'src');
export const outDir = path.join(root, 'dist');

// Every src/data/<name>.json file becomes a template variable called <name>.
async function loadData() {
  const dataDir = path.join(srcDir, 'data');
  const data = {};
  for (const file of (await readdir(dataDir)).filter((f) => f.endsWith('.json'))) {
    data[path.basename(file, '.json')] = JSON.parse(await readFile(path.join(dataDir, file), 'utf8'));
  }
  return data;
}

export async function build({ quiet = false } = {}) {
  const data = await loadData();
  const buildDate = new Date().toISOString().slice(0, 10);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const pagesDir = path.join(srcDir, 'pages');
  const pages = (await readdir(pagesDir)).filter((f) => f.endsWith('.ejs')).sort();
  for (const file of pages) {
    const page = path.basename(file, '.ejs');
    const html = await ejs.renderFile(path.join(pagesDir, file), { ...data, page, buildDate });
    await writeFile(path.join(outDir, `${page}.html`), html);
    if (!quiet) console.log(`built dist/${page}.html`);
  }
  await cp(path.join(srcDir, 'assets'), path.join(outDir, 'assets'), { recursive: true });
  await writeFile(path.join(outDir, '.nojekyll'), '');
  return pages.map((f) => `${path.basename(f, '.ejs')}.html`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
