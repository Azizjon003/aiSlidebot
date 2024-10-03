import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("addUniversity");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;

    const user = await prisma.user.findFirst({
      where: {
        telegram_id: String(user_id),
      },
    });

    if (!user) return ctx.reply("Foydalanuvchi topilmadi");

    const chat = await prisma.chat.findFirst({
      where: {
        user_id: user?.id,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!chat) return ctx.reply("Chat topilmadi");

    const text = xss(ctx.message.text);

    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        scool: text,
      },
    });

    console.log(ctx.message.text, "addUniversity");

    ctx.reply("Universitet qo'shildi.Ism Familyangizni kiriting:");
    ctx.scene.enter("addAuthor");
  } catch (error) {
    console.log(error, "xatolik");
  }
});

export default scene;
