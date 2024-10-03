const botStart = (bot: any) => {
  bot
    .launch()
    .then(() => {
      console.log("Aziz");
    })
    .catch((error: any) => {
      console.log("Error", error);
    });
  console.log(`Bot Azizjon has been started...`);
};

export default botStart;
