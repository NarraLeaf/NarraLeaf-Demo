import { SplashScreenDefinition } from "narraleaf/client";
import { NarraLeafLogo } from "./components/NarraLeafLogo";

export const splashScreen: SplashScreenDefinition[] = [{
    initial: {opacity: 0, scale: 0.95},
    animate: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.5,
            ease: "easeInOut"
        }
    },
    duration: 1,
    splashScreen:(
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen text-black overflow-hidden">
            <div className="transform transition-all">
                <NarraLeafLogo />
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
                    className="w-auto h-auto max-w-[400px]"
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
        <div className="flex justify-center items-center w-full h-full min-w-screen min-h-screen text-black AlimamaFangYuanTiVF-Thin">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl font-bold">NarraLeaf Demo</h1>
                <p className="text-xl text-gray-500">
                    该项目仅用于展示NarraLeaf引擎基础特性，无法代表最终成品
                </p>
                <div className="mt-4 text-sm text-gray-500 text-center">
                    <p>NarraLeaf v0.0.8</p>
                    <p>© 2025 NarraLeaf Project</p>
                </div>
            </div>
        </div>
    )
}];
