import fs from "fs";
import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
import { inlineKeyboardNumbers } from "../lib/helper";
import { chunkArrayInline } from "../utils/keyboards";
const scene = new Scenes.BaseScene("addAuthor");

import { Chat } from "@prisma/client";
import { sleep } from "openai/core";
import path from "path";
import {
  createPlansDescriptionLanguageReferat,
  createPlansLanguageReferat,
} from "../services/createPlansUseOpenAi";
import {
  handlePythonScriptReferat,
  parseJsonToTags,
} from "../services/parseReferat.service";
import { contentToString } from "../utils/functions";

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;

    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi topilmadi");

    const chat = await prisma.chat.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!chat) return ctx.reply("Chat topilmadi");

    const text = xss(ctx.message.text);

    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        author: text,
      },
    });

    const textUser = `🧮 Mustaqil soni nechta bo'lsin?
    To'lov qilganingizdan so'ng mustaqil ish soni 18 tagacha oshirishingiz mumkin bo'ladi
    `;
    const countArray = await inlineKeyboardNumbers(5, 12, user_id);

    const result = chunkArrayInline(countArray, 3);
    await ctx.reply(textUser, {
      reply_markup: {
        inline_keyboard: result,
      },
    });
  } catch (error) {
    console.log(error, "xatolik");
  }
});

scene.action(/\d+$/, async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;
    let user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        model: true,
        wallet: true,
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi mavjud emas");
    if (!user?.model_id) {
      const model = await prisma.gptModel.findFirst({
        where: {
          name: "gpt-3",
        },
      });
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          model_id: model?.id,
        },
        include: {
          model: true,
          wallet: true,
        },
      });
    }
    const count = ctx.callbackQuery.data;
    const messageId = ctx.callbackQuery.message?.message_id;
    ctx.deleteMessage(messageId);
    ctx.answerCbQuery();

    await ctx.reply("Siz tanlagan referatlar soni: " + count);

    let chat = await prisma.chat.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!chat) return ctx.reply("Chat topilmadi");

    chat = await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        pageCount: Number(count),
        model_id: user?.model_id,
        language: "Uzbek",
        lang: "uz",
      },
    });

    const slidePrice = await prisma.plansSlides.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });

    if (
      Number(user?.model?.name === "gpt-3" ? slidePrice?.price : 4000) >
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
          // [
          //   {
          //     text: "Mavzuni o'zgartirish",
          //     callback_data: "change",
          //   },
          // ],
          // [
          //   {
          //     text: "Slaydlar sonini o'zgartirish",
          //     callback_data: "changeSlides",
          //   },
          // ],
          // [
          //   {
          //     text: "Muallifni o'zgartirish",
          //     callback_data: "changeAuthor",
          //   },
          // ],
          // [
          //   {
          //     text: "Tekshirgan ustozni o'zgartirish",
          //     callback_data: "changeChecked",
          //   },
          // ],
        ],
      },
      parse_mode: "HTML",
    });

    ctx.session.user = {
      action: "slidesReady",
      chat_id: chat.id,
    };
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.action("confirm", async (ctx: any) => {
  try {
    // ctx.answerCbQuery();

    const message = ctx.callbackQuery.message;
    await ctx.editMessageReplyMarkup({
      inline_keyboard: [],
    });

    await ctx.reply(
      "Mustaqil ish  tasdiqlandi. Endi taqdimot matnini yuboraman"
    );

    const user_id = ctx.from?.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        wallet: true,
        model: true,
      },
    });

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        working: true,
      },
    });
    await ctx.telegram.sendChatAction(user?.telegram_id, "typing");

    const chat = await prisma.chat.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (!chat) return ctx.reply("Mavzu topilmadi topilmadi");

    createPresentationAsync(chat, user, ctx).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error, "Xatolik");
  }
});
scene.action("reject", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Mustaqil ish bekor qilindi");
  return await ctx.scene.enter("start");
});

