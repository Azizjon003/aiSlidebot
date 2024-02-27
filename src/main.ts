require("dotenv").config();
import { Context, Middleware } from "telegraf";
import bot from "./core/bot";
import session from "./core/session";
import botStart from "./utils/startBot";
import stage from "./scenes/index";
import { SceneContext } from "telegraf/typings/scenes";
import findProductByName from "./utils/searchFunction";
bot.use(session);

const middleware: Middleware<Context | SceneContext> = (ctx: any, next) => {
  ctx?.session ?? (ctx.session = {});
};
bot.use(stage.middleware());

bot.start((ctx: any) => ctx.scene.enter("start"));

bot.on("inline_query", async (ctx: any) => {
  const query = ctx.inlineQuery.query;
  let results: any = [];
  // Mahsulotlarni qidirish uchun kerakli kod
  const products = await findProductByName(query);
  console.log(products);
  products.forEach((product, i) => {
    results.push({
      type: "article",
      id: i,
      title: product.name,
      description: product.description,
      input_message_content: {
        message_text: product.name,
      },
    });
  });
  // });
  // await ctx.replanswerInlineQuery("Mahsulotlar");
  await ctx.answerInlineQuery(results);
});
bot.catch((err: any, ctx: any) => {
  console.log(`Ooops, encountered an error for ${ctx}`, err);
});
botStart(bot);
