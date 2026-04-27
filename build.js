// build.js
const fs = require('fs');
const path = require('path');
const { minify } = require('html-minifier-terser');

// Danh sách thư mục và file cần copy vào dist
const SOURCES = [
  // thư mục
  'images',
  'audio',
  'calculator',
  'club',
  'js',
  'css',
  'logs',
  'match',
  // files
  '404.html',
  'index.html',
  'pack.html',
  'shop.html',
  'credits.html',
  'upload.html',
  'phamhoangnam.pack.css',
  'phamhoangnam.pack.js'
];

const DIST = path.join(__dirname, 'dist');

// Hàm copy thư mục đệ quy
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  Thư mục nguồn "${src}" không tồn tại, bỏ qua.`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Hàm copy file đơn
function copyFile(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`⚠️  File nguồn "${src}" không tồn tại, bỏ qua.`);
    return;
  }
  const destDir = path.dirname(dest);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

// Hàm minify tất cả file HTML trong dist (đệ quy)
async function minifyHTMLFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await minifyHTMLFiles(fullPath);
    } else if (entry.name.endsWith('.html')) {
      const original = fs.readFileSync(fullPath, 'utf8');
      try {
        const result = await minify(original, {
          collapseWhitespace: true,
          removeComments: true,
          minifyJS: true,
          minifyCSS: true
        });
        fs.writeFileSync(fullPath, result);
        console.log(`✔  Minified: ${fullPath}`);
      } catch (err) {
        console.error(`❌ Lỗi minify ${fullPath}:`, err.message);
      }
    }
  }
}

// --- Bắt đầu build ---
(async () => {
  console.log('🧹 Dọn dẹp dist...');
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true, force: true });
  }
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

  console.log('✅ Build thành công!');
})().catch(err => {
  console.error('💥 Build thất bại:', err);
  process.exit(1);
});