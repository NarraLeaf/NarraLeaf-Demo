import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// Button interface with active property
export interface MenuButton {
    id: string;
    label: string;
    active?: boolean;
    onClick: () => void;
}

// Abstracted button component
interface MenuButtonProps {
    children: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    mousePosition?: { x: number; y: number };
    isMouseInView?: boolean;
    parallaxEnabled?: boolean;
}

function MenuButtonComponent({ 
    children, 
    active = false, 
    onClick, 
    mousePosition = { x: 0.5, y: 0.5 },
    isMouseInView = false,
    parallaxEnabled = false
}: MenuButtonProps) {
    // Calculate 3D rotation for button text
    const getButtonRotation = () => {
        if (!isMouseInView || !parallaxEnabled) return { rotateX: 0, rotateY: 0 };
        
        // Calculate direction from center
        const directionX = mousePosition.x - 0.5;
        const directionY = mousePosition.y - 0.5;
        
        // Convert to rotation angles (in degrees) - subtle for text
        const maxRotationX = 3; // Subtle X rotation for text
        const maxRotationY = 4; // Subtle Y rotation for text
        
        const rotateX = -directionY * maxRotationX; // Negative for natural tilt
        const rotateY = directionX * maxRotationY;
        
        return { rotateX, rotateY };
    };

    const buttonRotation = getButtonRotation();

    // Text button hover animation variants
    const textButtonVariants = {
        initial: {
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        },
        hover: {
            x: 10,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 25
            }
        },
        selected: {
            x: 10, // Maintain 10px right offset for selected state
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 20
            }
        }
    };

    return (
        <motion.button
            onClick={onClick}
            className={`text-3xl font-medium cursor-pointer text-center transition-colors duration-200 hover:text-white relative ${active ? 'text-white' : 'text-white/80'}`}
            style={{ 
                fontFamily: 'ZhanKu, sans-serif',
                transformStyle: 'preserve-3d',
                perspective: '1000px'
            }}
            variants={textButtonVariants}
            whileHover="hover"
            whileTap="tap"
            animate={active ? "selected" : "initial"}
        >
            {/* White vertical bar for selected state - always render but animate visibility */}
            <motion.div
                className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 bg-white rounded-full -ml-2"
                initial={{ height: 0, opacity: 0 }}
                animate={active ? { height: 24, opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 25,
                    duration: 0.3
                }}
            ></motion.div>
            
            {/* Text with 3D rotation */}
            <motion.span
                style={{
                    display: 'inline-block',
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden'
                }}
                initial={{
                    rotateY: 2 // 从4减到2
                }}
                animate={{
                    rotateX: buttonRotation.rotateX,
                    rotateY: buttonRotation.rotateY + 2, // 从+4减到+2
                    transition: {
                        type: "spring" as const,
                        stiffness: 200,
                        damping: 15,
                        mass: 0.5
                    }
                }}
            >
                {children}
            </motion.span>
        </motion.button>
    );
}

