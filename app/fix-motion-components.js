
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all tsx files that might have motion components
const files = execSync('find . -name "*.tsx" -not -path "./node_modules/*" -not -path "./.next/*"', { 
  encoding: 'utf8', 
  cwd: '/home/ubuntu/sfg-nexus-mockup/app' 
}).trim().split('\n').filter(Boolean);

console.log(`Found ${files.length} TSX files to check for motion components`);

files.forEach(filePath => {
  const fullPath = path.join('/home/ubuntu/sfg-nexus-mockup/app', filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Check if file contains motion components
    if (!content.includes('motion.') && !content.includes('from "framer-motion"')) {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    
    // Fix motion components by moving className to the correct position
    // Pattern: motion.div with props and className
    const motionRegex = /<motion\.(div|span|section|article|header|footer|nav|main|aside)\s+([^>]*?)className="([^"]*)"([^>]*?)>/g;
    
    content = content.replace(motionRegex, (match, element, beforeClass, className, afterClass) => {
      // Move className to the end, after all motion props
      const cleanBefore = beforeClass.trim();
      const cleanAfter = afterClass.trim();
      
      // Combine all non-className props
      const allProps = [cleanBefore, cleanAfter].filter(Boolean).join(' ');
      
      return `<motion.${element} ${allProps} className="${className}">`;
    });
    
    // Alternative pattern: Try a different approach for problematic motion components
    // Replace with div + motion props as separate
    const problematicMotionRegex = /<motion\.(div|span|section)\s+([^>]*?)className="([^"]*)"([^>]*?)>/g;
    
    content = content.replace(problematicMotionRegex, (match, element, props1, className, props2) => {
      // Extract motion props and regular props
      const allProps = `${props1} ${props2}`.trim();
      
      // Check if this causes issues - if so, use a div wrapper
      if (allProps.includes('initial=') || allProps.includes('animate=') || allProps.includes('transition=')) {
        return `<motion.${element}\n          ${allProps}\n          className="${className}">`;
      }
      
      return match;
    });
    
    // Another approach: Fix specific motion.div patterns that are causing issues
    const specificPatterns = [
      {
        // Pattern for motion.div with multiple props and className
        regex: /<motion\.div\s+([^>]*?)\s+className="([^"]*?)"\s*>/g,
        replacement: (match, props, className) => {
          return `<motion.div\n          ${props.trim()}\n          className="${className}">`;
        }
      }
    ];
    
    specificPatterns.forEach(({ regex, replacement }) => {
      const newContent = content.replace(regex, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    // Check if we actually made changes
    if (content !== fs.readFileSync(fullPath, 'utf8')) {
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Fixed: ${filePath}`);
    } else {
      console.log(`- No motion changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('Motion component fixing completed!');
