import React, { useState } from "react";
import { useRouter } from "narraleaf-react";
import { useApp } from "narraleaf/client";
import Panel from "../src/components/Panel";

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/20">
        <span className="text-white text-lg">{label}</span>
        {children}
    </div>
);

export default function Settings() {
    const { app } = useApp();
    const router = useRouter();
    const [volume, setVolume] = useState(80);
    const [textSpeed, setTextSpeed] = useState(50);
    const [fullscreen, setFullscreen] = useState(false);

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">设置</h1>
            
            <div className="space-y-4">
                <SettingItem label="音量">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(Number(e.target.value))}
                        className="w-32"
                    />
                </SettingItem>

                <SettingItem label="文字速度">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={textSpeed}
                        onChange={(e) => setTextSpeed(Number(e.target.value))}
                        className="w-32"
                    />
                </SettingItem>

                <SettingItem label="全屏">
                    <input
                        type="checkbox"
                        checked={fullscreen}
                        onChange={(e) => setFullscreen(e.target.checked)}
                        className="w-5 h-5"
                    />
                </SettingItem>
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