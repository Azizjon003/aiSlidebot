import { plansInsert, rejalarniAjratibOlish } from "../utils/textToPlans";
import { parseItems, parseTitles } from "../utils/functions";
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
import OpenAI from "openai";
console.log(key);
const openai = new OpenAI({
  apiKey: key,
});

// export let createPlans = async (name: string, pages: number) => {
//   const queryJson = {
//     input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{uz}}, {{eng}} in Uzbek and English. The end result should look like this. List of discussion questions. Return as JSON.`,
//     output_format: "json",
//     json_structure: {
//       slides: {
//         plans: [
//           {
//             uzTitle: "{{uzTitle}}",
//             enTitle: "{{enTitle}}",
//           },
//         ],
//       },
//     },
//   };

//   // try {
//   const response = await axios.post(
//     "https://api.openai.com/v1/chat/completions",
//     {
//       model: "gpt-3.5-turbo-0125",
//       messages: [
//         {
//           role: "user",
//           content: JSON.stringify(queryJson),
//         },
//       ],
//       max_tokens: 1024,
//       response_format: {
//         type: "json_object",
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${key}`,
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   // console.log(response.data.choices[0].message.content);
//   const content = response.data.choices[0].message.content || "";
//   let plans = JSON.parse(content).slides.plans;

//   let plansText = plans.map((plan: any) =>
//     `${plan.uzTitle} && ${plan.enTitle}`.replace(/\d+/g, "")
//   );

//   return plansText;
//   // } catch (error: any) {
//   //   console.error("Error during API call:", error.data);
//   //   // Xato bilan bog'liq qo'shimcha ishlov berish
//   //   throw error; // Yoki xato haqida ma'lumot berish
//   // }
// };

export let createPlans = async (name: string, pages: number) => {
  const queryJson = {
    input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{uz}}, {{eng}} in Uzbek and English. The end result should look like this. List of discussion questions. Return as JSON.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          {
            uz: "{{uz}}",
            eng: "{{eng}}",
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    model: "gpt-4-turbo-preview",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 1024,
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content || ""; // Handle null case
  // const plans = parseTitles(content);
  let plans;
  try {
    plans = JSON.parse(content).slides.plans;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      // model: "gpt-3.5-turbo-16k-0613",
      model: "gpt-4-turbo-preview",
      max_tokens: 1500,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  let plansText = plans.map((plan: any) => {
    return `${plan.uz} && ${plan.eng}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

// createPlans("Qon tomir kasallilari", 10);

// export async function createPlansDescription(description: string, datas: any) {
//   const chatCompletion = await openai.chat.completions.create({
//     messages: [
//       { role: "user", content: description },
//       ...datas,
//       {
//         role: "system",
//         content: `Please provide content for a PowerPoint slide on the topic "${description}", written in a concise and scientific manner in native Uzbek language, tailored for educational purposes. Ensure the content adheres to this structure:

//         - Key Facts: [2-3 important, scientifically-backed facts about the topic]
//         - Conclusion: [A brief conclusion summarizing the topic's impact or significance]

//         This content must be prepared to enhance the presentation's clarity and educational value, aiming to provide clear, useful, and scientifically validated information on the subject to the audience in Uzbek.
//         `,
//         // content:
//         //   "Give the information provided by the role of the teacher on the given topic. Do not let it be known that this information was given by the teacher. Write down the information you wrote down. The information should be in Uzbek. Who wrote the information not be known at all",
//         // content:
//         // "Write down the information provided by a 20-year-old teacher on the given topic and give more information. Do not use unnecessary texts in this information. Do not mix unnecessary texts at all. Be in Uzbek. Texts",
//         // content: `Sen menga berilgan mavzu bo'yicha professor tuzib bera oladigan darajada power point uchun reja tuzib ber.Menga ${pages} ta rejali qilib tuzib ber.Bunda rejalar aniq va bitta gapdan iborat bo'lsin.Beriladigan matnda faqat rejalar bo'lsin ortiqcha gaplardan foydalanish  taqiqlanadi.`,
//       },
//       {
//         role: "user",
//         content: "",
//       },
//     ],

//     model: "gpt-4-1106-preview",
//     max_tokens: 4096,
//   });

//   return chatCompletion.choices[0].message.content;
// }

