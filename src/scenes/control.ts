import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
import { getBalance } from "../utils/isBalance";
const scene = new Scenes.BaseScene("control");

scene.hears("/start", (ctx: any) => {
  ctx.reply("Bosh sahifadasiz");
  ctx.scene.enter("start");
});

scene.hears("Balans", async (ctx) => {
  const user_id = ctx.from.id;
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
  });

  if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

  const wallet = getBalance(user.id);
});
export default scene;
