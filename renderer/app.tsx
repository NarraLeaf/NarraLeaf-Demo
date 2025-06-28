import React, {useEffect} from 'react';
import {useGame, usePreference, useRouter} from 'narraleaf-react';
// import {GameMetadata, requestMain, useGamePlayback} from 'narraleaf/client';
import {GameMetadata, useApp} from 'narraleaf/client';

// Import your assets
import "./src/base.css";
import {story} from "./src/story";
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

const App = ({children}: {children: React.ReactNode}) => {
    // Access the game instance by using the useGame hook
    const game = useGame();
    const router = useRouter();
    const app = useApp();
    // const [, setCps] = usePreference("cps");
    useEffect(() => {
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
            defaultNametagColor: "white",

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

    // useEffect(() => {
    //     const plugin = createPreloadEntryPlugin(start);
    //     game.use(plugin);
    // }, []);

    // hold F11 for 3 seconds to crash the game
    // useEffect(() => {
    //     const handleKeyDown = (e: KeyboardEvent) => {
    //         if (e.key === 'F11') {
    //             setTimeout(() => {
    //                 app.crash("闲着没事长按F11干嘛");
    //             }, 3000);
    //         }
    //     };
    //     window.addEventListener('keydown', handleKeyDown);
    //     return () => window.removeEventListener('keydown', handleKeyDown);
    // }, []);

    return (
        <TestPanelProvider>
            <DemoConfigProvider>
                {children}
                
                {/* Global Test Panel - Rendered at app level to avoid transform scaling issues */}
                <GlobalTestPanel />
            </DemoConfigProvider>
        </TestPanelProvider>
    );
};

// const Stage = () => {
//     const {isPlaying} = useGamePlayback();
//     if (!isPlaying) return null;

//     return (
//         <QuickMenu />
//     );
// };

export default App;
export const metadata: GameMetadata = {
    story,
    // splashScreen,
    // stage: (<Stage />),
    // backgroundImage: "/static/img/ui/bg/outside.jpg",
};

