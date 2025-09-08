import clsx from "clsx";

interface MenuButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
}

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick, children, className }) => (
    <button
        onClick={onClick}
        className={clsx(`w-full px-8 py-5 bg-gradient-to-r from-primary/90 to-primary/80 
                 hover:from-primary hover:to-primary/90 text-white rounded-xl shadow-lg 
                 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
                 hover:shadow-xl active:translate-y-0 border border-white/10
                 backdrop-blur-sm`, className)}
    >
        {children}
    </button>
);

