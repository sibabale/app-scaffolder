import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const installDependencies = (destDir: string, packageManager: string, additionalDeps: string[], additionalDevDeps: string[], styleLibrary: string) => {
    console.log(`Installing dependencies using ${packageManager}...`);
    
    // Install all dependencies
    execSync(`${packageManager} install`, { stdio: 'inherit', cwd: destDir });
  
    // Get local packages
    const localPackagesDir = path.resolve(__dirname, '../packages');
    const localPackages = fs.readdirSync(localPackagesDir).filter(file => file.endsWith('.tgz'));
  
    // Only install the selected style library if it's available as a local package
    const styleLibraryPackagePath = localPackages.find(pkg => pkg.includes(styleLibrary.toLowerCase()));
    if (styleLibraryPackagePath) {
      const styleLibraryPath = path.join(localPackagesDir, styleLibraryPackagePath);
      const installCommand = `${packageManager} add ${styleLibraryPath}`;
      console.log(`Adding local style library: ${styleLibraryPath}...`);
      execSync(installCommand, { stdio: 'inherit', cwd: destDir });
    } else {
      console.log(`Style library ${styleLibrary} not found in local packages.`);
    }
  
    // Install additional dependencies
    if (additionalDeps.length > 0) {
      const addDepsCommand = `${packageManager} add ${additionalDeps.join(' ')}`;
      console.log(`Adding additional dependencies: ${additionalDeps.join(', ')}...`);
      execSync(addDepsCommand, { stdio: 'inherit', cwd: destDir });
    }
  
    // Install additional dev dependencies
    if (additionalDevDeps.length > 0) {
      const addDevDepsCommand = `${packageManager} add ${additionalDevDeps.join(' ')} --dev`;
      console.log(`Adding additional dev dependencies: ${additionalDevDeps.join(', ')}...`);
      execSync(addDevDepsCommand, { stdio: 'inherit', cwd: destDir });
    }
  };

  export {installDependencies};