import clsx from "clsx";
import { useGamePlayback } from "narraleaf/client";
import React from "react";

interface PanelProps {
    children: React.ReactNode;
    className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = "" }) => {
    const {isPlaying} = useGamePlayback();

    return (
        <div className={clsx(`absolute left-8 top-0 h-full bg-black/50 shadow-2xl ${className} p-4`, 
            isPlaying ? "w-full backdrop-blur-sm" : "w-1/3",
        )}>
            {children}
        </div>
    );
};

export default Panel;



