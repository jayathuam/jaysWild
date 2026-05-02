#!/usr/bin/env node
/**
 * Generate blur placeholder data URLs for all images in images.json.
 *
 * Reads each image from its local file (public/images/ or public/homePage/),
 * creates a tiny 10x10 JPEG thumbnail with Sharp, and stores it as a base64
 * data URL in the blurDataURL field of each entry.
 *
 * Usage:
 *   node scripts/generate-blur-placeholders.js
 *   yarn generate-blur
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const METADATA_PATH = path.join(ROOT, 'public', 'data', 'images.json');

async function generateBlurDataURL(filePath) {
  const { data } = await sharp(filePath)
    .resize(10, 10, { fit: 'cover' })
    .jpeg({ quality: 30 })
    .toBuffer({ resolveWithObject: true });
  return `data:image/jpeg;base64,${data.toString('base64')}`;
}

function localPathForImage(image) {
  // Gallery images: category tells us the subfolder
  if (image.category) {
    return path.join(ROOT, 'public', 'images', image.category, image.filename);
  }
  return null;
}

async function main() {
  if (!fs.existsSync(METADATA_PATH)) {
    console.error('❌  public/data/images.json not found');
    process.exit(1);
  }

  const json = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf-8'));
  let updated = 0;
  let skipped = 0;

  // --- Gallery images ---
  console.log('📸  Generating blur placeholders for gallery images...');
  for (const image of json.images) {
    const filePath = localPathForImage(image);
    if (!filePath || !fs.existsSync(filePath)) {
      console.log(`   ⏭️  Local file not found, skipping: ${image.filename}`);
      skipped++;
      continue;
    }
    try {
      process.stdout.write(`   🔲  ${image.filename}...`);
      image.blurDataURL = await generateBlurDataURL(filePath);
      console.log(' ✅');
      updated++;
    } catch (err) {
      console.log(` ❌  ${err.message}`);
      skipped++;
    }
  }

  // --- Homepage hero images ---
  if (json.homePage) {
    console.log('\n🏠  Generating blur placeholders for homepage hero images...');
    for (const [timeKey, entry] of Object.entries(json.homePage)) {
      const filePath = path.join(ROOT, 'public', 'homePage', entry.filename);
      if (!fs.existsSync(filePath)) {
        console.log(`   ⏭️  Local file not found, skipping: ${entry.filename}`);
        skipped++;
        continue;
      }
      try {
        process.stdout.write(`   🔲  ${timeKey} (${entry.filename})...`);
        entry.blurDataURL = await generateBlurDataURL(filePath);
        console.log(' ✅');
        updated++;
      } catch (err) {
        console.log(` ❌  ${err.message}`);
        skipped++;
      }
    }
  }

  fs.writeFileSync(METADATA_PATH, JSON.stringify(json, null, 2));

  console.log('\n─'.repeat(50));
  console.log(`✅  Done!  ${updated} blur placeholders added, ${skipped} skipped`);
  console.log('💡  Commit public/data/images.json to include blur placeholders in the build');
}

main().catch(err => {
  console.error('❌  Fatal error:', err);
  process.exit(1);
});
