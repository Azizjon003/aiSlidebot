const { Scenes } = require("telegraf");
import start from "./start";
import balans from "./balans";
import control from "./control";
import slidesCount from "./slidesCount";
import editSlides from "./editSlides";
const stage = new Scenes.Stage([
  start,
  balans,
  control,
  slidesCount,
  editSlides,
]);

export default stage;
