// Node.js muhitida ishlatayotganda node-fetchni o'rnatish kerak bo'lishi mumkin
// npm install node-fetch
// const fetch = require('node-fetch');
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
console.log(key);
export let createPlans = async (name: string, pages: number) => {
  const queryJson = {
    input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{uz}}, {{eng}} in Uzbek and English. The end result should look like this. List of discussion questions. Return as JSON.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          {
            uzTitle: "{{uzTitle}}",
            enTitle: "{{enTitle}}",
          },
        ],
      },
    },
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`, // API kalitini qo'ying
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      max_tokens: 1024,
      response_format: {
        type: "json_object",
      },
    }),
  });

  const data = await response.json();

  const content = data.choices[0].message.content || "";
  let plans = JSON.parse(content).slides.plans;
  let plansText = plans.map((plan: any) =>
    `${plan.uzTitle} && ${plan.enTitle}`.replace(/\d+/g, "")
  );

  console.log(plansText);

  return plansText;
};
