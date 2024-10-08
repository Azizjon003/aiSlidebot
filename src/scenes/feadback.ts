import { Scenes } from "telegraf";
import xss from "xss";
import prisma from "../../prisma/prisma";
const scene = new Scenes.BaseScene("feedback");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  try {
    const user_id = String(ctx.from.id);
    const user = await prisma.user.findFirst({
      where: {
        telegram_id: user_id,
      },
    });

    if (!user) {
      ctx.reply("You are not registered. Please /start the bot first.");
      return;
    }
    const txt = ctx.message.text;
    await ctx.telegram.sendMessage(
      -4594205360,
      xss(`foydalanuvchi: ${user.name} \n userId: ${user_id} \n fikr: ${txt}`)
    );

    await ctx.reply("Rahmat fikringiz uchun 🙏 )");

    return await ctx.scene.enter("start");
  } catch (error) {
    console.log(error, "xatolik");
  }
});
export default scene;
