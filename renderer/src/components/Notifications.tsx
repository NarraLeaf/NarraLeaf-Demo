import { INotificationsProps, Notifications } from "narraleaf-react";
import { motion, AnimatePresence } from "motion/react";
import { useBackdrop } from "../hooks/useBackdrop";
import clsx from "clsx";

function GameNotification({ notifications }: INotificationsProps) {
    const backdrop = useBackdrop();
    const gap = 40;

    return (
        <Notifications
            className="absolute top-0 left-0 w-full h-full"
        >
            <AnimatePresence>
                {notifications.map(({id, message}, index) =>
                    <motion.div
                        key={id}
                        className={clsx("absolute top-0 left-0 min-w-[400px] h-[40px] bg-black/50 text-white p-4 border-b-2 border-primary flex items-center rounded-r-lg", backdrop)}
                        initial={{ 
                            x: "-100%", 
                            opacity: 0,
                            y: index * gap
                        }}
                        animate={{ 
                            x: 0, 
                            opacity: 1,
                            y: index * gap
                        }}
                        exit={{ 
                            x: "-100%", 
                            opacity: 0,
                            y: index * gap
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut"
                        }}
                    >
                        <span className="text-white">
                            {message}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </Notifications>
    );
}

export default GameNotification;

