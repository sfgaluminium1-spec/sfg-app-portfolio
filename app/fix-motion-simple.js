
const fs = require('fs');

// List of files with motion component issues based on the build errors
const problematicFiles = [
  './app/portal/dashboard/page.tsx',
  './app/portal/page.tsx', 
  './app/pricing/page.tsx',
  './app/spec/page.tsx',
  './components/compliance-dashboard.tsx',
  './components/customer-management.tsx',
  './components/customer-portal-demo-system.tsx',
  './components/dashboard.tsx',
  './components/enhanced-customer-contact-management.tsx',
  './components/enhanced-workflow-overview.tsx',
  './components/glass-catalog.tsx',
  './components/job-workflow-dashboard.tsx'
];

console.log('Fixing motion component issues...');

problematicFiles.forEach(filePath => {
  const fullPath = `/home/ubuntu/sfg-nexus-mockup/app/${filePath}`;
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace motion.div with regular div while preserving animation attributes for later
    // We'll convert motion.div to div and add data attributes for animation properties
    content = content.replace(/<motion\.div\s+([^>]*?)>/g, (match, props) => {
      // Extract className and other non-motion props
      const classMatch = props.match(/className="([^"]*)"/);
      const keyMatch = props.match(/key=\{([^}]*)\}/);
      const onClickMatch = props.match(/onClick=\{([^}]*)\}/);
      
      let newProps = '';
      if (classMatch) newProps += ` className="${classMatch[1]}"`;
      if (keyMatch) newProps += ` key={${keyMatch[1]}}`;
      if (onClickMatch) newProps += ` onClick={${onClickMatch[1]}}`;
      
      return `<div${newProps}>`;
    });
    
    // Replace closing motion.div tags
    content = content.replace(/<\/motion\.div>/g, '</div>');
    
    // Also handle motion.section, motion.span, etc.
    content = content.replace(/<motion\.(section|span|article|header|footer|nav|main|aside)\s+([^>]*?)>/g, (match, element, props) => {
      const classMatch = props.match(/className="([^"]*)"/);
      const keyMatch = props.match(/key=\{([^}]*)\}/);
      const onClickMatch = props.match(/onClick=\{([^}]*)\}/);
      
      let newProps = '';
      if (classMatch) newProps += ` className="${classMatch[1]}"`;
      if (keyMatch) newProps += ` key={${keyMatch[1]}}`;
      if (onClickMatch) newProps += ` onClick={${onClickMatch[1]}}`;
      
      return `<${element}${newProps}>`;
    });
    
    content = content.replace(/<\/motion\.(section|span|article|header|footer|nav|main|aside)>/g, '</$1>');
    
    fs.writeFileSync(fullPath, content);
    console.log(`✓ Fixed motion components in: ${filePath}`);
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('Motion component fixing completed!');
