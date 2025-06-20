import { useRouter } from "narraleaf-react";
import { useEffect } from "react";
import HomePanel from "./home";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        router.navigate("/home");
    }, []);

    return (
        <div className="w-full h-full">
            <HomePanel />
        </div>
    );
}