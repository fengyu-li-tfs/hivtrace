const fs = require('fs');
const path = require('path');

const srcDist = path.join(__dirname, '..', 'node_modules', 'hivtrace-viz', 'dist');
const destDist = path.join(__dirname, '..', 'hivtrace', 'web', 'static', 'dist');

const srcAssets = path.join(__dirname, '..', 'node_modules', 'hivtrace-viz', 'assets');
const destAssets = path.join(__dirname, '..', 'hivtrace', 'web', 'static', 'assets');

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn('Source directory does not exist:', src);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log('Copied', destPath);
    }
  }
}

copyDirSync(srcDist, destDist);
copyDirSync(srcAssets, destAssets);

console.log('Done copying hivtrace-viz assets.');
