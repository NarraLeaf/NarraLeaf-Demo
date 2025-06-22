import {AppConfig} from "narraleaf";
import path from "path";
import fs from "fs";

type WindowState = {
    mode: "fullscreen" | "windowed";
};

type GamePreferences = {
    windowMode: "fullscreen" | "windowed";
    playerPreferences: Record<string, any>;
};

// React Developer Tools extension directory
const REACT_DEVTOOLS_EXTENSION_DIR = 'extensions/react-devtools';

// Function to install React DevTools from local directory
async function installReactDevTools(window: any): Promise<void> {
    try {
        // Get the app directory
        const appDir = process.cwd();
        const extensionPath = path.join(appDir, REACT_DEVTOOLS_EXTENSION_DIR);
        
        // Check if extension directory exists
        if (!fs.existsSync(extensionPath)) {
            console.warn(`React DevTools extension directory not found: ${extensionPath}`);
            console.log('Please download React DevTools extension and place it in the extensions/react-devtools directory');
            return;
        }
        
        // Check if manifest.json exists
        const manifestPath = path.join(extensionPath, 'manifest.json');
        if (!fs.existsSync(manifestPath)) {
            console.warn(`React DevTools manifest.json not found: ${manifestPath}`);
            console.log('Please ensure the extension directory contains a valid manifest.json file');
            return;
        }
        
        // Install extension from local directory
        await window.installExtension(extensionPath);
        console.log('React Developer Tools installed from local directory:', extensionPath);
    } catch (error) {
        console.warn('Failed to install React Developer Tools:', error);
        console.log('Please ensure the extension directory is valid and contains the correct files');
    }
}

// Create a new app
const app = new AppConfig({
    forceSandbox: true
}).configWindows({
    appIcon: "main/assets/app-icon.ico"
}).create();

// When the app is ready, launch the app with a window
app.onReady(async () => {
    console.log(app.getEntryFile());
    // Launch the app with a window
    const window = await app.launchApp({
        options: {
            backgroundColor: "white",
            width: 1280,
            height: 720,
        }
    });
    window.setTitle("My NarraLeaf App");

    // Install React Developer Tools in development mode
    if (process.env.NODE_ENV === 'development' || !app.isPackaged()) {
        try {
            await installReactDevTools(window);
        } catch (error) {
            console.warn('Failed to install React Developer Tools:', error);
        }
    }

    // Close the app when the window is closed
    window.onClose(() => {
        app.quit();
    });

    window.onKeyUp("F12", () => {
        window.toggleDevTools();
    });

    const preferenceStore = app.createJsonStore<GamePreferences>("game_preferences");
    const initValue = await preferenceStore.read();
    if (initValue.windowMode === "fullscreen") {
        window.enterFullScreen();
    } else {
        window.exitFullScreen();
    }

    window.handleUserEvent<GamePreferences, void>("setGamePreferences", async (preferences) => {
        await preferenceStore.write(preferences);
    });
    window.handleUserEvent<void, GamePreferences>("getGamePreferences", async () => {
        return await preferenceStore.read();
    });
    
    window.handleUserEvent<void, WindowState>("getWindowState", async () => {
        return {
            mode: (await preferenceStore.read()).windowMode,
        };
    });
    window.handleUserEvent<WindowState, void>("setWindowState", async (state) => {
        if (state.mode === "fullscreen") {
            window.enterFullScreen();
        } else {
            window.exitFullScreen();
        }
    });
});
