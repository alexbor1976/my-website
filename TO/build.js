const fs = require('fs');
const path = require('path');

// 1. List your JS files here in the EXACT order they appear in your HTML
const filesToMerge = [
    // jquery, bootstrap, zooming, panning
    'DATA/js/vendors/jquery-3.7.1.min.js',
    'DATA/js/vendors/jquery-ui.min.js',
    'DATA/js/vendors/bootstrap.bundle.min.js',
    'DATA/js/vendors/zoom_pan.js',
    'DATA/js/Settings.js',
    'DATA/js/Units/UnitsConverter.js',

    // ELEMENTS OF BLOCKS
    'DATA/js/block_elements/Root.js',
    'DATA/js/block_elements/MultiSwitch.js',
    'DATA/js/block_elements/RotateButton.js',
    'DATA/js/block_elements/ArmSafeTest.js',
    'DATA/js/block_elements/ToModeSwitch.js',
    'DATA/js/block_elements/TestTarget.js',
    'DATA/js/block_elements/JoystickSign.js',
    'DATA/js/block_elements/TrackDataLabel.js',
    'DATA/js/block_elements/PPI.js',
    'DATA/js/block_elements/PPI_TO.js',
    'DATA/js/block_elements/HorizontalDrag.js',
    'DATA/js/block_elements/AzimuthDrag.js',
    'DATA/js/block_elements/Drag.js',
    'DATA/js/block_elements/Joystick.js',
    'DATA/js/block_elements/RangePPI.js',
    'DATA/js/block_elements/TrackDataBtn.js',
    'DATA/js/block_elements/TargetPackage2Ro.js',
    'DATA/js/block_elements/PPITimeAzimuth.js',
    'DATA/js/block_elements/PowerLamp.js',
    'DATA/js/block_elements/PowerTripleSwitch.js',
    'DATA/js/block_elements/PowerSingleSwitch.js',
    'DATA/js/block_elements/SwitchSteel.js',
    'DATA/js/block_elements/PowerIndicator.js',
    'DATA/js/block_elements/PowerIndicatorStick.js',

    // BLOCKS
    'DATA/js/BlockTOCommunicationDevice.js',
    'DATA/js/BlockTOStatePanel.js',
    'DATA/js/BlockTOPanel.js',
    'DATA/js/ContextMenu.js',
    'DATA/js/PowerBlock.js',

    // THE F1 WINDOW
    'DATA/js/F1Win/Settings.js',
    'DATA/js/F1Win/F1Tab.js',
    'DATA/js/F1Win/F1TabChild.js',
    'DATA/js/F1Win/F1Win.js',
    'DATA/js/F1Win/main.js',

    // THE MAIN STARTING POINT
    'DATA/js/Main.js'
];  

// 2. Name your final output file
const outputFile = 'bundle.js';

console.log('Starting to merge JavaScript files...');

let mergedContent = '';

filesToMerge.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Check if the file actually exists to prevent crashes
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        // We add a newline (\n) after each file. 
        // This prevents errors if one file is missing a semicolon at the end!
        mergedContent += `\n/* --- Source: ${file} --- */\n` + content + '\n';
        console.log(`✅ Merged: ${file}`);
    } else {
        console.error(`❌ ERROR: Could not find ${file}`);
    }
});

// 3. Write the final merged content to the new file
const outputFilePath = path.join(__dirname, outputFile);
fs.writeFileSync(outputFilePath, mergedContent, 'utf8');

console.log(`\n🎉 Success! All files merged into ${outputFile}`);