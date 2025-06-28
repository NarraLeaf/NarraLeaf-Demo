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

    // Auto scroll to bottom when content changes
    useEffect(() => {
        if (autoScrollToBottom && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [children, autoScrollToBottom]);

    const handleScrollEvent = (e: React.UIEvent<HTMLDivElement>) => {
        onScroll?.(e);
    };

    return (
        <div
            ref={scrollRef}
            className={`overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-primary/60 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-primary/80 ${className}`}
            onScroll={handleScrollEvent}
        >
            {children}
        </div>
    );
};

export default ScrollableContainer; 