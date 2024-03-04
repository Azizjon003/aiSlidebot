import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
const scene = new Scenes.BaseScene("slidesCount");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.action(/\d+$/, async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi mavjud emas");
  const count = ctx.callbackQuery.data;
  const messageId = ctx.callbackQuery.message?.message_id;
  ctx.deleteMessage(messageId);
  ctx.answerCbQuery();

  await ctx.reply("Siz tanlagan taqdimotlar soni: " + count);

  const chat = await prisma.chat.create({
    data: {
      pageCount: Number(count),
      user_id: user?.id,
    },
  });

  const text = `Taqdimot muvzusini kiriting: 

  1. Har bir mavzuga umumiy bilimdondek qarayman. Qaysidir tor doirada ishlatiladigan mavzularni kiritishda ularni aniqroq izohlashga urinib ko'ring. 
  2. Qisqartma so'zlarga, imloviy xatoli so'zlarga tushunmay qolishim mumkin.
  3. Inglizchaga tarjima qilganda ma'nosi chalkashishi mumkin bo'lgan mavzularni kiritmang. 
  
  ❗️ Kiritilgan mavzuga tushunmagan holda boshqa mavzuga chalg'ib ketishim mumkin. Iltimos, mavzu yozishda e'tiborli bo'ling.`;
  ctx.session.user = {
    action: "slidesName",
    chat_id: chat.id,
  };

  ctx.reply(text);
});

scene.on("message", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const action = ctx.session.user?.action;
  if (action !== "slidesName") return ctx.scene.enter("start");
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi mavjud emas");

  let chat = await prisma.chat.findFirst({
    where: {
      id: ctx.session.user?.chat_id,
    },
  });

  if (!chat) return ctx.reply("Chat topilmadi");

  const text = ctx.message.text;
  if (!text) return ctx.reply("Xatolik");

  chat = await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      name: text,
    },
  });

  let txt = `🏙 Taqdimot haqida:

  ➡️ Muallif: ${user?.name}
  🖊 Til: 🇺🇿 (O'zbekcha)
  🧮 Slaydlar: <i>${chat.pageCount}</i> ta
  
  📌 Mavzu: <b>${chat?.name}</b>
  
  Eslatma: Avval, taqdimot matnini birin ketin yuboraman. So'ngra taqdimot faylini tayyorlayman. Iltimos, shoshilmang.`;

  ctx.reply(txt, {
    reply_markup: keyboards(["Tayyor", "Orqaga"]),
    parse_mode: "HTML",
  });
});

export default scene;
