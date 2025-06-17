import { Dissolve, Menu, Scene } from "narraleaf-react";
import { bounce, shake } from "../animations";
import { Backgrounds } from "../assets";
import { M, N, Nattou, Y, Youki } from "../chars";
import { scene3 } from "./scene3";

export const scene2 = new Scene("Scene2", {
    background: Backgrounds.Outside,
});

scene2.action([
    "这个人会是谁呢？走在路上的时候，我一直在想。",
    "难道我认识吗？",
    "我和她来到了街道旁，正值寒冬，街上满是雪。",
    "她的手往垃圾桶那边指着，我向那边看过去，看见一个红发少女，与遍地雪白产生了鲜明的对比。",

    Youki.show({ duration: 500 }),

    Y`嘿？Nattou早上好，这就是Mina吗？`,
    Y`初次见面～！我叫Youki，是Nattou的朋友喔～`,
    Youki.transform(bounce),

    "Youki.......？好熟悉的名字。",
    
    M`我叫Mina，也是Nattou的......朋友？`,
    Y`早有耳闻，听Nattou说，你会画画吧？`,
    M`的确如此，Nattou告诉你这个干什么。`,

    Youki.hide({ duration: 100 }),
    Nattou.show({ duration: 100 }),

    N`Youki最近在做游戏，缺一个画师，所以我就把你推荐过去了。`,
    Nattou.hide({ duration: 100 }),
    Youki.show({ duration: 100 }),

    Y`真的会画画对吗，好诶好诶！那个，能和我做一辈子的游戏吗？`,
    Youki.transform(shake),
    "她眼睛里像是有什么东西在燃烧，果然不能低估红发少女的性格啊。",

    Menu.prompt(undefined)
        .choose("你这Youki，还真是满脑子都是自己呢。", [
            Y`是这样......虽然但是，如果Mina能来我这里做画师，我什么都会做的！`,
            Youki.scale(0.6, 500, "easeInOut"),
            M`你是抱着个什么决心说的这句话啊......`,
        ])
        .choose("好，我来", [
            Youki.transform(shake),
            Y`好诶，Mina酱真的是帮大忙了`,
        ]),

    scene2.jumpTo(scene3, new Dissolve(500)),
]);

