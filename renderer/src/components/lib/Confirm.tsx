import { useBackdrop } from '../../hooks/useBackdrop';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ConfirmProps {
    isOpen: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export function Confirm({
    isOpen,
    onConfirm,
    onCancel,
    title,
    message,
    confirmText = "确认",
    cancelText = "取消"
}: ConfirmProps) {
    const backdrop = useBackdrop("md");

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpen && onCancel) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onCancel]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`fixed inset-0 bg-black/30 ${backdrop}`}
                        onClick={onCancel}
                    />
                    
                    {/* Modal */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`relative rounded-2xl p-8 shadow-lg w-[400px] AlimamaFangYuanTiVF-Thin bg-black/50 ${backdrop} border-2 border-primary`}
                    >
                        {title && (
                            <h3 className="text-xl text-white mb-4">{title}</h3>
                        )}
                        <p className="text-white text-lg mb-6">{message}</p>
                        
                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg border-2 border-primary text-white hover:bg-primary/20 transition-colors"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/80 transition-colors"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
