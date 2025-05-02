import {Story, Scene, Character, c, Image, Dissolve, Menu, Sentence, Transform} from "narraleaf-react";

const character1 = new Character("Character 1");

const Nattou = new Image({
    src: "/static/img/char/nattou/Nattou.png",
    scale: 0.5,
    position: {
        yalign: 0.2,
        xalign: 0.5,
    },
});
const Youki = new Image({
    src: "/static/img/char/youki/Youki.png",
    scale: 0.5,
    position: {
        yalign: 0.2,
        xalign: 0.5,
    },
});

const CNarrator = new Character(null);
const N = new Character("Nattou");
const Y = new Character("Youki");
const M = new Character("Mina");

const SRoomBG = "/static/img/ui/bg/room.jpg";
const SOutsideBG = "/static/img/ui/bg/outside.jpg";
const SOutsideBG_s = "/static/img/ui/bg/outside_s.jpg";
const SStudioBG = "/static/img/ui/bg/studio.jpg";

/**
 * WARNING: This is a hack, we will fix this in the future. DO NOT USE THIS IN YOUR PROJECTS.
 */
function black(t: string) {
    return new Sentence(t, {
        color: "black",
    });
}


const start = new Scene("Start", {
    background: "white",
});
start.action([
    start.background.char(SRoomBG, new Dissolve(500)),

    CNarrator.say`窗外阳光明媚，看来是一个好天气。`
    .say`现在是早上八点，不知道为什么今天自己会起的这么早。`,
    
    Nattou.show({duration: 500}),

    N.say`早上好！Mina！`,
    CNarrator.say`身旁站着一个女孩，一看就是趁着我睡觉的时候溜进来的。`,
    M.say`已经和你说过好多次了，不要在睡觉的时候进到我家里。`,
    N.say`看你屋门没有关，我就直接进来了。`,

    Menu.prompt("")
        .choose(black("我们一起出去玩吧？"), [
            N.say`真的吗？你终于愿意和我出去玩了吗？那我们现在就出发！`,
            N.say`不过去玩之前，先和我去见一个朋友吧。`,
            M.say`才八点就要出去吗？你不困吗？不再睡一会吗？`,
            CNarrator.say`她摇摇头，没办法，跟她去吧。`,
        ])
        .choose(black("累了 ，摆烂吧"), [
            N.say`真是个杂鱼，一早上起来就摆烂了。`,
            N.say`不过，我想去见一个朋友，和我一起去，好不好？`,
            M.say`啊喂，现在才八点啊，你不困吗？不再睡一会吗？`,
            CNarrator.say`她摇摇头，没办法，虽然还不想起，但还是跟她去吧。`,
        ]),

    start.background.char(SOutsideBG, new Dissolve(500)),

    CNarrator.say`这个人会是谁呢？走在路上的时候，我一直在想。`,
    CNarrator.say`难道我认识吗？`,
    CNarrator.say`我和她来到了街道旁，正值寒冬，街上满是雪。`,
    CNarrator.say`她的手往垃圾桶那边指着，我向那边看过去，看见一个红发少女，与遍地雪白产生了鲜明的对比。`,

    Youki.show({duration: 500}),

    Y.say`嘿？Nattou早上好，这就是Mina吗？`,
    Y.say`初次见面～！我叫Youki，是Nattou的朋友喔～`,
    CNarrator.say`Youki.......？好熟悉的名字。`,
    M.say`我叫Mina，也是Nattou的......朋友？`,
    Y.say`早有耳闻，听Nattou说，你会画画吧？`,
    M.say`的确如此，Nattou告诉你这个干什么。`,

    Youki.hide({duration: 100}),
    Nattou.show({duration: 100}),

    N.say`Youki最近在做游戏，缺一个画师，所以我就把你推荐过去了。`,
    Nattou.hide({duration: 100}),
    Youki.show({duration: 100}),

    Y.say`真的会画画对吗，好诶好诶！那个，能和我做一辈子的游戏吗？`,
    CNarrator.say`她眼睛里像是有什么东西在燃烧，果然不能低估红发少女的性格啊。`,

    Menu.prompt("")
        .choose(black("你这Youki，还真是满脑子都是自己呢。"), [
            Y.say`是这样......虽然但是，如果Mina能来我这里做画师，我什么都会做的！`,
            M.say`你是抱着个什么决心说的这句话啊......`,
        ])
        .choose(black("好，我来"), [
            Y.say`好诶，Mina酱真的是帮大忙了`,
        ]),

    start.background.char(SStudioBG, new Dissolve(500)),

    M.say`感觉去画画总比在家里宅着无所事事好些一些，所以就这样同意了。`,
    CNarrator.say`在Youki那里工作了很久，Youki的游戏也非常顺利地发布了。`,

    Youki.show({duration: 500}),
    Y.say`要出去走走吗？Mina？`,
    CNarrator.say`发布工作结束后，Youki约我出去走走。`,

    start.background.char(SOutsideBG_s, new Dissolve(500)),
    CNarrator.say`我和Youki走在工作室门外的小路上，不知道说些什么。`,

    Y.say`Mina，你认识我吗？我是说以前。`,
    M.say`刚见到你的时候，感觉名字有些熟悉。所以应该是见过，但好像又没见过。`,
    Y.say`我和你，是同学喔，你忘记了吗？小学同学？`,
    M.say`小学同学？我们班级里好像没有叫Youki的人。`,
    Y.say`毕业之后就改名啦，Konado，还记着吗？`,
    M.say`Konado？真的是你？我就说为什么会这么熟悉......除了发色变了之外其他都没有变啊。`,
    Y.say`是啊，当时我和你，还有Nattou都是同学。`,
    Y.say`毕业之后，我就离开了这个城市，临走前只给Nattou留下了自己的信息。`,
    Y.say`可能是因为思念的缘故吧，大学干脆就考回来了。`,
    Y.say`我通过Nattou找到了你，希望你能来我这里一起做想做的事情。`,
    Y.say`一直没告诉你我的名字，是因为怕你不会同意，毕竟我们分开了好长时间。`,
    Y.say`既然你已经知道我是谁了，那我有一件事情，要告诉你，你一定要同意。`,
    M.say`什么事？说吧。`,

    Youki.hide({duration: 300}),
    Youki.show(Transform.create().position({yalign: 0.1, xalign: 0.5}).commit({duration: 1000})),

    Y.say`其实，我喜欢你。`,
    M.say`.......？`,
    Y.say`真的喜欢你啊喂，从小学的时候就喜欢了。`,
    Y.say`这就是我让你来这里的第二个原因，想和你在一起。`,

    Youki.hide({duration: 1000}),
    Youki.show({duration: 300}),

    Y.say`所以.......`,
    M.say`我没意见。`,
    Y.say`你也喜欢我吗？`,
    M.say`不然呢，我亲爱的Youki......应该是Konado。`,
    Y.say`好诶！`,

    Youki.hide({duration: 500}),
    CNarrator.say`我和她望着远处的风景，不再说话。`,
    CNarrator.say`之后的之后，就没有之后了`,
]);

const story = new Story("My Story").entry(start);
export {story};
