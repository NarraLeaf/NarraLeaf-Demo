import { History, FastForward, Save, Settings, Home, Play, FileText, FileUp, ArrowLeft } from 'lucide-react';
import { useGame, usePreference, useRouter } from 'narraleaf-react';
import { useConfirm } from '../hooks/useConfirm';
import { useApp, useSaveAction } from 'narraleaf/client';
import { useBackdrop } from '../hooks/useBackdrop';
import clsx from 'clsx';

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
    const [gameSpeed] = usePreference("gameSpeed");

    const [confirmExit, ConfirmExitDialog] = useConfirm({
        message: "确定要退出游戏吗？",
    });
    const [confirmQuickRead, ConfirmQuickReadDialog] = useConfirm({
        message: "确定要读取快速保存吗？",
    });

    function handleUndo() {
        liveGame.undo();
    }

    function handleHistory() {
        console.log("push history");
        router.push("history");
    }

    function handleAutoForward() {
        game.preference.togglePreference("autoForward");
    }

    function handleGameSpeed() {
        if (gameSpeed === 1) {
            game.preference.setPreference("gameSpeed", 3);
        } else {
            game.preference.setPreference("gameSpeed", 1);
        }
    }

    
    function handleExit() {
        confirmExit().then((result) => {
            if (result) {
                app.exitGame();
            }
        });
    }

    function handleLoad() {
        router.push("loadgame");
    }

    function handleSave() {
        router.push("savegame");
    }

    function handleSettings() {
        router.push("settings");
    }

    function handleQuickSave() {
        quickSave();
        game.getLiveGame().notify("快速保存成功");
    }

    async function handleQuickRead() {
        const result = await confirmQuickRead();
        if (result) {
            const savedGame = await quickRead();
            game.getLiveGame().deserialize(savedGame);
            game.getLiveGame().notify("快速读取成功");
        }
    }

    return (
        <>
            <div className={clsx("fixed bottom-4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-1 rounded-full bg-black/10", backdrop)}>
                <MenuItem icon={ArrowLeft} label="上一步" onClick={handleUndo} />
                <MenuItem icon={History} label="历史" onClick={handleHistory} />
                <MenuItem icon={FastForward} label="快进" onClick={handleGameSpeed} active={gameSpeed > 1}/>
                <MenuItem icon={Play} label="自动" onClick={handleAutoForward} active={autoForward}/>
                <MenuItem icon={Save} label="保存" onClick={handleSave} />
                <MenuItem icon={Save} label="快速保存" onClick={handleQuickSave} />
                <MenuItem icon={FileText} label="读取" onClick={handleLoad} />
                <MenuItem icon={FileUp} label="快速读取" onClick={handleQuickRead} />
                <MenuItem icon={Settings} label="设置" onClick={handleSettings} />
                <MenuItem icon={Home} label="主页" onClick={handleExit} />
            </div>
            {ConfirmExitDialog}
            {ConfirmQuickReadDialog}
        </>
    );
}