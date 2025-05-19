import {AppConfig} from "narraleaf";

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
        backgroundColor: "white",
        width: 1280,
        height: 720,
        devTools: true,
    });
    window.setTitle("My NarraLeaf App");

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

    window.onEvent<GamePreferences, void>("setGamePreferences", async (preferences) => {
        await preferenceStore.write(preferences);
    });
    window.onEvent<void, GamePreferences>("getGamePreferences", async () => {
        return await preferenceStore.read();
    });
    window.onEvent<void, WindowState>("getWindowState", async () => {
        return {
            mode: (await preferenceStore.read()).windowMode,
        };
    });
    window.onEvent<WindowState, void>("setWindowState", async (state) => {
        if (state.mode === "fullscreen") {
            window.enterFullScreen();
        } else {
            window.exitFullScreen();
        }
    });
});
