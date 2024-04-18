import prisma from "../../prisma/prisma";

export const inlineKeyboardNumbers = async (
  startNumber: number,
  endNumber: number,
  user_id: string
) => {
  const array = [];

  const user = await prisma.user.findFirst({
    where: {
      telegram_id: String(user_id),
    },
    include: {
      wallet: true,
      walletRequest: {
        where: {
          status: "APPROVED",
        },
      },
    },
  });

  console.log("user", user);
  const gptModel3 = await prisma.gptModel.findFirst({
    where: {
      name: "gpt-3",
    },
  });
  if (user?.walletRequest[0]?.status === "APPROVED") {
    let umumiySumma = 0;

    user?.walletRequest.map((item) => {
      umumiySumma += item.amount;
    });

    if (umumiySumma < Number(user?.wallet?.balance)) {
      endNumber = 12;
      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          model_id: gptModel3?.id,
        },
      });
    } else {
      const gptModel = await prisma.gptModel.findFirst({
        where: {
          name: "gpt-4",
        },
      });

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          model_id: gptModel?.id,
        },
      });
      endNumber = 18;
    }
  } else if (Number(user?.wallet?.balance) > 0) {
    endNumber = 12;
    await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        model_id: gptModel3?.id,
      },
    });
  }
  for (let i = startNumber; i <= endNumber; i++) {
    array.push({
      text: ` ${i} `,
      callback_data: i,
    });
  }
  return array;
};
