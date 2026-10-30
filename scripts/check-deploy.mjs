import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(resolve(root, file), 'utf8');
const failures = [];
const check = (condition, message) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${message}`);
  if (!condition) failures.push(message);
};
const pkg = JSON.parse(read('package.json'));
const html = read('index.html');
const vite = read('vite.config.ts');
const netlify = read('netlify.toml');
const tsconfig = JSON.parse(read('tsconfig.app.json'));

check(/^\d+\.\d+\.\d+$/.test(pkg.version), 'project version uses semantic versioning');
check(pkg.scripts?.build === 'tsc -b && vite build', 'build script runs TypeScript check before Vite');
check(html.includes('<div id="root"></div>'), 'HTML contains React mount element');
check(html.includes('/src/main.tsx'), 'HTML points to Vite entry in development');
check(vite.includes('react()'), 'Vite React plugin is configured');
check(netlify.includes('command = "npm run build"'), 'Netlify build command is npm run build');
check(netlify.includes('publish = "dist"'), 'Netlify publish directory is dist');
check(netlify.includes('NODE_VERSION = "22"'), 'Netlify Node version is pinned to 22');
check(/from\s*=\s*"\/\*"[\s\S]*?to\s*=\s*"\/index\.html"[\s\S]*?status\s*=\s*200/.test(netlify), 'Netlify SPA fallback rewrites paths to index.html');
check(netlify.includes('for = "/assets/*"') && netlify.includes('immutable'), 'fingerprinted assets have immutable cache policy');
check(netlify.includes('for = "/index.html"') && netlify.includes('must-revalidate'), 'HTML shell is revalidated after deployment');
check(tsconfig.compilerOptions?.strict === true, 'TypeScript strict mode is enabled');
check(existsSync(resolve(root, 'src/main.tsx')), 'Vite entry file exists');
check(existsSync(resolve(root, 'src/App.tsx')), 'React app entry exists');
if (existsSync(resolve(root, 'package-lock.json'))) console.log('PASS npm lockfile exists for reproducible installs');
else console.warn('WARN package-lock.json is absent; run npm install in a network-enabled environment and commit the generated lockfile.');

// Check all source files rather than maintaining a manually curated file list.
function walk(dir) {
  return readdirSync(resolve(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const rel = `${dir}/${entry.name}`;
    return entry.isDirectory() ? walk(rel) : [rel];
  });
}
const sourceFiles = walk('src').filter((file) => ['.ts', '.tsx', '.js', '.jsx'].includes(extname(file)));
for (const file of sourceFiles) {
  const source = read(file);
  for (const match of source.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)) {
    const specifier = match[1];
    const base = resolve(root, file, '..', specifier);
    const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.jsx`, resolve(base, 'index.ts'), resolve(base, 'index.tsx')];
    check(candidates.some(existsSync), `${file} relative import resolves: ${specifier}`);
  }
}

// Local storage keys must be distinct, preventing one module from overwriting another module's data.
const storageSources = sourceFiles.map((file) => [file, read(file)]);
const keys = new Map();
for (const [file, source] of storageSources) {
  for (const match of source.matchAll(/['"](xinge-[a-z0-9-]+-v\d+)['"]/g)) {
    const key = match[1];
    if (keys.has(key) && keys.get(key) !== file) check(false, `local storage key ${key} is unique (${keys.get(key)} vs ${file})`);
    else keys.set(key, file);
  }
}
check(true, `scanned ${sourceFiles.length} source files and ${keys.size} explicit Xinge storage keys`);

if (failures.length) {
  console.error(`\n${failures.length} deployment preflight check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll static deployment preflight checks passed. This does not replace npm ci, npm run build, browser testing, or a live Netlify deploy.');
}
