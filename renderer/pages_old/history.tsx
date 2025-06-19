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
    const hasDragged = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    const history = liveGame.getHistory();

    // Memoize filtered history to prevent unnecessary re-renders
    const filteredHistory = useMemo(() => {
        return history.filter(h => h.element.text || (h.element.type === "menu" && h.element.selected));
    }, [history]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [filteredHistory]);

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
        hasDragged.current = false;
        startY.current = e.pageY - scrollRef.current.offsetTop;
        scrollTop.current = scrollRef.current.scrollTop;
        scrollRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const y = e.pageY - scrollRef.current.offsetTop;
        const walk = (y - startY.current) * 1;
        scrollRef.current.scrollTop = scrollTop.current - walk;
        hasDragged.current = true;
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
        if (hasDragged.current) return;
        game.getLiveGame().undo(token);
        router.clear();
    }

    const handleKeyNavigation = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Enter') {
            handleClick(filteredHistory[index].token);
        } else if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            const prevElement = document.querySelector(`[data-index="${index - 1}"]`) as HTMLElement;
            if (prevElement) {
                prevElement.focus();
                // Ensure the element is in view
                prevElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        } else if (e.key === 'ArrowDown' && index < filteredHistory.length - 1) {
            e.preventDefault();
            const nextElement = document.querySelector(`[data-index="${index + 1}"]`) as HTMLElement;
            if (nextElement) {
                nextElement.focus();
                // Ensure the element is in view
                nextElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    };

    return (
        <Panel>
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-white">历史记录</h1>
                    <button 
                        onClick={() => router.back()}
                        className="px-4 py-2 text-white border border-primary rounded-lg hover:bg-primary/10 transition-colors duration-200"
                    >
                        返回
                    </button>
                </div>
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto select-none cursor-grab pr-4 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <div className="space-y-4">
                        {filteredHistory.map((h, index) => {
                            const isLast = index === filteredHistory.length - 1;
                            if (h.element.type === "menu") {
                                return (
                                    <div
                                        id={isLast ? "last-history" : undefined}
                                        key={h.token}
                                        data-index={index}
                                        onClick={() => handleClick(h.token)}
                                        onKeyDown={(e) => handleKeyNavigation(e, index)}
                                        tabIndex={0}
                                        className="p-4 border border-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors duration-200 text-white focus:outline-2 focus:outline focus:outline-primary focus:outline-offset-[-2px] focus:shadow-[0_0_15px_rgba(var(--color-primary),0.5)] focus:border-primary/80 focus:bg-primary/20"
                                    >
                                        {h.element.text}{h.element.text && ": "}{h.element.selected}
                                    </div>
                                );
                            }
                            return (
                                <div
                                    id={isLast ? "last-history" : undefined}
                                    key={h.token}
                                    data-index={index}
                                    onClick={() => handleClick(h.token)}
                                    onKeyDown={(e) => handleKeyNavigation(e, index)}
                                    tabIndex={0}
                                    className="p-4 border border-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors duration-200 text-white focus:outline-2 focus:outline focus:outline-primary focus:outline-offset-[-2px] focus:shadow-[0_0_15px_rgba(var(--color-primary),0.5)] focus:border-primary/80 focus:bg-primary/20"
                                >
                                    {h.element.character ? (
                                        <>
                                            <span className="text-primary font-bold">{h.element.character}</span> {": "} <span className="text-white">{h.element.text}</span>
                                        </>
                                    ) : (
                                        <span className="text-neutral-300 italic">{h.element.text}</span>
                                    )}
                                </div>
                            );
                        })}
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
