import { useGame, useRouter } from "narraleaf-react";
import type { SavedGameMeta } from "narraleaf/renderer";
import { SaveType, useApp, useSavedGames, readGame } from "narraleaf/renderer";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HomePagesAnimation } from "../index";
import ScrollableContainer from "../../../src/components/lib/ScrollableContainer";
import { useAppConfirm } from "../layout";

type LoadSlotData = {
    id: string;
    isEmpty: boolean;
    existingSave?: SavedGameMeta;
};

export default function Load() {
    const router = useRouter();
    const app = useApp();
    const game = useGame();
    const savedGames = useSavedGames();
    const liveGame = game.getLiveGame();
    const { showConfirm } = useAppConfirm();

    const handleLoad = async (slotData: LoadSlotData) => {
        if (slotData.isEmpty) {
            liveGame.notify("此存档槽位为空");
            return;
        }

        const confirmed = await showConfirm({ message: "确定要加载这个存档吗？" });
        if (confirmed) {
            try {
                app.loadGame(slotData.id);
            } catch (error) {
                console.error("Failed to load game:", error);
                liveGame.notify("加载游戏失败");
            }
        }
    };

    // Create load slots (9 slots in 2 columns)
    const createLoadSlots = (): LoadSlotData[] => {
        const results = savedGames?.results || [];
        return Array.from({ length: 9 }, (_, index) => {
            const slotId = index.toString();
            const existingSave = results.find(result => 
                result.type === SaveType.Save && result.id === slotId
            );
            
            return {
                id: slotId,
                isEmpty: !existingSave,
                existingSave: existingSave,
            };
        });
    };

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    className="aspect-[4/3] rounded-lg bg-white/10 backdrop-blur-sm relative overflow-hidden"
                >
                    <div className="absolute inset-0 p-4 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="h-4 bg-white/20 rounded animate-pulse"></div>
                            <div className="h-3 bg-white/10 rounded animate-pulse w-2/3"></div>
                        </div>
                        <div className="h-3 bg-white/10 rounded animate-pulse w-1/2"></div>
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

    // Load slot card component
    const LoadSlotCard = ({ slotData, index, onClick }: {
        slotData: LoadSlotData;
        index: number;
        onClick: () => void;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={onClick}
            className={`aspect-[4/3] rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm relative overflow-hidden border-2 ${
                slotData.isEmpty 
                    ? 'bg-white/10 border-white/10 hover:bg-white/15 hover:border-white/20' 
                    : 'bg-white/20 border-transparent hover:bg-white/30 hover:border-white/20 hover:shadow-md'
            }`}
        >
            {/* Background image or empty state */}
            {slotData.isEmpty ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                </div>
            ) : slotData.existingSave?.capture ? (
                <div className="absolute inset-0 pointer-events-none">
                    <img
                        src={slotData.existingSave.capture}
                        alt="存档预览"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 pointer-events-none"></div>
            )}
            
            {/* Content overlay */}
            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-white text-lg font-medium mb-1">
                        {slotData.isEmpty ? `存档位 ${parseInt(slotData.id) + 1}` : "存档"}
                    </h3>
                    {!slotData.isEmpty && slotData.existingSave && (
                        <p className="text-white/90 text-xs">
                            {new Date(slotData.existingSave.updated).toLocaleString()}
                        </p>
                    )}
                    {slotData.isEmpty && (
                        <p className="text-white/50 text-xs">
                            EMPTY
                        </p>
                    )}
                </div>
                
                {/* Last dialog info for existing saves */}
                {!slotData.isEmpty && slotData.existingSave && (slotData.existingSave.lastSpeaker || slotData.existingSave.lastSentence) && (
                    <div className="text-white/80 text-xs">
                        {slotData.existingSave.lastSpeaker && (
                            <div className="font-medium">{slotData.existingSave.lastSpeaker}</div>
                        )}
                        {slotData.existingSave.lastSentence && (
                            <div className="line-clamp-2">{slotData.existingSave.lastSentence}</div>
                        )}
                    </div>
                )}
            </div>

            {/* Empty slot indicator */}
            {/* {slotData.isEmpty && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center z-20">
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                </div>
            )} */}
        </motion.div>
    );

    // Determine what to render
    const shouldShowLoading = !savedGames || savedGames.isLoading;
    const shouldShowError = savedGames?.error;
    const shouldShowContent = savedGames && !savedGames.isLoading && !savedGames.error;

    return (
        <>
            <motion.div
                className="h-full w-full absolute"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="flex flex-col h-full">
                    <motion.div
                        className="mb-6 shrink-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-bold text-white">读取存档</h1>
                    </motion.div>

                    <div className="flex-1 min-h-0">
                        <AnimatePresence mode="wait">
                            {shouldShowLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <ScrollableContainer className="h-full pr-4 min-h-[450px]">
                                        <LoadingSkeleton />
                                    </ScrollableContainer>
                                </motion.div>
                            ) : shouldShowError ? (
                                <motion.div
                                    key="error"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="h-full"
                                >
                                    <ErrorDisplay error={savedGames?.error?.message || "未知错误"} />
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
                                    <ScrollableContainer className="h-full pr-4 min-h-[450px]">
                                        <motion.div 
                                            className="grid grid-cols-2 gap-4"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.1, duration: 0.3 }}
                                        >
                                            {createLoadSlots().map((slotData, index) => (
                                                <LoadSlotCard
                                                    key={slotData.id}
                                                    slotData={slotData}
                                                    index={index}
                                                    onClick={() => handleLoad(slotData)}
                                                />
                                            ))}
                                        </motion.div>
                                    </ScrollableContainer>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </>
    );
} 