import { useBackdrop } from '../../hooks/useBackdrop';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import clsx from 'clsx';

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
                event.preventDefault();
                event.stopPropagation();
                onCancel();
            }
        };

        window.addEventListener('keydown', handleEsc, true);
        return () => {
            window.removeEventListener('keydown', handleEsc, true);
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
                        className={clsx(
                            "relative p-16 w-[500px] ZhanKu",
                        )}
                        style={{
                            backgroundImage: "url('/static/img/ui/popup/popup-dialog.png')",
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                    >
                        {title && (
                            <h3 className="text-2xl text-white mb-4">{title}</h3>
                        )}
                        <p className="text-white text-2xl mb-12 pr-8">{message}</p>
                        
                        {/* Buttons */}
                        <div className="absolute bottom-4 right-[52px] flex">
                            <button
                                onClick={onCancel}
                                className="relative w-[82px] h-[43px] flex items-center justify-center text-white transition-all duration-200 hover:-translate-y-1 active:translate-y-0 hover:drop-shadow-[0_0_1px_#ffffff] hover:opacity-90 outline-none"
                                style={{
                                    backgroundImage: "url('/static/img/ui/popup/dialog-btn-secondary.png')",
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center'
                                }}
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="relative w-[82px] h-[43px] flex items-center justify-center text-[#40a8c5] transition-all duration-200 hover:-translate-y-1 active:translate-y-0 hover:drop-shadow-[0_0_3px_#ffffff] hover:opacity-90 outline-none"
                                style={{
                                    backgroundImage: "url('/static/img/ui/popup/dialog-btn-primary.png')",
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center'
                                }}
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
