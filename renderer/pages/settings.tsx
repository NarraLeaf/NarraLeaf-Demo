import { usePreference, useRouter, useGame } from "narraleaf-react";
import { requestMain } from "narraleaf/client";
import React, { useEffect, useState } from "react";
import { useDemoConfig } from "../src/components/DemoConfig";
import Panel from "../src/components/Panel";
import { Checkbox } from "../src/components/lib/Checkbox";
import { Slider } from "../src/components/lib/Slider";

interface SettingItemProps {
    label: string;
    children: React.ReactNode;
}

type WindowState = {
    mode: "fullscreen" | "windowed";
};

export type GamePreferences = {
    windowMode: "fullscreen" | "windowed";
    playerPreferences: Record<string, any>;
};

const SettingItem: React.FC<SettingItemProps> = ({ label, children }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/20">
        <span className="text-white text-lg font-medium">{label}</span>
        {children}
    </div>
);

export default function Settings() {
    const router = useRouter();
    const game = useGame();
    const [cps, setCps] = usePreference("cps");
    const [fullscreen, setFullscreen] = useState(false);
    const [soundVolume, setSoundVolume] = usePreference("soundVolume");
    const [globalVolume, setGlobalVolume] = usePreference("globalVolume");
    const [voiceVolume, setVoiceVolume] = usePreference("voiceVolume");
    const [bgmVolume, setBgmVolume] = usePreference("bgmVolume");
    const [visualEffect, setVisualEffect] = useDemoConfig("useVisualEffect");

    useEffect(() => {
        requestMain<void, WindowState>("getWindowState").then((state) => {
            setFullscreen(state.mode === "fullscreen");
        });
    }, []);

    const handleBack = () => {
        router.back();
        requestMain<GamePreferences, void>("setGamePreferences", {
            windowMode: fullscreen ? "fullscreen" : "windowed",
            playerPreferences: game.preference.exportPreferences(),
        });
    };

    return (
        <Panel>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">设置</h1>
                    <button 
                        onClick={handleBack}
                        className="px-4 py-2 text-white border border-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
                    >
                        返回
                    </button>
                </div>
            
                <div className="space-y-2">
                    <SettingItem label="文字速度">
                        <Slider
                            value={cps}
                            onChange={(e) => setCps(Number(e.target.value))}
                            min={1}
                            max={100}
                            unit=""
                        />
                    </SettingItem>

                    <SettingItem label="全局音量">
                        <Slider
                            value={globalVolume}
                            onChange={(e) => setGlobalVolume(Number(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            isPercentage={true}
                        />
                    </SettingItem>

                    <SettingItem label="音效音量">
                        <Slider
                            value={soundVolume}
                            onChange={(e) => setSoundVolume(Number(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            isPercentage={true}
                        />
                    </SettingItem>

                    <SettingItem label="BGM音量">
                        <Slider
                            value={bgmVolume}
                            onChange={(e) => setBgmVolume(Number(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            isPercentage={true}
                        />
                    </SettingItem>

                    <SettingItem label="语音音量">
                        <Slider
                            value={voiceVolume}
                            onChange={(e) => setVoiceVolume(Number(e.target.value))}
                            min={0}
                            max={1}
                            step={0.01}
                            isPercentage={true}
                        />
                    </SettingItem>

                    <SettingItem label="全屏">
                        <Checkbox
                            checked={fullscreen}
                            onChange={(e) => {
                                requestMain<WindowState, void>("setWindowState", {
                                    mode: e.target.checked ? "fullscreen" : "windowed",
                                });
                                setFullscreen(e.target.checked);
                            }}
                        />
                    </SettingItem>

                    <SettingItem label="视觉效果">
                        <Checkbox
                            checked={visualEffect}
                            onChange={(e) => setVisualEffect(e.target.checked)}
                        />
                    </SettingItem>
                </div>
            </div>
        </Panel>
    );
}

export { config } from "./home";
