import { GameMenu, Item } from "narraleaf-react";
import React from "react";

export function DefaultMenu({items}: { items: number[] }) {
    return (
        <GameMenu
            className="absolute flex flex-col items-center justify-center min-w-full w-full h-full text-black"
        >
            {items.map((index) => (
                <Item
                    key={index}
                    className="bg-white text-black p-2 mt-2 w-1/2"
                />
            ))}
        </GameMenu>
    );
}