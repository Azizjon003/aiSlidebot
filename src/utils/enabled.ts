import prisma from "../../prisma/prisma";
enum enabledEnum {
  one = "one",
  two = "two",
  three = "three",
  four = "four",
}
const enabled = async (id: string, name: string): Promise<enabledEnum> => {
  const user = await prisma.user.findFirst({
    where: {
      telegram_id: id,
    },
  });

  // console.log(user, "user");
  if (user) {
    const branch = user?.branchId;
    if (user.role == "ADMIN") return enabledEnum.four;
    if (branch) return enabledEnum.one;
    else return enabledEnum.two;
  } else {
    await prisma.user.create({
      data: {
        telegram_id: id,
        name: name,
        username: name,
      },
    });

    return enabledEnum.three;
  }
};

export default enabled;
