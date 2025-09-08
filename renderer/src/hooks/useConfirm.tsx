import { useState, useCallback, useMemo } from 'react';
import { Confirm } from '../components/lib/Confirm';

interface UseConfirmOptions {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

type UseConfirmReturn = [
    confirm: (options?: Partial<UseConfirmOptions>) => Promise<boolean>,
    ConfirmDialog: React.ReactNode
];

export function useConfirm(defaultOptions: Partial<UseConfirmOptions> = {}): UseConfirmReturn {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<UseConfirmOptions>({
        message: '',
        onConfirm: () => {},
        onCancel: () => {},
        ...defaultOptions
    });

    const confirm = useCallback((newOptions?: Partial<UseConfirmOptions>) => {
        return new Promise<boolean>((resolve) => {
            setOptions(prev => ({
                ...prev,
                ...newOptions,
                onConfirm: () => {
                    setIsOpen(false);
                    newOptions?.onConfirm?.();
                    resolve(true);
                },
                onCancel: () => {
                    setIsOpen(false);
                    newOptions?.onCancel?.();
                    resolve(false);
                }
            }));
            setIsOpen(true);
        });
    }, []);

    const ConfirmDialog = useMemo(() => (
        <Confirm
            isOpen={isOpen}
            title={options.title}
            message={options.message}
            confirmText={options.confirmText}
            cancelText={options.cancelText}
            onConfirm={options.onConfirm}
            onCancel={options.onCancel}
        />
    ), [isOpen, options.title, options.message, options.confirmText, options.cancelText, options.onConfirm, options.onCancel]);

    return [confirm, ConfirmDialog];
} 