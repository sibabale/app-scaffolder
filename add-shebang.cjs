const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist/bin/cli.js');
const shebang = '#!/usr/bin/env node\n';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) throw err;

  if (!data.startsWith(shebang)) {
    fs.writeFile(filePath, shebang + data, 'utf8', (err) => {
      if (err) throw err;
      console.log('Shebang line added to cli.js');
    });
  }
});
