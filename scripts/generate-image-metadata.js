#!/usr/bin/env node

/**
 * Image Metadata Generator
 *
 * Automatically extracts EXIF metadata from images and generates images.json
 *
 * Usage:
 *   node scripts/generate-image-metadata.js
 *   npm run generate-metadata
 *
 * This script:
 * 1. Scans public/images/color and public/images/bw directories
 * 2. Extracts EXIF data (camera, ISO, aperture, shutter, lens, GPS)
 * 3. Generates public/data/images.json with all metadata
 */

const fs = require('fs').promises;
const path = require('path');
const exifr = require('exifr');
const https = require('https');

// Configuration
const IMAGE_DIRS = {
  color: path.join(process.cwd(), 'public/images/color'),
  bw: path.join(process.cwd(), 'public/images/bw'),
};

const OUTPUT_FILE = path.join(process.cwd(), 'public/data/images.json');

// Supported image formats
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

// Reverse geocoding cache to avoid repeated API calls
const geocodingCache = new Map();

/**
 * Reverse geocode GPS coordinates to location name
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 */
async function reverseGeocode(latitude, longitude) {
  const cacheKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Check cache first
  if (geocodingCache.has(cacheKey)) {
    return geocodingCache.get(cacheKey);
  }

  try {
    // Use OpenStreetMap Nominatim API (free, no API key required)
    // Rate limit: 1 request per second
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;

    const response = await new Promise((resolve, reject) => {
      https.get(url, {
        headers: {
          'User-Agent': 'BMAD-Wildlife-Photography-Site/1.0'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ data, statusCode: res.statusCode }));
      }).on('error', reject);
    });

    if (response.statusCode !== 200) {
      console.warn(`Geocoding failed for ${latitude}, ${longitude}`);
      return null;
    }

    const result = JSON.parse(response.data);

    // Format location name from result
    let location = null;
    if (result.address) {
      const parts = [];

      // Include park/nature reserve if available
      if (result.address.nature_reserve) parts.push(result.address.nature_reserve);
      if (result.address.park) parts.push(result.address.park);
      if (result.address.tourism) parts.push(result.address.tourism);

      // Include state/region
      if (result.address.state) parts.push(result.address.state);

      // Include country
      if (result.address.country) parts.push(result.address.country);

      location = parts.join(', ');
    }

    // Cache the result
    geocodingCache.set(cacheKey, location);

    // Respect rate limit (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1100));

    return location;
  } catch (error) {
    console.warn(`Error geocoding ${latitude}, ${longitude}:`, error.message);
    return null;
  }
}

/**
 * Get all image files from a directory
 */
async function getImageFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map(file => path.join(directory, file));
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.warn(`Directory not found: ${directory}`);
      return [];
    }
    throw error;
  }
}

/**
 * Extract EXIF metadata from an image
 */
