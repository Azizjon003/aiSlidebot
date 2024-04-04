import { Scenes, Markup } from 'telegraf';
import prisma from '../../prisma/prisma';
import { walletRequestStatus } from '@prisma/client';

const scene = new Scenes.BaseScene('createWalletRequest');

scene.hears('/start', (ctx:any) => {
  console.log("createWalletRequest /start")
  ctx.scene.enter('start');
});

scene.action(/pay_(2000|5000|10000)/, async (ctx:any) => {
  console.log("pay_(2000|5000|10000|other) function")
  await ctx.deleteMessage();
  const amount = parseInt(ctx.match[1]);
  await processPayment(ctx, ctx.from.id, amount);
});
scene.action('pay_other', async (ctx:any) => {
  await ctx.deleteMessage();
  await ctx.reply('Summani kiriting: ');
  ctx.scene.state.waitingForAmount = true;
});

scene.on('message', async (ctx:any) => {
  if (ctx.scene.state.waitingForAmount) {
    const text = ctx.message.text;
    const amount = parseInt(text, 10);
    ctx.scene.state.waitingForAmount = false;

    if (!isNaN(amount)) {
      await processPayment(ctx, ctx.from.id, amount);
    } else {
      await ctx.reply('Yaroqsiz summa, iltimos, qayta urining.');
    }
  }
});

scene.action('main_menu', async (ctx:any) => {
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.error('Failed to delete message:', error);
  }
  ctx.scene.enter('start');
});

scene.hears(/^[0-9]+$/, async (ctx) => {

  const amount = Number(ctx.message.text);
  if (amount < 2000) {
    return ctx.reply('Minimal summa 2000 so\'m');
  }
  if (amount > 100000) {
    return ctx.reply('Maksimal summa 100000 so\'m');
  }

  await processPayment(ctx, ctx.from.id, amount);
});

async function processPayment(ctx:any, tgId:any, amount:any) {
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(tgId),
    },
  });
  if (!user) return ctx.reply('Bu foydalanuchi mavjud emas');
  const newRequest = await prisma.walletRequest.create({
    data: {
      amount,
      user_id: user.id,
      status: walletRequestStatus.PENDING,
    },
  });

  const res = await ctx.telegram.sendInvoice(user.telegram_id, {
    title: `Magic Slide bot uchun balansni to'ldirish`,
    description: `Siz hisobingizni to\'ldirayotgan mablag' ${amount}, ~${Math.floor(amount/2000)} ta taqdimot uchun to'g'ri keladi.
     Siz to'ldirgan mablag'ni qaytarib olish imkoni yo'q. To'ldirish tugmasini bosing va to'lovni amalga oshiring. `,
    payload: `id:${newRequest.id}`,
    provider_token: process.env.PROVIDER_TOKEN,
    currency: 'UZS',
    prices: [{ label: 'Balans', amount: amount * 100 }],
  });

  await prisma.walletRequest.update({
    where: { id: newRequest.id },
    data: { message_id: String(res.message_id) },
  });
}

export default scene;
