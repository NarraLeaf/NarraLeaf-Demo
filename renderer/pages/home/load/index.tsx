import { useGame, useRouter } from "narraleaf-react";
import type { SavedGameMeta } from "narraleaf/client";
import { SaveType, useApp, useSavedGames } from "narraleaf/client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HomePagesAnimation } from "../index";

export default function Load() {
    const router = useRouter();
    const app = useApp();
    const game = useGame();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const savedGames = useSavedGames();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    const handleLoad = () => {
        if (selectedSlot !== null) {
            console.log(`Loading save slot ${selectedSlot}`);
            app.loadGame(selectedSlot);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        hasDragged.current = false;
        startY.current = e.pageY - scrollRef.current.offsetTop;
        scrollTop.current = scrollRef.current.scrollTop;
        scrollRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const y = e.pageY - scrollRef.current.offsetTop;
        const walk = (y - startY.current) * 1;
        scrollRef.current.scrollTop = scrollTop.current - walk;
        hasDragged.current = true;
    };

    const handleMouseUp = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.cursor = 'grab';
    };

    React.useEffect(() => {
        const handleMouseUp = () => {
            if (!scrollRef.current) return;
            isDragging.current = false;
            scrollRef.current.style.cursor = 'grab';
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                    <div className="flex justify-between items-center">
                        <div className="space-y-2 flex-1">
                            <div className="h-6 bg-white/20 rounded animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded animate-pulse w-2/3"></div>
                        </div>
                        <div className="w-16 h-16 bg-white/10 rounded animate-pulse"></div>
                    </div>
                </motion.div>
            ))}
        </div>
    );

    // Error component
    const ErrorDisplay = ({ error }: { error: string }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center p-8"
        >
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-white text-xl font-medium mb-2">加载失败</h3>
            <p className="text-white/70 text-sm max-w-md">{error}</p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 px-6 py-3 bg-primary/80 hover:bg-primary text-white rounded-lg transition-colors"
            >
                重试
            </button>
        </motion.div>
    );

    // Empty state component
    const EmptyState = () => (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center p-8"
        >
            <div className="text-white/50 text-6xl mb-4">📁</div>
            <h3 className="text-white text-xl font-medium mb-2">暂无存档</h3>
            <p className="text-white/70 text-sm">您还没有保存任何游戏进度</p>
        </motion.div>
    );

    return (
        <motion.div
            className="h-full w-full absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="flex flex-col h-full">
                <motion.h1 
                    className="text-2xl font-bold text-white mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    读取存档
                </motion.h1>

                <div className="flex-1 relative">
                    <AnimatePresence mode="wait">
                        {!savedGames ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <div
                                    ref={scrollRef}
                                    className="h-full overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                                >
                                    <LoadingSkeleton />
                                </div>
                            </motion.div>
                        ) : savedGames.error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <ErrorDisplay error={savedGames.error.message} />
                            </motion.div>
                        ) : savedGames.isLoading ? (
                            <motion.div
                                key="loading-data"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                <div
                                    ref={scrollRef}
                                    className="h-full overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                                >
                                    <LoadingSkeleton />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="content"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="h-full"
                            >
                                {(() => {
                                    const games = savedGames.results.filter((game: SavedGameMeta) => game.type === SaveType.Save);
                                    
                                    if (games.length === 0) {
                                        return <EmptyState />;
                                    }

                                    return (
                                        <div
                                            ref={scrollRef}
                                            className="h-full overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                                            onMouseDown={handleMouseDown}
                                            onMouseMove={handleMouseMove}
                                            onMouseUp={handleMouseUp}
                                        >
                                            <motion.div 
                                                className="space-y-4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.1, duration: 0.3 }}
                                            >
                                                {games.map((slot: SavedGameMeta, index: number) => (
                                                    <motion.div
                                                        key={slot.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05, duration: 0.3 }}
                                                        onClick={() => !hasDragged.current && setSelectedSlot(slot.id)}
                                                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm
                                                                     ${selectedSlot === slot.id
                                                            ? 'bg-primary/90 shadow-lg shadow-primary/20'
                                                            : 'bg-white/20 hover:bg-white/30 hover:shadow-md'}`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <h3 className="text-white text-lg font-medium">
                                                                    {slot.type === 0 ? "存档" : slot.type === 1 ? "快速存档" : "恢复存档"}
                                                                </h3>
                                                                <p className="text-white/70 text-sm">
                                                                    {new Date(slot.updated).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {slot.capture && (
                                                                <motion.img
                                                                    src={slot.capture}
                                                                    alt="存档预览"
                                                                    className="w-16 h-16 object-cover rounded shadow-md"
                                                                    whileHover={{ scale: 1.05 }}
                                                                    transition={{ duration: 0.2 }}
                                                                />
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        </div>
                                    );
                                })()}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div 
                    className="mt-8 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    <button
                        onClick={handleLoad}
                        disabled={selectedSlot === null}
                        className={`w-full px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
                                     ${selectedSlot !== null
                                ? 'bg-transparent border-2 border-primary/90 hover:border-primary/95 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 text-primary/90 hover:text-primary/95'
                                : 'bg-transparent border-2 border-white/20 text-white/50 cursor-not-allowed'}`}
                    >
                        读取选中存档
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
} 