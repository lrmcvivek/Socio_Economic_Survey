const fs = require('fs');
const path = require('path');

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create screenshots directory
const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

console.log('Icon and screenshot directories created successfully!');
console.log('Note: You will need to add actual icon images to the public/icons directory:');
console.log('- icon-192x192.png');
console.log('- icon-256x256.png');
console.log('- icon-384x384.png');
console.log('- icon-512x512.png');
console.log('- icon-180x180.png (for Apple touch)');
console.log('- icon-32x32.png');
console.log('- icon-16x16.png');
console.log('\nAnd screenshot images to public/screenshots/:');
console.log('- desktop.png (1280x720)');
console.log('- mobile.png (720x1280)');