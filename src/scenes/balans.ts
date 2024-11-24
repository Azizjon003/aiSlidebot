import { Markup, Scenes } from "telegraf";
import prisma from "../../prisma/prisma";

const scene = new Scenes.BaseScene("balans");

scene.hears("/start", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.action(
  /^balance:([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/,
  async (ctx: any) => {
    try {
      const user_id = ctx.from.id;
      const user = await prisma.user.findFirst({
        where: { telegram_id: String(user_id) },
      });

      ctx.answerCbQuery();
      if (!user) return ctx.reply("Bu foydalanuchi mavjud emas");

      const wallet = await prisma.wallet.findFirst({
        where: { user_id: user.id },
      });

      if (!wallet) {
        return ctx.reply("Bu foydalanuchi mavjud emas");
      }
      await ctx.deleteMessage();

      let txt = `Karta orqali to'lov qilmoqchi bo'lsangiz \n
    <b>Karta raqam</b>: <code>8600 3129 7257 8377</code>
    <b>Kimni nomida</b>: Aliqulov Azizjon

     <b>Karta raqam</b>: <code>9860 6067 4202 8008</code>
    <b>Kimni nomida</b>: Aliqulov Azizjon

    <b>Karta raqam</b>: <code>5614 6868 0954 7279</code>
    <b>Kimni nomida</b>: Aliqulov Azizjon   

    karta raqamlariga to'lov qilib chekni adminga yuboring
    Adminlarning kontaktlari: @magic_slide_admin @aliqulov_azizjon
    
    Bitta taqdimot narxi 2000 so'm yoki 4000 so'm.Bunda siz 18 sahifali taqdimot yoki mustaqil ish tayyorlay olishingiz mumkin bo'ladi


    Iltimos to'lovni amalga oshirgan bo'lsangiz adminga murojaat qiling va to'lovni tasdiqlating.\nTo'lov qilishda muammo bo'lsa adminlarimizga bog'lanishingiz mumkin
    `;
      const text = `Balansingiz: ${wallet.balance}.\nBalansni to'ldirish uchun summani kiriting:\nMinimal summa 4000 so'm mumkin`;

      await ctx.reply(txt, {
        parse_mode: "HTML",
      });

      const inlineKeyboard = Markup.inlineKeyboard([
        [
          Markup.button.callback("2000 so'm", "pay_2000"),
          Markup.button.callback("5000 so'm", "pay_5000"),
          Markup.button.callback("10000 so'm", "pay_10000"),
        ],
        [
          Markup.button.callback("Boshqa miqdor", "pay_other"),
          Markup.button.callback("Asosiy menyu", "main_menu"),
        ],
      ]);

      await ctx.reply(text, inlineKeyboard);
      return await ctx.scene.enter("createWalletRequest");
    } catch (error) {
      console.log(error, "xatolik");
    }
  }
);

scene.action("free", async (ctx: any) => {
  try {
    const user_id = ctx.from?.id;
    const friends = await prisma.invitedUsers.count({
      where: {
        invited_user_id: String(user_id),
        isActive: true,
      },
    });
    // const text = `Do'stlaringizni taklif qilish uchun quyidagi havolani ulashing\n
    // https://t.me/Magic_slides_bot?start=${user_id}
    // \n
    // Har bir taklif qilingan do'stingiz uchun 1000 so'm bonus oling
    // \n
    // Siz taklif qilgan do'stingizlar soni: ${friends}
    // `;

    const text = `1 daqiqada hech qanday toʻlovlarsiz slayd yoki mustaqil ish  tayyorlatishni istaysizmi?

  ▪️ Oʻzbekistonda ilk bor 1 daqiqada mutlaqo tekinga slayd yoki mustaqil ish tayyorlab beruvchi bot yaratildi.
  
  ▪️ Hoziroq start bosing, foydalaning, baholaringiz doimo 5 boʻlsin😉
   
  ▪️ Do'stlaringizga ulashishingiz mumkin 2 ta do'stingiz qo'shilsa 1 ta taqdimot yoki mustaqil ish bepul bo'ladi😉
  
  ▫️ Linkni bossangiz kifoya:https://t.me/Magic_slides_bot?start=${user_id}`;
    ctx.reply(text);
  } catch (error) {
    console.log(error, "xatolik");
  }
});

scene.hears("Bosh menyu", async (ctx: any) => {
  return await ctx.scene.enter("start");
});

scene.on("message", async (ctx: any) => {
  ctx.reply(
    "Bu buyruqni tushunmadim 😔. /start buyrug'ini bosib qaytadan boshlang"
  );
});
// Simplified action handler for all pay actions

export default scene;
