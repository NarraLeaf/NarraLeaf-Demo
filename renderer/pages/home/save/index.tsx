import { useGame, useRouter } from "narraleaf-react";
import type { SavedGameMeta } from "narraleaf/renderer";
import { SaveType, useSavedGames, useSaveAction } from "narraleaf/renderer";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HomePagesAnimation } from "../index";
import ScrollableContainer from "../../../src/components/lib/ScrollableContainer";
import { useAppConfirm } from "../layout";

type SaveSlotData = {
    id: string;
    isEmpty: boolean;
    existingSave?: SavedGameMeta;
};

export default function Save() {
    const router = useRouter();
    const game = useGame();
    const savedGames = useSavedGames();
    const liveGame = game.getLiveGame();
    const saveAction = useSaveAction();
    const { showConfirm } = useAppConfirm();



    const handleSave = async (slotData: SaveSlotData) => {
        // If slot has existing save, confirm overwrite
        if (!slotData.isEmpty) {
            const confirmed = await showConfirm({ message: "确定要覆盖当前存档吗？" });
            if (!confirmed) return;
        }

        router.clear();
        await liveGame.waitForRouterExit().promise;

        setTimeout(async () => {
            try {
                await saveAction.save(slotData.id);
                liveGame.notify("保存成功");
            } catch (error) {
                console.error("Failed to save game:", error);
                liveGame.notify("保存游戏失败");
            }
        }, 1);
    };

    // Create save slots (9 slots in 2 columns, so some slots will be on the right)
    const createSaveSlots = (): SaveSlotData[] => {
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

    // Save slot card component
    const SaveSlotCard = ({ slotData, index, onClick }: {
        slotData: SaveSlotData;
        index: number;
        onClick: () => void;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={onClick}
            className="aspect-[4/3] rounded-lg cursor-pointer transition-all duration-200 backdrop-blur-sm relative overflow-hidden border-2 bg-white/20 border-transparent hover:bg-white/30 hover:border-white/20 hover:shadow-md"
        >
            {/* Background image or empty state */}
            {slotData.isEmpty ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-white/40 text-4xl">+</div>
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
                        <p className="text-white/70 text-xs">
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

            {/* Overwrite indicator */}
            {/* {!slotData.isEmpty && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500/80 rounded-full flex items-center justify-center z-20">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
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
                        <h1 className="text-2xl font-bold text-white">保存游戏</h1>
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
                                    <ScrollableContainer className="h-full pr-4">
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
                                            {createSaveSlots().map((slotData, index) => (
                                                <SaveSlotCard
                                                    key={slotData.id}
                                                    slotData={slotData}
                                                    index={index}
                                                    onClick={() => handleSave(slotData)}
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
