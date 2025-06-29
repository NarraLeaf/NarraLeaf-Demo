import { useRouter } from "narraleaf-react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimate } from "motion/react";
import React, { useEffect, useState } from "react";
import { splashScreen as splashScreens } from "../../src/splashScreens";

// A page component that sequentially plays predefined splash screens and then navigates to /home
export default function SplashScreenPage() {
    const router = useRouter();
    const [scope, animate] = useAnimate();

    // Index of current splash screen
    const [index, setIndex] = useState(0);

    useEffect(() => {
        // If no splash screens defined, jump directly
        if (!splashScreens || splashScreens.length === 0) {
            router.navigate("/home");
            return;
        }

        const playSequence = async () => {
            for (let i = 0; i < splashScreens.length; i++) {
                setIndex(i);
                const current = splashScreens[i];
                if (!current) continue;

                const { initial, animate: anim, exit, duration } = current;
                const hold = duration ?? 1;

                const { transition: animTransition, ...animKeyframes } = anim;
                const { transition: exitTransition, ...exitKeyframes } = exit || {};

                // Reset to initial and play enter animation
                if (scope.current) {
                    // Set initial properties instantly, then play enter animation
                    await animate(scope.current, initial, { duration: 0 });
                    await animate(scope.current, animKeyframes, animTransition as any);
                }

                // Hold for the specified duration
                await new Promise(resolve => setTimeout(resolve, hold * 1000));

                // Play exit animation before next screen or exit
                if (exit) {
                    await animate(scope.current, exitKeyframes, exitTransition as any);
                }
            }
            router.navigate("/home");
        };

        playSequence();
    }, [animate, router, scope]);


    const currentSplash = splashScreens[index];
    // Safeguard: if currentSplash is undefined during the initial render before effect runs
    if (!currentSplash) {
        return null;
    }

    return (
        <motion.div
            ref={scope}
            layout
            className="absolute inset-0 flex items-center justify-center w-full h-full"
        >
            {currentSplash.splashScreen}
        </motion.div>
    );
}
