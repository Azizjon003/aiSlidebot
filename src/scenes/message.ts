import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
import { sleep } from "openai/core";
import xss from "xss";
const scene = new Scenes.BaseScene("sendMessage");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  const users = await prisma.user.findMany();
  for (let user of users) {
    const userNameClean = xss(user.username ?? "Anonymous");
    try {
      await ctx.telegram.sendMessage(user.telegram_id, ctx.message.text, {
        parse_mode: "HTML",
      });
      await delay(1000);
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
  ctx.reply(
    "Xabar barcha foydalanuvchilarga yuborildi.\n Qanday xizmatlar bor menga admin :)"
  );
  ctx.scene.enter("start");
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export default scene;
