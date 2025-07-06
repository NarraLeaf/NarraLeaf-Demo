import { usePreference, useRouter, useGame, useKeyBinding, KeyBindingType, KeyBindingValue } from "narraleaf-react";
import React, { useEffect, useState, useRef } from "react";
import { motion, Variants, AnimatePresence } from "motion/react";
import { useDemoConfig } from "../../../src/components/DemoConfig";
import { Checkbox } from "../../../src/components/lib/Checkbox";
import { Slider } from "../../../src/components/lib/Slider";
import { KeyBindingInput } from "../../../src/components/lib/KeyBindingInput";
import ScrollableContainer from "../../../src/components/lib/ScrollableContainer";
import { HomePagesAnimation } from "../index";

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

type TabId = "audio" | "text" | "display";

interface Tab {
    id: TabId;
    label: string;
}

const tabs: Tab[] = [
    { id: "text", label: "文字" },
    { id: "display", label: "显示" },
    { id: "audio", label: "音频" },
];

const SettingItem: React.FC<SettingItemProps> = ({ label, children }) => (
    <div className="flex items-center justify-between py-6 border-b border-white/20 last:border-b-0">
        <span className="text-white text-lg font-medium">{label}</span>
        <div className="flex-shrink-0">
            {children}
        </div>
    </div>
);

