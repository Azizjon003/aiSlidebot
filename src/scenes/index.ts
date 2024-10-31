const { Scenes } = require("telegraf");
import addAuthor from "./addAuthor";
import addLanguage from "./addLanguage";
import addUniversity from "./addUniversity";
import admin from "./admin";
import balans from "./balans";
import changeAuthor from "./changeAuthor";
import changeChecked from "./changeChecked";
import changeLanguageReferat from "./changeLanguageByReferat";
import changeThemeReferat from "./changeThemeByReferat";
import control from "./control";
import createWalletRequest from "./createWalletRequest";
import editSlides from "./editSlides";
import feadback from "./feadback";
import indepententWork from "./independentWork";
import sendMesssage from "./message";
import slidesCount from "./slidesCount";
import start from "./start";
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
  indepententWork,
  addUniversity,
  addAuthor,
  feadback,
  changeLanguageReferat,
  changeThemeReferat,
]);

export default stage;
