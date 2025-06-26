import { useRouter } from "narraleaf-react";
import { AnimatePresence, motion } from "motion/react";
import { useContext, useEffect, useState } from "react";
import { PresenceContext } from "motion/react";
import { PresenceContext as PresenceContext2 } from "narraleaf-react";
import { HomePagesAnimation } from "../index";

export default function About() {
    const router = useRouter();
    const r = useContext(PresenceContext);
    const r2 = useContext(PresenceContext2);
    console.log(r);
    console.log("Is Equal", PresenceContext === PresenceContext2);
    console.log("r2", r2);
    return (
        <motion.div
            className="h-full w-full absolute"
            {...HomePagesAnimation}
        >
            <h1 className="text-2xl font-bold text-white mb-6">关于</h1>

            <div className="space-y-6 text-white">
                <div>
                    <h2 className="text-xl font-semibold mb-2">NarraLeaf Demo</h2>
                    <p className="text-white/80">版本 0.2.0</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">开发团队</h2>
                    <p className="text-white/80">NarraLeaf Project</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">联系方式</h2>
                    <p className="text-white/80">github.com/NarraLeaf</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">版权信息</h2>
                    <p className="text-white/80">© 2025 NarraLeaf. Published under the MPL-2.0 license.</p>
                </div>
            </div>
        </motion.div>
    );
}