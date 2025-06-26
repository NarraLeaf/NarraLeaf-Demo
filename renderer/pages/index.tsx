import { motion } from "framer-motion";
import { useRouter } from "narraleaf-react";
import { useEffect } from "react";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        router.navigate("/home");
    }, []);

    return (
        <div className="absolute inset-0 flex items-center justify-center">
            Index
        </div>
    );
}