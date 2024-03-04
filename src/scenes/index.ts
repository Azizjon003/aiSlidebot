const { Scenes } = require("telegraf");
import start from "./start";
import balans from "./balans";
import control from "./control";
const stage = new Scenes.Stage([start, balans, control]);

export default stage;
