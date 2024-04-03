import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [
  "Yangi Taqdimot",
  "Balans",
  "Do'stlarimni taklif qilish",
  "AI modelni tanlash",
];
export let keyboard2 = [
  "Foydalanuvchilar",
  "Hamma foydalanuchilarga xabar yuborish",
  "Bugungi statistika",
  "Foydalanuvchilarga limit qo'shish",
  "Umumiy statistika",
];
scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;

  const user_name = ctx.from?.first_name || ctx.from?.username;

  const enable = await enabled(String(user_id), String(user_name));

  const invitedUsers = await prisma.invitedUsers.findFirst({
    where: {
      user_id: String(user_id),
      isActive: false,
    },
  });

  if (invitedUsers) {
    await prisma.invitedUsers.update({
      where: {
        id: invitedUsers.id,
      },
      data: {
        isActive: true,
      },
    });

    await prisma.wallet.updateMany({
      where: {
        user: {
          telegram_id: invitedUsers.invited_user_id,
        },
      },
      data: {
        balance: {
          increment: 1000,
        },
      },
    });

    await ctx.telegram.sendMessage(
      invitedUsers.invited_user_id,
      `Sizni do'stingiz botimizga taklif qildi va sizga 1000 so'm bonus berildi`
    );
  }

  if (enable === "one") {
    ctx.telegram.sendMessage(
      user_id,
      `Assalomu alaykum!\nYangi Taqdimot tugmasini bosib taqdimot yaratishni boshlashingiz mumkin!\nTakliflar

      👉 Bot ingliz tilida kiritilgan mavzularni yaxshi tushunadi.
      👉 Bot sekinroq ishlaydi bunga sabab chatgpt-4 dan foydalanganligi
      👉 Botga yangi taqdimot qo'shish uchun "Yangi Taqdimot" tugmasini bosing
    
      `,
      keyboards(keyboard)
    );

    return ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";

    ctx.telegram.sendMessage(user_id, text, keyboards(keyboard2));
    return ctx.scene.enter("admin");
  } else if (enable === "three") {
    ctx.telegram.sendMessage(
      user_id,
      "Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz"
    );
  }
});

export default scene;
