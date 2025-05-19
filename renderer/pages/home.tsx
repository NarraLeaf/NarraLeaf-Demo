import { useRouter } from "narraleaf-react";
import { PageConfig, useApp } from "narraleaf/client";
import React from "react";
import Panel from "../src/components/Panel";
import clsx from "clsx";

// Menu Button Component
interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children, className }) => (
    <button
        onClick={onClick}
        className={clsx(`w-full px-8 py-5 bg-gradient-to-r from-primary/90 to-primary/80 
                 hover:from-primary hover:to-primary/90 text-white rounded-xl shadow-lg 
                 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                 hover:shadow-xl active:translate-y-0 border border-white/10
                 backdrop-blur-sm`, className)}
    >
        {children}
    </button>
);

export default function Home() {
    const app = useApp();
    const router = useRouter();

    return (
        <div className="relative min-h-full overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent"></div>
            </div>

            <Panel route={false} className="flex-1 flex flex-col justify-center gap-6">
                {/* Vertical Stack Container */}
                <div className="flex-1 flex flex-col justify-center gap-8 m-8 max-w-md mx-auto w-full">
                    <MenuButton onClick={() => app.newGame()}>
                        <span className="text-xl font-semibold">开始游戏</span>
                    </MenuButton>

                    <MenuButton onClick={() => router.push("load")}>
                        <span className="text-xl font-semibold">读取存档</span>
                    </MenuButton>

                    <MenuButton onClick={() => router.push("settings")}>
                        <span className="text-xl font-semibold">设置</span>
                    </MenuButton>

                    <MenuButton onClick={() => router.push("about")}>
                        <span className="text-xl font-semibold">关于</span>
                    </MenuButton>
                </div>
            </Panel>

            {/* Main Title */}
            <div className="absolute top-12 right-12 text-right">
                <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    NarraLeaf Demo
                </h1>
                <div className="h-1 w-32 bg-primary/50 ml-auto mt-4 rounded-full"></div>
            </div>

            {/* Copyright Information */}
            <div className="absolute bottom-8 right-12 text-right text-gray-400">
                <img 
                    src="/static/img/ui/logo-text-blue.png" 
                    alt="Logo" 
                    className="w-auto h-auto max-w-[180px] ml-auto"
                />
                <p className="text-sm">© 2025 NarraLeaf Project.</p>
                <p className="text-xs mt-2 text-gray-500 max-w-md ml-auto">
                    这是NarraLeaf引擎的演示项目，仅用于展示引擎基础特性，无法代表最终成品
                </p>
            </div>
        </div>
    );
}

export const config: PageConfig = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.2,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.1,
            ease: "easeIn"
        }
    },
};
