import React, { useEffect, useState, useRef, useCallback, createContext, useContext, useMemo } from "react";
import { SaveType, useApp, useGamePlayback, useSavedGames } from "narraleaf/renderer";
import { motion, usePresence } from "motion/react";
import { HomePanel, MenuButton } from "../../src/components/HomePanel";
import { usePathname, useRouter } from "narraleaf-react";
import { GameExitListener } from "../../src/components/GameExitListener";
import { useConfirm } from "../../src/hooks/useConfirm";

// Confirm Context Types
interface ConfirmConfig {
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface ConfirmContextType {
    showConfirm: (config: ConfirmConfig) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

// Hook to use confirm context
export const useAppConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useAppConfirm must be used within a ConfirmProvider');
    }
    return context;
};

// ConfirmProvider component
function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [confirmExit, ConfirmExitDialog] = useConfirm({
        message: "确定要退出游戏吗？",
    });
    const [confirmQuit, ConfirmQuitDialog] = useConfirm({
        message: "确定要结束游戏吗？",
    });
    const [confirmLoad, ConfirmLoadDialog] = useConfirm({
        message: "确定要加载这个存档吗？",
    });
    const [confirmSave, ConfirmSaveDialog] = useConfirm({
        message: "确定要覆盖当前存档吗？",
    });
    const [confirmGeneric, ConfirmGenericDialog] = useConfirm({
        message: "确定要执行此操作吗？",
    });

    const showConfirm = useCallback(async (config: ConfirmConfig): Promise<boolean> => {
        switch (config.message) {
            case "确定要退出游戏吗？":
                return await confirmExit();
            case "确定要结束游戏吗？":
                return await confirmQuit();
            case "确定要加载这个存档吗？":
                return await confirmLoad();
            case "确定要覆盖当前存档吗？":
                return await confirmSave();
            default:
                // For generic messages, update the confirm message and use generic dialog
                return await confirmGeneric();
        }
    }, [confirmExit, confirmQuit, confirmLoad, confirmSave, confirmGeneric]);

    const contextValue: ConfirmContextType = useMemo(() => ({
        showConfirm
    }), [showConfirm]);

    return (
        <ConfirmContext.Provider value={contextValue}>
            {children}
            {ConfirmExitDialog}
            {ConfirmQuitDialog}
            {ConfirmLoadDialog}
            {ConfirmSaveDialog}
            {ConfirmGenericDialog}
        </ConfirmContext.Provider>
    );
}

// Independent BlurOverlay component using useAnimate and usePresence
interface BlurOverlayProps {
    blur: boolean;
    isPlaying: boolean;
}

function BlurOverlay({ blur, isPlaying }: BlurOverlayProps) {
    return (
        <motion.div
            className={isPlaying ? "absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-none" : "absolute inset-0 bg-black/30 backdrop-blur-md pointer-events-none"}
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{
                opacity: blur ? 1 : 0.4,
                backdropFilter: blur
                    ? (isPlaying ? 'blur(5px)' : 'blur(8px)')
                    : 'blur(3px)'
            }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            style={{
                willChange: 'opacity, backdrop-filter',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
            }}
        />
    );
}

