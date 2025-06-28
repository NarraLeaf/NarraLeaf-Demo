import { useRouter } from "narraleaf-react";
import { useGamePlayback } from "narraleaf/client";
import { useEffect } from "react";
import { QuickMenu } from "../src/components/QuickMenu";

export default function Index() {
    const router = useRouter();
    const { isPlaying } = useGamePlayback();

    useEffect(() => {
        if (!isPlaying) {
            router.navigate("/home");
        }
    }, [isPlaying]);

    return (
        isPlaying ? (
            <QuickMenu />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center">
                Index
            </div>
        )
    );
}