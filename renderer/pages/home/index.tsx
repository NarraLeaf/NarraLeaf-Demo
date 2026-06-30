import { motion, Variants } from "motion/react";
import type { SavedGameMeta } from "narraleaf/renderer";
import { SaveType, useApp, useSavedGames } from "narraleaf/renderer";
import React from "react";
import clsx from "clsx";

// Menu Button Component
interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children, className }) => (
    <button
        onClick={onClick}
        className={clsx(`w-full px-8 py-5 bg-gradient-to-r from-primary/90 to-primary/80 
                 hover:from-primary hover:to-primary/90 text-white rounded-xl shadow-lg 
                 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                 hover:shadow-xl active:translate-y-0 border border-white/10
                 backdrop-blur-sm`, className)}
    >
        {children}
    </button>
);

export default function HomePage() {
    const app = useApp();
    const { results } = useSavedGames();

    function handleContinue() {
        if (!results) {
            return;
        }

        const latestSave = (results as SavedGameMeta[])
            .filter(save => save.type === SaveType.Save)
            .sort((a, b) => b.updated - a.updated)[0];

        if (!latestSave) {
            return;
        }

        console.log("Loading save", latestSave);
        app.loadGame(latestSave.id);
    }

    return null;
}

export const HomePagesAnimation: Variants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: 20, transition: { duration: 0.2, ease: "easeIn" } }
};
