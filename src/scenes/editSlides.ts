import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
const scene = new Scenes.BaseScene("editSlidesCount");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(/\d+/, async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi topilmadi");
  ctx.answerCbQuery();

  const count = ctx.callbackQuery.data;
  const chatId = await prisma.chat.findFirst({
    where: {
      user_id: user?.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  const chat = await prisma.chat.update({
    where: {
      id: chatId?.id,
    },
    data: {
      pageCount: Number(count),
    },
  });

  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);

  let txt = `🏙 Taqdimot haqida:

  ➡️ Muallif: ${user?.name}
  🖊 Til: 🇺🇿 (O'zbekcha)
  🧮 Slaydlar: <i>${chat.pageCount}</i> ta
  
  📌 Mavzu: <b>${chat?.name}</b>
  
  Eslatma: Avval, taqdimot matnini birin ketin yuboraman. So'ngra taqdimot faylini tayyorlayman. Iltimos, shoshilmang.`;

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
        [
          {
            text: "Slaydlar sonini o'zgartirish",
            callback_data: "changeSlides",
          },
        ],
        [
          {
            text: "Muallifni o'zgartirish",
            callback_data: "changeAuthor",
          },
        ],
        [
          {
            text: "Tekshirgan ustozni o'zgartirish",
            callback_data: "changeChecked",
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

  return await ctx.scene.enter("slidesCount");
});

export default scene;
