const { Scenes } = require("telegraf");
import start from "./start";

const stage = new Scenes.Stage([start]);

export default stage;
