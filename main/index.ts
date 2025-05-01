import {AppConfig} from "narraleaf";

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
});
