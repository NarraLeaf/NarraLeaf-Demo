import { useRouter } from "narraleaf-react";
import { useGamePlayback } from "narraleaf/client";
import { useEffect } from "react";
import { QuickMenu } from "../src/components/QuickMenu";
import { useDemoConfig } from "../src/components/DemoConfig";

export default function Index() {
    const router = useRouter();
    const { isPlaying } = useGamePlayback();
    const [splashScreen, setSplashScreen] = useDemoConfig("isSplashScreen");

    useEffect(() => {
        if (!isPlaying) {
            if (splashScreen) {
                router.navigate("/splash-screen");
                setSplashScreen(false);
            } else {
                router.navigate("/home");
            }
        }
    }, [isPlaying]);

    return (
        isPlaying && <QuickMenu />
    );
}