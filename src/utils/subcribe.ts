export let subcribeFunk = async (ctx: any, next: any) => {
  const data = ctx.callbackQuery?.data;
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
    } catch (err) {
      console.log(err);
    }
  }
  if (!channels.length) {
    if (data === "checkSubscribing") {
      ctx.reply(
        "Tabriklaymiz! Siz botdan to'liq foydalanishingiz mumkin! 🎉\n /start buyrug'ini bosing"
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
      callback_data: "checkSubscribing", // Added callback_data property
    },
  ]);

  keyboard.push([
    {
      text: "Qo'shildim 🤝",
      callback_data: "checkSubscribing",
    },
  ]);

  return ctx.reply(text, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
};