// Smooth parallax hook for background
function useSmoothBackgroundParallax() {
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isMouseInView, setIsMouseInView] = useState(false);
    const [parallaxEnabled, setParallaxEnabled] = useState(false);

    const currentOffset = useRef({ x: 0, y: 0 });
    const targetOffset = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    // Smooth easing function (easeInOutSine)
    const easeInOutSine = (t: number): number => {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    };

    // Calculate target offset with very subtle movement
    const calculateTargetOffset = useCallback((mouseX: number, mouseY: number) => {
        if (!isMouseInView || !parallaxEnabled) return { x: 0, y: 0 };

        // Calculate direction from center
        const directionX = mouseX - 0.5;
        const directionY = mouseY - 0.5;

        // Use smooth easing for very subtle movement
        const distanceFromCenter = Math.sqrt(directionX * directionX + directionY * directionY);
        const easedDistance = easeInOutSine(Math.min(distanceFromCenter * 2, 1));

        // Very low sensitivity for subtle background movement
        const sensitivity = 0.05; // Reduced from 0.15 to 0.05
        const maxOffset = 20; // Reduced from 60 to 20 for more subtle effect

        // Apply sensitivity and easing with forward direction (removed negative sign)
        const offsetX = directionX * sensitivity * maxOffset * easedDistance;
        const offsetY = directionY * sensitivity * maxOffset * easedDistance;

        return { x: offsetX, y: offsetY };
    }, [isMouseInView, parallaxEnabled]);

    // Calculate 3D rotation for background
    const calculate3DRotation = useCallback(() => {
        if (!isMouseInView || !parallaxEnabled) return { rotateX: 0, rotateY: 0 };

        // Calculate direction from center
        const directionX = mousePosition.x - 0.5;
        const directionY = mousePosition.y - 0.5;

        // Convert to rotation angles (in degrees) - very subtle for background
        const maxRotationX = 2; // Very subtle X rotation
        const maxRotationY = 3; // Very subtle Y rotation

        const rotateX = -directionY * maxRotationX; // Negative for natural tilt
        const rotateY = directionX * maxRotationY;

        return { rotateX, rotateY };
    }, [mousePosition, isMouseInView, parallaxEnabled]);

    // Smooth animation loop
    const animateParallax = useCallback((timestamp: DOMHighResTimeStamp) => {
        // Spring-damper interpolation for smooth movement
        const spring = 0.08; // Reduced spring stiffness for smoother movement
        const damper = 0.85; // Increased damping for more stability

        const dx = targetOffset.current.x - currentOffset.current.x;
        const dy = targetOffset.current.y - currentOffset.current.y;

        currentOffset.current.x += dx * spring;
        currentOffset.current.y += dy * spring;

        // Apply damping
        currentOffset.current.x *= damper;
        currentOffset.current.y *= damper;

        rafId.current = requestAnimationFrame(animateParallax);
    }, []);

    // Mouse move handler - only updates target values
    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        setMousePosition({ x, y });
        setIsMouseInView(true);
    }, []);

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
        setIsMouseInView(false);
        setMousePosition({ x: 0.5, y: 0.5 });
    }, []);

    // Start parallax animation when enabled
    useEffect(() => {
        if (parallaxEnabled) {
            rafId.current = requestAnimationFrame(animateParallax);
        }

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [parallaxEnabled, animateParallax]);

    // Enable parallax after a short delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setParallaxEnabled(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    // Get current background offset
    const getBackgroundOffset = useCallback(() => {
        return calculateTargetOffset(mousePosition.x, mousePosition.y);
    }, [mousePosition, calculateTargetOffset]);

    // Get current 3D rotation
    const getBackgroundRotation = useCallback(() => {
        return calculate3DRotation();
    }, [calculate3DRotation]);

    return {
        handleMouseMove,
        handleMouseLeave,
        parallaxEnabled,
        currentOffset: currentOffset.current,
        getBackgroundOffset,
        getBackgroundRotation
    };
}

