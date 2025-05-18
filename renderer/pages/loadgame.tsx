import { useGame, useRouter } from "narraleaf-react";
import { useSavedGames, readGame, SaveType } from "narraleaf/client";
import Panel from "../src/components/Panel";
import { SaveGrid, SaveGridItem, SaveGridCoord } from "../src/components/lib/SaveGrid";
import { useEffect } from "react";
import { useConfirm } from "../src/hooks/useConfirm";

export default function LoadGame() {
    const router = useRouter();
    const savedGames = useSavedGames();
    const game = useGame();
    const liveGame = game.getLiveGame();
    const [confirmLoad, ConfirmLoadDialog] = useConfirm({
        message: "确定要加载游戏吗？",
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

    const gridItems: SaveGridItem[] = results.filter((result) => {
        return result.type === SaveType.Save;
    }).map((result) => ({
        id: result.id,
        thumbnail: result.capture ?? "",
        title: "Save",
        timestamp: new Date(result.updated).toLocaleString(),
    }));

    const handleSelect = (item: SaveGridItem | SaveGridCoord) => {
        if ('index' in item) {
            return;
        } else {
            confirmLoad().then((result) => {
                if (result) {
                    readGame(item.id).then((game) => {
                        liveGame.deserialize(game);
                        router.back();
                    });
                }
            });
        }
    };

    return (
        <>
            <Panel>
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                        <h1 className="text-2xl font-bold text-white">加载游戏</h1>
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
            {ConfirmLoadDialog}
        </>
    );
}

export { config } from "./home";

