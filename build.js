// build.js
// Minifies src/index.html (including its inline <style> and <script>)
// and writes the production-ready file to public/index.html.
// Run with: npm run build

const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

const SRC = path.join(__dirname, 'src', 'index.html');
const OUT_DIR = path.join(__dirname, 'public');
const OUT = path.join(OUT_DIR, 'index.html');

async function build() {
  console.log('Building from', SRC);

  const html = fs.readFileSync(SRC, 'utf8');

  const minified = await minify(html, {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
    minifyJS: true,
    // Keep this false: the embedded base64 logo/data must never be altered
    caseSensitive: true
  });

  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUT, minified, 'utf8');

  const before = Buffer.byteLength(html, 'utf8');
  const after = Buffer.byteLength(minified, 'utf8');
  console.log(`Built ${OUT}`);
  console.log(`Size: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
