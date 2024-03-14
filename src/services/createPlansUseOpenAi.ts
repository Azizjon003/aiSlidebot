import OpenAI from "openai";
import { rejalarniAjratibOlish } from "../utils/textToPlans";
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
console.log(key);
const openai = new OpenAI({
  apiKey: String(key), // This is the default and can be omitted
});
export async function createPlans(name: string, pages: number) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        // content: `Make a plan for power point as much as the professor can make on the given topic. Make a plan for ${pages} for me. Make sure the plans are clear and consist of one sentence. use is prohibited. Plans should be in Uzbek`,
        // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
        content:
          "Generate a list of creative PowerPoint presentation topics that are suitable for a business audience on the theme of 'Technology Innovations'. The topics should be engaging, informative, and encourage audience participation. Aim for a mix of current trends in technology, the impact of innovations on business, and innovative perspectives on future developments. Provide a brief description for each topic to outline the angle of presentation and the key points that will be covered",
      },
    ],
    model: "gpt-3.5-turbo-1106",
    max_tokens: 4096,
  });

  let text = chatCompletion.choices[0].message.content;

  const reja = rejalarniAjratibOlish(String(text));
  return reja;
}

export async function createPlansDescription(description: string) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: description },
      {
        role: "system",
        content:
          "Give the information provided by the role of the teacher on the given topic. Do not let it be known that this information was given by the teacher. Write down the information you wrote down. The information should be in Uzbek. Who wrote the information not be known at all",
        // content:
        // "Write down the information provided by a 20-year-old teacher on the given topic and give more information. Do not use unnecessary texts in this information. Do not mix unnecessary texts at all. Be in Uzbek. Texts",
        // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
      },
    ],
    model: "gpt-3.5-turbo-0125",
    max_tokens: 4096,
  });

  return chatCompletion.choices[0].message.content;
}
