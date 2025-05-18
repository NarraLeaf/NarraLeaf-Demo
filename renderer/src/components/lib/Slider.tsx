export const Slider: React.FC<{
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    isPercentage?: boolean;
}> = ({ value, onChange, min, max, step = 1, unit = "", isPercentage = false }) => (
    <div className="flex items-center gap-4">
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-32 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <div className="w-16 text-right">
            <span className="text-white/80 text-sm">
                {isPercentage ? `${Math.round(value * 100)}%` : `${value}${unit}`}
            </span>
        </div>
    </div>
);