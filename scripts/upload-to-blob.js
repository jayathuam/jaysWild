#!/usr/bin/env node
/**
 * Upload all local images to Vercel Blob Storage and update images.json with new URLs.
 *
 * Usage:
 *   yarn upload-to-blob              → upload new images only (skip existing)
 *   yarn upload-to-blob --force      → re-upload ALL images (use when replacing an image)
 *   yarn upload-to-blob --force Lion.jpg Leopard.jpg  → re-upload specific files only
 *
 * Requires BLOB_READ_WRITE_TOKEN in .env.local
 */

const { put, list } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

// Parse CLI flags
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const FORCE_FILES = new Set(args.filter(a => !a.startsWith('--'))); // specific filenames to force

// Load .env.local manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  }
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('❌  BLOB_READ_WRITE_TOKEN not found in .env.local');
  process.exit(1);
}

const ROOT = path.join(__dirname, '..');
const IMAGE_DIRS = [
  { dir: path.join(ROOT, 'public', 'images', 'color'), blobPrefix: 'images/color' },
  { dir: path.join(ROOT, 'public', 'images', 'bw'),    blobPrefix: 'images/bw' },
  { dir: path.join(ROOT, 'public', 'homePage'),         blobPrefix: 'homePage' },
  { dir: path.join(ROOT, 'public', 'about'),            blobPrefix: 'about' },
];

const METADATA_PATH = path.join(ROOT, 'public', 'data', 'images.json');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => IMAGE_EXTS.has(path.extname(f).toLowerCase()))
    .map(f => path.join(dir, f));
}

async function uploadFile(filePath, blobPrefix, overwrite = false) {
  const filename = path.basename(filePath);
  const blobPathname = `${blobPrefix}/${filename}`;
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' :
    ext === '.png'  ? 'image/png'  :
    ext === '.webp' ? 'image/webp' :
    ext === '.avif' ? 'image/avif' : 'application/octet-stream';

  const result = await put(blobPathname, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: false,
    allowOverwrite: overwrite,
  });

  return { localPath: filePath, blobPathname, url: result.url };
}

async function main() {
  if (FORCE && FORCE_FILES.size > 0) {
    console.log(`🚀  Starting Vercel Blob upload (force replace: ${[...FORCE_FILES].join(', ')})...\n`);
  } else if (FORCE) {
    console.log('🚀  Starting Vercel Blob upload (force replace ALL)...\n');
  } else {
    console.log('🚀  Starting Vercel Blob upload (new images only)...\n');
  }

  const uploadMap = {}; // localRelPath → blobUrl
  let totalUploaded = 0;
  let totalReplaced = 0;
  let totalSkipped = 0;

  // Fetch existing blobs and build a pathname → url map
  console.log('🔍  Checking existing blobs...');
  const existingBlobMap = {};
  try {
    let cursor;
    do {
      const result = await list({ cursor, limit: 1000 });
      for (const blob of result.blobs) {
        existingBlobMap[blob.pathname] = blob.url;
      }
      cursor = result.cursor;
    } while (cursor);
    console.log(`   Found ${Object.keys(existingBlobMap).length} existing blobs\n`);
  } catch {
    console.log('   Could not fetch existing blobs — will upload all\n');
  }

  for (const { dir, blobPrefix } of IMAGE_DIRS) {
    const files = getImageFiles(dir);
    if (files.length === 0) continue;

    console.log(`📁  ${blobPrefix}/ — ${files.length} image(s)`);

    for (const filePath of files) {
      const filename = path.basename(filePath);
      const blobPathname = `${blobPrefix}/${filename}`;
      const localKey = `/${blobPrefix}/${filename}`;
      const alreadyExists = !!existingBlobMap[blobPathname];

      // Determine if we should (re-)upload this file
      const shouldForce = FORCE || FORCE_FILES.has(filename);

      if (alreadyExists && !shouldForce) {
        uploadMap[localKey] = existingBlobMap[blobPathname];
        console.log(`   ⏭️  Skip (use --force to replace): ${filename}`);
        totalSkipped++;
        continue;
      }

      try {
        const action = alreadyExists ? '🔄  Replacing' : '⬆️  Uploading';
        process.stdout.write(`   ${action} ${filename}...`);
        const { url } = await uploadFile(filePath, blobPrefix, alreadyExists);
        uploadMap[localKey] = url;
        if (alreadyExists) totalReplaced++; else totalUploaded++;
        console.log(` ✅`);
      } catch (err) {
        if (err.message && err.message.includes('private store')) {
          console.log(` ❌\n\n🔒  Your Blob store has PRIVATE access.\n    Fix: Vercel Dashboard → Storage → your store → Settings → enable Public access.\n    Then run \`yarn upload-to-blob\` again.\n`);
          process.exit(1);
        }
        console.log(` ❌  ${err.message}`);
      }
    }
    console.log('');
  }

  // Update images.json
  if (fs.existsSync(METADATA_PATH) && Object.keys(uploadMap).length > 0) {
    console.log('📝  Updating public/data/images.json with Blob URLs...');
    const json = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
    const metadata = Array.isArray(json) ? json : json.images;
    let updated = 0;

    for (const image of metadata) {
      if (uploadMap[image.url]) {
        image.url = uploadMap[image.url];
        updated++;
      }
    }

    const output = Array.isArray(json) ? metadata : { ...json, images: metadata };
    fs.writeFileSync(METADATA_PATH, JSON.stringify(output, null, 2));
    console.log(`   ✅  Updated ${updated} image URL(s) in images.json\n`);
  }

  console.log('─'.repeat(50));
  console.log(`✅  Done!  ⬆️  ${totalUploaded} new  |  🔄 ${totalReplaced} replaced  |  ⏭️  ${totalSkipped} skipped`);
  console.log('💡  Run `yarn dev` and check /gallery/color and /gallery/bw');
}

main().catch(err => {
  console.error('❌  Fatal error:', err);
  process.exit(1);
});
