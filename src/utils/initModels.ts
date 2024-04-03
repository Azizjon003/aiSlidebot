import prisma from "../../prisma/prisma";

const initModels = async () => {
  await prisma.gptModel.create({
    data: {
      name: "gpt-3",
    },
  });

  await prisma.gptModel.create({
    data: {
      name: "gpt-4",
    },
  });

  console.log("Models are initialized");
};

initModels();
