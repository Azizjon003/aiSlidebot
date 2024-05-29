import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
import { languages } from "./slidesCount";
const scene = new Scenes.BaseScene("addLanguage");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(["eng", "ru", "uz", "fr", "de"], async (ctx: any) => {
  // Update the type of ctx
  ctx.answerCbQuery();
  ctx.deleteMessage();
  const lang = ctx.callbackQuery?.data;
  const user_id = String(ctx.from.id);
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: user_id,
    },
  });

  if (!user) {
    ctx.reply("You are not registered. Please /start the bot first.");
    return;
  }

  const chat = await prisma.chat.findFirst({
    where: {
      user_id: user.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!chat) {
    ctx.reply("You have not started any chat. Please /start the bot first.");
    return;
  }

  if (lang === "eng") {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        language: "English",
        lang: "eng",
      },
    });
  } else if (lang === "ru") {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        language: "Russian",
        lang: "ru",
      },
    });
  } else if (lang === "uz") {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        language: "Uzbek",
        lang: "uz",
      },
    });
  } else if (lang === "fr") {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        language: "French",
        lang: "fr",
      },
    });
  } else if (lang === "de") {
    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        language: "German",
        lang: "de",
      },
    });
  }

  const text = `Taqdimot muvzusini kiriting:

    1. Har bir mavzuga 20 yillik o'qituvchi kabi qarayman.
    2. Qisqartma so'zlarga, imloviy xatoli so'zlarga tushunmay qolishim mumkin.
    3. Inglizchaga tarjima qilganda ma'nosi chalkashishi mumkin bo'lgan mavzularni kiritmang.

     ❗️ Iltimos, mavzu yozishda e'tiborli bo'ling.`;

  ctx.session.user = {
    action: "slidesName",
    chat_id: chat.id,
  };

  await ctx.reply(text, {
    parse_mode: "HTML",
  });

  return await ctx.scene.enter("slidesCount");
});
export default scene;
