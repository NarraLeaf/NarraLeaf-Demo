import React, { useMemo, useEffect } from 'react';

export const Slider: React.FC<{
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    isPercentage?: boolean;
}> = (props) => {
    const { value, min, max, unit = "", isPercentage = false } = props;
    
    const clampedValue = useMemo(() => Math.max(min, Math.min(max, value || 0)), [value, min, max]);
    
    const displayValue = useMemo(() => {
        return isPercentage ? `${Math.round(clampedValue * 100)}%` : `${Math.round(clampedValue)}${unit}`;
    }, [clampedValue, isPercentage, unit]);

    // 动态注入 CSS 样式
    useEffect(() => {
        const styleId = 'slider-thumb-styles';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                input[type="range"]::-webkit-slider-thumb:active {
                    transform: scale(0.85) !important;
                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
                    background-color: rgba(255, 255, 255, 0.9) !important;
                }
                input[type="range"]::-moz-range-thumb:active {
                    transform: scale(0.85) !important;
                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
                    background-color: rgba(255, 255, 255, 0.9) !important;
                }
                input[type="range"]::-ms-thumb:active {
                    transform: scale(0.85) !important;
                    box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.1) !important;
                    background-color: rgba(255, 255, 255, 0.9) !important;
                }
            `;
            document.head.appendChild(style);
        }

        return () => {
            const existingStyle = document.getElementById(styleId);
            if (existingStyle) {
                existingStyle.remove();
            }
        };
    }, []);

    return (
        <div className="flex items-center gap-4 group">
            <div className="relative flex items-center w-48 h-6">
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={props.step || 1}
                    value={clampedValue}
                    onChange={props.onChange}
                    className="outline-none w-full h-2 bg-white/15 rounded-lg cursor-pointer appearance-none transition-all duration-200 group-hover:bg-white/20
                             [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                             [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                             [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:ease-out
                             [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:hover:shadow-xl [&::-webkit-slider-thumb]:hover:bg-white/90
                             [&::-webkit-slider-track]:bg-transparent [&::-webkit-slider-track]:h-2 [&::-webkit-slider-track]:rounded-lg
                             [&::-webkit-slider-track]:bg-gradient-to-r [&::-webkit-slider-track]:from-white/80 [&::-webkit-slider-track]:to-white/15
                             [&::-webkit-slider-track]:bg-[length:var(--slider-progress,0%)_100%] [&::-webkit-slider-track]:bg-no-repeat
                             [&::-webkit-slider-track]:transition-all [&::-webkit-slider-track]:duration-300 [&::-webkit-slider-track]:ease-out"
                    style={{
                        '--slider-progress': `${((clampedValue - min) / (max - min)) * 100}%`
                    } as React.CSSProperties}
                />
            </div>
            <div className="w-16 text-right">
                <span className="text-white/80 text-sm font-medium transition-colors duration-200 group-hover:text-white/90">
                    {displayValue}
                </span>
            </div>
        </div>
    );
};