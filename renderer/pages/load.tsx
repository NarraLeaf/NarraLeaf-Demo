import React, { useState } from "react";
import { useRouter } from "narraleaf-react";
import Panel from "../src/components/Panel";
interface SaveSlot {
    id: number;
    title: string;
    date: string;
    thumbnail?: string;
}

export default function Load() {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

    // Mock save slots data
    const saveSlots: SaveSlot[] = [
        {
            id: 1,
            title: "存档 1",
            date: "2024-03-20 15:30",
            thumbnail: "/static/img/ui/save-thumb-1.jpg"
        },
        {
            id: 2,
            title: "存档 2",
            date: "2024-03-20 14:15"
        },
        {
            id: 3,
            title: "存档 3",
            date: "2024-03-19 20:45"
        }
    ];

    const handleLoad = () => {
        if (selectedSlot !== null) {
            // TODO: Implement actual loading logic
            console.log(`Loading save slot ${selectedSlot}`);
            router.back();
        }
    };

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">读取存档（摆设）</h1>
            
            <div className="space-y-4">
                {saveSlots.map((slot) => (
                    <div
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200
                                 ${selectedSlot === slot.id 
                                    ? 'bg-indigo-600/90' 
                                    : 'bg-white/20 hover:bg-white/30'}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-white text-lg font-medium">{slot.title}</h3>
                                <p className="text-white/70 text-sm">{slot.date}</p>
                            </div>
                            {slot.thumbnail && (
                                <img 
                                    src={slot.thumbnail} 
                                    alt={`${slot.title} thumbnail`}
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
                                ? 'bg-indigo-600/90 hover:bg-indigo-700 hover:-translate-y-1 hover:shadow-xl active:translate-y-0'
                                : 'bg-gray-500/50 cursor-not-allowed'}`}
                >
                    读取选中存档
                </button>

                <button
                    onClick={() => router.push("home")}
                    className="w-full px-6 py-4 bg-indigo-600/90 hover:bg-indigo-700 text-white rounded-lg shadow-lg 
                             transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                             hover:shadow-xl active:translate-y-0"
                >
                    返回
                </button>
            </div>
        </Panel>
    );
}

export {config} from "./home"; 