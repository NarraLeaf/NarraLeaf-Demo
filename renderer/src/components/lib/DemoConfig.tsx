import { createContext, useContext, useEffect, useState } from "react";
import { EventEmitter } from "events";

const event = new EventEmitter<{
    "clientEvent:demoConfig.flush": [];
}>();

interface DemoConfig {
    useVisualEffect: boolean;
}

interface DemoConfigContextType {
    demoConfig: DemoConfig;
    setDemoConfig: (demoConfig: DemoConfig | ((prev: DemoConfig) => DemoConfig)) => void;
}

type UseDemoConfigReturn<K extends keyof DemoConfig> = [
    DemoConfig[K],
    (value: DemoConfig[K] | ((prev: DemoConfig[K]) => DemoConfig[K])) => void
];

export const DemoConfigContext = createContext<DemoConfigContextType | null>(null);

export function DemoConfigProvider({ children }: { children: React.ReactNode }) {
    const [demoConfig, setDemoConfig] = useState<DemoConfig>({
        useVisualEffect: false,
    });

    return (
        <DemoConfigContext.Provider value={{ demoConfig, setDemoConfig }}>
            {children}
        </DemoConfigContext.Provider>
    );
}

export function useDemoConfig<K extends keyof DemoConfig>(key: K): UseDemoConfigReturn<K> {
    const demoConfigContext = useContext(DemoConfigContext);
    const [, forceUpdate] = useState(0);
    if (!demoConfigContext) {
        throw new Error("DemoConfigContext not found");
    };
    
    useEffect(() => {
        event.on("clientEvent:demoConfig.flush", () => {
            forceUpdate(prev => prev + 1);
        });
    }, []);

    const { demoConfig, setDemoConfig } = demoConfigContext;

    return [demoConfig[key], (value: DemoConfig[K] | ((prev: DemoConfig[K]) => DemoConfig[K])) => {
        setDemoConfig(prev => ({ ...prev, [key]: typeof value === "function" ? value(prev[key]) : value }));
        event.emit("clientEvent:demoConfig.flush");
    }];
}
