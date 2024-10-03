import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("independentWork");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
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
    const text = xss(ctx.message.text);

    const chat = await prisma.chat.create({
      data: {
        pageCount: 15,
        user_id: user?.id,
        model_id: user?.model_id,
        name: text?.trim(),
      },
    });
    console.log(ctx.message.text, "independentWork");

    // ctx.reply("Sizning mavzuyingiz qabul qilindi:");
    ctx.reply("Universitetingizni kiriting (masalan: TATU)");
    return await ctx.scene.enter("addUniversity");
  } catch (error) {
    console.log(error, "xatolik");
  }
});

export default scene;
