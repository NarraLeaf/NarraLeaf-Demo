import { useRouter } from "narraleaf-react";
import { useGamePlayback } from "narraleaf/renderer";
import { useEffect } from "react";


export function GameExitListener() {
    const router = useRouter();
    const { isPlaying } = useGamePlayback();

    useEffect(() => {
        if (!isPlaying) {
            return;
        }
        
        const listener = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                router.navigate("/");
            }
        };
        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, [isPlaying]);

    return null;
}