export let createPlansDescription = async (name: string) => {
  const queryJson = {
    // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
    input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in Uzbek. In the title, the name of the topic for the slide section should be in Uzbek. UzContent should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
          {
            title: "{{title}}",
            uzContent: "{{uzContent}}",
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: "gpt-3.5-turbo-0125",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 800,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: name },
        {
          role: "system",
          content: JSON.stringify(queryJson),
        },
        {
          role: "system",
          content: "please JSON format based on the given structure.",
        },
      ],
      model: "gpt-3.5-turbo-0125",
      // model: "gpt-4-turbo-preview",
      max_tokens: 800,
      response_format: {
        type: "json_object",
      },
    });
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  }

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

// export let createPlansDescription = async (name: string) => {
//   const queryJson = {
//     // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
//     input_text: `Provide the necessary information on the topic. Create 30 to 50 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in Uzbek. In the title, the name of the topic for the slide section should be in Uzbek. UzContent should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
//     output_format: "json",
//     json_structure: {
//       slide: {
//         name: "{{name}}",
//         content: [
//           {
//             title: "{{title}}",
//             uzContent: "{{uzContent}}",
//           },
//           {
//             title: "{{title}}",
//             uzContent: "{{uzContent}}",
//           },
//           {
//             title: "{{title}}",
//             uzContent: "{{uzContent}}",
//           },
//           {
//             title: "{{title}}",
//             uzContent: "{{uzContent}}",
//           },
//         ],
//       },
//     },
//   };

//   // try {
//   const response = await axios.post(
//     "https://api.openai.com/v1/chat/completions",
//     {
//       model: "gpt-4-turbo-preview", // Specify the model here
//       messages: [
//         { role: "user", content: name },
//         {
//           role: "system",
//           content: JSON.stringify(queryJson),
//         },
//       ],
//       max_tokens: 800,
//       response_format: {
//         type: "json_object",
//       },
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${key}`, // Replace with your actual API key
//         "Content-Type": "application/json",
//       },
//     }
//   );

//   const description = JSON.parse(response.data.choices[0].message.content ?? "")
//     .slide.content;

//   console.log(description);
//   return {
//     name: name,
//     content: description,
//   };
//   // } catch (error) {
//   //   console.error("Error during API call:", error.response?.data || error.message);
//   //   throw error; // Or handle the error as needed
//   // }
// };

export let createPlansLanguage = async (
  name: string,
  pages: number,
  lang: string,
  language: string
) => {
  const queryJson = {
    input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {{${lang}}}, {{eng}} in ${language} and English. The end result should look like this. List of discussion questions. Return as JSON.`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          {
            [lang]: `{{${lang}}}`,
            eng: "{{eng}}",
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    model: "gpt-4-turbo-preview",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 1024,
    response_format: {
      type: "json_object",
    },
  });
  console.log(chatCompletion.choices[0].message.content);
  const content = chatCompletion.choices[0].message.content || ""; // Handle null case
  // const plans = parseTitles(content);
  let plans;
  try {
    plans = JSON.parse(content).slides.plans;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJson),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      // model: "gpt-3.5-turbo-16k-0613",
      model: "gpt-4-turbo-preview",
      max_tokens: 1500,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  let plansText = plans.map((plan: any) => {
    return `${plan[lang]} && ${plan.eng}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

export let createPlansDescriptionLanguage = async (
  name: string,
  lang: string,
  languege: string
) => {
  const queryJson = {
    // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
    input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{${lang}}} for each topic should be in ${languege} language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in ${languege}. In the title, the name of the topic for the slide section should be in ${languege}. ${lang}Content should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            [`${lang}Content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`${lang}Content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`${lang}Content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`${lang}Content`]: `{{${lang}Content}}`,
          },
        ],
      },
    },
  };
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: "gpt-3.5-turbo-0125",
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 800,
    response_format: {
      type: "json_object",
    },
  });

  let description = "";
  try {
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  } catch (error) {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        { role: "user", content: name },
        {
          role: "system",
          content: JSON.stringify(queryJson),
        },
        {
          role: "system",
          content: "please JSON format based on the given structure.",
        },
      ],
      model: "gpt-3.5-turbo-0125",
      // model: "gpt-4-turbo-preview",
      max_tokens: 800,
      response_format: {
        type: "json_object",
      },
    });
    description = await JSON.parse(
      chatCompletion.choices[0].message.content ?? ""
    ).slide.content;
  }

  console.log(description);

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};
