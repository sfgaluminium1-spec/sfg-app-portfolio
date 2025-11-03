
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all tsx files that might have motion components
const files = execSync('find . -name "*.tsx" -not -path "./node_modules/*" -not -path "./.next/*"', { 
  encoding: 'utf8', 
  cwd: '/home/ubuntu/sfg-nexus-mockup/app' 
}).trim().split('\n').filter(Boolean);

console.log(`Checking ${files.length} TSX files for motion components`);

let totalFixed = 0;

files.forEach(filePath => {
  const fullPath = path.join('/home/ubuntu/sfg-nexus-mockup/app', filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if file contains motion components
    if (!content.includes('motion.') && !content.includes('<motion.')) {
      return;
    }
    
    console.log(`Processing: ${filePath}`);
    let modified = false;
    
    // Replace all motion elements with regular elements
    const motionElements = ['div', 'span', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside', 'form', 'button'];
    
    motionElements.forEach(element => {
      // Pattern: <motion.element ...props>
      const openingTagRegex = new RegExp(`<motion\\.${element}\\s+([^>]*?)>`, 'g');
      const closingTagRegex = new RegExp(`</motion\\.${element}>`, 'g');
      
      if (content.match(openingTagRegex)) {
        // Replace opening tags
        content = content.replace(openingTagRegex, (match, props) => {
          // Extract only HTML attributes (className, key, onClick, etc.)
          // Remove motion-specific props (initial, animate, transition, whileHover, whileTap, exit)
          
          let cleanProps = props
            .replace(/initial=\{[^}]*\}/g, '')
            .replace(/animate=\{[^}]*\}/g, '')
            .replace(/transition=\{[^}]*\}/g, '')
            .replace(/whileHover=\{[^}]*\}/g, '')
            .replace(/whileTap=\{[^}]*\}/g, '')
            .replace(/exit=\{[^}]*\}/g, '')
            .replace(/variants=\{[^}]*\}/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          return `<${element}${cleanProps ? ' ' + cleanProps : ''}>`;
        });
        
        // Replace closing tags
        content = content.replace(closingTagRegex, `</${element}>`);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Fixed motion components in: ${filePath}`);
      totalFixed++;
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log(`Motion component fixing completed! Fixed ${totalFixed} files.`);
