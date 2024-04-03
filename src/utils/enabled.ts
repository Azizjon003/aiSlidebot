import prisma from "../../prisma/prisma";
import xss from "xss";
import { getBalance } from "./isBalance";
enum enabledEnum {
  one = "one",
  two = "two",
  three = "three",
}
const enabled = async (id: string, name: string): Promise<enabledEnum> => {
  name = xss(name);
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: id,
    },
  });

  if (user) {
    if (!user.isActive) {
      return enabledEnum.three;
    }
    if (user.role === "USER") {
      return enabledEnum.one;
    } else if (user.role === "ADMIN") {
      return enabledEnum.two;
    }

    return enabledEnum.one;
  } else {
    const gpt3 = await prisma.gptModel.findFirst({
      where: {
        name: "gpt-3",
      },
    });
    let user = await prisma.user.create({
      data: {
        telegram_id: id,
        name: name,
        username: name,
        model_id: gpt3?.id,
      },
    });

    await getBalance(user.id);

    return enabledEnum.one;
  }
};

export default enabled;
