export let subcribeFunk = async (ctx: any, next: any) => {
  // if (config.ADMINS.some((admin) => admin == ctx.from.id)) {
  //   return next();
  // }
  if (ctx.callbackQuery?.data === "checkSubscribing") {
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
    } catch (err) {}
  }
  if (!channels.length) {
    return next();
  }
  const text =
    "❗️ Botdan to'liq foydalanish imkoniga quyidagi kanallarga a'zo bo'lish orqali erishishingiz mumkin!";
  const keyboard = channels.map((channel) => [
    {
      text: `A'zo bo'lish: ${channel.name}`,
      url: `https://t.me/${channel.link}`,
    },
  ]);
  return ctx.reply(text, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};
