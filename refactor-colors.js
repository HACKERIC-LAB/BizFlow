const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    let filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = walk('./Bizflow FRONTEND/src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Primary variants
  content = content.replace(/primary-soft/g, 'coffee-50');
  content = content.replace(/primary-light/g, 'coffee-400');
  content = content.replace(/primary-dark/g, 'coffee-900');
  content = content.replace(/primary-accent/g, 'accent');
  
  // Base primary
  // Use regex with word boundaries to avoid replacing parts of other words, though primary is usually bounded by - or space
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to|accent)-primary\b/g, '$1-coffee-700');
  
  // Secondary Teal
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to)-secondaryTeal\b/g, '$1-coffee-500');
  
  // Neutrals
  content = content.replace(/neutral-darkNavy/g, 'coffee-900');
  content = content.replace(/neutral-textMid/g, 'coffee-600');
  content = content.replace(/neutral-textLight/g, 'neutral-500');
  content = content.replace(/neutral-border/g, 'coffee-200');
  content = content.replace(/neutral-background/g, 'coffee-50');
  
  // Mpesa / Gold / Red (Fallback to tailwind defaults or coffee/accent)
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to)-gold\b/g, '$1-accent');
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to)-accent-red\b/g, '$1-red-500');
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to)-mpesa-green\b/g, '$1-green-600');
  content = content.replace(/(text|bg|border|ring|shadow|from|via|to)-mpesa-muted\b/g, '$1-green-100');

  // Hardcoded Hexes or specific issues
  content = content.replace(/text-slate-400/g, 'text-neutral-400');
  content = content.replace(/text-slate-500/g, 'text-neutral-500');
  content = content.replace(/text-slate-600/g, 'text-coffee-600');
  content = content.replace(/text-slate-900/g, 'text-coffee-900');
  content = content.replace(/bg-slate-50/g, 'bg-coffee-50');
  content = content.replace(/bg-slate-100/g, 'bg-coffee-100');
  content = content.replace(/bg-slate-200/g, 'bg-coffee-200');
  content = content.replace(/border-slate-100/g, 'border-coffee-100');
  content = content.replace(/border-slate-200/g, 'border-coffee-200');

  if (content !== originalContent) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});

console.log('Refactoring complete.');
