import { HomePanel } from "../../src/components/HomePanel";
import { useRouter } from "narraleaf-react";
import { motion } from "motion/react";

export default function Home() {
    const router = useRouter();

    return (
        <motion.div 
            key="settings-page"
            className="flex flex-col items-center justify-center space-y-6 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
        >
            <h1 className="text-4xl font-bold text-white mb-8">测试页面</h1>

            {/* 页面内容 */}
            <div className="text-white/60 text-center">
                <p>这是一个测试页面</p>
                <p className="text-sm mt-4">
                    💡 提示: 在键盘上输入 "dev" 来显示测试面板
                </p>
            </div>
        </motion.div>
    );
}
