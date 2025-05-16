import { useGame, useRouter } from "narraleaf-react";
import { useEffect } from "react";
import Panel from "../src/components/Panel";

export default function Load() {
    const router = useRouter();
    const game = useGame();
    const liveGame = game.getLiveGame();

    const history = liveGame.getHistory();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                router.back();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    return (
        <Panel>
            <h1 className="text-2xl font-bold text-white mb-6">历史记录</h1>
            <div className="space-y-4">
                {history.map((h) => (
                    <div key={h.token}>{h.element.type} {h.element.text}</div>
                ))}
            </div>
        </Panel>
    );
}

export { config } from "./home";
