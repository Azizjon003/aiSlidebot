import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import enabled from "../utils/enabled";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [
  ["Yangi Taqdimot", "Mustaqil ish"],
  ["Balans", "Do'stlarimni taklif qilish"],
  ["Fikr bildirish", "Qo'llanma"],
  // ["Web sahifaga o'tish"],
];
//"Web sahifaga o'tish"
export let admin_keyboard = [
  ["Hamma foydalanuchilarga xabar yuborish"],
  ["Bugungi statistika", "Foydalanuvchilarga limit qo'shish"],
  ["Umumiy statistika"],
];

// scene.on("message", async (ctx: any, next: any) => {
//   console.log(ctx.message.text, "start");

//   next();
// });
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

  if (enable === "one" || enable === "four") {
    let keyboardStart = keyboards(keyboard);

    ctx.telegram.sendMessage(
      user_id,
      // `Assalomu alaykum!\nYangi Taqdimot tugmasini bosib taqdimot yaratishni boshlashingiz mumkin!\nTakliflar

      // 👉 Bot ingliz tilida kiritilgan mavzularni yaxshi tushunadi.
      // 👉 Bot sekinroq ishlaydi bunga sabab chatgpt-4 dan foydalanganligi
      // 👉 Botga yangi taqdimot qo'shish uchun "Yangi Taqdimot" tugmasini bosing

      // `,
      `Assalomu alaykum!

<b>Yangi Taqdimot</b> - taqdimot tayorlash uchun.
<b>Mustaqil ish</b>- referat tayorlash uchun.
<b>Qo'llanma</b> - botdan qanday foydalanish haqida ma'lumot. Iltimos, avval shu bo'lim bilan tanishib chiqing.
`,
      {
        parse_mode: "HTML",
        ...keyboardStart,
      }
    );

    console.log("start scene");
    return await ctx.scene.enter("control");
  } else if (enable === "two") {
    const text = "Assalomu alaykum Admin xush kelibsiz";

    ctx.telegram.sendMessage(user_id, text, keyboards(admin_keyboard));
    return await ctx.scene.enter("admin");
  } else if (enable === "three") {
    ctx.telegram.sendMessage(
      user_id,
      "Assalomu alaykum.Kechirasiz siz admin tomonidan bloklangansiz"
    );
    return;
  }
  // } else if (enable === "four") {
  //   // ctx.telegram.sendMessage(
  //   //   user_id,
  //   //   "Assalomu alaykum.Kechirasiz siz taqdimot tayyorlayapsiz.Taqdimot tugagandan so'ng boshqa amallar bajarishingiz mumkin bo'ladi"
  //   // );
  //   // return;
  // }
});

export default scene;
