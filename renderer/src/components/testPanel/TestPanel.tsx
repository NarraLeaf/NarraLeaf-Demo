import { useState, useEffect, useRef } from "react";
import { motion, PanInfo } from "framer-motion";

export interface TestPanelProps {
    isVisible: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    title?: string;
    className?: string;
    initialPosition?: { x: number; y: number };
}

export interface TestPanelTriggerProps {
    triggerKeys: string;
    onTrigger: () => void;
    hintText?: string;
    className?: string;
    showHint?: boolean;
}

// Test Panel Component - Now draggable and independent
export function TestPanel({ 
    isVisible, 
    onClose, 
    children, 
    title = "测试控制面板",
    className = "",
    initialPosition = { x: 20, y: 20 }
}: TestPanelProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // Handle drag end
    const handleDragEnd = (event: any, info: PanInfo) => {
        setPosition({
            x: position.x + info.offset.x,
            y: position.y + info.offset.y
        });
        setIsDragging(false);
    };

    // Handle drag start
    const handleDragStart = () => {
        setIsDragging(true);
    };

    // Reset position when panel becomes visible
    useEffect(() => {
        if (isVisible) {
            setPosition(initialPosition);
        }
    }, [isVisible, initialPosition]);

    if (!isVisible) return null;

    return (
        <motion.div 
            ref={panelRef}
            className={`fixed z-50 ${className}`}
            style={{
                left: position.x,
                top: position.y,
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto'
            }}
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
        >
            <div 
                className={`bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-2xl ${
                    isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            >
                {/* Drag Handle */}
                <div 
                    className="flex justify-between items-center p-4 border-b border-white/20 cursor-grab active:cursor-grabbing"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                >
                    <h2 className="text-xl text-white font-semibold">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="text-white/60 hover:text-white text-lg transition-colors p-1 hover:bg-white/10 rounded"
                    >
                        ✕
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}

// Test Panel Trigger Component
export function TestPanelTrigger({ 
    triggerKeys, 
    onTrigger, 
    hintText,
    className = "",
    showHint = true // Default to true for backward compatibility
}: TestPanelTriggerProps) {
    const [typedKeys, setTypedKeys] = useState<string>("");
    const [showHintState, setShowHintState] = useState<boolean>(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Only handle alphanumeric keys
            if (event.key.length === 1) {
                const newTypedKeys = typedKeys + event.key;
                setTypedKeys(newTypedKeys);
                
                // Check if trigger keys are typed
                if (newTypedKeys.includes(triggerKeys)) {
                    onTrigger();
                    setTypedKeys(""); // Reset typed keys
                }
                
                // Limit the length of typed keys to prevent memory issues
                if (newTypedKeys.length > 10) {
                    setTypedKeys(newTypedKeys.slice(-10));
                }
            }
        };

        // Add escape key to hide test panel
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onTrigger();
                setTypedKeys("");
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keydown', handleEscape);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keydown', handleEscape);
        };
    }, [typedKeys, triggerKeys, onTrigger]);

    // Show hint after a delay, but only if showHint is true
    useEffect(() => {
        if (showHint) {
            const timer = setTimeout(() => setShowHintState(true), 1000);
            return () => clearTimeout(timer);
        } else {
            setShowHintState(false);
        }
    }, [showHint]);

    if (!showHintState) return null;

    return (
        <motion.div 
            className={`fixed bottom-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-3 z-40 ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
        >
            <p className="text-white/80 text-sm">
                💡 {hintText || `输入 "${triggerKeys}" 显示测试面板`}
            </p>
        </motion.div>
    );
}

// Hook for managing test panel state
export function useTestPanel(triggerKeys: string = "dev") {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const togglePanel = () => setIsVisible(!isVisible);
    const closePanel = () => setIsVisible(false);
    const openPanel = () => setIsVisible(true);

    return {
        isVisible,
        togglePanel,
        closePanel,
        openPanel,
        triggerKeys
    };
} 