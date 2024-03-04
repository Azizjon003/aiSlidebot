import { Scenes } from "telegraf";
import enabled from "../utils/enabled";
import prisma from "../../prisma/prisma";
import { keyboards } from "../utils/keyboards";
const scene = new Scenes.BaseScene("balans");

scene.hears("/start", (ctx: any) => {
  ctx.reply("Bosh sahifadasiz");
  ctx.scene.enter("start");
});

export default scene;
