import { Character, Image } from "narraleaf-react";

export const N = new Character("Nattou");
export const Nattou = new Image({
    src: "/static/img/char/nattou/Nattou.png",
    scale: 0.5,
    position: {
        yalign: 0.2,
        xalign: 0.5,
    },
});

export const Y = new Character("Youki");
export const Youki = new Image({
    src: "/static/img/char/youki/YouKi.png",
    scale: 0.5,
    position: {
        yalign: 0.2,
        xalign: 0.5,
    },
});

export const M = new Character("Mina");

export const Narrator = new Character(null);
