import {IGamePluginRegistry, LiveGameEventToken, Scene} from "narraleaf-react";

export function createPreloadEntryPlugin(entry: Scene): IGamePluginRegistry {
    let tokens: LiveGameEventToken[] = [];
    return {
        name: "demo:preload-entry",
        register(game) {
            tokens.push(game.hooks.hook("init", () => {
                if (!game.getLiveGame().getGameState()) {
                    console.warn("Game state is not found");
                }
                game.getLiveGame().getGameState()?.preloadScene(entry);
            }));
        },
        unregister() {
            tokens.forEach((token) => {
                token.cancel();
            });
        }
    };
}
