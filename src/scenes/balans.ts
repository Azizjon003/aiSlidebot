import { Scenes, Markup } from "telegraf";
import prisma from "../../prisma/prisma";

const scene = new Scenes.BaseScene("balans");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(
  /^balance:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  async (ctx: any) => {
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: { telegram_id: String(user_id) },
    });

    ctx.answerCbQuery();
    if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

    const wallet = await prisma.wallet.findFirst({
      where: { user_id: user.id },
    });

    if (!wallet) {
      return ctx.reply("Bu foydalanuchi mavjud emas");
    }
    await ctx.deleteMessage();

    let txt = `Karta orqali to'lov qilmoqchi bo'lsangiz \n
    <b>Karta raqam</b>: <code>8600 3129 7257 8377</code>
    <b>Kimni nomida</b>: Aliqulov Azizjon
    karta raqamlariga to'lov qilib chekni adminga yuboring
    Adminlarning kontaktlari: @magic_slide_admin @aliqulov_azizjon
    
    Bitta taqdimot narxi 2000 so'm.Bunda siz 18 sahifali taqdimot tayyorlay olishingiz mumkin bo'ladi
    `;
    const text = `Balansingiz: ${wallet.balance}.\nBalansni to'ldirish uchun summani kiriting:\nMinimal summa 2000 so'm mumkin`;

    ctx.reply(txt, {
      parse_mode: "HTML",
    });

    const inlineKeyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback("2000 so'm", "pay_2000"),
        Markup.button.callback("5000 so'm", "pay_5000"),
        Markup.button.callback("10000 so'm", "pay_10000"),
      ],
      [
        Markup.button.callback("Boshqa miqdor", "pay_other"),
        Markup.button.callback("Asosiy menyu", "main_menu"),
      ],
    ]);

    await ctx.reply(text, inlineKeyboard);
    return await ctx.scene.enter("createWalletRequest");
  }
);

scene.hears("Bosh menyu", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  ctx.reply(
    "Bu buyruqni tushunmadim 😔. /start buyrug'ini bosib qaytadan boshlang"
  );
});
// Simplified action handler for all pay actions

export default scene;
