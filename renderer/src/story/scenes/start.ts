import { Control, Dissolve, Menu, Scene } from "narraleaf-react";
import { shake } from "../animations";
import { Backgrounds } from "../assets";
import { M, N, Nattou } from "../chars";
import { scene2 } from "./scene2";

const start = new Scene("Start", {
    background: "white",
});

start.action([
    start.background.char(Backgrounds.Room, new Dissolve(500)),

    "Sunlight poured through the window. It looked like the start of a beautiful day.",
    "It was eight in the morning. For some reason, I had woken up earlier than usual.",
    
    Nattou.show({ duration: 500 }),

    N`Good morning, Mina!`,

    Nattou.darken(0.5, 500, "easeIn"),
    "A girl was standing beside me. Clearly, she had slipped in while I was asleep.",
    Nattou.darken(0, 500, "easeOut"),

    M`I have told you so many times not to come into my house while I am sleeping.`,
    N`Your door was not closed, so I just came in.`,

    Menu.prompt(undefined)
        .choose("Want to go out together?", [
            N`Really? You finally want to go out with me? Then let us leave right now!`,
            Nattou.pos({ xalign: 0.7 }, 500, "easeInOut"),
            N`But before we have fun, come meet a friend with me first.`,
            M`We are going out at eight? Are you not tired? Do you not want to sleep a little longer?`,
            "She shook her head. I had no choice but to go with her.",
            Nattou.hide({ duration: 500 }),

            start.jumpTo(scene2, new Dissolve(500)),
        ])
        .choose("I am tired. Let us give up for today.", [
            N`What a slacker. You just woke up and you are already giving up.`,
            Nattou.transform(shake),
            N`Anyway, I want to go meet a friend. Come with me, okay?`,
            M`Hey, it is only eight. Are you not tired? Do you not want to sleep a little longer?`,
            "She shook her head. I still did not want to get up, but I went with her anyway.",
            Nattou.hide({ duration: 500 }),

            start.jumpTo(scene2, new Dissolve(500)),
        ]),
]);

export { start };
