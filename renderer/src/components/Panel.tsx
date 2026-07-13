import clsx from "clsx";
import { useGamePlayback } from "narraleaf/renderer";
import React, { useEffect } from "react";
import { useBackdrop } from "../hooks/useBackdrop";
import { useRouter } from "narraleaf-react";
import { AnimatePresence, motion } from "motion/react";

interface PanelProps {
    children: React.ReactNode;
    route?: boolean;
    className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = "", route = true }) => {
    const {isPlaying} = useGamePlayback();
    const backdrop = useBackdrop();
    const router = useRouter();

    useEffect(() => {
        if (!route) {
            return;
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                router.back();
                cleanUp();
            }
        };
        const cleanUp = () => {
            window.removeEventListener("keydown", handleKeyDown);
        };

        window.addEventListener("keydown", handleKeyDown);
        return cleanUp;
    }, [router, route]);

    return (
        <AnimatePresence>
            <motion.div
                className={clsx(`absolute top-0 h-full bg-black/50 shadow-2xl ${className} p-4`, 
                    isPlaying ? `w-full ${backdrop}` : "w-1/3 left-8",
            )}
            style={{
                willChange: 'backdrop-filter',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
            }}
        >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default Panel;



