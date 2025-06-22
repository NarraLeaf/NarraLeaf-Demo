import { useRouter } from "narraleaf-react";
import { useEffect } from "react";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        router.navigate("/home");
    }, []);

    return null;
}