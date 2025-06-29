import { GameMenu, Item } from "narraleaf-react";

export function DefaultMenu({ items }: { items: number[] }) {
    return (
        // Root container anchors to bottom of the screen and disables pointer-events for unused areas
        <GameMenu className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none">
            {/*
             * The inner wrapper collects pointer events so only the dialog box area is interactive
             */}
            <div className="relative w-full max-w-5xl pointer-events-auto px-4 md:px-8">
                <div className="px-10 py-8 space-y-4">
                    {items.map((index) => (
                        <Item
                            key={index}
                            className="block md:w-3/4 lg:w-2/3 mx-auto text-center text-white text-lg py-3 px-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:[filter:drop-shadow(8px_8px_0_rgba(0,0,0,0.8))]"
                            style={{
                                backgroundColor: "rgba(64,168,197,0.9)",
                                clipPath: "polygon(0 0,100% 0,97% 100%,3% 100%)",
                                filter: "drop-shadow(4px 4px 0 rgba(0,0,0,0.6))",
                            }}
                        />
                    ))}
                </div>
            </div>
        </GameMenu>
    );
}