


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
