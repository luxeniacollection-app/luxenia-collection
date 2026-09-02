import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure upload directory exists
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

/**
 * Save base64 image data to public products directory
 * @param {string} base64Data - Data URL (e.g. "data:image/jpeg;base64,...")
 * @param {string} customName - Optional name prefix
 * @returns {string} - Relative public URL (e.g. "/images/products/bag-1712345678.jpg")
 */
export async function saveProductImage(base64Data, customName = 'product') {
  ensureUploadDir();

  if (!base64Data || typeof base64Data !== 'string') {
    throw new Error('Invalid image data provided.');
  }

  // Extract mime type and base64 body
  const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  let extension = 'jpg';
  let buffer;

  if (matches && matches.length === 3) {
    const mimeType = matches[1];
    if (mimeType === 'image/png') extension = 'png';
    else if (mimeType === 'image/webp') extension = 'webp';
    else if (mimeType === 'image/gif') extension = 'gif';
    else extension = 'jpg';

    buffer = Buffer.from(matches[2], 'base64');
  } else {
    // Attempt direct base64 decode
    buffer = Buffer.from(base64Data, 'base64');
  }

  // Max 10MB file check
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('Image size exceeds maximum limit of 10MB.');
  }

  const cleanName = customName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .slice(0, 30);
    
  const filename = `${cleanName}-${Date.now()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, filename);

  fs.writeFileSync(filePath, buffer);

  return `/images/products/${filename}`;
}