// Smooth parallax hook with requestAnimationFrame
function useSmoothParallax() {
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isMouseInView, setIsMouseInView] = useState(false);
    const [isInitialAnimationComplete, setIsInitialAnimationComplete] = useState(false);
    const [parallaxEnabled, setParallaxEnabled] = useState(false);

    const currentOffset = useRef({ x: 0, y: 0 });
    const targetOffset = useRef({ x: 0, y: 0 });
    const rafId = useRef<number>(0);

    // Smooth easing function (easeInOutSine)
    const easeInOutSine = (t: number): number => {
        return -(Math.cos(Math.PI * t) - 1) / 2;
    };

    // Calculate target offset with improved easing
    const calculateTargetOffset = useCallback((mouseX: number, mouseY: number, sensitivity: number, maxOffset: number) => {
        if (!isMouseInView || !parallaxEnabled) return { x: 0, y: 0 };

        // Calculate direction from center
        const directionX = mouseX - 0.5;
        const directionY = mouseY - 0.5;

        // Use smooth easing instead of linear decay
        const distanceFromCenter = Math.sqrt(directionX * directionX + directionY * directionY);
        const easedDistance = easeInOutSine(Math.min(distanceFromCenter * 2, 1)); // Smoother curve

        // Apply sensitivity and easing
        const offsetX = directionX * sensitivity * maxOffset * easedDistance;
        const offsetY = directionY * sensitivity * maxOffset * easedDistance;

        return { x: offsetX, y: offsetY };
    }, [isMouseInView, parallaxEnabled]);

    // Smooth animation loop
    const animateParallax = useCallback((timestamp: DOMHighResTimeStamp) => {
        // Spring-damper interpolation for smooth movement
        const spring = 0.1; // Spring stiffness
        const damper = 0.8; // Damping factor

        const dx = targetOffset.current.x - currentOffset.current.x;
        const dy = targetOffset.current.y - currentOffset.current.y;

        currentOffset.current.x += dx * spring;
        currentOffset.current.y += dy * spring;

        // Apply damping
        currentOffset.current.x *= damper;
        currentOffset.current.y *= damper;

        rafId.current = requestAnimationFrame(animateParallax);
    }, []);

    // Mouse move handler - only updates target values
    const handleMouseMove = useCallback((event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        setMousePosition({ x, y });
        setIsMouseInView(true);
    }, []);

    // Mouse leave handler
    const handleMouseLeave = useCallback(() => {
        setIsMouseInView(false);
        setMousePosition({ x: 0.5, y: 0.5 });
    }, []);

    // Start parallax animation when enabled
    useEffect(() => {
        if (parallaxEnabled) {
            rafId.current = requestAnimationFrame(animateParallax);
        }

        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current);
            }
        };
    }, [parallaxEnabled, animateParallax]);

    // Enable parallax after entrance animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialAnimationComplete(true);
            // Progressive enable parallax with fade-in
            setTimeout(() => {
                setParallaxEnabled(true);
            }, 500);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Calculate offsets for different layers with z-depth
    const getLayerOffsets = useCallback((layer: 'background' | 'secondary' | 'content' | 'buttons') => {
        const baseSensitivity = 0.2;
        const baseMaxOffset = 30;
        let sensitivity: number;
        let maxOffset: number;
        switch (layer) {
            case 'background':
                sensitivity = baseSensitivity * 2.5; // 只增强背景
                maxOffset = baseMaxOffset * 3.5;
                break;
            case 'secondary':
                sensitivity = baseSensitivity * 2.2;
                maxOffset = baseMaxOffset * 3.0;
                break;
            case 'content':
                sensitivity = baseSensitivity * 0.8;
                maxOffset = baseMaxOffset * 0.8;
                break;
            case 'buttons':
                sensitivity = baseSensitivity * 0.8;
                maxOffset = baseMaxOffset * 0.8;
                break;
            default:
                sensitivity = baseSensitivity;
                maxOffset = baseMaxOffset;
        }
        return calculateTargetOffset(mousePosition.x, mousePosition.y, sensitivity, maxOffset);
    }, [mousePosition, calculateTargetOffset]);

    // Calculate 3D rotation angles for tilt effect
    const get3DRotation = useCallback((type: 'background' | 'content' = 'content') => {
        if (!isMouseInView || !parallaxEnabled) return { rotateX: 0, rotateY: 0 };
        const directionX = mousePosition.x - 0.5;
        const directionY = mousePosition.y - 0.5;
        let maxRotationX = 6, maxRotationY = 9;
        if (type === 'background') {
            maxRotationX = 12; // 只增强背景
            maxRotationY = 18;
        }
        const rotateX = -directionY * maxRotationX;
        const rotateY = directionX * maxRotationY;
        return { rotateX, rotateY };
    }, [mousePosition, isMouseInView, parallaxEnabled]);

    return {
        handleMouseMove,
        handleMouseLeave,
        isInitialAnimationComplete,
        parallaxEnabled,
        currentOffset: currentOffset.current,
        getLayerOffsets,
        get3DRotation
    };
}

