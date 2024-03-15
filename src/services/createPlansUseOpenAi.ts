import OpenAI from "openai";
import { plansInsert, rejalarniAjratibOlish } from "../utils/textToPlans";
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
        // content: `I am preparing a presentation and need an outline with ${pages} sections in both Uzbek and English. Could you provide an outline that starts with an introduction, covers various aspects of the topic, and concludes effectively? Each section should be numbered and listed in both languages. The presentation topic is ${name}`,
        // content: `I'm creating a presentation about ${name}. Please create a comprehensive outline that includes an introduction, background, and conclusion. Each point should be numbered and titled in Uzbek, with a corresponding English translation below.${pages} section. The structure should follow the following format:

        // 1. [Uzbek Title]
        //    1.1. [English title translation]

        // 2. [Uzbek title]
        //    2.1. [English title translation]

        // ...

        // 15. [Uzbek title]
        //    15.1. [English title translation]`,
        content: `I'm creating a presentation about ${name}. Please create a comprehensive outline that includes an introduction, background, and conclusion, structured in a scientific manner. The outline should consist of up to ${pages} sections, with each point numbered and titled in Uzbek, followed by a corresponding English translation. Ensure the structure adheres to the following format:

         1. [Uzbek Title]
            1.1. [English title translation]

         2. [Uzbek title]
            2.1. [English title translation]

         ...

         15. [Uzbek title]
            15.1. [English title translation]`,
      },
    ],
    model: "gpt-3.5-turbo-1106",
    max_tokens: 4096,
  });
  console.log(chatCompletion.choices[0].message.content);
  let text = chatCompletion.choices[0].message.content;

  let reja = plansInsert(String(text));
  let plans = reja.map((plan) => {
    return `${plan.uzTitle} && ${plan.enTitle}`;
  });
  return plans;
}

// createPlans("Qon tomir kasalliklari", 10);

export async function createPlansDescription(description: string, datas: any) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: description },
      ...datas,
      {
        role: "system",
        content: `Please provide content for a PowerPoint slide on the topic "${description}", written in a concise and scientific manner in native Uzbek language, tailored for educational purposes. Ensure the content adheres to this structure:

        - Key Facts: [2-3 important, scientifically-backed facts about the topic]
        - Conclusion: [A brief conclusion summarizing the topic's impact or significance]
        
        This content must be prepared to enhance the presentation's clarity and educational value, aiming to provide clear, useful, and scientifically validated information on the subject to the audience in Uzbek.
        `,
        // content:
        //   "Give the information provided by the role of the teacher on the given topic. Do not let it be known that this information was given by the teacher. Write down the information you wrote down. The information should be in Uzbek. Who wrote the information not be known at all",
        // content:
        // "Write down the information provided by a 20-year-old teacher on the given topic and give more information. Do not use unnecessary texts in this information. Do not mix unnecessary texts at all. Be in Uzbek. Texts",
        // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
      },
      {
        role: "user",
        content: "",
      },
    ],

    model: "gpt-4-1106-preview",
    max_tokens: 4096,
  });

  return chatCompletion.choices[0].message.content;
}
