const { Scenes } = require("telegraf");
import start from "./start";
import balans from "./balans";
import control from "./control";
import slidesCount from "./slidesCount";
const stage = new Scenes.Stage([start, balans, control, slidesCount]);

export default stage;