export const createPresentationAsync = async (
  chat: Chat,
  user: any,
  ctx: any
) => {
  try {
    const plans = await createPlansLanguageReferat(
      String(chat.name),
      chat.pageCount,
      chat?.lang || "uz",
      chat.language || "uzbek",
      chat?.pageCount || 5,
      user?.model?.name || "gpt-3"
    );

    console.log(plans);
    for (let plan of plans) {
      // await ctx.telegram.sendChatAction(user.telegram_id, "typing");
      await prisma.plan.create({
        data: {
          chat_id: chat.id,
          name: plan,
        },
      });
    }

    let plan = await prisma.plan.findMany({
      where: {
        chat_id: chat.id,
      },
    });

    for (let [index, p] of plan.entries()) {
      let txt = `📌${index + 1}. ${p.name.split("&&")[0]}\n`;

      let description: any;
      try {
        await ctx.telegram.sendChatAction(user.telegram_id, "typing");
        description = await createPlansDescriptionLanguageReferat(
          p.name,
          chat.lang || "uz",
          chat.language || "uzbek",
          user?.model?.name
        );
      } catch (error) {
        console.log(error);
      }

      await prisma.description.create({
        data: {
          plan_id: p.id,
          name: p.name,
          content: description.content,
          chat_id: chat.id,
        },
      });

      await ctx.telegram.sendChatAction(user.telegram_id, "typing");
      txt += contentToString(description.content, chat.lang || "uz"); // contentToString(description.content, chat.lang);
      // txt += `\n\n ${description.content}`;
      await ctx.telegram.sendMessage(user.telegram_id, txt, {
        parse_mode: "HTML",
      });
      await ctx.telegram.sendChatAction(user.telegram_id, "typing");
    }

    await ctx.reply("Sizning Musataqil ishingiz tayyor. Endi faylni yuboraman");

    const description = await prisma.plan.findMany({
      where: {
        chat_id: chat.id,
      },
      include: {
        description: true,
      },
    });

    let body = description;

    const title = {
      name: chat.name,
      author: user?.name,
    };

    // let rightContent = `
    // Guruh: ${chat.name}.
    // Bajardi: ${chat?.author || "Anonymous"}.
    // Tekshirdi:${chat.checkUser || "Anonymous"}.
    // Fan: ${chat.name || "Unknown"}.`;
    let rightContent = `
    Bajardi: ${chat?.author || "Anonymous"}.
    Fan: ${chat.name || "Unknown"}.`;
    const contentText = parseJsonToTags(
      {
        plans: body,
      },
      rightContent,
      chat.scool || "O'quv yurti",
      chat.name || "Unknown"
    );

    console.log(contentText);
    // const slidePrice = await prisma.plansSlides.findFirst({
    //   orderBy: {
    //     created_at: "desc",
    //   },
    // });
    // await prisma.wallet.update({
    //   where: {
    //     id: user?.wallet?.id,
    //   },.
    //   data: {
    //     balance: {
    //       decrement: Number(
    //         user?.model?.name === "gpt-3" ? slidePrice?.price : 4000
    //       ),
    //     },
    //   },
    // });
    // await prisma.user.update({
    //   where: {
    //     id: user?.id,
    //   },
    //   data: {
    //     working: false,
    //   },
    // });

    // await ctx.telegram.sendMessage(
    //   user?.telegram_id,
    //   "Keyingi 5 ta taqdimot turlarini yaratishda xatolikka duch keldik.Yaqin kunlarda tuzatamiz.Bizni to'g'ri tushunganingiz uchun raxmat"
    // );

    const id = user.telegram_id;
    const filePath = path.join(__dirname, `../../output2${id}.docx`);

    const createdFile = await handlePythonScriptReferat(
      `${id}{{${contentText}`
    );

    await sleep(500);

    const dataExplore = fs.readFileSync(filePath);
    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: dataExplore,
        filename: `${id}.docx`,
      },
      {
        caption: `📌 Mustaqil ishingiz tayyor`,
        parse_mode: "HTML",
      }
    );

    await ctx.telegram.sendMessage(
      user?.telegram_id,
      "Botimizning foydasi  tekkan bo'lsa do'stlaringizni taklif qiling bizga katta yordam bergan bo'lasiz"
    );
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error);
    const user_id = ctx.from?.id;
    ctx.telegram.sendMessage(
      user_id,
      "Xatolik yuz berdi. Iltimos qayta urinib ko'ring /start buyrug'i bilan urunib ko'ring"
    );
  }
};

export default scene;
