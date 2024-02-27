import { Telegraf } from "telegraf";
import configs from "../utils/config";
const bot = new Telegraf(String(configs.TOKEN));

export default bot;
