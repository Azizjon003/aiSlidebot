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

  if (user?.walletRequest[0]?.status === "APPROVED") {
    endNumber = 18;
  } else if (user?.wallet?.balance === 2000) {
    endNumber = 6;
  } else if (Number(user?.wallet?.balance) > 2000) {
    endNumber = 12;
  }
  for (let i = startNumber; i <= endNumber; i++) {
    array.push({
      text: ` ${i} `,
      callback_data: i,
    });
  }
  return array;
};
