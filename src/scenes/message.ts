import { User } from "@prisma/client";
import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("sendMessage");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const users = await prisma.user.findMany();

  messageFunction(users, ctx);
  ctx.reply(
    "Xabar barcha foydalanuvchilarga yuborildi.\n Qanday xizmatlar bor menga admin :)"
  );
  return await ctx.scene.enter("start");
});

const messageFunction = async (users: User[], ctx: any) => {
  for (let user of users) {
    const userNameClean = xss(user.username ?? "Anonymous");
    try {
      await ctx.telegram.sendMessage(user.telegram_id, ctx.message.text, {
        parse_mode: "HTML",
      });
      await delay(500);
    } catch (error) {
      console.log(error);
      ctx.reply(
        `Xabar yuborishda xatolik yuz berdi <a href="tg://user?id=${user.telegram_id}">${userNameClean}</a> foydalanvchi `,
        {
          parse_mode: "HTML",
        }
      );
    }
  }
};
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export default scene;
