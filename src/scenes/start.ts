import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("start");

export let keyboard = [
  "Bugungi buyurtmalar",
  "Filiallar",
  "Foydalanuvchilar",
  "Mahsulotlar",
  "Filliallarga odam qo'shish",
];
export let keyboard2 = ["Fikr bildirish", "Admin bilan aloqa"];
scene.enter(async (ctx: any) => {
  const user_id = ctx.from?.id;
  const text =
    ctx.update.message?.text?.trim().split(" ")[1] ||
    "65d7306cb4583406a13c2b7d";

  const user_name = ctx.from?.first_name || ctx.from?.username;
  console.log("ctx", text);
  const enable = await enabled(String(user_id), String(user_name));

  // console.log(enable, "enable");
  if (enable === "one") {
    // if (!branchAdded) {
    let branches = await prisma.branch.findMany({
      where: {
        users: {
          some: {
            telegram_id: String(user_id),
          },
        },
      },
    });
    let length = branches.length;
    let branch = [["Bugungi buyurtmalar"], ["Fillialni almashtirish"]];
    for (let i = 0; i < length; i++) {
      branch.push([branches[i].name]);
    }
    branch.reverse();

    await ctx.reply("Добро пожаловать в бот", {
      ...keyboards(branch),
      remove_keyboard: true,
    });
    // }

    console.log("Добро пожаловать в бот");
    return ctx.scene.enter("branches");
  } else if (enable === "two") {
    ctx.session.user = {
      branch_id: text,
    };
    ctx.reply("Добро пожаловать в бот", {
      ...keyboards(keyboard2),
      remove_keyboard: true,
    });
    ctx.scene.enter("publicUsers");
  } else if (enable === "three") {
    ctx.session.user = {
      branch_id: text,
    };
    ctx.reply("Добро пожаловать в бот", {
      ...keyboards(keyboard2),
      remove_keyboard: true,
    });
    return ctx.scene.enter("publicUsers");
  } else if (enable === "four") {
    ctx.reply("Welcome to the bot admin!", {
      ...keyboards(keyboard),
      remove_keyboard: true,
    });
    return ctx.scene.enter("admin");
  }
});

export default scene;
