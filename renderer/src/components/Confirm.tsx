import React from 'react';
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onCancel}
            />
            
            {/* Modal */}
            <div className="relative rounded-2xl p-8 shadow-lg w-[400px] AlimamaFangYuanTiVF-Thin bg-black/50 backdrop-blur-md border-2 border-primary">
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
            </div>
        </div>
    );
}
