import React, { useState } from "react";
import { useRouter } from "narraleaf-react";
import Panel from "../src/components/Panel";
import { MenuButton } from "./home";
import { useSavedGames } from "narraleaf/client";
import type { SavedGameMetadata } from "narraleaf/client";

export default function Load() {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const savedGames = useSavedGames();

    const handleLoad = () => {
        if (selectedSlot !== null) {
            // TODO: Implement actual loading logic
            console.log(`Loading save slot ${selectedSlot}`);
            router.back();
        }
    };

    if (!savedGames) {
        return <Panel>Loading...</Panel>;
    }

    const { results, error, isLoading } = savedGames;

    if (error) {
        return <Panel>Error loading saved games: {error.message}</Panel>;
    }

    if (isLoading) {
        return <Panel>Loading saved games...</Panel>;
    }

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">读取存档</h1>
            
            <div className="space-y-4">
                {results.map((slot: SavedGameMetadata) => (
                    <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
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

                <MenuButton
                    onClick={() => router.push("home")}
                    className="mt-8"
                >
                    返回
                </MenuButton>
            </div>
        </Panel>
    );
}

export {config} from "./home"; 