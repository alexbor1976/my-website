const fs = require('fs');
const path = require('path');

/**
 * Copies a file from the source path to the destination directory, with replacement if it already exists.
 * 
 * @param {string} sourceFilePath - The path of the file to copy.
 * @param {string} destDirPath - The directory where the file should be copied.
 */
function copyFile(sourceFilePath, destDirPath) {
  const destFilePath = path.join(destDirPath, path.basename(sourceFilePath));

  // Ensure the destination directory exists
  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }

  // Copy the file with replacement
  fs.copyFile(sourceFilePath, destFilePath, (err) => {
    if (err) {
      console.error('Error occurred while copying the file:', err);
    } else {
      console.log(`File copied successfully to ${destFilePath}`);
    }
  });
}

/**
 * Copies an entire folder and its contents to the destination.
 * If the destination contains the folder, it will be erased first.
 * 
 * @param {string} sourceDirPath - The path of the directory to copy.
 * @param {string} destDirPath - The destination directory.
 */
function copyFolder(sourceDirPath, destDirPath) {
  const destFolderPath = path.join(destDirPath, path.basename(sourceDirPath));

  // Remove the destination folder if it exists
  if (fs.existsSync(destFolderPath)) {
    fs.rmSync(destFolderPath, { recursive: true, force: true });
    console.log(`Existing folder ${destFolderPath} removed.`);
  }

  // Recursively copy the folder and its contents
  function copyRecursiveSync(src, dest) {
    const entries = fs.readdirSync(src, { withFileTypes: true });

    fs.mkdirSync(dest);

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      entry.isDirectory()
        ? copyRecursiveSync(srcPath, destPath)
        : fs.copyFileSync(srcPath, destPath);
    }
  }

  copyRecursiveSync(sourceDirPath, destFolderPath);
  console.log(`Folder ${sourceDirPath} copied successfully to ${destFolderPath}`);
}

/**
 * Copies only *.css and *.map files from the /css folder to the destination.
 * If the destination contains the /css folder, it will be erased first.
 * 
 * @param {string} sourceCssDirPath - The path of the /css directory to copy.
 * @param {string} destDirPath - The destination directory.
 */
function copyCssFiles(sourceCssDirPath, destDirPath) {
  const destCssFolderPath = path.join(destDirPath, path.basename(sourceCssDirPath));

  // Remove the destination /css folder if it exists
  if (fs.existsSync(destCssFolderPath)) {
    fs.rmSync(destCssFolderPath, { recursive: true, force: true });
    console.log(`Existing folder ${destCssFolderPath} removed.`);
  }

  // Ensure the destination directory exists
  if (!fs.existsSync(destDirPath)) {
    fs.mkdirSync(destDirPath, { recursive: true });
  }

  // Copy only *.css and *.map files from the source /css folder
  fs.readdir(sourceCssDirPath, (err, files) => {
    if (err) {
      console.error('Error reading the /css directory:', err);
      return;
    }

    files.forEach(file => {
      const fileExtension = path.extname(file);
      if (fileExtension === '.css' || fileExtension === '.map') {
        const sourceFilePath = path.join(sourceCssDirPath, file);
        const destFilePath = path.join(destCssFolderPath, file);

        // Ensure the /css folder exists in the destination
        if (!fs.existsSync(destCssFolderPath)) {
          fs.mkdirSync(destCssFolderPath, { recursive: true });
        }

        // Copy the file
        fs.copyFile(sourceFilePath, destFilePath, (err) => {
          if (err) {
            console.error(`Error copying ${file}:`, err);
          } else {
            console.log(`File ${file} copied successfully to ${destCssFolderPath}`);
          }
        });
      }
    });
  });
}

// Example usage:
const sourceFile = path.join(__dirname, 'adp_start.html');
const destDir = path.join(__dirname, 'dist');
copyFile(sourceFile, destDir);

// Copy the 'js' folder
const sourceJsFolder = path.join(__dirname, 'js');
copyFolder(sourceJsFolder, destDir);

// Copy the 'assets' folder
const sourceAssetsFolder = path.join(__dirname, 'assets');
copyFolder(sourceAssetsFolder, destDir);

// Copy only *.css and *.map files from the 'css' folder
const sourceCssFolder = path.join(__dirname, 'css');
copyCssFiles(sourceCssFolder, destDir);
