import { Dissolve, Scene, Transform } from "narraleaf-react";
import { shake } from "../animations";
import { Backgrounds } from "../assets";
import { M, Y, Youki } from "../chars";

export const scene3 = new Scene("Scene3", {
    background: Backgrounds.Studio,
});

scene3.action([
    M`感觉去画画总比在家里宅着无所事事好些一些，所以就这样同意了。`,
    "在Youki那里工作了很久，Youki的游戏也非常顺利地发布了。",

    Youki.show({ duration: 500 }),
    Y`要出去走走吗？Mina？`,
    "发布工作结束后，Youki约我出去走走。",

    scene3.background.char(Backgrounds.Outside_s, new Dissolve(500)),
    "我和Youki走在工作室门外的小路上，不知道说些什么。",

    Y`Mina，你认识我吗？我是说以前。`,
    M`刚见到你的时候，感觉名字有些熟悉。所以应该是见过，但好像又没见过。`,

    Y`我和你，是同学喔，你忘记了吗？小学同学？`,
    M`小学同学？我们班级里好像没有叫Youki的人。`,

    Y`毕业之后就改名啦，Konado，还记着吗？`,
    M`Konado？真的是你？我就说为什么会这么熟悉......除了发色变了之外其他都没有变啊。`,

    Y`是啊，当时我和你，还有Nattou都是同学。`,
    Y`毕业之后，我就离开了这个城市，临走前只给Nattou留下了自己的信息。`,
    Y`可能是因为思念的缘故吧，大学干脆就考回来了。`,
    Y`我通过Nattou找到了你，希望你能来我这里一起做想做的事情。`,
    Y`一直没告诉你我的名字，是因为怕你不会同意，毕竟我们分开了好长时间。`,
    Y`既然你已经知道我是谁了，那我有一件事情，要告诉你，你一定要同意。`,

    M`什么事？说吧。`,

    Youki.hide({ duration: 300 }),
    Youki.show(Transform.create()
        .position({ yalign: -0.5, xalign: 0.5 })
        .scale(1.1)
        .commit({ duration: 1000 })),

    Y`其实，我喜欢你。`,
    M`.......？`,
    Y`真的喜欢你啊喂，从小学的时候就喜欢了。`,
    Y`这就是我让你来这里的第二个原因，想和你在一起。`,

    Youki.hide({ duration: 1000 }),
    Youki.show({ duration: 300 }),

    Y`所以.......`,
    M`我没意见。`,
    Y`你也喜欢我吗？`,
    M`不然呢，我亲爱的Youki......应该是Konado。`,
    Y`好诶！`,
    Youki.transform(shake),

    "我和她望着远处的风景，不再说话。",
    "之后的之后，就没有之后了",
]);