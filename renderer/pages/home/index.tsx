import { HomePanel } from "../../src/components/HomePanel";
import { useRouter } from "narraleaf-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, createContext } from "react";

export function Home() {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(true);

    // 每隔一秒切换元素的可见性
    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(prev => !prev);
        }, 1000000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div 
            key="settings-page"
            className="flex flex-col items-center justify-center space-y-6 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <h1 className="text-4xl font-bold text-white mb-8">AnimatePresence 测试</h1>

            {/* AnimatePresence 测试区域 */}
            <div className="text-white/60 text-center">
                <p className="mb-4">测试元素每秒钟会卸载和挂载一次</p>
                
                <AnimatePresence mode="wait">
                    {isVisible && (
                        <Test />
                    )}
                </AnimatePresence>

                <div className="mt-6 text-sm text-white/40">
                    <p>💡 提示: 在键盘上输入 "dev" 来显示测试面板</p>
                    <p>⏱️ 观察退场动画效果</p>
                </div>
            </div>
        </motion.div>
    );
}

export default function  Test() {

    return (<motion.div
        key="test-element"
        className="bg-blue-500/20 border border-blue-400/40 rounded-lg p-6 min-w-[300px]"
        initial={{ 
            opacity: 0, 
            scale: 0.8, 
            y: 20,
            rotateX: -15
        }}
        animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            rotateX: 0
        }}
        exit={{ 
            opacity: 0, 
            scale: 0.8, 
            y: -20,
            rotateX: 15
        }}
        transition={{ 
            duration: 0.5, 
            ease: "easeInOut",
            type: "spring",
            stiffness: 200,
            damping: 20
        }}
    >
        <div className="text-blue-300 font-semibold mb-2">
            🎭 动画测试元素
        </div>
        <div className="text-blue-200/80 text-sm">
            <p>时间: {new Date().toLocaleTimeString()}</p>
        </div>
    </motion.div>);
}

const TestContext = createContext<void>(void 0);
