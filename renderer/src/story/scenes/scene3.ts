import { Dissolve, Scene, Transform } from "narraleaf-react";
import { shake } from "../animations";
import { Backgrounds } from "../assets";
import { M, Y, Youki } from "../chars";

export const scene3 = new Scene("Scene3", {
    background: Backgrounds.Studio,
});

scene3.action([
    M`Drawing sounded better than sitting around at home doing nothing, so I agreed.`,
    "After working with Youki for quite a while, her game launched smoothly.",

    Youki.show({ duration: 500 }),
    Y`Want to take a walk, Mina?`,
    "After the release work was finished, Youki invited me outside.",

    scene3.background.char(Backgrounds.Outside_s, new Dissolve(500)),
    "Youki and I walked along the path outside the studio, neither of us sure what to say.",

    Y`Mina, do you know me? I mean, from before.`,
    M`When I first met you, your name felt familiar. So I thought we might have met, but also maybe not.`,

    Y`You and I were classmates. Did you forget? Elementary school classmates?`,
    M`Elementary school? I do not remember anyone named Youki in our class.`,

    Y`I changed my name after graduation. Konado. Do you remember?`,
    M`Konado? It is really you? No wonder you felt so familiar... aside from your hair color, you have not changed at all.`,

    Y`Right. Back then, you, Nattou, and I were classmates.`,
    Y`After graduation, I left this city. Before I went, I only left my contact information with Nattou.`,
    Y`Maybe I missed this place too much, because I ended up coming back for college.`,
    Y`I found you through Nattou because I wanted you to come here and make something with me.`,
    Y`I never told you my name because I was afraid you would refuse. We had been apart for such a long time.`,
    Y`Now that you know who I am, there is something I need to tell you. You have to say yes.`,

    M`What is it? Go ahead.`,

    Youki.hide({ duration: 300 }),
    Youki.show(Transform.create()
        .position({ yalign: -0.5, xalign: 0.5 })
        .scale(1.1, 1.1)
        .commit({ duration: 1000 })),

    Y`The truth is, I like you.`,
    M`.......？`,
    Y`I really like you, okay? I have liked you since elementary school.`,
    Y`That is the second reason I asked you to come here. I wanted to be with you.`,

    Youki.hide({ duration: 1000 }),
    Youki.show({ duration: 300 }),

    Y`So...`,
    M`I have no objection.`,
    Y`You like me too?`,
    M`What else would this mean, my dear Youki... or should I say Konado?`,
    Y`Yay!`,
    Youki.transform(shake),

    "We looked out at the distant scenery and said nothing more.",
    "After that, there was nothing more to add.",
]);
