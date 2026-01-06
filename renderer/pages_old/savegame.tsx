import { useGame, useRouter } from "narraleaf-react";
import { useSavedGames, useSaveAction, SaveType } from "narraleaf/renderer";
import Panel from "../src/components/Panel";
import { SaveGrid, SaveGridItem, SaveGridCoord } from "../src/components/lib/SaveGrid";
import { useEffect } from "react";
import { useConfirm } from "../src/hooks/useConfirm";

export default function SaveGame() {
    const router = useRouter();
    const savedGames = useSavedGames();
    const game = useGame();
    const liveGame = game.getLiveGame();
    const saveAction = useSaveAction();
    const [confirmSave, ConfirmSaveDialog] = useConfirm({
        message: "确定要覆盖当前存档吗？",
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                router.back();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [router]);

    const { results, error, isLoading } = savedGames;

    if (error) {
        return <Panel>Error loading saved games: {error.message}</Panel>;
    }

    const gridItems: SaveGridItem[] = Array.from({ length: 9 }, (_, index) => {
        const saveId = (index).toString();
        const existingSave = results.find(result => 
            result.type === SaveType.Save && result.id === saveId
        );
        
        if (existingSave) {
            return {
                id: existingSave.id,
                thumbnail: existingSave.capture ?? "",
                title: "Save",
                timestamp: new Date(existingSave.updated).toLocaleString(),
                lastDialog: {
                    sentence: existingSave.lastSentence,
                    speaker: existingSave.lastSpeaker,
                },
            };
        }
        
        return undefined;
    });

    const handleSelect = async (item: SaveGridItem | SaveGridCoord) => {
        if (!item) return;

        if (!('index' in item)) {
            const result = await confirmSave();
            if (!result) return;
        }

        router.clear();
        await game.getLiveGame().waitForRouterExit().promise;

        setTimeout(async () => {
            if ('index' in item) {
                // Handle empty slot selection for new save
                await saveAction.save(item.index.toString());
            } else {
                // Handle overwriting existing save
                await saveAction.save(item.id);
            }
            liveGame.notify("保存成功");
        }, 1);
    };

    return (
        <>
            <Panel>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h1 className="text-2xl font-bold text-white">保存游戏</h1>
                        <button
                            onClick={() => router.back()}
                            className="px-4 py-2 text-white border border-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
                        >
                            返回
                        </button>
                    </div>
                    <div className="flex-1 min-h-0">
                        <SaveGrid
                            columns={3}
                            rows={3}
                            onSelect={handleSelect}
                            items={gridItems}
                            className="w-full h-full"
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </Panel>
            {ConfirmSaveDialog}
        </>
    );
}

export { config } from "./home";

