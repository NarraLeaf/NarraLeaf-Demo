import { motion } from "framer-motion";
import { useRouter } from "narraleaf-react";
import { useEffect } from "react";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.navigate("/home");
        }, 1000);
    }, []);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1, ease: "easeInOut" }}>
            <h1>Index</h1>
        </motion.div>
    );
}