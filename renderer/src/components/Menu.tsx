import { GameMenu, Item } from "narraleaf-react";

export function DefaultMenu({items}: { items: number[] }) {
    return (
        <GameMenu
            className="absolute flex flex-col items-center justify-center min-w-full w-full h-full"
        >
            {items.map((index) => (
                <Item
                    key={index}
                    className="bg-black/50 backdrop-blur-sm text-white p-4 mb-4 w-[50%] rounded-xl border-2 border-primary hover:bg-black/70 transition-colors duration-200"
                />
            ))}
        </GameMenu>
    );
}