export function HomePanel({
    children,
    buttons
}: {
    children: React.ReactNode;
    buttons: MenuButton[];
}) {
    const {
        handleMouseMove,
        handleMouseLeave,
        isInitialAnimationComplete,
        parallaxEnabled,
        getLayerOffsets,
        get3DRotation
    } = useSmoothParallax();

    // Get mouse position from the hook
    const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
    const [isMouseInView, setIsMouseInView] = useState(false);

    // Enhanced mouse handlers that also update local state
    const enhancedMouseMove = useCallback((event: React.MouseEvent) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        
        setMousePosition({ x, y });
        setIsMouseInView(true);
        handleMouseMove(event);
    }, [handleMouseMove]);

    const enhancedMouseLeave = useCallback(() => {
        setIsMouseInView(false);
        setMousePosition({ x: 0.5, y: 0.5 });
        handleMouseLeave();
    }, [handleMouseLeave]);

    // Different background images for left and right panels
    const leftPanelBgImage = "url('/static/img/ui/main-menu/main_menu_left.png')";
    const rightPanelBgImage = "url('/static/img/ui/main-menu/main_menu_right.png')";
    
    // Secondary background images
    const leftPanelSecondaryBgImage = "url('/static/img/ui/main-menu/main_menu_left_layer.png')";
    const rightPanelSecondaryBgImage = "url('/static/img/ui/main-menu/main_menu_right_layer.png')";

    // Calculate width percentages based on design specs
    // Left: 374px, Right: 896px, Total: 1270px
    const leftPanelWidth = (374 / 1270) * 100; // ~29.45%
    const rightPanelWidth = (896 / 1270) * 100; // ~70.55%

    // Animation variants for left panel (slides in from left)
    const leftPanelVariants = {
        hidden: { x: '-100%' },
        visible: {
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20,
                duration: 0.8
            }
        }
    };

    // Animation variants for right panel (slides in from right)
    const rightPanelVariants = {
        hidden: { x: '100%' },
        visible: {
            x: 0,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 20,
                duration: 0.8,
            }
        }
    };

    // Get offsets for different layers
    const leftPanelOffset = getLayerOffsets('background');
    const rightPanelOffset = getLayerOffsets('background');
    const leftSecondaryOffset = getLayerOffsets('secondary'); // Secondary background with different parallax
    const rightSecondaryOffset = getLayerOffsets('secondary'); // Secondary background with different parallax
    const contentOffset = getLayerOffsets('content');
    const buttonsOffset = getLayerOffsets('buttons');
    
    // Get 3D rotation angles
    const leftPanelRotation = get3DRotation('background');
    const rightPanelRotation = get3DRotation('background');

    useEffect(() => {
        console.warn("HomePanel render");
    }, []);

    return (
        <div
            className="flex h-full w-full relative overflow-hidden"
            style={{
                transformStyle: 'preserve-3d',
                perspective: '1200px'
            }}
            onMouseMove={enhancedMouseMove}
            onMouseLeave={enhancedMouseLeave}
        >
            {/* Left Panel Container */}
            <div className="relative" style={{ width: `${leftPanelWidth}%` }}>
                {/* Left Panel Secondary Background Layer */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: leftPanelSecondaryBgImage,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        opacity: 0.7, // Slightly transparent for layering effect
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                    variants={leftPanelVariants}
                    initial="hidden"
                    animate={isInitialAnimationComplete ? {
                        x: leftSecondaryOffset.x,
                        y: leftSecondaryOffset.y,
                        rotateX: leftPanelRotation.rotateX * 0.7, // Slightly less rotation for depth
                        rotateY: leftPanelRotation.rotateY * 0.7,
                        transition: {
                            type: "spring" as const,
                            stiffness: 80,
                            damping: 25,
                            mass: 0.8
                        }
                    } : "visible"}
                />
                
                {/* Left Panel - Primary Background Layer */}
                <motion.div
                    className="flex flex-col justify-center items-center relative"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: leftPanelBgImage,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                    variants={leftPanelVariants}
                    initial="hidden"
                    animate={isInitialAnimationComplete ? {
                        x: leftPanelOffset.x,
                        y: leftPanelOffset.y,
                        rotateX: leftPanelRotation.rotateX,
                        rotateY: leftPanelRotation.rotateY,
                        transition: {
                            type: "spring" as const,
                            stiffness: 100,
                            damping: 20,
                            mass: 0.6
                        }
                    } : "visible"}
                >
                    {/* Content Layer - Buttons with opposite movement for 3D effect */}
                    <motion.div
                        className="w-full max-w-xs flex flex-col space-y-6 relative z-20 items-center p-6"
                        style={{
                            marginLeft: '10px',
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d',
                            perspective: '1000px'
                        }}
                        initial={{
                            rotateY: 1.5 // 从2.5减到1.5
                        }}
                        animate={parallaxEnabled ? {
                            x: buttonsOffset.x,
                            y: buttonsOffset.y,
                            rotateX: leftPanelRotation.rotateX * 0.3,
                            rotateY: leftPanelRotation.rotateY * 0.3 + 1.5, // 从+2.5减到+1.5
                            transition: {
                                type: "spring" as const,
                                stiffness: 100,
                                damping: 20,
                                mass: 0.6
                            }
                        } : {
                            rotateY: 1.5 // 从2.5减到1.5
                        }}
                    >
                        {buttons.map((button) => (
                            <MenuButtonComponent
                                key={button.id}
                                active={button.active}
                                onClick={button.onClick}
                                mousePosition={mousePosition}
                                isMouseInView={isMouseInView}
                                parallaxEnabled={parallaxEnabled}
                            >
                                {button.label}
                            </MenuButtonComponent>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Right Panel Container */}
            <div className="relative" style={{ width: `${rightPanelWidth}%` }}>
                {/* Right Panel Secondary Background Layer */}
                <motion.div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: rightPanelSecondaryBgImage,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        opacity: 0.7, // Slightly transparent for layering effect
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                    variants={rightPanelVariants}
                    initial="hidden"
                    animate={isInitialAnimationComplete ? {
                        x: rightSecondaryOffset.x,
                        y: rightSecondaryOffset.y,
                        rotateX: rightPanelRotation.rotateX * 0.7, // Slightly less rotation for depth
                        rotateY: rightPanelRotation.rotateY * 0.7,
                        transition: {
                            type: "spring" as const,
                            stiffness: 80,
                            damping: 25,
                            mass: 0.8
                        }
                    } : "visible"}
                />

                {/* Right Panel - Primary Background Layer */}
                <motion.div
                    className="relative flex items-center justify-center"
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: rightPanelBgImage,
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        willChange: 'transform',
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                        perspective: '1000px'
                    }}
                    variants={rightPanelVariants}
                    initial="hidden"
                    animate={isInitialAnimationComplete ? {
                        x: rightPanelOffset.x,
                        y: rightPanelOffset.y,
                        rotateX: rightPanelRotation.rotateX,
                        rotateY: rightPanelRotation.rotateY,
                        transition: {
                            type: "spring" as const,
                            stiffness: 100,
                            damping: 20,
                            mass: 0.6
                        }
                    } : "visible"}
                >
                    {/* Content Layer - Main content with independent movement */}
                    <motion.div
                        className="w-full h-full p-[7rem] pl-[6rem] pr-[10rem] relative z-20"
                        style={{
                            willChange: 'transform',
                            transform: 'translateZ(0)',
                            backfaceVisibility: 'hidden',
                            transformStyle: 'preserve-3d',
                            perspective: '1000px'
                        }}
                        initial={{
                            rotateY: -1.5 // 从-2.5减到-1.5
                        }}
                        animate={parallaxEnabled ? {
                            x: contentOffset.x,
                            y: contentOffset.y,
                            rotateX: rightPanelRotation.rotateX * 0.3,
                            rotateY: rightPanelRotation.rotateY * 0.3 - 1.5, // 从-2.5减到-1.5
                            transition: {
                                type: "spring" as const,
                                stiffness: 100,
                                damping: 20,
                                mass: 0.6
                            }
                        } : {
                            rotateY: -1.5 // 从-2.5减到-1.5
                        }}
                    >
                        <div className="relative w-full h-full">
                            {/* 3D Text Content Wrapper */}
                            <motion.div
                                style={{
                                    transformStyle: 'preserve-3d',
                                    backfaceVisibility: 'hidden'
                                }}
                                initial={{
                                    rotateY: -2 // 从-4减到-2
                                }}
                                animate={parallaxEnabled ? {
                                    rotateX: rightPanelRotation.rotateX * 0.2,
                                    rotateY: rightPanelRotation.rotateY * 0.2 - 2, // 从-4减到-2
                                    transition: {
                                        type: "spring" as const,
                                        stiffness: 150,
                                        damping: 12,
                                        mass: 0.4
                                    }
                                } : {
                                    rotateY: -2 // 从-4减到-2
                                }}
                            >
                            {children}
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
