import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import fs from "fs";
import {
  chunkArrayInline,
  createInlineKeyboard,
  keyboards,
} from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
import {
  createPlans,
  createPlansDescription,
} from "../services/createPlansUseOpenAi";
import path from "path";
import { createPresentation } from "../services/createSlide.service";
import { contentToString } from "../utils/functions";
import { countArray } from "./control";
const scene = new Scenes.BaseScene("slidesCount");

scene.hears("/start", (ctx: any) => {
  ctx.scene.enter("start");
});

scene.action(/\d+$/, async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi mavjud emas");
  const count = ctx.callbackQuery.data;
  const messageId = ctx.callbackQuery.message?.message_id;
  ctx.deleteMessage(messageId);
  ctx.answerCbQuery();

  await ctx.reply("Siz tanlagan taqdimotlar soni: " + count);

  const chat = await prisma.chat.create({
    data: {
      pageCount: Number(count),
      user_id: user?.id,
    },
  });

  const text = `Taqdimot muvzusini kiriting: 

  1. Har bir mavzuga 20 yillik o'qituvchi kabi qarayman.  
  2. Qisqartma so'zlarga, imloviy xatoli so'zlarga tushunmay qolishim mumkin.
  3. Inglizchaga tarjima qilganda ma'nosi chalkashishi mumkin bo'lgan mavzularni kiritmang. 
  
   ❗️ Iltimos, mavzu yozishda e'tiborli bo'ling.`;
  ctx.session.user = {
    action: "slidesName",
    chat_id: chat.id,
  };

  ctx.reply(text);
});

scene.on("message", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const action = ctx.session.user?.action;
  if (action !== "slidesName") return ctx.scene.enter("start");
  const users = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });
  const getBalans = await getBalance(String(users?.id));
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      wallet: true,
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi mavjud emas");

  let chat = await prisma.chat.findFirst({
    where: {
      user_id: user?.id,
      // id: ctx.session.user?.chat_id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!chat) return ctx.reply("Chat topilmadi");

  const text = ctx.message.text;
  if (!text) return ctx.reply("Xatolik");

  chat = await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      name: text,
    },
  });

  const slidePrice = await prisma.plansSlides.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });

  if (Number(slidePrice?.price) > Number(user?.wallet?.balance)) {
    ctx.reply(
      `Sizda yetarli mablag' mavjud emas. Balansingiz: ${user?.wallet?.balance} so'm`
    );
    return ctx.scene.enter("start");
  }

  let txt = `🏙 Taqdimot haqida:

  ➡️ Muallif: ${user?.name}
  🖊 Til: 🇺🇿 (O'zbekcha)
  🧮 Slaydlar: <i>${chat.pageCount}</i> ta
  
  📌 Mavzu: <b>${chat?.name}</b>
  
  Eslatma: Avval, taqdimot ning matnlarini yuboraman.So'ngra taqdimotni tayyorlayman.\n Iltimos shoshilmang men sekinroq javob berishim mumkin`;

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
        // [
        //   {
        //     text: "Mavzuni o'zgartirish",
        //     callback_data: "change",
        //   },
        // ],
        [
          {
            text: "Slaydlar sonini o'zgartirish",
            callback_data: "changeSlides",
          },
        ],
        // [
        //   {
        //     text: "Muallifni o'zgartirish",
        //     callback_data: "changeAuthor",
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

  // await prisma.wallet.update({
  //   where: {
  //     id: user?.wallet?.id,
  //   },
  //   data: {
  //     balance: {
  //       decrement: Number(slidePrice?.price),
  //     },
  //   },
  // });
});

scene.action("changeSlides", async (ctx: any) => {
  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Foydalanuvchi topilmadi");
  ctx.answerCbQuery();

  const result = chunkArrayInline(countArray, 3);
  const text = `🧮 Slaydlar sonini qaytadan tanlang`;
  ctx.editMessageText(text, {
    reply_markup: {
      inline_keyboard: result,
    },
  });

  const chat = await prisma.chat.findFirst({
    where: {
      // id: chatId,
      user_id: user?.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  ctx.session.user = {
    action: "slidesCount",
    chat_id: ctx.session.user?.chat_id,
  };

  ctx.scene.enter("editSlidesCount");
});

scene.action("confirm", async (ctx: any) => {
  // ctx.answerCbQuery();
  const message = ctx.callbackQuery.message;
  ctx.editMessageReplyMarkup({
    inline_keyboard: [],
  });

  ctx.reply("Taqdimot tasdiqlandi. Endi taqdimot matnini yuboraman");

  const user_id = ctx.from?.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      wallet: true,
    },
  });

  const chat = await prisma.chat.findFirst({
    where: {
      user_id: user?.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  if (!chat) return ctx.reply("Mavzu topilmadi topilmadi");

  createPresentationAsync(chat, user, ctx);
});
scene.action("reject", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Taqdimot bekor qilindi");
  ctx.scene.enter("start");
});

export default scene;

const createPresentationAsync = async (chat: any, user: any, ctx: any) => {
  await ctx.telegram.sendChatAction(user.telegram_id, "typing");
  const plans = await createPlans(String(chat.name), chat.pageCount);
  console.log(plans);
  for (let plan of plans) {
    await prisma.plan.create({
      data: {
        chat_id: chat.id,
        name: plan,
      },
    });
  }

  let plan = await prisma.plan.findMany({
    where: {
      chat_id: chat.id,
    },
  });
  for (let [index, p] of plan.entries()) {
    let txt = `📌${index + 1}. ${p.name.split("&&")[0]}\n`;
    const plan = await prisma.plan.findMany({
      where: {
        chat_id: chat.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let description: any;
    try {
      description = await createPlansDescription(p.name);
    } catch (error) {
      console.log(error);
    }
    await prisma.description.create({
      data: {
        plan_id: p.id,
        name: p.name,
        content: description.content,
        chat_id: chat.id,
      },
    });

    console.log(description.content);

    txt += contentToString(description.content);
    // txt += `\n\n ${description.content}`;
    await ctx.reply(txt, {
      parse_mode: "HTML",
    });
    await ctx.telegram.sendChatAction(user.telegram_id, "typing");
  }

  await ctx.reply("Sizning taqdimotlaringiz tayyor. Endi faylni yuboraman");

  const description = await prisma.description.findMany({
    where: {
      chat_id: chat.id,
    },
    include: {
      plan: true,
    },
  });

  let body = description;

  const title = {
    name: chat.name,
    author: user?.name,
  };

  const filePath = path.join(__dirname, "../../output.pptx");
  const data = {
    title,
    body,
    path: filePath,
  };

  const slide = await createPresentation(data);

  const datas = fs.readFileSync(filePath);
  await ctx.telegram.sendDocument(
    user?.telegram_id,
    {
      source: datas,
      filename: `${chat.name}.pptx`,
    },
    {
      caption: `📌 ${chat.name} taqdimoti tayyor`,
      parse_mode: "HTML",
    }
  );

  const slidePrice = await prisma.plansSlides.findFirst({
    orderBy: {
      created_at: "desc",
    },
  });
  await prisma.wallet.update({
    where: {
      id: user?.wallet?.id,
    },
    data: {
      balance: {
        decrement: Number(slidePrice?.price),
      },
    },
  });

  return ctx.scene.enter("start");
};
