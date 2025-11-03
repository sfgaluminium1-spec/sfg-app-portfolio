
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all API route files with dynamic parameters
const routeFiles = execSync('find app/api -name "route.ts" -path "*/\\[*\\]/*"', { 
  encoding: 'utf8', 
  cwd: '/home/ubuntu/sfg-nexus-mockup/app' 
}).trim().split('\n').filter(Boolean);

console.log(`Found ${routeFiles.length} API route files to fix`);

routeFiles.forEach(filePath => {
  const fullPath = path.join('/home/ubuntu/sfg-nexus-mockup/app', filePath);
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let modified = false;
    
    // Pattern 1: Single parameter like { params: { id: string } }
    const singleParamRegex = /(\{ params \}: \{ params: \{ (\w+): string \} \})/g;
    if (content.match(singleParamRegex)) {
      content = content.replace(singleParamRegex, '{ params }: { params: Promise<{ $2: string }> }');
      modified = true;
    }
    
    // Pattern 2: Multiple parameters like { params: { id: string; drawingId: string; } }
    const multiParamRegex = /(\{ params \}: \{ params: \{ ([^}]+) \} \})/g;
    const multiMatches = content.match(multiParamRegex);
    if (multiMatches) {
      multiMatches.forEach(match => {
        const paramsPart = match.match(/\{ ([^}]+) \}/)[1];
        const newParams = `{ params }: { params: Promise<{ ${paramsPart} }> }`;
        content = content.replace(match, newParams);
        modified = true;
      });
    }
    
    // Add await params destructuring after try { statements
    const functionRegex = /export async function (GET|POST|PUT|PATCH|DELETE)\s*\([^)]*\{ params \}[^)]*\)\s*\{[\s]*try\s*\{([^}]*?)(?=\s*const|\s*if|\s*return|\s*await|\s*\/\/|\s*\w)/g;
    
    content = content.replace(functionRegex, (match, method, afterTry) => {
      // Check if this function already has await params
      if (match.includes('await params')) {
        return match;
      }
      
      // Determine parameter names from the function signature
      const paramMatch = match.match(/\{ params \}: \{ params: Promise<\{ ([^}]+) \}> \}/);
      if (!paramMatch) return match;
      
      const paramsContent = paramMatch[1];
      const paramNames = paramsContent.split(/[,;]/).map(p => p.split(':')[0].trim()).filter(Boolean);
      
      if (paramNames.length === 1) {
        const paramName = paramNames[0];
        const destructuring = `\n    const { ${paramName} } = await params;`;
        return match.replace(/try\s*\{/, `try {${destructuring}`);
      } else if (paramNames.length > 1) {
        const destructuring = `\n    const { ${paramNames.join(', ')} } = await params;`;
        return match.replace(/try\s*\{/, `try {${destructuring}`);
      }
      
      return match;
    });
    
    // Fix remaining params.paramName references
    const paramNameRegex = /params\.(\w+)/g;
    const paramMatches = content.match(paramNameRegex);
    if (paramMatches) {
      const uniqueParams = [...new Set(paramMatches.map(m => m.split('.')[1]))];
      uniqueParams.forEach(paramName => {
        // Only replace if we haven't already destructured this parameter
        const hasDestructured = content.includes(`const { ${paramName} }`) || 
                              content.includes(`const { ${paramName},`) ||
                              content.includes(`, ${paramName} }`);
        if (!hasDestructured) {
          content = content.replace(new RegExp(`params\\.${paramName}`, 'g'), paramName);
        } else {
          content = content.replace(new RegExp(`params\\.${paramName}`, 'g'), paramName);
        }
      });
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(fullPath, content);
      console.log(`✓ Fixed: ${filePath}`);
    } else {
      console.log(`- No changes needed: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error processing ${filePath}:`, error.message);
  }
});

console.log('API route fixing completed!');
