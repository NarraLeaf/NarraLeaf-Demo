import { Transform, TransformDefinitions } from "narraleaf-react";

export function easeOutBack(t: number) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function multiBounce(t: number) {
    const damping = 10;
    const frequency = 5;
    return 1 - Math.exp(-damping * t) * Math.cos(frequency * t * Math.PI);
}

export const shake: Transform<TransformDefinitions.ImageTransformProps> = Transform.create()
    .repeat(3)
    .position({ xoffset: 10 })
    .commit({ duration: 75, ease: "easeInOut" })
    .position({ xoffset: 0 })
    .commit({ duration: 75, ease: "easeInOut" });

export const bounce: Transform<TransformDefinitions.ImageTransformProps> = Transform.create()
    .scale(0.6, 0.6)
    .commit({ duration: 500, ease: "easeInOut" })
    .scale(0.5, 0.5)
    .commit({ duration: 500, ease: "easeIn" });
