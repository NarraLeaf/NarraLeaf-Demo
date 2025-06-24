import { usePreference, useRouter, useGame } from "narraleaf-react";
import React, { useEffect, useState } from "react";
import { motion, usePresence } from "motion/react";
import { useDemoConfig } from "../../../src/components/DemoConfig";
import { Checkbox } from "../../../src/components/lib/Checkbox";
import { Slider } from "../../../src/components/lib/Slider";

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
    const [skipDelay, setSkipDelay] = usePreference("skipDelay");
    const [skipInterval, setSkipInterval] = usePreference("skipInterval");

    useEffect(() => {
        window.NarraLeaf.app.requestMain<void, WindowState>("getWindowState").then((response) => {
            if (response.success) {
                setFullscreen(response.data.mode === "fullscreen");
            }
        });
    }, []);

    const handleBack = () => {
        router.back();
        window.NarraLeaf.app.requestMain<GamePreferences, void>("setGamePreferences", {
            windowMode: fullscreen ? "fullscreen" : "windowed",
            playerPreferences: game.preference.exportPreferences(),
        });
    };

    return (
        <motion.div
            key="settings-page"
            className="h-full w-full absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">设置</h1>
                </div>

                <div className="space-y-2">
                    <SettingItem label="文字速度">
                        <Slider
                            value={cps}
                            onChange={(e) => setCps(Number(e.target.value))}
                            min={1}
                            max={100}
                            unit="cps"
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

                    <SettingItem label="跳过延迟">
                        <Slider
                            value={skipDelay}
                            onChange={(e) => setSkipDelay(Number(e.target.value))}
                            min={0}
                            max={1000}
                            step={10}
                            unit="ms"
                        />
                    </SettingItem>

                    <SettingItem label="跳过间隔">
                        <Slider
                            value={skipInterval}
                            onChange={(e) => setSkipInterval(Number(e.target.value))}
                            min={0}
                            max={1000}
                            step={10}
                            unit="ms"
                        />
                    </SettingItem>

                    <SettingItem label="全屏">
                        <Checkbox
                            checked={fullscreen}
                            onChange={(e) => {
                                window.NarraLeaf.app.requestMain<WindowState, void>("setWindowState", {
                                    mode: e.target.checked ? "fullscreen" : "windowed",
                                });
                                setFullscreen(e.target.checked);
                            }}
                        />
                    </SettingItem>

                    {/* <SettingItem label="视觉效果">
                        <Checkbox
                            checked={visualEffect}
                            onChange={(e) => setVisualEffect(e.target.checked)}
                        />
                    </SettingItem> */}
                </div>
            </div>
        </motion.div>
    );
} 