import fs from "fs";
import path from "path";
import { Scenes } from "telegraf";
import prisma from "../../prisma/prisma";
import {
  createPlansDescriptionLanguage,
  createPlansLanguage,
} from "../services/createPlansUseOpenAi";
import {
  createPresentation,
  createSlideEducationTemplate,
  createSlideWithAnimationDarkMode,
} from "../services/createSlide.service";
import { contentToString } from "../utils/functions";
import { chunkArrayInline } from "../utils/keyboards";
const drJson = require("dirty-json");
// import { countArray } from "./control";
import { sleep } from "openai/core";
import { inlineKeyboardNumbers } from "../lib/helper";
import {
  generateFormattedStringFromData,
  handlePythonScriptDocx,
} from "../services/createDocTemplatesWithPython";
import {
  generateSlides,
  handlePythonScript,
} from "../services/createSlideTemplatesWithPython";
export const languages = [
  {
    text: "🇺🇿 O'zbekcha",
    callback_data: "uz",
  },
  {
    text: "🇷🇺 Русский",
    callback_data: "ru",
  },
  {
    text: "🇺🇸 English",
    callback_data: "eng",
  },
  {
    text: "🇫🇷 French",
    callback_data: "fr",
  },

  {
    text: "🇩🇪 Deutsch",
    callback_data: "de",
  },
];
const scene = new Scenes.BaseScene("slidesCount");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(/\d+$/, async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;
    let user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        model: true,
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi mavjud emas");
    if (!user?.model_id) {
      const model = await prisma.gptModel.findFirst({
        where: {
          name: "gpt-3",
        },
      });
      user = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          model_id: model?.id,
        },
        include: {
          model: true,
        },
      });
    }
    const count = ctx.callbackQuery.data;
    const messageId = ctx.callbackQuery.message?.message_id;
    ctx.deleteMessage(messageId);
    ctx.answerCbQuery();

    await ctx.reply("Siz tanlagan taqdimotlar soni: " + count);

    const chat = await prisma.chat.create({
      data: {
        pageCount: Number(count),
        user_id: user?.id,
        model_id: user?.model_id,
      },
    });
    const text = `Kerakli tilni tanlang`;
    const keyboard = chunkArrayInline(languages, 2);

    // const text = `Taqdimot muvzusini kiriting:

    // 1. Har bir mavzuga 20 yillik o'qituvchi kabi qarayman.
    // 2. Qisqartma so'zlarga, imloviy xatoli so'zlarga tushunmay qolishim mumkin.
    // 3. Inglizchaga tarjima qilganda ma'nosi chalkashishi mumkin bo'lgan mavzularni kiritmang.

    //  ❗️ Iltimos, mavzu yozishda e'tiborli bo'ling.`;
    ctx.session.user = {
      action: "slidesName",
      chat_id: chat.id,
    };

    await ctx.reply(text, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });

    return await ctx.scene.enter("addLanguage");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.on("message", async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;
    const action = ctx.session.user?.action;
    const message = ctx.message.text;
    if (action !== "slidesName") {
      if (message === "Balans") {
        return await ctx.scene.enter("control");
      } else {
        return await ctx.scene.enter("start");
      }
    }

    // const getBalans = await getBalance(String(users?.id));
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        wallet: true,
        model: true,
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

    if (
      Number(user?.model?.name === "gpt-3" ? slidePrice?.price : 2000) >
      Number(user?.wallet?.balance)
    ) {
      ctx.reply(
        `Sizda yetarli mablag' mavjud emas. Balansingiz: ${user?.wallet?.balance} so'm\n Bir dona to'liq taqdimot narxi 2000 so'm yoki 4000 so'm.Taqdimot 18 tagacha sahifagadan iborat bo'lishi mumkin`
      );
      return await ctx.scene.enter("start");
    }

    let txt = `🏙 Taqdimot haqida:

  ➡️ Muallif: ${user?.name}
  🖊 Til: ${chat.language}
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
          [
            {
              text: "Muallifni o'zgartirish",
              callback_data: "changeAuthor",
            },
          ],
          [
            {
              text: "Tekshirgan ustozni o'zgartirish",
              callback_data: "changeChecked",
            },
          ],
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
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.action("changeSlides", async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;

    const countArray = await inlineKeyboardNumbers(5, 12, user_id);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi topilmadi");
    ctx.answerCbQuery();

    const result = await chunkArrayInline(countArray, 3);
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

    return await ctx.scene.enter("editSlidesCount");
  } catch (error) {
    console.log(error, "Xatolik");
  }
});

scene.action("changeChecked", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Tekshiradigan ustozning ism familyasini kiriting: ");
  ctx.session.user = {
    action: "changeChecked",
    chat_id: ctx.session.user?.chat_id,
  };
  return await ctx.scene.enter("changeChecked");
});
scene.action("changeAuthor", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Muallifni kiriting");
  ctx.session.user = {
    action: "changeAuthor",
    chat_id: ctx.session.user?.chat_id,
  };
  return await ctx.scene.enter("changeAuthor");
});

scene.action("confirm", async (ctx: any) => {
  try {
    // ctx.answerCbQuery();

    const message = ctx.callbackQuery.message;
    await ctx.editMessageReplyMarkup({
      inline_keyboard: [],
    });

    await ctx.reply("Taqdimot tasdiqlandi. Endi taqdimot matnini yuboraman");

    const user_id = ctx.from?.id;
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
      include: {
        wallet: true,
        model: true,
      },
    });

    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        working: true,
      },
    });
    await ctx.telegram.sendChatAction(user?.telegram_id, "typing");

    const chat = await prisma.chat.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    if (!chat) return ctx.reply("Mavzu topilmadi topilmadi");

    createPresentationAsync(chat, user, ctx).catch((error) => {
      console.log(error);
    });
  } catch (error) {
    console.log(error, "Xatolik");
  }
});
scene.action("reject", async (ctx: any) => {
  ctx.answerCbQuery();
  ctx.deleteMessage(ctx.callbackQuery.message?.message_id);
  ctx.reply("Taqdimot bekor qilindi");
  return await ctx.scene.enter("start");
});

export default scene;

const createPresentationAsync = async (chat: any, user: any, ctx: any) => {
  try {
    const plans = await createPlansLanguage(
      String(chat.name),
      chat.pageCount,
      chat.lang,
      chat.language,
      chat?.pageCount || 5,
      user?.model?.name
    );

    console.log(plans);
    for (let plan of plans) {
      // await ctx.telegram.sendChatAction(user.telegram_id, "typing");
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

      let description: any;
      try {
        await ctx.telegram.sendChatAction(user.telegram_id, "typing");
        description = await createPlansDescriptionLanguage(
          p.name,
          chat.lang,
          chat.language,
          user?.model?.name
        );
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
      await ctx.telegram.sendChatAction(user.telegram_id, "typing");
      txt += contentToString(description.content, chat.lang); // contentToString(description.content, chat.lang);
      // txt += `\n\n ${description.content}`;
      await ctx.telegram.sendMessage(user.telegram_id, txt, {
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

    const filePath = path.join(
      __dirname,
      `../../${user?.telegram_id}output.pptx`
    );
    const data = {
      title,
      body,
      path: filePath,
      changeAuthor: chat?.checkUser,
    };

    console.log(data);

    const slide = await createPresentation(data, chat.lang);

    let newDate = new Date().getTime();
    const datas = fs.readFileSync(filePath);
    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: datas,
        filename: `${newDate}.pptx`,
      },
      {
        caption: `📌 Birinchi dizayndagi taqdimot`,
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
          decrement: Number(
            user?.model?.name === "gpt-3" ? slidePrice?.price : 2000
          ),
        },
      },
    });
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        working: false,
      },
    });

    const filePaths = path.join(
      __dirname,
      `../../${user?.telegram_id}output.pptx`
    );
    const darkModeData = {
      title,
      body,
      paths: filePaths,
      changeAuthor: chat?.checkUser,
    };

    const slideDark = await createSlideWithAnimationDarkMode(
      darkModeData,
      chat.lang
    );

    const dataDark = fs.readFileSync(filePaths);

    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: dataDark,
        filename: `${newDate}-dark.pptx`,
      },
      {
        caption: `📌 Ikkinchi dizayndagi taqdimot`,
        parse_mode: "HTML",
      }
    );
    const filePathNew = path.join(
      __dirname,
      `../../${user?.telegram_id}output-education.pptx`
    );
    const educationSlideData = {
      title,
      body,
      paths: filePathNew,
      changeAuthor: chat?.checkUser,
    };

    const slideEducation = await createSlideEducationTemplate(
      educationSlideData
    );
    await sleep(500);

    const dataDarkEducation = fs.readFileSync(filePathNew);

    await ctx.telegram.sendDocument(
      user?.telegram_id,
      {
        source: dataDarkEducation,
        filename: `${newDate}-education.pptx`,
      },
      {
        caption: `📌 3- dizayndagi taqdimot`,
        parse_mode: "HTML",
      }
    );

    const chatData = await prisma.chat.findFirst({
      where: {
        id: chat.id,
      },
      include: {
        plans: {
          include: {
            description: true,
          },
        },
      },
    });

    let templates = [
      "Explore",
      "Academic",
      "Organic",
      // "Luminous",
      "Floral",
      // "Snowflake",
    ];

    await ctx.telegram.sendMessage(
      user?.telegram_id,
      `Yana bir nechta shablonlarimiz bor kutib turing iltimos 🥹`
    );

    // await ctx.telegram.sendMessage(
    //   user?.telegram_id,
    //   "Keyingi 5 ta taqdimot turlarini yaratishda xatolikka duch keldik.Yaqin kunlarda tuzatamiz.Bizni to'g'ri tushunganingiz uchun raxmat"
    // );

    let pyPath = path.join(__dirname, `../../output2${user.telegram_id}.pptx`);
    for (let template of templates) {
      const stringDatas = generateSlides(
        {
          ...chatData,
          author: user.name,
        },
        template,
        user.telegram_id
      );

      const handlePy = await handlePythonScript(stringDatas);

      // const pyPath = path.join(
      //   __dirname,
      //   `../../output2${user.telegram_id}.pptx`
      // );

      const dataExplore = fs.readFileSync(pyPath);
      await ctx.telegram.sendDocument(
        user?.telegram_id,
        {
          source: dataExplore,
          filename: `${newDate}-${template}.pptx`,
        },
        {
          caption: `📌 Taqdimotingiz tayyor`,
          parse_mode: "HTML",
        }
      );

      await sleep(1000);
    }

    await fs.unlinkSync(pyPath);
    await ctx.telegram.sendMessage(
      user.telegram_id,
      "Word fayl ham yuboraman 📄.\nOzgina kutib turasangiz word fayl tayyor"
    );

    const stringDocx = generateFormattedStringFromData(
      chatData,
      user.telegram_id
    );
    const wordPath = path.join(
      __dirname,
      `../../output2${user.telegram_id}.docx`
    );

    const handlePy = await handlePythonScriptDocx(stringDocx);

    const wordData = fs.readFileSync(wordPath);

    await ctx.telegram.sendDocument(
      user.telegram_id,
      {
        source: wordData,
        filename: `${newDate}.docx`,
      },
      {
        caption: `📌 Taqdimotingizning word shakli tayyor`,
        parse_mode: "HTML",
      }
    );

    await fs.unlinkSync(wordPath);

    await ctx.telegram.sendMessage(
      user?.telegram_id,
      "Bosh menyuga o'tish uchun pastdagi tugmani bosing",
      {
        reply_markup: {
          keyboards: [["Bosh menyu"]],
        },
        resize_keyboard: true,
      }
    );
    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error);
    const user_id = ctx.from?.id;
    ctx.telegram.sendMessage(
      user_id,
      "Xatolik yuz berdi. Iltimos qayta urinib ko'ring /start buyrug'i bilan urunib ko'ring"
    );
  }
};
