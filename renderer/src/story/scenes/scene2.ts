import { Dissolve, Menu, Scene } from "narraleaf-react";
import { bounce, shake } from "../animations";
import { Backgrounds } from "../assets";
import { M, N, Nattou, Y, Youki } from "../chars";
import { scene3 } from "./scene3";

export const scene2 = new Scene("Scene2", {
    background: Backgrounds.Outside,
});

scene2.action([
    "Who could this person be? I kept wondering as we walked.",
    "Did I know them somehow?",
    "We arrived at the side of the street. It was the middle of winter, and snow covered everything.",
    "She pointed toward the trash cans. When I looked that way, I saw a red-haired girl standing in bright contrast to the white snow.",

    Youki.show({ duration: 500 }),

    Y`Huh? Good morning, Nattou. So this is Mina?`,
    Y`Nice to meet you! I am Youki, one of Nattou's friends.`,
    Youki.transform(bounce),

    "Youki...? That name sounded so familiar.",
    
    M`I am Mina. I am also Nattou's... friend?`,
    Y`I have heard a lot about you. Nattou said you can draw, right?`,
    M`That is true, but why did Nattou tell you that?`,

    Youki.hide({ duration: 100 }),
    Nattou.show({ duration: 100 }),

    N`Youki is making a game and needs an artist, so I recommended you.`,
    Nattou.hide({ duration: 100 }),
    Youki.show({ duration: 100 }),

    Y`So you really can draw? Awesome, awesome! Um, would you make games with me forever?`,
    Youki.transform(shake),
    "There was something burning in her eyes. You really should never underestimate a red-haired girl's energy.",

    Menu.prompt(undefined)
        .choose("Youki, you really only think about yourself.", [
            Y`That is true... but still, if you come work as my artist, I will do anything!`,
            Youki.scale(0.6, 0.6, 500, "easeInOut"),
            M`What kind of resolve are you saying that with...?`,
        ])
        .choose("Yes. I will join.", [
            Youki.transform(shake),
            Y`Yay! Mina, you are really saving me!`,
        ]),

    scene2.jumpTo(scene3, new Dissolve(500)),
]);
