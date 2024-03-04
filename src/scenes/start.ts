import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = ["Yangi Taqdimot", "Balans"];
export let keyboard2 = [
  "Foydalanuvchilar",
  "Hamma foydalanuchilarga xabar yuborish",
  "Bugungi statistika",
];
scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;

  const user_name = ctx.from?.first_name || ctx.from?.username;

  const enable = await enabled(String(user_id), String(user_name));

  if (enable === "one") {
    ctx.reply(
      `Assalomu alaykum!\nYangi Taqdimot tugmasini bosib taqdimot yaratishni boshlashingiz mumkin!\nTakliflar

      👉 Bot ingliz tilida kiritilgan mavzularni yaxshi tushunadi.
      👉 Ingliz tiliga tarjima qilinganda ma'nosi o'zgarishi mumkin bo'lgan mavzularni kiritishdan saqlaning.
      👉 Mavzu qaysi tilda kiritilishidan qat'iy nazar, tanlangan til asosida taqdimot yaratiladi.
      👉 Bot butun dunyo ma'lumotlari asosida taqdimot tayyorlaydi. Agar O'zbekistonga oid ma'lumot kerak bo'lsa, mavzuni kiritishda davlat nomini ham kiritgan ma'qul.
      👉 Shaxslar asosida taqdimot yaratishda, shaxs haqida aniqroq ma'lumot berishga urinib ko'ring.
      `,
      keyboards(keyboard)
    );

    return ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";
    ctx.reply(text, keyboards(keyboard2));
  } else if (enable === "three") {
    ctx.reply("Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz");
  }
});

export default scene;
