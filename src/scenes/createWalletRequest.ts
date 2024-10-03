import { walletRequestStatus } from "@prisma/client";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";

const scene = new Scenes.BaseScene("createWalletRequest");

scene.hears("/start", async (ctx: any) => {
  console.log("createWalletRequest /start");
  return await ctx.scene.enter("start");
});

scene.action(/pay_(2000|5000|10000)/, async (ctx: any) => {
  try {
    console.log("pay_(2000|5000|10000|other) function");
    await ctx.deleteMessage();
    const amount = parseInt(ctx.match[1]);
    await processPayment(ctx, ctx.from.id, amount);

    return await ctx.scene.enter("control");
  } catch (error) {
    console.error("Failed to process payment:", error);
  }
});
scene.action("pay_other", async (ctx: any) => {
  await ctx.deleteMessage();
  await ctx.reply("Summani kiriting: ");
  ctx.scene.state.waitingForAmount = true;
});

// scene.on("message", async (ctx: any) => {
//   if (ctx.scene.state.waitingForAmount) {
//     const text = ctx.message.text;
//     const amount = parseInt(text, 10);
//     ctx.scene.state.waitingForAmount = false;

//     if (!isNaN(amount)) {
//       await processPayment(ctx, ctx.from.id, amount);
//     } else {
//       await ctx.reply("Yaroqsiz summa, iltimos, qayta urining.");
//     }
//   }
// });

scene.action("main_menu", async (ctx: any) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
  return await ctx.scene.enter("start");
});

scene.hears(/^[0-9]+$/, async (ctx: any) => {
  try {
    const amount = Number(ctx.message.text);
    if (amount < 2000) {
      return ctx.reply("Minimal summa 2000 so'm");
    }
    if (amount > 100000) {
      return ctx.reply("Maksimal summa 100000 so'm");
    }

    await processPayment(ctx, ctx.from.id, amount);

    return await ctx.scene.enter("control");
  } catch (error) {
    console.error("Failed to process payment:", error);
  }
});
scene.hears("Bosh menyu", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  ctx.reply(
    "Bu buyruqni tushunmadim 😔. /start buyrug'ini bosib qaytadan boshlang"
  );
});

async function processPayment(ctx: any, tgId: any, amount: any) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(tgId),
      },
    });
    if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");
    const newRequest = await prisma.walletRequest.create({
      data: {
        amount,
        user_id: user.id,
        status: walletRequestStatus.PENDING,
      },
    });

    const res = await ctx.telegram.sendInvoice(user.telegram_id, {
      title: `Magic Slide bot uchun balansni to'ldirish`,
      description: `Siz hisobingizni to\'ldirayotgan mablag' ${amount}, ~${Math.floor(
        amount / 2000
      )} ta taqdimot uchun to'g'ri keladi.To'ldirish tugmasini bosing va to'lovni amalga oshiring.`,
      payload: `id:${newRequest.id}`,
      provider_token: process.env.PROVIDER_TOKEN,
      currency: "UZS",
      photo_url:
        "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/7899.png",
      // "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Paymeuz_logo.png/2560px-Paymeuz_logo.png",
      prices: [{ label: "Balans", amount: amount * 100 }],
    });

    await prisma.walletRequest.update({
      where: { id: newRequest.id },
      data: { message_id: String(res.message_id) },
    });

    // ctx.telegram.sendMessage(
    //   "-1002103794627",
    //   `Foydalanuvchi ${user.name} quyidagi summani to'lamoqchi bo'ldi ${
    //     amount * 100
    //   } `
    // );
  } catch (error) {
    console.error("Error processing payment:", error);
    ctx.telegram.sendMessage(
      ctx.from.id,
      "Xatolik sodir bo'ldi qayta kiriting /start ni bosing"
    );
  }
}

export default scene;
