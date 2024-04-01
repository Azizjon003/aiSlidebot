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
  const userBalanceCount = await prisma.wallet.count({
    where: {
      balance: 0,
    },
  });
  const userBalance = await prisma.wallet.count({
    where: {
      balance: 2000,
    },
  });

  const userBalance1 = await prisma.wallet.count({
    where: {
      balance: {
        gte: 2000,
      },
    },
  });
  text += `\nBugun ${chat.length} ta chat ro'yxatdan o'tgan`;

  text += `\nBugun ${userBalanceCount} ta foydalanuvchi balansi 0\n ${userBalance} ta foydalanuvchi balansi 2000\n ${userBalance1} ta foydalanuvchi balansi 2000 dan ko'p`;
  ctx.reply(text);
  ctx.scene.enter("start");
});

scene.hears("Hamma foydalanuchilarga xabar yuborish", async (ctx: any) => {
  ctx.reply("Xabarni kiriting");
  ctx.scene.enter("sendMessage");
});

scene.hears("Umumiy statistika", async (ctx: any) => {
  const users = await prisma.user.count();
  const chats = await prisma.chat.count();
  const slides = await prisma.plan.count();

  ctx.reply(
    `Foydalanuvchilar soni: ${users}\n Taqtimotlar  soni: ${chats}\n Umumiy taqdimotlar sahifalar soni: ${slides}`
  );
  ctx.scene.enter("start");
});

export default scene;
