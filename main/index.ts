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
        backgroundColor: "black",
        width: 1920 * 0.7,
        height: 1080 * 0.7
    });
    window.setTitle("My NarraLeaf App");

    // Close the app when the window is closed
    window.onClose(() => {
        app.quit();
    });
});
