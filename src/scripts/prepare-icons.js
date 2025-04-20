import fs from 'fs';
import path from 'path';
import https from 'https';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the directory name using ES modules approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// URL of the icon
const iconUrl = 'https://www.webcincodev.com/blog/wp-content/uploads/2025/04/ico.png';
const tempPath = path.join(iconsDir, 'temp-icon.png');

// Download the icon
const file = fs.createWriteStream(tempPath);
https.get(iconUrl, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      console.log('Icon downloaded successfully');
      
      // Resize to 192x192
      sharp(tempPath)
        .resize(192, 192)
        .toFile(path.join(iconsDir, 'icon-192x192.png'))
        .then(() => console.log('192x192 icon created'))
        .catch(err => console.error('Error creating 192x192 icon:', err));
      
      // Resize to 512x512
      sharp(tempPath)
        .resize(512, 512)
        .toFile(path.join(iconsDir, 'icon-512x512.png'))
        .then(() => {
          console.log('512x512 icon created');
          // Delete the temporary file
          fs.unlinkSync(tempPath);
        })
        .catch(err => console.error('Error creating 512x512 icon:', err));
    });
  });
}).on('error', (err) => {
  fs.unlinkSync(tempPath);
  console.error('Error downloading icon:', err);
});
