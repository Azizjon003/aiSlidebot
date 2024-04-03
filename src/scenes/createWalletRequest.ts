import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
import { languages } from "./slidesCount";
import { walletRequestStatus } from "@prisma/client";
const scene = new Scenes.BaseScene("createWalletRequest");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.hears(/^[0-9]+$/, async (ctx) => {
  const user_id = ctx.from.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });
  if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

  const wallet = await prisma.wallet.findFirst({
    where: {
      user_id: user.id,
    },
  });

  if (!wallet) {
    return ctx.reply("Bu foydalanuchi mavjud emas");
  }

  const amount = Number(ctx.message.text);

  if (amount < 1000) {
    return ctx.reply("Minimal summa 2000 so'm");
  }
  if (amount > 100000) {
    return ctx.reply("Maksimal summa 100000 so'm");
  }
  const newRequest = await prisma.walletRequest.create({
    data: {
      amount,
      user_id: user.id,
      status: walletRequestStatus.PENDING,
    },
  });
  const res = await ctx.telegram.sendInvoice(user.telegram_id, {
    title: "Balans",
    description: `Balansni to'ldirish`,
    payload: `id:${newRequest.id}`,
    provider_token: String(process.env.PROVIDER_TOKEN),
    currency: "UZS",
    prices: [{ label: "Balans", amount: amount * 100 }],
  });

  await prisma.walletRequest.update({
    where: {
      id: newRequest.id,
    },
    data: {
      message_id: String(res.message_id),
    },
  });
});

export default scene;
