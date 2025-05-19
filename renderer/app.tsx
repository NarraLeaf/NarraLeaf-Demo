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

const App = ({children}: {children: React.ReactNode}) => {
    // Access the game instance by using the useGame hook
    const game = useGame();
    const router = useRouter();
    const app = useApp();
    const [, setCps] = usePreference("cps");

    useEffect(() => {
        game.configure({
            // Set the resolution
            width: 1280, // set the resolution width
            height: 720, // set the resolution height
            aspectRatio: 16 / 9, // set the aspect ratio

            // Configure the game behavior
            ratioUpdateInterval: 0, // disable the ratio update interval
            skipInterval: 10, // set the skip interval to 10ms

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
        setCps(30);

        console.log(game, router, app);
    }, []);

    useEffect(() => {
        requestMain<void, GamePreferences>("getGamePreferences").then((preferences) => {
            game.preference.importPreferences(preferences.playerPreferences);
        });
    }, []);

    useEffect(() => {
        const plugin = createPreloadEntryPlugin(start);
        game.use(plugin);
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
    splashScreen,
    stage: (<Stage />),
    backgroundImage: "/static/img/ui/bg/outside.jpg",
};

