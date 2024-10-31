import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("changeLanguageReferat");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(["eng", "ru", "uz"], async (ctx: any) => {
  try {
    // Update the type of ctx
    ctx.answerCbQuery();
    ctx.deleteMessage();
    const lang = ctx.callbackQuery?.data;
    const user_id = String(ctx.from.id);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: user_id,
      },
      include: {
        model: true,
        wallet: true,
      },
    });

    if (!user) {
      ctx.reply("You are not registered. Please /start the bot first.");
      return;
    }

    let chat = await prisma.chat.findFirst({
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
      chat = await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "English",
          lang: "eng",
        },
      });
    } else if (lang === "ru") {
      chat = await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "Russian",
          lang: "ru",
        },
      });
    } else if (lang === "uz") {
      chat = await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          language: "Uzbek",
          lang: "uz",
        },
      });
    }
    const slidePrice = await prisma.plansSlides.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });

    if (
      Number(user?.model?.name === "gpt-3" ? slidePrice?.price : 2000) >
      Number(user?.wallet?.balance)
    ) {
      ctx.reply(
        `Sizda yetarli mablag' mavjud emas. Balansingiz: ${user?.wallet?.balance} so'm\n Bir dona to'liq referat narxi 2000 so'm yoki 4000 so'm.Referat 18 tagacha sahifagadan iborat bo'lishi mumkin`
      );
      return await ctx.scene.enter("start");
    }

    let txt = `🏙 Mustaqil ish haqida:

  ➡️ Muallif: ${chat?.author || "Anonim"}
  🖊 Til: ${chat.language}
  🧮 Soni: <i>${chat.pageCount}</i> ta
  
  📌 Mavzu: <b>${chat?.name}</b>
  
  Eslatma: Avval, Mustaqil ishning matnlarini yuboraman.So'ngra mustaqil ishni tayyorlayman.\n Iltimos shoshilmang men sekinroq javob berishim mumkin`;

    await ctx.reply(txt, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Tasdiqlash",
              callback_data: "confirm",
            },
          ],
          [
            {
              text: "Bekor qilish",
              callback_data: "reject",
            },
          ],
          [
            {
              text: "Mavzuni o'zgartirish",
              callback_data: "change",
            },
          ],
          [
            {
              text: "Tilini o'zgartirish",
              callback_data: "changeLanguage",
            },
          ],
        ],
      },
      parse_mode: "HTML",
    });

    ctx.session.user = {
      action: "slidesReady",
      chat_id: chat.id,
    };

    return await ctx.scene.enter("addAuthor");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});
export default scene;
