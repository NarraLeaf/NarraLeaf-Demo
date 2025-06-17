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

    "窗外阳光明媚，看来是一个好天气。",
    "现在是早上八点，不知道为什么今天自己会起的这么早。",
    
    Nattou.show({ duration: 500 }),

    N`早上好！Mina！`,

    Nattou.darken(0.5, 500, "easeIn"),
    "身旁站着一个女孩，一看就是趁着我睡觉的时候溜进来的。",
    Nattou.darken(0, 500, "easeOut"),

    M`已经和你说过好多次了，不要在睡觉的时候进到我家里。`,
    N`看你屋门没有关，我就直接进来了。`,

    Menu.prompt(undefined)
        .choose("我们一起出去玩吧？", [
            N`真的吗？你终于愿意和我出去玩了吗？那我们现在就出发！`,
            Nattou.pos({ xalign: 0.7 }, 500, "easeInOut"),
            N`不过去玩之前，先和我去见一个朋友吧。`,
            M`才八点就要出去吗？你不困吗？不再睡一会吗？`,
            "她摇摇头，没办法，跟她去吧。",
            Nattou.hide({ duration: 500 }),

            start.jumpTo(scene2, new Dissolve(500)),
        ])
        .choose("累了 ，摆烂吧", [
            N`真是个杂鱼，一早上起来就摆烂了。`,
            Nattou.transform(shake),
            N`不过，我想去见一个朋友，和我一起去，好不好？`,
            M`啊喂，现在才八点啊，你不困吗？不再睡一会吗？`,
            "她摇摇头，没办法，虽然还不想起，但还是跟她去吧。",
            Nattou.hide({ duration: 500 }),

            start.jumpTo(scene2, new Dissolve(500)),
        ]),
]);

export { start };
