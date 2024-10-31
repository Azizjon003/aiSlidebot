import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("changeThemeReferat");
scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  try {
    let text = xss(ctx.message.text);
    const user_id = ctx.from?.id;

    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        model: true,
        wallet: true,
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi topilmadi");

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
        name: text,
      },
    });

    await ctx.deleteMessage(ctx.message?.message_id);

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

    return await ctx.scene.enter("addAuthor");
  } catch (error) {
    console.log(error, "xatolik");
  }
});

export default scene;
