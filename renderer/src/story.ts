import {Story, Scene, Character, c} from "narraleaf-react";

const character1 = new Character("Character 1");

const scene1 = new Scene("Scene 1");
scene1.action([
    character1
        .say`Hello, World!`
        .say`This is a ${c("NarraLeaf", "blue")} story!`,
]);

const story = new Story("My Story").entry(scene1);
export {story};
