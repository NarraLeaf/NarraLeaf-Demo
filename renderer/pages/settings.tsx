import React, { useEffect, useState } from "react";
import { useGame, usePreference, useRouter } from "narraleaf-react";
import { useApp, requestMain } from "narraleaf/client";
import Panel from "../src/components/Panel";
import { MenuButton } from "./home";

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

type WindowState = {
    mode: "fullscreen" | "windowed";
};

const SettingItem: React.FC<SettingItemProps> = ({ label, children }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/20">
        <span className="text-white text-lg">{label}</span>
        {children}
    </div>
);

export default function Settings() {
    const router = useRouter();
    const [volume, setVolume] = useState(80);
    const [cps, setCps] = usePreference("cps");
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        requestMain<void, WindowState>("getWindowState").then((state) => {
            setFullscreen(state.mode === "fullscreen");
        });
    }, []);

    function handleTextSpeedChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCps(Number(e.target.value));
    }

    function handleFullscreenChange(e: React.ChangeEvent<HTMLInputElement>) {
        requestMain<WindowState, void>("setWindowState", {
            mode: e.target.checked ? "fullscreen" : "windowed",
        });
        setFullscreen(e.target.checked);
    }

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">设置</h1>
            
            <div className="space-y-4">
                <SettingItem label="音量（摆设）">
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
                        value={cps}
                        onChange={handleTextSpeedChange}
                        className="w-32"
                    />
                </SettingItem>

                <SettingItem label="全屏">
                    <input
                        type="checkbox"
                        checked={fullscreen}
                        onChange={handleFullscreenChange}
                        className="w-5 h-5"
                    />
                </SettingItem>
            </div>

            {/* Back Button */}
            <MenuButton
                onClick={() => router.push("home")}
                className="mt-8"
            >
                返回
            </MenuButton>
        </Panel>
    );
}

export {config} from "./home"; 