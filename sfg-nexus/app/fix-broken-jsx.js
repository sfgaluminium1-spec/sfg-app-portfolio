
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all tsx files
const files = execSync('find . -name "*.tsx" -not -path "./node_modules/*" -not -path "./.next/*"', { 
  encoding: 'utf8', 
  cwd: '/home/ubuntu/sfg-nexus-mockup/app' 
}).trim().split('\n').filter(Boolean);

console.log(`Checking ${files.length} TSX files for broken JSX`);

let totalFixed = 0;

files.forEach(filePath => {
  const fullPath = path.join('/home/ubuntu/sfg-nexus-mockup/app', filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    // Pattern 1: <div } } }>
    content = content.replace(/<div\s+\}\s+\}\s+\}>/g, '<div>');
    
    // Pattern 2: <div key={...} } } } className="...">
    content = content.replace(/(<div[^>]*?)\s+\}\s+\}\s+\}\s+(className="[^"]*">)/g, '$1 $2');
    
    // Pattern 3: Various broken JSX patterns
    content = content.replace(/\s+\}\s+\}\s+\}\s+/g, ' ');
    content = content.replace(/\s+\}\s+\}\s+/g, ' ');
    content = content.replace(/\s+\}\s+>/g, '>');
    
    // Pattern 4: Fix spaces before className
    content = content.replace(/\s+className=/g, ' className=');
    
    // Pattern 5: Multiple spaces
    content = content.replace(/\s+/g, ' ');
    
    if (content !== original) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Fixed broken JSX in: ${filePath}`);
      totalFixed++;
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log(`Broken JSX fixing completed! Fixed ${totalFixed} files.`);
