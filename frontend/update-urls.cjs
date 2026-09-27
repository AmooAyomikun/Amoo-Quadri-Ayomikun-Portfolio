const fs = require('fs');
const path = require('path');

const files = [
  'src/sections/VisitorMapSection.tsx',
  'src/pages/ProjectDetailPage.tsx',
  'src/pages/GuestbookPage.tsx',
  'src/sections/NewsSection.tsx',
  'src/sections/ContactSection.tsx',
  'src/components/ProjectCard.tsx'
];

files.forEach(relativePath => {
  const file = path.join(__dirname, relativePath);
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Replace 'http://localhost:5000/api/...' or 'http://localhost:5000' with environment variable
    if (content.includes("'http://localhost:5000/api/")) {
      content = content.replace(/'http:\/\/localhost:5000\/api\/([^']+)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/$1`");
      modified = true;
    } else if (content.includes("'http://localhost:5000/")) {
      content = content.replace(/'http:\/\/localhost:5000\/([^']+)'/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/$1`");
      modified = true;
    } else if (content.includes("http://localhost:5000")) {
      content = content.replace(/http:\/\/localhost:5000/g, "${import.meta.env.VITE_API_URL || 'http://localhost:5000'}");
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated', file);
    }
  }
});
