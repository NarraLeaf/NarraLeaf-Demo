export const Checkbox: React.FC<{
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
        />
        <div className={`w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer 
            peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] 
            after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 
            after:w-5 after:transition-all peer-checked:bg-primary hover:bg-white/30 
            transition-colors duration-200`}></div>
    </label>
);