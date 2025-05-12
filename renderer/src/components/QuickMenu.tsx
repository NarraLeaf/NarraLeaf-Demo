import { History, FastForward, Save, Settings, Home, Play, FileText, FileUp, ArrowLeft } from 'lucide-react';

interface MenuItemProps {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}

function MenuItem({ icon: Icon, label, onClick, disabled, active }: MenuItemProps) {
    return (
        <button 
            onClick={onClick}
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
        >
            <Icon className={`w-4 h-4 flex-shrink-0 text-white ${active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`} />
            <span className={`text-xs text-white ${active ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : ''}`}>{label}</span>
        </button>
    );
}

export function QuickMenu() {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full">
            <MenuItem icon={ArrowLeft} label="上一步" />
            <MenuItem icon={History} label="历史" />
            <MenuItem icon={FastForward} label="快进" />
            <MenuItem icon={Play} label="自动" />
            <MenuItem icon={Save} label="保存" />
            <MenuItem icon={Save} label="快速保存" />
            <MenuItem icon={FileText} label="读取" />
            <MenuItem icon={FileUp} label="快速读取" />
            <MenuItem icon={Settings} label="设置" />
            <MenuItem icon={Home} label="主页" />
        </div>
    );
}