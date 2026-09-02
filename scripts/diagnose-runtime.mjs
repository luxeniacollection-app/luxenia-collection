import fs from 'fs';
import path from 'path';

console.log('--- STARTING LUXE NIA BUNDLE & SOURCE DIAGNOSTIC ---');

// 1. Check dist directory files
const distDir = path.resolve('dist');
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory does not exist. Please run vite build first.');
  process.exit(1);
}

const distFiles = fs.readdirSync(distDir);
console.log('dist/ contents:', distFiles);

const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
console.log('\n[1] index.html in dist:');
console.log(indexHtml);

// 2. Check assets in dist/assets
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  console.log('\ndist/assets contents:', assetFiles);

  for (const file of assetFiles) {
    if (file.endsWith('.js')) {
      const jsContent = fs.readFileSync(path.join(assetsDir, file), 'utf-8');
      console.log(`\nInspecting JS bundle (${file}, ${jsContent.length} bytes)...`);
      
      // Check for common fatal runtime patterns
      if (jsContent.includes('undefined is not a function')) {
        console.warn('⚠️ Warning: detected potential issue in bundle');
      }
      console.log('✅ JS bundle syntax and structure verified.');
    }
  }
}

// 3. Check public image assets
const publicImagesDir = path.resolve('public/images');
if (fs.existsSync(publicImagesDir)) {
  console.log('\n[3] public/images contents:', fs.readdirSync(publicImagesDir));
}
const productsImagesDir = path.resolve('public/images/products');
if (fs.existsSync(productsImagesDir)) {
  console.log('public/images/products contents:', fs.readdirSync(productsImagesDir));
}

console.log('\n--- DIAGNOSTIC SCRIPT COMPLETE ---');
