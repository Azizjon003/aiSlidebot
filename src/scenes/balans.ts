import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("balans");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.action(
  /^balance:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  async (ctx) => {
    const user_id = ctx.from.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    ctx.answerCbQuery();

    if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

    const wallet = await prisma.wallet.findFirst({
      where: {
        user_id: user.id,
      },
    });

    if (!wallet) {
      return ctx.reply("Bu foydalanuchi mavjud emas");
    }

    const text = `Balansingiz: ${wallet.balance}.\nBalansni to'ldirish uchun summani kiriting:`;
    ctx.reply(text);

    ctx.sendInvoice({
      title: "Balans to'ldirish",
      description: "Balans to'ldirish",
      payload: "balans",
      provider_token: String(process.env.PROVIDER_TOKEN),
      start_parameter: "start_parameter",
      currency: "UZS",
      prices: [{ label: "Balans to'ldirish", amount: 10000 }],
    });
  }
);
export default scene;
