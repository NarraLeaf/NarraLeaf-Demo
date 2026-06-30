import { motion } from "motion/react";
import { HomePagesAnimation } from "../index";

export default function About() {
    return (
        <motion.div
            className="h-full w-full absolute"
            {...HomePagesAnimation}
        >
            <h1 className="text-2xl font-bold text-white mb-6">About</h1>

            <div className="space-y-6 text-white">
                <div>
                    <h2 className="text-xl font-semibold mb-2">NarraLeaf Demo</h2>
                    <p className="text-white/80">Version 0.2.0</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Development Team</h2>
                    <p className="text-white/80">NarraLeaf Project</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                    <p className="text-white/80">github.com/NarraLeaf</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">Copyright</h2>
                    <p className="text-white/80">© 2025 NarraLeaf. Published under the MPL-2.0 license.</p>
                </div>
            </div>
        </motion.div>
    );
}
