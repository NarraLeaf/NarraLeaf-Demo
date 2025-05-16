import { useGame, useRouter } from "narraleaf-react";
import { useEffect, useMemo, useRef } from "react";
import Panel from "../src/components/Panel";
import { PageConfig } from "narraleaf/client";

export default function Load() {
    const router = useRouter();
    const game = useGame();
    const liveGame = game.getLiveGame();
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    const history = liveGame.getHistory();

    // Memoize filtered history to prevent unnecessary re-renders
    const filteredHistory = useMemo(() => {
        return history.filter(h => h.element.text && h.element.type !== "menu");
    }, [history]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                router.back();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [router]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        startY.current = e.pageY - scrollRef.current.offsetTop;
        scrollTop.current = scrollRef.current.scrollTop;
        scrollRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const y = e.pageY - scrollRef.current.offsetTop;
        const walk = (y - startY.current) * 2;
        scrollRef.current.scrollTop = scrollTop.current - walk;
    };

    const handleMouseUp = () => {
        if (!scrollRef.current) return;
        isDragging.current = false;
        scrollRef.current.style.cursor = 'grab';
    };

    useEffect(() => {
        const handleMouseUp = () => {
            if (!scrollRef.current) return;
            isDragging.current = false;
            scrollRef.current.style.cursor = 'grab';
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    function handleClick(token: string) {
        game.getLiveGame().undo(token);
        router.clear();
    }

    return (
        <Panel>
            <div className="flex flex-col h-full">
                <h1 className="text-2xl font-bold text-white mb-6">历史记录</h1>
                <div 
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div className="space-y-4">
                        {filteredHistory.map((h) => (
                            <div 
                                key={h.token} 
                                onClick={() => handleClick(h.token)}
                                className="p-4 border border-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors duration-200 text-white"
                            >
                                {h.element.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Panel>
    );
}

export const config: PageConfig = {
    initial: {
        opacity: 0,
    },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.1,
        }
    },
    exit: {
        opacity: 0,
        transition: {
            duration: 0.1,
        }
    },
};
