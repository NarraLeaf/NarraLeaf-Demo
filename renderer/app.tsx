import React, {useEffect} from 'react';
import {useGame} from 'narraleaf-react';
import {Meta, SplashScreenDefinition} from 'narraleaf/client';

// Import your assets
import "./src/base.css";
import {story} from "./src/story";

const App = ({children}: {children: React.ReactNode}) => {
    // Access the game instance by using the useGame hook
    const game = useGame();

    useEffect(() => {
        game.configure({
            width: 1920, // set the resolution width
            height: 1080, // set the resolution height
            aspectRatio: 16 / 9, // set the aspect ratio

            ratioUpdateInterval: 0, // disable the ratio update interval
            cps: 50, // set the dialog characters per second to 10
            /* Add your custom configurations here */
        });
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
            duration: 1,
            ease: "easeIn"
        }
    },
    duration: 300,
    splashScreen:(
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen bg-gray-500 text-white">
            <div className="transform transition-all">
                {/* <p className="text-3xl text-white font-medium tracking-wide">Created with NarraLeaf</p> */}
                <h1 className="text-3xl font-bold underline">
                Hello world!
                </h1>
            </div>
        </div>
    )
}];

export default App;
export const meta: Meta = {
    story,
    splashScreen
};

