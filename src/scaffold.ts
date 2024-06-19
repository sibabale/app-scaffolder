import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import handlebars from 'handlebars';
import { cwd } from 'process';
import { fileURLToPath } from 'url';

// Utility functions

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getCurrentDir = (): string => path.resolve(__dirname);

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

const updateFiles = (appName: string, destDir: string, framework: string): void => {
  const packageJsonPath = path.join(destDir, 'package.json');
  const indexHtmlPath = framework === 'vue'
    ? path.join(destDir, 'public', 'index.html')
    : path.join(destDir, 'public', 'index.html');
  const appJsPath = path.join(destDir, 'src', framework === 'react' ? 'App.jsx' : 'App.vue');

  // Update package.json
  if (fs.existsSync(packageJsonPath)) {
    const packageJsonTemplate = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJsonContent = handlebars.compile(packageJsonTemplate)({ appName });
    fs.writeFileSync(packageJsonPath, packageJsonContent, 'utf-8');
  }

  // Update index.html
  if (fs.existsSync(indexHtmlPath)) {
    const indexHtmlTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');
    const indexHtmlContent = handlebars.compile(indexHtmlTemplate)({ appName });
    fs.writeFileSync(indexHtmlPath, indexHtmlContent, 'utf-8');
  }

  // Update App component
  if (fs.existsSync(appJsPath)) {
    const appJsTemplate = fs.readFileSync(appJsPath, 'utf-8');
    const appJsContent = handlebars.compile(appJsTemplate)({ appName });
    fs.writeFileSync(appJsPath, appJsContent, 'utf-8');
  }
};

const installDependencies = (destDir: string, packageManager: string, additionalDeps: string[], additionalDevDeps: string[]) => {
  console.log(`Installing dependencies using ${packageManager}...`);
  execSync(`${packageManager} install`, { stdio: 'inherit', cwd: destDir });

  const localPackagesDir = path.resolve(__dirname, '../packages');
  const localPackages = fs.readdirSync(localPackagesDir).filter(file => file.endsWith('.tgz'));

  localPackages.forEach(pkg => {
    const pkgPath = path.join(localPackagesDir, pkg);
    const installCommand = `${packageManager} add ${pkgPath}`;
    console.log(`Adding local package: ${pkgPath}...`);
    execSync(installCommand, { stdio: 'inherit', cwd: destDir });
  });

  if (additionalDeps.length > 0) {
    const addDepsCommand = `${packageManager} add ${additionalDeps.join(' ')}`;
    console.log(`Adding additional dependencies: ${additionalDeps.join(', ')}...`);
    execSync(addDepsCommand, { stdio: 'inherit', cwd: destDir });
  }

  if (additionalDevDeps.length > 0) {
    const addDevDepsCommand = `${packageManager} add ${additionalDevDeps.join(' ')} --dev`;
    console.log(`Adding additional dev dependencies: ${additionalDevDeps.join(', ')}...`);
    execSync(addDevDepsCommand, { stdio: 'inherit', cwd: destDir });
  }
};

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

  installDependencies(destDir, packageManager, additionalDeps, additionalDevDeps);

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
