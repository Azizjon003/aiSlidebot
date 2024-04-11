const { Scenes } = require("telegraf");
import start from "./start";
import balans from "./balans";
import control from "./control";
import slidesCount from "./slidesCount";
import editSlides from "./editSlides";
import admin from "./admin";
import sendMesssage from "./message";
import changeAuthor from "./changeAuthor";
import addLanguage from "./addLanguage";
import createWalletRequest from "./createWalletRequest";
import changeChecked from "./changeChecked";
const stage = new Scenes.Stage([
  start,
  balans,
  control,
  slidesCount,
  editSlides,
  admin,
  sendMesssage,
  changeAuthor,
  addLanguage,
  createWalletRequest,
  changeChecked,
]);

export default stage;
