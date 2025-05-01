import React from "react";
import { useRouter } from "narraleaf-react";
import Panel from "../src/components/Panel";
export default function About() {
    const router = useRouter();

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">关于</h1>
            
            <div className="space-y-6 text-white">
                <div>
                    <h2 className="text-xl font-semibold mb-2">NarraLeaf</h2>
                    <p className="text-white/80">版本 1.0.0</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">开发团队</h2>
                    <p className="text-white/80">NarraLeaf Team</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">联系方式</h2>
                    <p className="text-white/80">support@narraleaf.com</p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">版权信息</h2>
                    <p className="text-white/80">© 2024 NarraLeaf. All rights reserved.</p>
                </div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.push("home")}
                className="mt-8 w-full px-6 py-4 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-lg shadow-lg 
                         transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                         hover:shadow-xl active:translate-y-0"
            >
                返回
            </button>
        </Panel>
    );
}

export {config} from "./home"; 