// 音频设置内容 - 提取到组件外部
const AudioSettings: React.FC<{
    globalVolume: number;
    setGlobalVolume: (value: number) => void;
    soundVolume: number;
    setSoundVolume: (value: number) => void;
    voiceVolume: number;
    setVoiceVolume: (value: number) => void;
    bgmVolume: number;
    setBgmVolume: (value: number) => void;
}> = ({ globalVolume, setGlobalVolume, soundVolume, setSoundVolume, voiceVolume, setVoiceVolume, bgmVolume, setBgmVolume }) => (
    <div className="space-y-4" style={{ minHeight: '200px' }}>
        <SettingItem label="全局音量">
            <Slider
                value={globalVolume || 0.5}
                onChange={(e) => setGlobalVolume(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
                isPercentage={true}
            />
        </SettingItem>

        <SettingItem label="音效音量">
            <Slider
                value={soundVolume || 0.5}
                onChange={(e) => setSoundVolume(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
                isPercentage={true}
            />
        </SettingItem>

        <SettingItem label="语音音量">
            <Slider
                value={voiceVolume || 0.5}
                onChange={(e) => setVoiceVolume(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
                isPercentage={true}
            />
        </SettingItem>

        <SettingItem label="BGM音量">
            <Slider
                value={bgmVolume || 0.5}
                onChange={(e) => setBgmVolume(Number(e.target.value))}
                min={0}
                max={1}
                step={0.01}
                isPercentage={true}
            />
        </SettingItem>
    </div>
);

// 文字设置内容 - 提取到组件外部
const TextSettings: React.FC<{
    cps: number;
    setCps: (value: number) => void;
    skipDelay: number;
    setSkipDelay: (value: number) => void;
    skipInterval: number;
    setSkipInterval: (value: number) => void;
}> = ({ cps, setCps, skipDelay, setSkipDelay, skipInterval, setSkipInterval }) => (
    <div className="space-y-4" style={{ minHeight: '200px' }}>
        <SettingItem label="文字速度">
            <Slider
                value={cps || 30}
                onChange={(e) => setCps(Number(e.target.value))}
                min={1}
                max={100}
                unit="cps"
            />
        </SettingItem>

        <SettingItem label="跳过延迟">
            <Slider
                value={skipDelay || 100}
                onChange={(e) => setSkipDelay(Number(e.target.value))}
                min={0}
                max={1000}
                step={10}
                unit="ms"
            />
        </SettingItem>

        <SettingItem label="跳过间隔">
            <Slider
                value={skipInterval || 200}
                onChange={(e) => setSkipInterval(Number(e.target.value))}
                min={0}
                max={1000}
                step={10}
                unit="ms"
            />
        </SettingItem>
    </div>
);

// 显示设置内容 - 提取到组件外部
const DisplaySettings: React.FC<{
    fullscreen: boolean;
    setFullscreen: (value: boolean) => void;
    visualEffect: boolean;
    setVisualEffect: (value: boolean) => void;
    skipKeyBinding: KeyBindingValue;
    setSkipKeyBinding: (value: KeyBindingValue) => void;
}> = ({ fullscreen, setFullscreen, visualEffect, setVisualEffect, skipKeyBinding, setSkipKeyBinding }) => (
    <div className="space-y-4" style={{ minHeight: '200px' }}>
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

        <SettingItem label="视觉效果">
            <Checkbox
                checked={visualEffect}
                onChange={(e) => setVisualEffect(e.target.checked)}
            />
        </SettingItem>

        <SettingItem label="跳过键">
            <KeyBindingInput
                value={skipKeyBinding}
                onChange={setSkipKeyBinding}
            />
        </SettingItem>
    </div>
);

export default function Settings() {
    const router = useRouter();
    const game = useGame();

    // 音频设置
    const [globalVolume, setGlobalVolume] = usePreference("globalVolume");
    const [soundVolume, setSoundVolume] = usePreference("soundVolume");
    const [voiceVolume, setVoiceVolume] = usePreference("voiceVolume");
    const [bgmVolume, setBgmVolume] = usePreference("bgmVolume");

    // 文字设置
    const [cps, setCps] = usePreference("cps");
    const [skipDelay, setSkipDelay] = usePreference("skipDelay");
    const [skipInterval, setSkipInterval] = usePreference("skipInterval");

    // 显示设置
    const [fullscreen, setFullscreen] = useState(false);
    const [visualEffect, setVisualEffect] = useDemoConfig("useVisualEffect");
    const [skipKeyBinding, setSkipKeyBinding] = useKeyBinding(KeyBindingType.skipAction);

    // Tab状态 - 使用数组中的第一个tab作为默认值
    const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);
    const [previousTab, setPreviousTab] = useState<TabId>(tabs[0].id);
    // 使用ref来立即存储动画方向，避免状态更新时序问题
    const animationDirectionRef = useRef<"left" | "right">("right");

    // Tab栏引用，用于计算白线位置
    const tabRefs = React.useRef<Record<TabId, HTMLButtonElement | null>>({
        audio: null,
        text: null,
        display: null
    });
    const tabContainerRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        window.NarraLeaf.app.requestMain<void, WindowState>("getWindowState").then((response) => {
            if (response.success) {
                setFullscreen(response.data.mode === "fullscreen");
            }
        });
    }, []);

    // Persist preferences whenever related values change.
    // This effect runs *after* React has committed the state update, ensuring we write the latest values.
    useEffect(() => {
        const preferences: GamePreferences = {
            windowMode: fullscreen ? "fullscreen" : "windowed",
            playerPreferences: {
                cps,
                skipDelay,
                skipInterval,
                globalVolume,
                soundVolume,
                voiceVolume,
                bgmVolume,
            },
        };

        // Debounce writes to avoid persisting on every small change.
        const debounceTimer = setTimeout(() => {
            window.NarraLeaf.app.requestMain<GamePreferences, void>("setGamePreferences", preferences);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [
        fullscreen,
        globalVolume,
        soundVolume,
        voiceVolume,
        bgmVolume,
        cps,
        skipDelay,
        skipInterval,
    ]);

    // 指示器位置状态
    const [indicatorLeft, setIndicatorLeft] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);

    // 更新指示器位置
    const updateIndicatorPosition = React.useCallback(() => {
        const position = getIndicatorPosition();
        if (position.left > 0) { // 只有在计算出有效位置时才显示和更新
            setIndicatorLeft(position.left);
            if (!isInitialized) {
                setIsInitialized(true);
            }
        }
    }, [activeTab, isInitialized]);

    useEffect(() => {
        // 当activeTab变化时，稍微延迟一下让DOM更新完成
        const timer = setTimeout(() => {
            updateIndicatorPosition();
        }, 100);

        return () => clearTimeout(timer);
    }, [activeTab, updateIndicatorPosition]);

    // 组件挂载后初始化位置
    useEffect(() => {
        const timer = setTimeout(() => {
            updateIndicatorPosition();
        }, 200);

        return () => clearTimeout(timer);
    }, [updateIndicatorPosition]);

    // 计算动画方向的函数
    const getAnimationDirection = (fromTabId: TabId, toTabId: TabId): "right" | "left" => {
        const fromIndex = tabs.findIndex(tab => tab.id === fromTabId);
        const toIndex = tabs.findIndex(tab => tab.id === toTabId);
        return toIndex > fromIndex ? "right" : "left";
    };

    const handleTabChange = (tabId: TabId) => {
        if (tabId !== activeTab) {
            // 立即计算并存储动画方向，避免状态更新时序问题
            const direction = getAnimationDirection(activeTab, tabId);
            animationDirectionRef.current = direction;
            
            setPreviousTab(activeTab);
            setActiveTab(tabId);
        }
    };

    // 计算白线位置
    const getIndicatorPosition = () => {
        const activeTabElement = tabRefs.current[activeTab];
        const containerElement = tabContainerRef.current;

        if (!activeTabElement || !containerElement) {
            return { left: 0 };
        }

        // 获取元素的offsetLeft和offsetWidth来精确计算位置
        const tabLeft = activeTabElement.offsetLeft;
        const tabWidth = activeTabElement.offsetWidth;
        const indicatorWidth = 20; // 增加到20px宽度

        // 计算tab中心位置，然后减去指示器宽度的一半来居中
        const tabCenter = tabLeft + tabWidth / 2;

        return {
            left: tabCenter - indicatorWidth / 2
        };
    };

    // Tab按钮动画variants
    const tabButtonVariants = {
        initial: {
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        },
        hover: {
            y: -4,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25
            }
        }
    };

    // 计算当前动画配置 - 使用ref中存储的方向，避免状态更新时序问题
    const getCurrentAnimationConfig = () => {
        const direction = animationDirectionRef.current;
        return direction === "right" 
            ? {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: -30 }
            }
            : {
                initial: { opacity: 0, x: -30 },
                animate: { opacity: 1, x: 0 },
                exit: { opacity: 0, x: 30 }
            };
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "audio":
                return (
                    <AudioSettings
                        globalVolume={globalVolume}
                        setGlobalVolume={setGlobalVolume}
                        soundVolume={soundVolume}
                        setSoundVolume={setSoundVolume}
                        voiceVolume={voiceVolume}
                        setVoiceVolume={setVoiceVolume}
                        bgmVolume={bgmVolume}
                        setBgmVolume={setBgmVolume}
                    />
                );
            case "text":
                return (
                    <TextSettings
                        cps={cps}
                        setCps={setCps}
                        skipDelay={skipDelay}
                        setSkipDelay={setSkipDelay}
                        skipInterval={skipInterval}
                        setSkipInterval={setSkipInterval}
                    />
                );
            case "display":
                return (
                    <DisplaySettings
                        fullscreen={fullscreen}
                        setFullscreen={setFullscreen}
                        visualEffect={visualEffect}
                        setVisualEffect={setVisualEffect}
                        skipKeyBinding={skipKeyBinding}
                        setSkipKeyBinding={setSkipKeyBinding}
                    />
                );
            default:
                return <div className="text-white p-4">未知的选项卡: {activeTab}</div>;
        }
    };

    return (
        <motion.div
            key="settings-page"
            className="h-full w-full absolute"
            {...HomePagesAnimation}
        >
            <div className="flex flex-col h-full">
                {/* 标题栏 */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">设置</h1>
                </div>

                {/* Tab导航 */}
                <div
                    ref={tabContainerRef}
                    className="relative flex mb-2"
                >
                    {tabs.map((tab) => (
                        <motion.button
                            key={tab.id}
                            ref={(el) => { tabRefs.current[tab.id] = el; }}
                            onMouseDown={() => handleTabChange(tab.id)}
                            className={`flex-1 py-2 px-6 transition-colors duration-200 relative outline-none ${activeTab === tab.id
                                    ? "text-white"
                                    : "text-white/70 hover:text-white"
                                }`}
                            variants={tabButtonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            animate="initial"
                        >
                            <span className="text-xl font-semibold relative z-10">{tab.label}</span>
                        </motion.button>
                    ))}

                    {/* 移动的白线指示器 */}
                    {isInitialized && (
                        <motion.div
                            className="absolute bottom-0 bg-white rounded-full"
                            initial={{
                                left: indicatorLeft,
                                opacity: 0
                            }}
                            animate={{
                                left: indicatorLeft,
                                opacity: 1,
                            }}
                            transition={{
                                left: {
                                    type: "tween",
                                    ease: "circInOut",
                                    duration: 0.4
                                },
                                opacity: {
                                    duration: 0.2
                                }
                            }}
                            style={{
                                width: "20px",
                                height: "3px",
                                boxShadow: "0 0 8px rgba(255, 255, 255, 0.5)"
                            }}
                        />
                    )}
                </div>

                {/* Tab内容区域 */}
                <div className="flex-1 relative w-full h-full min-h-[400px]">
                    <AnimatePresence mode="wait">
                        {(() => {
                            const animationConfig = getCurrentAnimationConfig();
                            return (
                                <motion.div
                                    key={activeTab}
                                    initial={animationConfig.initial}
                                    animate={animationConfig.animate}
                                    exit={animationConfig.exit}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut"
                                    }}
                                    className="w-full h-full absolute inset-0"
                                >
                                    {renderTabContent()}
                                </motion.div>
                            );
                        })()}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}   