import React, { useEffect, useState } from "react";
import { useGame, usePreference, useRouter } from "narraleaf-react";
import { useApp, requestMain, useGamePlayback } from "narraleaf/client";
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
    <div className="flex items-center justify-between py-4 border-b border-white/20">
        <span className="text-white text-lg font-medium">{label}</span>
        {children}
    </div>
);

// Custom slider component with value display
const CustomSlider: React.FC<{
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    isPercentage?: boolean;
}> = ({ value, onChange, min, max, step = 1, unit = "", isPercentage = false }) => (
    <div className="flex items-center gap-4">
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="w-16 text-right">
            <span className="text-white/80 text-sm">
                {isPercentage ? `${Math.round(value * 100)}%` : `${value}${unit}`}
            </span>
        </div>
    </div>
);

// Custom checkbox component
const CustomCheckbox: React.FC<{
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
        />
        <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
);

export default function Settings() {
    const router = useRouter();
    const [cps, setCps] = usePreference("cps");
    const [fullscreen, setFullscreen] = useState(false);
    const [soundVolume, setSoundVolume] = usePreference("soundVolume");
    const [globalVolume, setGlobalVolume] = usePreference("globalVolume");
    const [voiceVolume, setVoiceVolume] = usePreference("voiceVolume");
    const [bgmVolume, setBgmVolume] = usePreference("bgmVolume");

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

    function handleSoundVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSoundVolume(Number(e.target.value));
    }

    function handleGlobalVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setGlobalVolume(Number(e.target.value));
    }

    function handleBgmVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setBgmVolume(Number(e.target.value));
    }

    function handleVoiceVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
        setVoiceVolume(Number(e.target.value));
    }

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-8">设置</h1>
            
            <div className="space-y-2">
                <SettingItem label="文字速度">
                    <CustomSlider
                        value={cps}
                        onChange={handleTextSpeedChange}
                        min={0}
                        max={100}
                        unit="字/秒"
                    />
                </SettingItem>

                <SettingItem label="全局音量">
                    <CustomSlider
                        value={globalVolume}
                        onChange={handleGlobalVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        isPercentage={true}
                    />
                </SettingItem>

                <SettingItem label="音效音量">
                    <CustomSlider
                        value={soundVolume}
                        onChange={handleSoundVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        isPercentage={true}
                    />
                </SettingItem>

                <SettingItem label="BGM音量">
                    <CustomSlider
                        value={bgmVolume}
                        onChange={handleBgmVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        isPercentage={true}
                    />
                </SettingItem>

                <SettingItem label="语音音量">
                    <CustomSlider
                        value={voiceVolume}
                        onChange={handleVoiceVolumeChange}
                        min={0}
                        max={1}
                        step={0.01}
                        isPercentage={true}
                    />
                </SettingItem>

                <SettingItem label="全屏">
                    <CustomCheckbox
                        checked={fullscreen}
                        onChange={handleFullscreenChange}
                    />
                </SettingItem>
            </div>

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