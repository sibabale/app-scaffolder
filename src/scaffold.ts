import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

import { installDependencies } from './utils/install.js';
import { updateFiles, copyTemplate, getDestinationDir  } from './utils/files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getCurrentDir = (): string => path.resolve(__dirname);

// Main function to scaffold the app
export const scaffoldApp = (
  appName: string,
  framework: string,
  styleLibrary: string,
  packageManager: string
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const destDir = getDestinationDir(appName, isDevelopment);
  const templateDir = path.resolve(getCurrentDir(), '../templates', framework.toLowerCase());

  console.log(`Creating a new ${framework} app named "${appName}" with ${styleLibrary}...`);

  // Copy template files
  copyTemplate(templateDir, destDir);

  // Install dependencies
  const additionalDeps: string[] = [];
  const additionalDevDeps: string[] = [];
  let postInstallCommand: string | null = null;

  if (styleLibrary === 'Tailwind CSS') {
    additionalDevDeps.push('tailwindcss');
    postInstallCommand = 'npx tailwindcss init';
  } else if (styleLibrary === 'Bootstrap') {
    additionalDeps.push('bootstrap', '@popperjs/core');
  } else if (styleLibrary === 'Material UI') {
    additionalDeps.push('@mui/material', '@emotion/react', '@emotion/styled');
  }

  installDependencies(destDir, packageManager, additionalDeps, additionalDevDeps, styleLibrary);

  if (postInstallCommand) {
    console.log(`Running post-install command: ${postInstallCommand}...`);
    execSync(postInstallCommand, { stdio: 'inherit', cwd: destDir });
    console.log('Add the following @tailwind directives for each of Tailwind’s layers to your main CSS file:');
    console.log('@tailwind base;');
    console.log('@tailwind components;');
    console.log('@tailwind utilities;');
  }

  // Update files
  updateFiles(appName, destDir, framework);

  console.log('App setup complete.');
  console.log(`Navigate to your app directory: cd ${destDir}`);
  console.log(`Start the app with: ${packageManager} start`);
};

