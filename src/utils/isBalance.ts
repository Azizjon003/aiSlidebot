import { PrismaClientRustPanicError } from "@prisma/client/runtime/library";
import prisma from "../../prisma/prisma";

export const getBalance = async (id: string, price: number = 4000) => {
  let wallet = await prisma.wallet.findFirst({
    where: {
      user_id: id,
    },
  });

  if (!wallet) {
    wallet = await prisma.wallet.create({
      data: {
        user_id: id,
        balance: price,
      },
    });
  }
  return wallet;
};
