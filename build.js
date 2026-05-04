// build.js
const fs = require('fs');
const path = require('path');
const { minify: minifyHTML } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJS } = require('terser');

const SOURCES = [
  'images',
  'audio',
  'calculator',
  'club',
  'js',
  'css',
  'logs',
  'match',
  '404.html',
  'index.html',
  'pack.html',
  'shop.html',
  'credits.html',
  'upload.html',
  'phamhoangnam.pack.css',
  'phamhoangnam.pack.js',
  'phamhoangnam.apple-warn.js',
];

const DIST = path.join(__dirname, 'dist');

// Copy helpers (giữ nguyên)
function copyDir(src, dest) { /* ... */ }
function copyFile(src, dest) { /* ... */ }

// === Minhify từng loại file ===
async function minifyHTMLFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await minifyHTMLFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      try {
        const result = await minifyHTML(original, {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true,
        });
        fs.writeFileSync(fullPath, result);
        console.log(`✔  Minified HTML: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Lỗi minify HTML ${fullPath}:`, err.message);
      }
    }
  }
}

function minifyCSSFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      minifyCSSFiles(fullPath);
    } else if (entry.name.endsWith('.css')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      try {
        const minified = new CleanCSS({}).minify(original);
        if (minified.errors.length) {
          console.error(`❌ CSS error in ${fullPath}:`, minified.errors);
        } else {
          fs.writeFileSync(fullPath, minified.styles);
          console.log(`✔  Minified CSS: ${fullPath}`);
        }
      } catch (err) {
        console.error(`❌ Lỗi minify CSS ${fullPath}:`, err.message);
      }
    }
  }
}

async function minifyJSFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await minifyJSFiles(fullPath);
    } else if (entry.name.endsWith('.js') && !entry.name.endsWith('.min.js')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      try {
        const result = await minifyJS(original);
        if (result.error) {
          console.error(`❌ JS error in ${fullPath}:`, result.error);
        } else {
          fs.writeFileSync(fullPath, result.code);
          console.log(`✔  Minified JS: ${fullPath}`);
        }
      } catch (err) {
        console.error(`❌ Lỗi minify JS ${fullPath}:`, err.message);
      }
    }
  }
}

// === Main build ===
(async () => {
  console.log('🧹 Dọn dẹp dist...');
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  console.log('📁 Copy file vào dist...');
  for (const src of SOURCES) {
    const srcPath = path.join(__dirname, src);
    const destPath = path.join(DIST, src);
    if (fs.existsSync(srcPath) && fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
      console.log(`  📂 ${src}/ -> dist/${src}/`);
    } else {
      copyFile(srcPath, destPath);
      console.log(`  📄 ${src} -> dist/${src}`);
    }
  }

  console.log('🗜️  Minify HTML...');
  await minifyHTMLFiles(DIST);

  console.log('🎨 Minify CSS...');
  minifyCSSFiles(DIST);

  console.log('⚙️  Minify JS...');
  await minifyJSFiles(DIST);

  console.log('✅ Build thành công!');
})().catch(err => {
  console.error('💥 Build thất bại:', err);
  process.exit(1);
});