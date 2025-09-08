import { Story} from "narraleaf-react";
import { start } from "./story/scenes/start";

const story = new Story("My Story").entry(start);
export { story, start };