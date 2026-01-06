import React, { useEffect } from 'react';
import { useGame, usePreference, useRouter } from 'narraleaf-react';
// import {GameMetadata, requestMain, useGamePlayback} from 'narraleaf/renderer';
import { GameMetadata, requestMain, useApp } from 'narraleaf/renderer';

// Import your assets
import "./src/base.css";
import { start, story } from "./src/story";
// import { QuickMenu } from './src/components/QuickMenu';
import { GameDialog } from './src/components/Dialog';
import { DefaultMenu } from './src/components/Menu';
// import { createPreloadEntryPlugin } from './src/plugins';
// import {splashScreen} from './src/splashScreens';
import { DemoConfigProvider } from './src/components/DemoConfig';
// import { useRouter } from 'narraleaf-react';
import GameNotification from './src/components/Notifications';
// import { GamePreferences } from './pages/settings';

// Import test panel components
import { TestPanelProvider, GlobalTestPanel } from './src/components/testPanel';
import { createPreloadEntryPlugin } from './src/plugins';
import { GamePreferences } from './pages/home/settings';

const App = ({ children }: { children: React.ReactNode }) => {
    // Access the game instance by using the useGame hook
    const game = useGame();
    const router = useRouter();
    const app = useApp();
    // const [, setCps] = usePreference("cps");
    useEffect(() => {
        requestMain<void, GamePreferences>("getGamePreferences").then((preferences) => {
            game.preference.importPreferences(preferences.playerPreferences);
            game.configure({
                // Set the resolution
                width: 1280, // set the resolution width
                height: 720, // set the resolution height
                aspectRatio: 16 / 9, // set the aspect ratio
                dialogWidth: 1280,
                dialogHeight: 720,

                // Configure the game behavior
                ratioUpdateInterval: 0, // disable the ratio update interval
                screenshotQuality: 0.2,
                skipKey: ["Control"],

                // Customize the styles
                dialog: GameDialog,
                notification: GameNotification,
                menu: DefaultMenu,
                defaultTextColor: "white",
                defaultNametagColor: "#40a8c5",
                fontFamily: "ZhanKu",
                fontSize: 20,
                fontWeight: 500,

                // Debug mode
                app: {
                    logger: {
                        log: true,
                        warn: true,
                        error: true,
                        debug: true,
                        info: true,
                        trace: true,
                        verbose: true,
                    },
                },

                // animationPropagate: true,
            });
        });

        console.log(game, router, app);
    }, []);

    // useEffect(() => {
    //     // Preload font
    //     preloadFont('/static/font/AlimamaFangYuanTiVF-Thin.ttf');
    // }, []);

    // useEffect(() => {
    //     game.preference.setPreference("skipInterval", 0);
    //     requestMain<void, GamePreferences>("getGamePreferences").then((preferences) => {
    //         game.preference.importPreferences(preferences.playerPreferences);

    //         game.configure({
    //             // Set the resolution
    //             width: 1280, // set the resolution width
    //             height: 720, // set the resolution height
    //             aspectRatio: 16 / 9, // set the aspect ratio
    //             dialogWidth: 1280,
    //             dialogHeight: 720,

    //             // Configure the game behavior
    //             ratioUpdateInterval: 0, // disable the ratio update interval
    //             screenshotQuality: 0.2,

    //             // Customize the styles
    //             dialog: GameDialog,
    //             notification: GameNotification,
    //             menu: DefaultMenu,
    //             defaultTextColor: "white",
    //             defaultNametagColor: "white",

    //             // Debug mode
    //             app: {
    //                 logger: {
    //                     log: true,
    //                     warn: true,
    //                     error: true,
    //                     debug: true,
    //                     info: true,
    //                     trace: true,
    //                     verbose: true,
    //                 },
    //             }
    //         });

    //         console.log(game, router, app);
    //     });
    // }, []);

    useEffect(() => {
        const plugin = createPreloadEntryPlugin(start);
        game.use(plugin);
    }, []);

    return (
        <TestPanelProvider>
            <DemoConfigProvider>
                {children}

                <GlobalTestPanel />
            </DemoConfigProvider>
        </TestPanelProvider>
    );
};

export default App;
export const metadata: GameMetadata = {
    story,
};

