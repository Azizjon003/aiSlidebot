import prisma from "../../prisma/prisma";

export let subcribeFunk = async (ctx: any, next: any) => {
  try {
    const data = String(ctx?.callbackQuery?.data);
    const action = ctx.message?.text?.split(" ")[0];

    const id = String(ctx.from.id);
    let invitedUser: any;

    if (action === "/start") {
      invitedUser = ctx.message?.text?.split(" ")[1];
      if (invitedUser?.length > 24) {
        invitedUser = null;
      }
      if (invitedUser) {
        const invitedUsers = await prisma.invitedUsers.findFirst({
          where: {
            user_id: id,
          },
        });

        if (!invitedUsers) {
          const user = await prisma.user.findFirst({
            where: {
              telegram_id: id,
            },
          });
          const invitedUsersId = await prisma.user.findFirst({
            where: {
              telegram_id: String(invitedUser),
            },
          });

          if (!user && invitedUsersId) {
            await prisma.invitedUsers.create({
              data: {
                user_id: id,
                invited_user_id: String(invitedUser),
              },
            });

            console.log("invitedUsersId", invitedUsersId);
          }
        }
      }
    }
    const chatType = ctx.chat?.type;
    console.log(chatType);
    if (
      chatType === "channel" ||
      chatType === "supergroup" ||
      chatType === "group"
    ) {
      return next();
    }
    if (data?.includes("checkSubscribing")) {
      invitedUser = data.split("_")[1];

      await ctx.deleteMessage();
    }
    let channels = [
      {
        name: "Magic Slide",
        link: "magi_slides",
      },
    ];
    let allowedStatuses = ["creator", "administrator", "member"];
    for (let channel of channels) {
      let username = `@${channel.link}`;
      try {
        const { status } = await ctx.telegram.getChatMember(
          username,
          ctx.from.id
        );
        if (allowedStatuses.includes(status)) {
          channels = channels.filter((c) => c !== channel);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (!channels.length) {
      if (data.includes("checkSubscribing")) {
        ctx.reply(
          `Tabriklaymiz! Siz botdan to'liq foydalanishingiz mumkin! 🎉\n/start buyrug'ini bosing`
        );
      }

      return next();
    }
    const text =
      "❗️ Botdan to'liq foydalanish imkoniga quyidagi kanallarga a'zo bo'lish orqali erishishingiz mumkin!";
    let keyboard: any = channels.map((channel) => [
      {
        text: `A'zo bo'lish: ${channel.name}`,
        url: `https://t.me/${channel.link}`,
      },
    ]);

    console.log(invitedUser);
    keyboard.push([
      {
        text: "Qo'shildim 🤝",
        callback_data: invitedUser
          ? `checkSubscribing_${invitedUser}`
          : `checkSubscribing`,
      },
    ]);

    console.log(keyboard);
    return ctx.reply(text, {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    console.log(error);
  }
};
