#!/usr/bin/env node

/**
 * React Developer Tools Setup Script
 * 
 * This script helps you set up React Developer Tools extension for NarraLeaf applications.
 * It provides instructions and can optionally copy extension files from Chrome installation.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const EXTENSION_ID = 'fmkadmapgofadopljbjfkapdkoienihi';
const TARGET_DIR = path.join(__dirname, '..', 'extensions', 'react-devtools');

// Chrome extension paths for different platforms
const CHROME_PATHS = {
    win32: [
        path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Extensions', EXTENSION_ID),
        path.join(process.env.USERPROFILE, 'AppData', 'Local', 'Microsoft', 'Edge', 'User Data', 'Default', 'Extensions', EXTENSION_ID)
    ],
    linux: [
        path.join(os.homedir(), '.config', 'google-chrome', 'Default', 'Extensions', EXTENSION_ID),
        path.join(os.homedir(), '.config', 'chromium', 'Default', 'Extensions', EXTENSION_ID)
    ],
    darwin: [
        path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome', 'Default', 'Extensions', EXTENSION_ID),
        path.join(os.homedir(), 'Library', 'Application Support', 'Chromium', 'Default', 'Extensions', EXTENSION_ID)
    ]
};

function findChromeExtension() {
    const platform = os.platform();
    const paths = CHROME_PATHS[platform] || [];
    
    for (const basePath of paths) {
        if (fs.existsSync(basePath)) {
            const versions = fs.readdirSync(basePath);
            if (versions.length > 0) {
                const latestVersion = versions.sort().pop();
                const fullPath = path.join(basePath, latestVersion);
                if (fs.existsSync(path.join(fullPath, 'manifest.json'))) {
                    return fullPath;
                }
            }
        }
    }
    
    return null;
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

function setupReactDevTools() {
    console.log('🔧 Setting up React Developer Tools for NarraLeaf...\n');
    
    // Check if target directory already exists
    if (fs.existsSync(TARGET_DIR)) {
        console.log('⚠️  React DevTools extension directory already exists:');
        console.log(`   ${TARGET_DIR}\n`);
        
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
            rl.close();
            if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                fs.rmSync(TARGET_DIR, { recursive: true, force: true });
                performSetup();
            } else {
                console.log('Setup cancelled.');
            }
        });
    } else {
        performSetup();
    }
}

function performSetup() {
    console.log('🔍 Looking for React DevTools in Chrome installation...\n');
    
    const chromeExtensionPath = findChromeExtension();
    
    if (chromeExtensionPath) {
        console.log('✅ Found React DevTools in Chrome installation:');
        console.log(`   ${chromeExtensionPath}\n`);
        
        try {
            copyDirectory(chromeExtensionPath, TARGET_DIR);
            console.log('✅ Successfully copied React DevTools to:');
            console.log(`   ${TARGET_DIR}\n`);
            console.log('🎉 Setup complete! You can now run your NarraLeaf application.');
            console.log('   The React DevTools will be automatically loaded in development mode.\n');
        } catch (error) {
            console.error('❌ Failed to copy extension files:', error.message);
            showManualInstructions();
        }
    } else {
        console.log('❌ React DevTools not found in Chrome installation.\n');
        showManualInstructions();
    }
}

function showManualInstructions() {
    console.log('📋 Manual Setup Instructions:\n');
    console.log('1. Install React Developer Tools in Chrome:');
    console.log('   https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi\n');
    console.log('2. Find the extension installation directory:');
    
    const platform = os.platform();
    const paths = CHROME_PATHS[platform] || [];
    
    console.log(`   For ${platform}:`);
    for (const p of paths) {
        console.log(`   - ${p}`);
    }
    console.log('\n3. Copy the latest version folder contents to:');
    console.log(`   ${TARGET_DIR}\n`);
    console.log('4. Ensure the directory contains a valid manifest.json file.\n');
}

// Run the setup
if (require.main === module) {
    setupReactDevTools();
}

module.exports = { setupReactDevTools, findChromeExtension }; 