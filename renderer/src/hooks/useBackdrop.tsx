import { useDemoConfig } from "../components/DemoConfig";

export function useBackdrop(type: "sm" | "md" | "lg" = "sm"): string {
    const [visualEffect] = useDemoConfig("useVisualEffect");

    if (!visualEffect) {
        return "bg-black/30";
    }

    switch (type) {
        case "sm":
            return "backdrop-blur-sm";
        case "md":
            return "backdrop-blur-md";
        case "lg":
            return "backdrop-blur-lg";
    }
}