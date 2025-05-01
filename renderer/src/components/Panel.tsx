import React from "react";

interface PanelProps {
    children: React.ReactNode;
    className?: string;
}

const Panel: React.FC<PanelProps> = ({ children, className = "" }) => (
    <div className={`absolute left-8 top-0 h-full w-1/3 bg-black/20 shadow-2xl ${className} p-4`}>
        {children}
    </div>
);

export default Panel;



