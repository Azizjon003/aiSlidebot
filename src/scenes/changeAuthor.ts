import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("changeAuthor");
import xss from "xss";
scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  let text = xss(ctx.message.text);
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

  const users = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: text,
    },
  });

  await ctx.deleteMessage(ctx.message?.message_id);

  let txt = `🏙 Taqdimot haqida:

  ➡️ Muallif: ${users?.name}
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
