import React, {useEffect} from 'react';
import {useGame} from 'narraleaf-react';
import {GameMetadata, SplashScreenDefinition, useApp, useGamePlayback} from 'narraleaf/client';

// Import your assets
import "./src/base.css";
import {story} from "./src/story";
import { QuickMenu } from './src/components/QuickMenu';
import { GameDialog } from './src/components/Dialog';
import { DefaultMenu } from './src/components/Menu';

const App = ({children}: {children: React.ReactNode}) => {
    // Access the game instance by using the useGame hook
    const game = useGame();
    const app = useApp();

    useEffect(() => {
        game.configure({
            // Set the resolution
            width: 1280, // set the resolution width
            height: 720, // set the resolution height
            aspectRatio: 16 / 9, // set the aspect ratio

            // Configure the game behavior
            ratioUpdateInterval: 0, // disable the ratio update interval
            cps: 50, // set the dialog characters per second to 10
            skipInterval: 10, // set the skip interval to 10ms

            // Customize the styles
            dialog: GameDialog,
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
        console.log(game);
    }, []);

    return (
        <>
            {children}
        </>
    );
};

const splashScreen: SplashScreenDefinition[] = [{
    initial: {opacity: 0, scale: 0.95},
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    },
    duration: 1.5,
    splashScreen:(
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen text-white">
            <div className="transform transition-all">
                <img 
                    src="/static/img/ui/logo-text-blue.png" 
                    alt="Logo" 
                    className="w-auto h-auto max-w-[300px]"
                />
            </div>
        </div>
    )
}, {
    initial: {opacity: 0},
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    },
    duration: 1.5,
    splashScreen:(
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen text-black">
            <div className="transform transition-all">
                <img 
                    src="/static/img/ui/mewbaka-logo.png" 
                    alt="Logo" 
                    className="w-auto h-auto max-w-[400px] invert"
                />
            </div>
        </div>
    )
}, {
    initial: {opacity: 0},
    animate: {
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.5,
            ease: "easeIn"
        }
    },
    duration: 1.5,
    splashScreen:(
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen text-black">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">NarraLeaf Demo</h1>
                <p className="text-xl text-gray-500">该项目仅用于展示NarraLeaf引擎基础特性，无法代表最终成品</p>
                <div className="mt-4 text-sm text-gray-500 text-center">
                    <p>NarraLeaf v0.0.6</p>
                    <p>© 2025 NarraLeaf Project</p>
                </div>
            </div>
        </div>
    )
}];

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
    // splashScreen
    stage: (<Stage />),
    backgroundImage: "/static/img/ui/bg/outside.jpg",
};

