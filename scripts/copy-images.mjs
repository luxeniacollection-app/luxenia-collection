import fs from 'fs';
import path from 'path';

const targetDir = path.resolve('public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const sourceDir = 'C:/Users/ADMIN/.gemini/antigravity-ide/brain/6963a0a6-18cf-4bf7-84d8-cd13ca3fee17/.user_uploaded';

const files = [
  { src: 'media_1787374212369.jpg', dest: 'luxe-baguette-noir-black.jpg' },
  { src: 'media_1787374215818.jpg', dest: 'luxe-baguette-sahara-brown.jpg' },
  { src: 'media_1787374219109.jpg', dest: 'luxe-baguette-ivory-cream.jpg' }
];

for (const f of files) {
  const srcPath = path.join(sourceDir, f.src);
  const destPath = path.join(targetDir, f.dest);
  fs.copyFileSync(srcPath, destPath);
  console.log(`Copied ${f.src} -> ${destPath}`);
}
