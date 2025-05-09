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
        className={clsx(`w-full px-6 py-4 bg-primary/90 hover:bg-primary/95 text-white rounded-lg shadow-lg 
                 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                 hover:shadow-xl active:translate-y-0`, className)}
    >
        {children}
    </button>
);

export default function Home() {
    const app = useApp();
    const router = useRouter();

    return (
        <>
            <Panel className="flex-1 flex flex-col justify-center gap-6">
                {/* Vertical Stack Container */}
                <div className="flex-1 flex flex-col justify-center gap-6 m-4">
                    <MenuButton onClick={() => app.newGame()}>
                        开始游戏
                    </MenuButton>

                    <MenuButton onClick={() => router.push("load")}>
                        读取存档
                    </MenuButton>

                    <MenuButton onClick={() => router.push("settings")}>
                        设置
                    </MenuButton>

                    <MenuButton onClick={() => router.push("about")}>
                        关于
                    </MenuButton>
                </div>

            </Panel>

            {/* Main Title */}
            <div className="absolute top-8 right-8 text-gray-800">
                <h1 className="text-5xl font-bold">NarraLeaf Demo</h1>
            </div>

            {/* Copyright Information */}
            <div className="absolute bottom-8 right-8 text-gray-700 text-lg text-right">
                <h1 className="font-bold text-2xl mb-1">NarraLeaf</h1>
                <p>© 2025 NarraLeaf Project.</p>
                <p className="text-xs mt-1">这是NarraLeaf引擎的演示项目，仅用于展示引擎基础特性，无法代表最终成品</p>
            </div>
        </>
    );
}

export const config: PageConfig = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.2,
            ease: "easeIn"
        }
    },
};
