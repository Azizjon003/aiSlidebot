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

    const text = `Balansingiz: ${wallet.balance}.\nBalansni to'ldirish uchun summani kiriting:\nMinimal summa 2000 so'm mumkin`;
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
  const message_id = ctx.update.message.message_id;
  try {
    await ctx.deleteMessage(message_id - 1);
  } catch (error) {
    console.error("Xabar o'chirishda xatolik yuz berdi:", error);
  }
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  ctx.reply(
    "Bu buyruqni tushunmadim 😔. /start buyrug'ini bosib qaytadan boshlang"
  );
});
// Simplified action handler for all pay actions

export default scene;
