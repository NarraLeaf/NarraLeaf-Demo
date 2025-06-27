import React from "react";
import { motion } from "motion/react";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <motion.div
            className="w-full h-full absolute pointer-events-none"
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
}