async function extractMetadata(filePath) {
  try {
    const exif = await exifr.parse(filePath, {
      tiff: true,
      exif: true,
      gps: true,
      ifd0: true,
      ifd1: true,
    });

    if (!exif) {
      console.warn(`No EXIF data found for: ${path.basename(filePath)}`);
      return null;
    }

    // Extract camera settings
    const metadata = {
      camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}`.trim() : null,
      iso: exif.ISO || null,
      aperture: exif.FNumber ? `f/${exif.FNumber}` : null,
      shutter: exif.ExposureTime
        ? exif.ExposureTime < 1
          ? `1/${Math.round(1 / exif.ExposureTime)}s`
          : `${exif.ExposureTime}s`
        : null,
      lens: exif.LensModel || exif.LensInfo || null,
      focalLength: exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : null,
      dateTaken: exif.DateTimeOriginal || exif.DateTime || null,
      location: null, // Will be populated from GPS or manual override
    };

    // Extract GPS coordinates and reverse geocode to location name
    if (exif.latitude && exif.longitude) {
      metadata.gps = {
        latitude: exif.latitude,
        longitude: exif.longitude,
      };

      // Try to get location name from GPS coordinates
      console.log(`    🌍 Reverse geocoding GPS: ${exif.latitude.toFixed(4)}, ${exif.longitude.toFixed(4)}`);
      const locationName = await reverseGeocode(exif.latitude, exif.longitude);
      if (locationName) {
        metadata.location = locationName;
        console.log(`    📍 Location: ${locationName}`);
      }
    }

    return metadata;
  } catch (error) {
    console.error(`Error extracting EXIF from ${path.basename(filePath)}:`, error.message);
    return null;
  }
}

/**
 * Get image dimensions
 */
async function getImageDimensions(filePath) {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
    };
  } catch (error) {
    console.warn(`Could not get dimensions for ${path.basename(filePath)}`);
    return { width: null, height: null };
  }
}

/**
 * Generate a tiny base64 blur placeholder using Sharp
 */
async function generateBlurDataURL(filePath) {
  try {
    const sharp = require('sharp');
    const { data } = await sharp(filePath)
      .resize(10, 10, { fit: 'cover' })
      .jpeg({ quality: 30 })
      .toBuffer({ resolveWithObject: true });
    return `data:image/jpeg;base64,${data.toString('base64')}`;
  } catch (error) {
    console.warn(`Could not generate blur placeholder for ${path.basename(filePath)}`);
    return null;
  }
}

/**
 * Generate image entry for images.json
 */
async function generateImageEntry(filePath, category) {
  const filename = path.basename(filePath);
  const metadata = await extractMetadata(filePath);
  const dimensions = await getImageDimensions(filePath);
  const blurDataURL = await generateBlurDataURL(filePath);

  // Generate ID from filename
  const id = path.parse(filename).name;

  // Generate alt text from filename (convert hyphens/underscores to spaces)
  const altText = id
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());

  return {
    id,
    filename,
    category,
    url: `/images/${category}/${filename}`,
    width: dimensions.width,
    height: dimensions.height,
    alt: altText,
    blurDataURL,
    metadata: metadata || {
      camera: null,
      iso: null,
      aperture: null,
      shutter: null,
      lens: null,
      focalLength: null,
      location: null,
      dateTaken: null,
    },
    createdAt: new Date().toISOString(),
  };
}

/**
 * Main function
 */
async function generateMetadata() {
  console.log('🔍 Scanning for images...\n');

  const images = [];

  // Process color images
  console.log('📸 Processing color images...');
  const colorFiles = await getImageFiles(IMAGE_DIRS.color);
  for (const filePath of colorFiles) {
    const entry = await generateImageEntry(filePath, 'color');
    images.push(entry);
    console.log(`  ✓ ${entry.filename}`);
    if (entry.metadata.camera) {
      console.log(`    📷 ${entry.metadata.camera}`);
    }
    if (entry.metadata.iso) {
      console.log(`    ⚙️  ISO ${entry.metadata.iso} • ${entry.metadata.aperture} • ${entry.metadata.shutter}`);
    }
  }

  console.log('');

  // Process B&W images
  console.log('📸 Processing black & white images...');
  const bwFiles = await getImageFiles(IMAGE_DIRS.bw);
  for (const filePath of bwFiles) {
    const entry = await generateImageEntry(filePath, 'bw');
    images.push(entry);
    console.log(`  ✓ ${entry.filename}`);
    if (entry.metadata.camera) {
      console.log(`    📷 ${entry.metadata.camera}`);
    }
    if (entry.metadata.iso) {
      console.log(`    ⚙️  ISO ${entry.metadata.iso} • ${entry.metadata.aperture} • ${entry.metadata.shutter}`);
    }
  }

  console.log('');

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  await fs.mkdir(outputDir, { recursive: true });

  // Write images.json
  const output = {
    images,
    generatedAt: new Date().toISOString(),
    totalImages: images.length,
    categories: {
      color: images.filter(img => img.category === 'color').length,
      bw: images.filter(img => img.category === 'bw').length,
    },
  };

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log('✅ Metadata generated successfully!\n');
  console.log(`📁 Output: ${OUTPUT_FILE}`);
  console.log(`📊 Total images: ${output.totalImages}`);
  console.log(`   • Color: ${output.categories.color}`);
  console.log(`   • B&W: ${output.categories.bw}`);
  console.log('');
  console.log('💡 Tip: You can manually edit public/data/images.json to add:');
  console.log('   • location (e.g., "Serengeti National Park, Tanzania")');
  console.log('   • story (behind-the-lens narrative)');
  console.log('   • timeOfDay (dawn/midday/dusk/night)');
}

// Run the script
generateMetadata().catch(error => {
  console.error('❌ Error generating metadata:', error);
  process.exit(1);
});
