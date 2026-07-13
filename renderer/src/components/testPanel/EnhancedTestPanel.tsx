import { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "motion/react";

export interface EnhancedTestPanelProps {
    isVisible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
    className?: string;
    initialPosition?: { x: number; y: number };
    initialSize?: { width: number; height: number };
    onMinimize?: () => void;
    isMinimized?: boolean;
}

export function EnhancedTestPanel({ 
    isVisible, 
    onClose, 
    children, 
    title = "Test Control Panel",
    className = "",
    initialPosition = { x: 20, y: 20 },
    initialSize = { width: 500, height: 600 },
    onMinimize,
    isMinimized = false
}: EnhancedTestPanelProps) {
    const [position, setPosition] = useState(initialPosition);
    const [size, setSize] = useState(initialSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [isMinimizedState, setIsMinimizedState] = useState(isMinimized);
    const [resizeType, setResizeType] = useState<'se' | 's' | 'e'>('se');
    const panelRef = useRef<HTMLDivElement>(null);
    const resizeStartPos = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

    // Handle drag end - Only update position if not resizing
    const handleDragEnd = (event: any, info: PanInfo) => {
        if (!isResizing) {
            setPosition(prev => ({
                x: prev.x + info.delta.x,
                y: prev.y + info.delta.y
            }));
        }
        setIsDragging(false);
    };

    // Handle drag start
    const handleDragStart = () => {
        if (!isResizing) {
            setIsDragging(true);
        }
    };

    // Handle resize with global mouse events
    const handleResize = (e: MouseEvent) => {
        if (!isResizing || !resizeStartPos.current) return;
        
        const deltaX = e.clientX - resizeStartPos.current.x;
        const deltaY = e.clientY - resizeStartPos.current.y;
        
        let newWidth = resizeStartPos.current.width;
        let newHeight = resizeStartPos.current.height;
        
        // Apply changes based on resize type
        if (resizeType === 'se' || resizeType === 'e') {
            newWidth = resizeStartPos.current.width + deltaX;
        }
        if (resizeType === 'se' || resizeType === 's') {
            newHeight = resizeStartPos.current.height + deltaY;
        }
        
        setSize({
            width: Math.max(300, Math.min(800, newWidth)),
            height: Math.max(200, Math.min(window.innerHeight * 0.8, newHeight))
        });
    };

    // Handle resize end with global mouse events
    const handleResizeEnd = () => {
        setIsResizing(false);
        resizeStartPos.current = null;
    };

    // Handle resize start
    const handleResizeStart = (e: React.MouseEvent, type: 'se' | 's' | 'e' = 'se') => {
        e.stopPropagation(); // Prevent drag from starting
        e.preventDefault();
        setIsResizing(true);
        setResizeType(type);
        resizeStartPos.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        };
    };

    // Handle minimize
    const handleMinimize = () => {
        onMinimize?.();
    };

    // Add global mouse event listeners for resize
    useEffect(() => {
        if (isResizing) {
            const handleGlobalMouseMove = (e: MouseEvent) => {
                handleResize(e);
            };

            const handleGlobalMouseUp = () => {
                handleResizeEnd();
            };

            document.addEventListener('mousemove', handleGlobalMouseMove);
            document.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleGlobalMouseMove);
                document.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isResizing]);

    // Reset position when panel becomes visible
    useEffect(() => {
        if (isVisible) {
            setPosition(initialPosition);
            setSize(initialSize);
        }
    }, [isVisible, initialPosition, initialSize]);

    // Sync minimized state with prop
    useEffect(() => {
        setIsMinimizedState(isMinimized);
    }, [isMinimized]);

    if (!isVisible) return null;

    return (
        <motion.div 
            ref={panelRef}
            className={`fixed z-50 ${className}`}
            style={{
                left: position.x,
                top: position.y,
                width: isMinimizedState ? 'auto' : size.width,
                height: isMinimizedState ? 'auto' : size.height,
                maxWidth: '800px',
                maxHeight: '90vh',
                minWidth: '300px',
                minHeight: '200px'
            }}
            drag={!isMinimizedState && !isResizing}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={false}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <div 
                className={`bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            >
                {/* Drag Handle */}
                <div 
                    className="flex justify-between items-center p-3 border-b border-white/20 cursor-grab active:cursor-grabbing"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <h2 className="text-lg text-white font-semibold">{title}</h2>
                    <div className="flex items-center space-x-1">
                        <button 
                            onClick={handleMinimize}
                            className="text-white/60 hover:text-white text-sm transition-colors p-1 hover:bg-white/10 rounded"
                            title="Minimize"
                        >
                            {isMinimizedState ? '□' : '−'}
                        </button>
                        <button 
                            onClick={onClose}
                            className="text-white/60 hover:text-white text-sm transition-colors p-1 hover:bg-white/10 rounded"
                            title="Close"
                        >
                            ✕
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                {!isMinimizedState && (
                    <div 
                        className="p-4 overflow-auto"
                        style={{ height: `calc(100% - 60px)` }}
                    >
                        {children}
                    </div>
                )}

                {/* Resize Handles - Multiple handles for better control */}
                {!isMinimizedState && (
                    <>
                        {/* Bottom-right corner resize handle */}
                        <div 
                            className="absolute bottom-0 right-0 w-8 h-8 cursor-se-resize flex items-end justify-end"
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                            style={{ 
                                cursor: isResizing ? 'se-resize' : 'se-resize',
                                zIndex: 10
                            }}
                        >
                            <div className="w-0 h-0 border-l-6 border-l-transparent border-b-6 border-b-white/40 hover:border-b-white/60 transition-colors"></div>
                        </div>

                        {/* Bottom edge resize handle for vertical only */}
                        <div 
                            className="absolute bottom-0 left-0 right-8 h-2 cursor-s-resize"
                            onMouseDown={(e) => handleResizeStart(e, 's')}
                            style={{ 
                                cursor: isResizing ? 's-resize' : 's-resize',
                                zIndex: 10
                            }}
                        >
                            <div className="w-full h-full bg-transparent hover:bg-white/10 transition-colors"></div>
                        </div>

                        {/* Right edge resize handle for horizontal only */}
                        <div 
                            className="absolute top-0 bottom-8 right-0 w-2 cursor-e-resize"
                            onMouseDown={(e) => handleResizeStart(e, 'e')}
                            style={{ 
                                cursor: isResizing ? 'e-resize' : 'e-resize',
                                zIndex: 10
                            }}
                        >
                            <div className="w-full h-full bg-transparent hover:bg-white/10 transition-colors"></div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
}

// Minimized Panel Component
export function MinimizedTestPanel({
    isVisible,
    onRestore,
    title = "Test Panel"
}: {
    isVisible: boolean;
    onRestore: () => void;
    title?: string;
}) {
    if (!isVisible) return null;

    return (
        <motion.div 
            className="fixed bottom-4 left-4 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
        >
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-lg">
                <div className="flex items-center space-x-3">
                    <span className="text-white/80 text-sm">{title}</span>
                    <button 
                        onClick={onRestore}
                        className="text-white/60 hover:text-white text-sm transition-colors p-1 hover:bg-white/10 rounded"
                        title="Restore"
                    >
                        □
                    </button>
                </div>
            </div>
        </motion.div>
    );
} 
