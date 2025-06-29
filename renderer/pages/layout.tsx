import React, { useRef, useState, useEffect } from "react";
import { motion } from "motion/react";

/**
 * Custom hook to preload images into the browser cache.
 *
 * @param imageUrls - An array of image URLs to preload. For stable performance, this array should be memoized.
 * @returns An object containing the loading progress and loaded status.
 */
export function useImagePreloader(imageUrls: string[]) {
    const [progress, setProgress] = useState(0);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setLoaded(true);
            setProgress(1);
            return;
        }

        setLoaded(false);
        setProgress(0);

        let loadedCount = 0;
        const totalImages = imageUrls.length;

        const promises = imageUrls.map((url) => {
            return new Promise<void>((resolve) => {
                const img = new Image();
                img.src = url;

                const handleFinish = () => {
                    loadedCount++;
                    setProgress(loadedCount / totalImages);
                    resolve();
                };

                img.onload = handleFinish;
                img.onerror = () => {
                    console.error(`[ImagePreloader] Failed to load image: ${url}`);
                    handleFinish(); // Resolve even on error to not block loading process
                };
            });
        });

        Promise.all(promises).then(() => {
            setLoaded(true);
            console.log("ImagePreloader", "Images loaded", imageUrls);
        });

        // The effect should not return a cleanup function that involves the images,
        // as we want them to continue loading even if the component unmounts.
        // If the component unmounts and remounts with the same URLs,
        // the browser cache should handle it efficiently.
    }, [imageUrls]); // Re-run effect if imageUrls array instance changes

    return { progress, loaded };
}

/**
 * A component wrapper that displays a fallback UI while preloading images.
 * Once all images are loaded, it renders its children.
 *
 * @example
 * <ImagePreloader imageUrls={['/img/1.png', '/img/2.png']} fallback={<div>Loading...</div>}>
 *   <MyComponentThatUsesImages />
 * </ImagePreloader>
 */
export function ImagePreloader({
    imageUrls,
    children,
    fallback = null,
}: {
    imageUrls: string[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}) {
    const { loaded } = useImagePreloader(imageUrls);

    return loaded ? <>{children}</> : <>{fallback}</>;
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const imageUrls: string[] = [
        "/static/img/ui/dialog/game-dialog.png",
        "/static/img/ui/dialog/game-dialog-nametag.png",
        "/static/img/ui/main-menu/main_menu_left_layer.png",
        "/static/img/ui/main-menu/main_menu_left.png",
        "/static/img/ui/main-menu/main_menu_right_layer.png",
        "/static/img/ui/main-menu/main_menu_right.png",
        "/static/img/ui/bg/outside.jpg",
        "/static/img/ui/popup/dialog-btn-primary.png",
        "/static/img/ui/popup/dialog-btn-secondary.png",
        "/static/img/ui/popup/notification.png",
        "/static/img/ui/popup/popup-dialog.png"
    ];

    return (
        <motion.div
            className="w-full h-full absolute pointer-events-none"
            initial="hidden"
            animate="visible"
        >
            <ImagePreloader imageUrls={imageUrls} fallback={<div></div>}>
                {children}
            </ImagePreloader>
        </motion.div>
    );
}
