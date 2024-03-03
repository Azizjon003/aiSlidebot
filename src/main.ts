require("dotenv").config();
import { Context, Middleware } from "telegraf";
import bot from "./core/bot";
import session from "./core/session";
import botStart from "./utils/startBot";
import stage from "./scenes/index";
import { SceneContext } from "telegraf/typings/scenes";

bot.use(session);

const middleware: Middleware<Context | SceneContext> = (ctx: any, next) => {
  ctx?.session ?? (ctx.session = {});
};
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("start"));

bot.catch((err: any, ctx: any) => {
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});
botStart(bot);
