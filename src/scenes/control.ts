import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});
export const countArray = [
  {
    text: "5",
    callback_data: 5,
  },
  {
    text: " 6 ",
    callback_data: 6,
  },
  {
    text: " 7 ",
    callback_data: 7,
  },
  {
    text: " 8 ",
    callback_data: 8,
  },
  {
    text: " 9 ",
    callback_data: 9,
  },
  {
    text: " 10 ",
    callback_data: 10,
  },
  {
    text: " 11 ",
    callback_data: 11,
  },
  {
    text: " 12 ",
    callback_data: 12,
  },
  // {
  //   text: " 13 ",
  //   callback_data: 13,
  // },
  // {
  //   text: " 14 ",
  //   callback_data: 14,
  // },
  // {
  //   text: " 15 ",
  //   callback_data: 15,
  // },
];

scene.hears("Yangi Taqdimot", async (ctx: any) => {
  const user_id = ctx.from?.id;

  const result = chunkArrayInline(countArray, 3);

  const text = `🧮 Slaydlar soni nechta bo'lsin?`;

  ctx.reply(text, {
    reply_markup: {
      inline_keyboard: result,
    },
  });
  ctx.scene.enter("slidesCount");
});

scene.hears("Balans", async (ctx: any) => {
  const user_id = ctx.from.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

  const wallet = await getBalance(user.id);
  let priceSlide = await prisma.plansSlides.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });
  if (!priceSlide) {
    priceSlide = await prisma.plansSlides.create({
      data: {
        price: 2000,
      },
    });
  }

  const text = `Balansingiz: ${
    wallet.balance
  }\nSiz olishingiz mumkin bo'lgan slidelar soni: ${Math.floor(
    wallet.balance / Number(priceSlide?.price)
  )}
  \n To'lov qilish imkoniyati yaqinda qo'shiladi`;
  const inlineKeyboard = [
    {
      text: "Balansni to'ldirish",
      callbackData: `balance:${user?.id}`,
    },
  ];

  // ctx.reply(text);
  ctx.reply(text, createInlineKeyboard(inlineKeyboard));

  ctx.scene.enter("balans");
});
scene.hears("Do'stlarimni taklif qilish", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const friends = await prisma.invitedUsers.count({
    where: {
      invited_user_id: String(user_id),
      isActive: true,
    },
  });
  const text = `Do'stlaringizni taklif qilish uchun quyidagi havolani ulashing\n
  https://t.me/Magic_slides_bot?start=${user_id}
  \n
  Har bir taklif qilingan do'stingiz uchun 1000 so'm bonus oling
  \n
  Siz taklif qilgan do'stingizlar soni: ${friends}
  `;

  ctx.reply(text);
});

scene.hears("AI modelni tanlash", async (ctx: any) => {
  const user_id = ctx.from?.id;

  let user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      model: true,
    },
  });
  if (!user) return ctx.reply("Foydalanuvchi topilmadi");

  if (!user?.model_id) {
    const models = await prisma.gptModel.findFirst({
      where: {
        name: "gpt-3",
      },
    });
    user = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        model_id: models?.id,
      },

      include: {
        model: true,
      },
    });
    // return ctx.reply("Sizda AI modeli mavjud");
  }

  const text = `Sizning tanlangan modelingiz: ${user?.model?.name}\nPastdagi kerakli modellardan tanlab shu model bilan taqdimot tayyorlashingiz mumkin.Narxlari quyidagicha \n GPT-3: 2000 so'm \n GPT-4: 4000 so'm`;
  const inlineKeyboard = [
    {
      text: "GPT-3",
      callbackData: "gpt-3",
    },
    {
      text: "GPT-4",
      callbackData: "gpt-4",
    },
  ];
  ctx.reply(text, createInlineKeyboard(inlineKeyboard));
  // ctx.reply(text);
});

scene.action("gpt-3", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      model: true,
    },
  });
  if (!user) return ctx.reply("Foydalanuvchi topilmadi");

  const model = await prisma.gptModel.findFirst({
    where: {
      name: "gpt-3",
    },
  });

  if (!model) return ctx.reply("Model topilmadi");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      model_id: model.id,
    },
  });
  const text = `Siz tanlagan model: ${model.name}`;
  ctx.reply(text);
  ctx.scene.enter("start");
});

scene.action("gpt-4", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage();
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      model: true,
    },
  });
  if (!user) return ctx.reply("Foydalanuvchi topilmadi");

  const model = await prisma.gptModel.findFirst({
    where: {
      name: "gpt-4",
    },
  });

  if (!model) return ctx.reply("Model topilmadi");

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      model_id: model.id,
    },
  });
  const text = `Siz tanlagan model: ${model.name}`;
  ctx.reply(text);
  ctx.scene.enter("start");
});

export default scene;
