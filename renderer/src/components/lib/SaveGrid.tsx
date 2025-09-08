export type SaveGridItem = {
    id: string;
    /**
     * Base64 encoded image uri
     */
    thumbnail: string;
    title: string;
    timestamp: string;
    lastDialog: {
        sentence: string | null;
        speaker: string | null;
    } | null;
} | undefined;

export type SaveGridCoord = {
    column: number;
    row: number;
    index: number;
};

export type SaveGridConfig = {
    columns: number;
    rows: number;
    /**
     * If a empty grid is selected, the coord will be returned.
     */
    onSelect: (item: SaveGridItem | SaveGridCoord) => void;
    items: SaveGridItem[];
    className?: string;
    /**
     * Whether the grid is in loading state
     */
    isLoading?: boolean;
};

export function SaveGrid({ columns, rows, onSelect, items, className, isLoading = false }: SaveGridConfig) {
    function handleSelect(index: number) {
        if (isLoading) return;
        const item = items[index];
        if (!item) {
            onSelect({ column: index % columns, row: Math.floor(index / columns), index });
        } else {
            onSelect(item);
        }
    }

    return (
        <div className={`rounded-2xl p-8 shadow-lg w-[90%] h-[90%] mb-4 AlimamaFangYuanTiVF-Thin bg-bottom relative bg-black/10 backdrop-blur-md border-2 border-primary mx-auto ${className}`}>
            <div className="grid gap-4 h-full w-full" style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
            }}>
                {Array.from({ length: columns * rows }).map((_, index) => {
                    const item = items[index];
                    if (isLoading) {
                        return (
                            <div
                                key={index}
                                className="rounded-xl border-2 border-primary bg-black/20 backdrop-blur-sm p-4 flex flex-col min-h-0 animate-pulse"
                            >
                                <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-white/20 rounded w-1/2"></div>
                            </div>
                        );
                    }
                    if (!item) {
                        return (
                            <div
                                key={index}
                                className="rounded-xl border-2 border-primary bg-black/20 backdrop-blur-sm p-4 cursor-pointer hover:bg-black/30 transition-all duration-200 flex flex-col min-h-0"
                                onClick={() => handleSelect(index)}
                            >
                                <span className="text-white/70">Empty</span>
                            </div>
                        );
                    }
                    if (item.thumbnail && !item.thumbnail.startsWith('data:image')) {
                        throw new Error('Invalid thumbnail');
                    }
                    
                    return (
                        <div
                            key={item.id}
                            className="rounded-xl border-2 border-primary bg-black/10 backdrop-blur-sm p-4 cursor-pointer hover:bg-black/30 transition-all duration-200 flex flex-col min-h-0 relative overflow-hidden"
                            onClick={() => handleSelect(index)}
                        >
                            {item.thumbnail ? (
                                <div className="absolute inset-0 -z-10">
                                    <img 
                                        src={item.thumbnail} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover rounded-lg" 
                                    />
                                    <div className="absolute inset-0 rounded-lg bg-black/40" />
                                </div>
                            ) : (
                                <div className="absolute inset-0 -z-10 bg-black/30 rounded-lg" />
                            )}
                            <div className="flex-1 flex flex-col justify-between">
                                <h3 className="text-white text-lg font-medium mb-1 break-words line-clamp-3">{item.title}</h3>
                                {item.lastDialog && (
                                    <div className="mb-2">
                                        {item.lastDialog.speaker && (
                                            <p className="text-white text-sm mb-0.5 line-clamp-1">{item.lastDialog.speaker}{": "}</p>
                                        )}
                                        <p className="text-white text-sm italic break-words line-clamp-2">{item.lastDialog.sentence}</p>
                                    </div>
                                )}
                                <p className="text-white/80 text-sm break-words line-clamp-1">{item.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
