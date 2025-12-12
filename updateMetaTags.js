import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

// Path to the built index.html file
const indexPath = join(process.cwd(), 'dist', 'index.html');

// Read the file
let content = readFileSync(indexPath, 'utf8');

// Replace all instances of the old URL with the new Netlify URL
content = content.replace(/https:\/\/wordquest-sigma\.vercel\.app/g, 'https://word-swipe.netlify.app');

// Write the updated content back to the file
writeFileSync(indexPath, content, 'utf8');

console.log('Meta tags updated successfully!');