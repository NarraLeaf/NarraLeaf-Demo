import { History, FastForward, Save, Settings, Home, Play, FileText, FileUp, ArrowLeft } from 'lucide-react';
import { LiveGameEventToken, NotificationToken, useGame, usePreference, useRouter } from 'narraleaf-react';
import { useConfirm } from '../hooks/useConfirm';
import { useApp, useSaveAction } from 'narraleaf/renderer';
import { useBackdrop } from '../hooks/useBackdrop';
import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}

function MenuItem({ icon: Icon, label, onClick, disabled, active }: MenuItemProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick();
        }
        e.currentTarget.blur();
    };

    return (
        <button 
            onClick={handleClick}
            disabled={disabled}
            className={`
                flex items-center gap-1 px-2 py-1.5 rounded-full transition-colors whitespace-nowrap
                ${disabled 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-white/20 active:bg-white/30'
                }
                ${active 
                    ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' 
                    : ''
                }
            `}
            tabIndex={-1}
        >
            <Icon className={`w-4 h-4 flex-shrink-0 text-white ${active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
            <span className={`text-xs text-white ${active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}>{label}</span>
        </button>
    );
}

export function QuickMenu() {
    const game = useGame();
    const liveGame = game.getLiveGame();
    const router = useRouter();
    const app = useApp();
    const backdrop = useBackdrop();
    const {quickSave, quickRead} = useSaveAction();

    const [autoForward] = usePreference("autoForward");
    const [showDialog, setShowDialog] = usePreference("showDialog");
    const fastForwardNotification = useRef<NotificationToken | null>(null);

    const [confirmExit, ConfirmExitDialog] = useConfirm({
        message: "确定要退出游戏吗？",
    });
    const [confirmQuickRead, ConfirmQuickReadDialog] = useConfirm({
        message: "确定要读取快速保存吗？",
    });

    useEffect(() => {
        if (fastForwardNotification.current) {
            fastForwardNotification.current.cancel();
            fastForwardNotification.current = null;
        }
        let token: LiveGameEventToken | null = null;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                if (fastForwardNotification.current) {
                    return;
                }
                fastForwardNotification.current = game.getLiveGame().notify("快进中...", null);
                game.preference.setPreference("gameSpeed", 10);
                game.preference.setPreference("autoForward", true);
            } else if (e.key === 'Escape' && router.getPathname() !== "settings") {
                router.navigate("/home/settings");
            } else if (e.key === 'ArrowUp' && router.getPathname() !== "history") {
                router.navigate("/history");

                if (token) {
                    token.cancel();
                }

                const routerToken = liveGame.waitForPageMount();
                routerToken.promise.then(() => {
                    setTimeout(() => {
                        const element = document.getElementById("last-history");
                        if (element) {
                            element.focus();
                            console.log("last-history element found and focused", element);
                        } else {
                            console.warn("last-history element not found");
                        }
                    }, 100);
                });
                token = routerToken;
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') {
                if (fastForwardNotification.current) {
                    fastForwardNotification.current.cancel();
                    fastForwardNotification.current = null;
                }
                game.preference.setPreference("gameSpeed", 1);
                game.preference.setPreference("autoForward", false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (token) {
                token.cancel();
            }
        };
    }, [router]);

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            setShowDialog(!showDialog);
        };

        window.addEventListener('contextmenu', handleContextMenu);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        };
    }, [showDialog, setShowDialog]);

    function handleUndo() {
        liveGame.undo();
    }

    function handleHistory() {
        console.log("push history");
        router.navigate("/home/history");
    }

    function handleAutoForward() {
        game.preference.togglePreference("autoForward");
    }

    // function handleGameSpeed() {
    //     if (gameSpeed === 1) {
    //         game.preference.setPreference("gameSpeed", 3);
    //     } else {
    //         game.preference.setPreference("gameSpeed", 1);
    //     }
    // }

    
    function handleExit() {
        confirmExit().then((result) => {
            if (result) {
                app.exitGame();
            }
        });
    }

    function handleLoad() {
        router.navigate("/home/load");
    }

    function handleSave() {
        router.navigate("/home/save");
    }

    function handleSettings() {
        router.navigate("/home/settings");
    }

    function handleQuickSave() {
        quickSave();
        game.getLiveGame().notify("快速保存成功");
    }

    function handleSkipDialog() {
        liveGame.skipDialog();
    }

    async function handleQuickRead() {
        const result = await confirmQuickRead();
        if (result) {
            const savedGame = await quickRead();
            if (!savedGame) {
                game.getLiveGame().notify("快速读取失败");
                return;
            }

            game.getLiveGame().deserialize(savedGame);
            game.getLiveGame().notify("快速读取成功");
        }
    }

    return (
        <>
            <AnimatePresence>
                {showDialog && (
                    <div className="fixed bottom-5 left-0 right-0 flex justify-center">
                        <motion.div 
                            className={clsx("flex items-center gap-2 px-4 py-1 rounded-full")}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 25,
                                duration: 0.3
                            }}
                        >
                            <MenuItem icon={ArrowLeft} label="上一步" onClick={handleUndo} />
                            <MenuItem icon={History} label="历史" onClick={handleHistory} />
                            <MenuItem icon={FastForward} label="跳过" onClick={handleSkipDialog} />
                            {/* <MenuItem icon={FastForward} label="快进" onClick={handleGameSpeed} active={gameSpeed > 1}/> */}
                            <MenuItem icon={Play} label="自动" onClick={handleAutoForward} active={autoForward}/>
                            <MenuItem icon={Save} label="保存" onClick={handleSave} />
                            <MenuItem icon={Save} label="快速保存" onClick={handleQuickSave} />
                            <MenuItem icon={FileText} label="读取" onClick={handleLoad} />
                            <MenuItem icon={FileUp} label="快速读取" onClick={handleQuickRead} />
                            <MenuItem icon={Settings} label="设置" onClick={handleSettings} />
                            <MenuItem icon={Home} label="主页" onClick={handleExit} />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {ConfirmExitDialog}
            {ConfirmQuickReadDialog}
        </>
    );
}