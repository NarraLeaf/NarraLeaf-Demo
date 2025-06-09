import React, {useEffect} from 'react';
import {useGame, usePreference} from 'narraleaf-react';
import {GameMetadata, requestMain, useApp, useGamePlayback} from 'narraleaf/client';

// Import your assets
import "./src/base.css";
import {story, start} from "./src/story";
import { QuickMenu } from './src/components/QuickMenu';
import { GameDialog } from './src/components/Dialog';
import { DefaultMenu } from './src/components/Menu';
import { createPreloadEntryPlugin } from './src/plugins';
import {splashScreen} from './src/splashScreens';
import { DemoConfigProvider } from './src/components/DemoConfig';
import { useRouter } from 'narraleaf-react';
import GameNotification from './src/components/Notifications';
import { GamePreferences } from './pages/settings';

// Add font preload function
const preloadFont = (fontUrl: string) => {
    const font = new FontFace('AlimamaFangYuanTiVF-Thin', `url(${fontUrl})`);
    return font.load().then(() => {
        document.fonts.add(font);
        console.log('Font loaded successfully');
    }).catch(err => {
        console.error('Font loading failed:', err);
    });
};

const App = ({children}: {children: React.ReactNode}) => {
    // Access the game instance by using the useGame hook
    const game = useGame();
    const router = useRouter();
    const app = useApp();
    const [, setCps] = usePreference("cps");

    useEffect(() => {
        // Preload font
        preloadFont('/static/font/AlimamaFangYuanTiVF-Thin.ttf');
    }, []);

    useEffect(() => {
        requestMain<void, GamePreferences>("getGamePreferences").then((preferences) => {
            game.preference.importPreferences(preferences.playerPreferences);

            game.configure({
                // Set the resolution
                width: 1280, // set the resolution width
                height: 720, // set the resolution height
                aspectRatio: 16 / 9, // set the aspect ratio
                dialogWidth: 1920,
                dialogHeight: 1080,
    
                // Configure the game behavior
                ratioUpdateInterval: 0, // disable the ratio update interval
                skipInterval: 10, // set the skip interval to 10ms
                screenshotQuality: 0.2,
    
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
                }
            });
    
            console.log(game, router, app);
        });
    }, []);

    useEffect(() => {
        const plugin = createPreloadEntryPlugin(start);
        game.use(plugin);
    }, []);

    // hold F11 for 3 seconds to crash the game
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'F11') {
                setTimeout(() => {
                    app.crash("闲着没事长按F11干嘛");
                }, 3000);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <DemoConfigProvider>
                {children}
            </DemoConfigProvider>
        </>
    );
};



const Stage = () => {
    const {isPlaying} = useGamePlayback();
    if (!isPlaying) return null;

    return (
        <QuickMenu />
    );
};

export default App;
export const metadata: GameMetadata = {
    story,
    // splashScreen,
    stage: (<Stage />),
    backgroundImage: "/static/img/ui/bg/outside.jpg",
};

