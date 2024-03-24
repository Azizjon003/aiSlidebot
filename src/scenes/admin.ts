import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("admin");
import xss from "xss";

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.hears("Foydalanuvchilar", async (ctx: any) => {
  const users = await prisma.user.findMany();
  let text = "Foydalanuvchilar";
  // users.forEach(async (user, index) => {
  //   let normalizedUsername = user.username
  //     ?.normalize("NFD")
  //     ?.replace(/[\u0300-\u036f]/g, "A");
  //   const clean = xss(normalizedUsername ?? "Anonymous");
  //   text += `\n${
  //     index + 1
  //   } - ${clean} - <a href="tg://user?id=${clean}">User</a>`;

  //   if ((index + 1) % 5 === 0) {
  //     await ctx.reply(text, {
  //       parse_mode: "HTML",
  //     });
  //     text = "";
  //   }
  // });
  for (let [index, user] of users.entries()) {
    let normalizedUsername = user.username
      ?.normalize("NFD")
      ?.replace(/[\u0300-\u036f]/g, "A");
    const clean = xss(normalizedUsername ?? "Anonymous");
    text += `\n${index + 1} - ${clean} - <a href="tg://user?id=${
      user.telegram_id
    }">${clean}</a>`;

    if ((index + 1) % 5 === 0) {
      await ctx.reply(text, {
        parse_mode: "HTML",
      });
      text = "";
    }
  }
  await ctx.reply(text, {
    parse_mode: "HTML",
  });
  ctx.scene.enter("start");
});

scene.hears("Bugungi statistika", async (ctx: any) => {
  let todayTime = new Date().setHours(0, 0, 0, 0);
  const users = await prisma.user.findMany({
    where: {
      created_at: {
        gte: new Date(todayTime),
      },
    },
  });

  let text = `Bugun ${users.length} ta foydalanuvchi ro'yxatdan o'tgan`;
  const chat = await prisma.chat.findMany({
    where: {
      created_at: {
        gte: new Date(todayTime),
      },
    },
  });
  text += `\nBugun ${chat.length} ta chat ro'yxatdan o'tgan`;

  ctx.reply(text);
  ctx.scene.enter("start");
});

scene.hears("Hamma foydalanuchilarga xabar yuborish", async (ctx: any) => {
  ctx.reply("Xabarni kiriting");
  ctx.scene.enter("sendMessage");
});
export default scene;
