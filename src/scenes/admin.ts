import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("admin");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.hears("/users", async (ctx: any) => {
  try {
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
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error, "xatolik");
  }
});

scene.hears("Bugungi statistika", async (ctx: any) => {
  try {
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
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.hears("Hamma foydalanuchilarga xabar yuborish", async (ctx: any) => {
  try {
    ctx.reply("Xabarni kiriting");
    return await ctx.scene.enter("sendMessage");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.hears("Umumiy statistika", async (ctx: any) => {
  try {
    const users = await prisma.user.count();
    const chats = await prisma.chat.count();
    const slides = await prisma.plan.count();

    ctx.reply(
      `Foydalanuvchilar soni: ${users}\n Taqtimotlar  soni: ${chats}\n Umumiy taqdimotlar sahifalar soni: ${slides}`
    );
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

export default scene;
