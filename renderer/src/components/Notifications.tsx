import { INotificationsProps, Notifications } from "narraleaf-react";
import { motion, AnimatePresence } from "motion/react";
import { useBackdrop } from "../hooks/useBackdrop";
import clsx from "clsx";

function GameNotification({ notifications }: INotificationsProps) {
    const backdrop = useBackdrop();
    const gap = 40;

    return (
        <Notifications
            className="absolute top-5 left-0 w-full h-full z-[100]"
        >
            <AnimatePresence>
                {notifications.map(({id, message}, index) =>
                    <motion.div
                        key={id}
                        className={clsx("absolute top-0 left-0 h-[40px] w-[400px] flex items-center pl-4 text-white", backdrop)}
                        style={{
                            backgroundImage: "url(/static/img/ui/popup/notification.png)",
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "100% 100%"
                        }}
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

