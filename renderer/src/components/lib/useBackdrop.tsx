import { useDemoConfig } from "./DemoConfig";

export function useBackdrop(): string {
    const [visualEffect] = useDemoConfig("useVisualEffect");

    if (!visualEffect) {
        return "bg-black/30";
    }

    return "backdrop-blur-sm";
}