function LayoutContent({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const currentPathname = usePathname();
    const bgImage = "url('/static/img/ui/bg/outside.jpg')";
    const app = useApp();
    const { isPlaying } = useGamePlayback();
    const { showConfirm } = useAppConfirm();

    const isHomePage = currentPathname === "/home";
    const blur = (currentPathname.startsWith("/home") && !isHomePage) || isPlaying;

    // 使用 usePresence 钩子来控制退场动画
    const [isPresent, safeToRemove] = usePresence();

    // 处理退场动画完成的回调
    const handleExitComplete = useCallback(() => {
        // 当退场动画完成后，调用 safeToRemove 告知可以安全移除组件
        if (!isPresent) {
            safeToRemove();
        }
    }, [isPresent, safeToRemove]);

    const onlyInHome = (v: MenuButton): MenuButton[] => {
        if (!isPlaying) {
            return [v];
        }
        return [];
    };

    const onlyInPlaying = (v: MenuButton): MenuButton[] => {
        if (isPlaying) {
            return [v];
        }
        return [];
    };

    const {
        handleMouseMove,
        handleMouseLeave,
        getBackgroundOffset,
        getBackgroundRotation
    } = useSmoothBackgroundParallax();

    // Define menu buttons with active states
    const menuButtons: MenuButton[] = [
        ...onlyInHome({
            id: "start-game",
            label: "开始游戏",
            active: false,
            onClick: () => {
                app.newGame();
            }
        }),
        ...onlyInHome({
            id: "continue-game",
            label: "继续游戏",
            active: false,
            onClick: () => {
                app.continueGame();
            }
        }),
        ...onlyInPlaying({
            id: "continue-game",
            label: "继续游戏",
            onClick: () => {
                router.navigate("/");
            }
        }),
        {
            id: "load-game",
            label: "读取存档",
            active: router.getPathname() === "/home/load",
            onClick: () => {
                router.navigate("/home/load");
            }
        },
        ...onlyInPlaying({
            id: "save-game",
            label: "保存游戏",
            active: router.getPathname() === "/home/save",
            onClick: () => {
                router.navigate("/home/save");
            }
        }),
        {
            id: "settings",
            label: "游戏设置",
            active: router.getPathname() === "/home/settings",
            onClick: () => {
                router.navigate("/home/settings");
            }
        },
        {
            id: "about",
            label: "关于游戏",
            active: router.getPathname() === "/home/about",
            onClick: () => {
                router.navigate("/home/about");
            }
        },
        ...onlyInPlaying({
            id: "exit-game",
            label: "返回主页",
            active: false,
            onClick: () => {
                handleExit();
            }
        }),
        {
            id: "exit-app",
            label: "退出",
            active: false,
            onClick: async () => {
                const result = await showConfirm({ message: "确定要结束游戏吗？" });
                if (result) {
                    app.quit();
                }
            }
        }
    ];

    const bgVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5
            }
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.5
            }
        }
    };


    const backgroundOffset = getBackgroundOffset();
    const backgroundRotation = getBackgroundRotation();

    async function handleExit() {
        const result = await showConfirm({ message: "确定要退出游戏吗？" });
        if (result) {
            app.exitGame();
        }
    }

    return (
        <motion.div
            className="w-full h-full absolute"
            style={{
                backgroundImage: isPlaying ? 'none' : bgImage,
                backgroundSize: '160%', // Increased from 140% to 160% for larger image
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden'
            }}
            variants={bgVariants}
            initial="hidden"
            animate={isPresent ? {
                opacity: 1,
                x: backgroundOffset.x,
                y: backgroundOffset.y,
                transition: {
                    type: "spring" as const,
                    stiffness: 60, // Reduced from 80 for smoother movement
                    damping: 20, // Increased from 18 for more stability
                    mass: 0.8 // Increased from 0.7 for more inertia
                }
            } : "exit"}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <GameExitListener />

            {/* Independent blur overlay */}
            <BlurOverlay
                blur={blur}
                isPlaying={isPlaying}
            />
            <HomePanel
                key="home-panel"
                buttons={menuButtons}
                raw={isHomePage}
                isHomePage={isHomePage}
                onExitComplete={handleExitComplete}
                presence={isPresent}
            >
                {isHomePage ? (
                    <>
                        <div className="absolute w-full h-full min-h-[500px]">
                            {/* Main Title */}
                            <div className="absolute top-12 right-12 text-right">
                                <h1 className="text-6xl font-bold bg-gradient-to-r text-white bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">
                                    NarraLeaf Demo
                                </h1>
                                <div className="h-1 w-32 bg-white/90 ml-auto mt-4 rounded-full drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]"></div>
                            </div>

                            {/* Copyright Information */}
                            <div className="absolute bottom-8 right-12 text-right text-white drop-shadow-[0_1px_2px_rgba(255,255,255,0.2)]">
                                <img
                                    src="/static/img/ui/logo-text-blue.png"
                                    alt="Logo"
                                    className="w-auto h-auto max-w-[180px] ml-auto drop-shadow-[0_1px_2px_rgba(255,255,255,0.1)]"
                                />
                                <p className="text-sm font-medium">© 2025 NarraLeaf Project.</p>
                                <p className="text-xs mt-2 text-gray-100 max-w-md ml-auto font-medium">
                                    这是NarraLeaf引擎的演示项目，仅用于展示引擎基础特性，无法代表最终成品
                                </p>
                            </div>
                        </div>
                    </>
                ) : children}
            </HomePanel>
        </motion.div>
    );
}

// Main Layout component with ConfirmProvider
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ConfirmProvider>
            <LayoutContent>{children}</LayoutContent>
        </ConfirmProvider>
    );
}

