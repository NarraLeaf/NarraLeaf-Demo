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

// Create a new app
const app = new AppConfig({
    forceSandbox: true
}).configWindows({
    appIcon: "main/assets/app-icon.ico"
}).create();

// When the app is ready, launch the app with a window
app.onReady(async () => {
    // Launch the app with a window
    const window = await app.launchApp({
        options: {
            backgroundColor: "white",
            width: 1280,
            height: 720,
        }
    });
    window.setTitle("My NarraLeaf App");

    // Close the app when the window is closed
    window.onClose(() => { app.quit(); });


    // Create a JSON store for game preferences
    const preferenceStore = app.createJsonStore<GamePreferences>("game_preferences");
    const initValue = await preferenceStore.read();
    if (initValue.windowMode === "fullscreen") {
        window.enterFullScreen();
    } else {
        window.exitFullScreen();
    }

    // Handle user events for setting and getting game preferences and window state
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
