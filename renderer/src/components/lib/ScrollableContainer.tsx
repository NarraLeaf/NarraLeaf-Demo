import React, { useRef, useEffect, ReactNode } from "react";

interface ScrollableContainerProps {
    children: ReactNode;
    className?: string;
    autoScrollToBottom?: boolean;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
    children,
    className = "",
    autoScrollToBottom = false,
    onScroll
}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const hasDragged = useRef(false);
    const startY = useRef(0);
    const scrollTop = useRef(0);

    // Auto scroll to bottom when content changes
    useEffect(() => {
        if (autoScrollToBottom && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [children, autoScrollToBottom]);

    // Handle mouse events for drag scrolling
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

    // Global mouse up handler
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (!scrollRef.current) return;
            isDragging.current = false;
            scrollRef.current.style.cursor = 'grab';
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    const handleScrollEvent = (e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
    };

    return (
        <div
            ref={scrollRef}
            className={`overflow-y-auto select-none cursor-grab [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80 ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onScroll={handleScrollEvent}
        >
            {children}
        </div>
    );
};

export default ScrollableContainer; 