import fs from 'fs-extra';
import path from 'path';
import handlebars from 'handlebars';
import { cwd } from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getCurrentDir = (): string => path.resolve(__dirname);

const updateFiles = (appName: string, destDir: string, framework: string): void => {
    const indexHtmlPath = framework === 'vue'
      ? path.join(destDir, 'index.html')
      : path.join(destDir, 'public', 'index.html');
  
    // Update index.html
    if (fs.existsSync(indexHtmlPath)) {
      const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');
      const indexHtmlContent = handlebars.compile(indexHtmlTemplate)({ appName });
      fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf-8');
    }
  
  };


const getDestinationDir = (appName: string, isDevelopment: boolean): string => {
  return isDevelopment
    ? path.resolve(getCurrentDir(), '../../apps', appName)
    : path.resolve(cwd(), appName);
};

const copyTemplate = (templateDir: string, destDir: string): void => {
  if (!fs.existsSync(templateDir)) {
    throw new Error(`Template directory ${templateDir} does not exist`);
  }
  fs.copySync(templateDir, destDir);
};


  export { updateFiles, copyTemplate, getCurrentDir, getDestinationDir  }