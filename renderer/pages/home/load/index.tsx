import { useGame, useRouter } from "narraleaf-react";
import type { SavedGameMeta } from "narraleaf/client";
import { SaveType, useApp, useSavedGames } from "narraleaf/client";
import React, { useRef, useState } from "react";
import { motion } from "motion/react";

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

    if (!savedGames) {
        return (
            <motion.div 
                className="h-full w-full absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            >
                Loading...
            </motion.div>
        );
    }

    const { results, error, isLoading } = savedGames;
    const games = results.filter((game: SavedGameMeta) => game.type === SaveType.Save);

    if (error) {
        return (
            <motion.div 
                className="h-full w-full absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                Error loading saved games: {error.message}
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <motion.div 
                className="h-full w-full absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                Loading saved games...
            </motion.div>
        );
    }

    return (
        <motion.div
            className="h-full w-full absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <div className="flex flex-col h-full">
                <h1 className="text-2xl font-bold text-white mb-6">读取存档</h1>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div className="space-y-4">
                        {games.map((slot: SavedGameMeta) => (
                            <div
                                key={slot.id}
                                onClick={() => !hasDragged.current && setSelectedSlot(slot.id)}
                                className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                                             ${selectedSlot === slot.id
                                        ? 'bg-primary/90'
                                        : 'bg-white/20 hover:bg-white/30'}`}
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
                                        <img
                                            src={slot.capture}
                                            alt="存档预览"
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        onClick={handleLoad}
                        disabled={selectedSlot === null}
                        className={`w-full px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
                                     ${selectedSlot !== null
                                ? 'bg-transparent border-2 border-primary/90 hover:border-primary/95 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 text-primary/90 hover:text-primary/95'
                                : 'bg-transparent border-2 text-white cursor-not-allowed'}`}
                    >
                        读取选中存档
                    </button>

                    <button
                        onClick={() => router.back()}
                        className="w-full px-6 py-3 bg-transparent border-2 border-primary/90 hover:border-primary/95 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 text-primary/90 hover:text-primary/95 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
                    >
                        返回
                    </button>
                </div>
            </div>
        </motion.div>
    );
} 