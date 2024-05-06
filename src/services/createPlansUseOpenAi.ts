import { plansInsert, rejalarniAjratibOlish } from "../utils/textToPlans";
import { parseItems, parseTitles } from "../utils/functions";
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
import OpenAI from "openai";
console.log(key);
const openai = new OpenAI({
  apiKey: key,
});

const djJson = require("dirty-json");
const xss = require("xss");
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
  language: string,
  pagesCount: number,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": "gpt-3.5-turbo-0125",
    "gpt-4": "gpt-4-turbo-preview",
  };
  console.log(models["gpt-3"], pages);
  if (lang == "eng") {
    lang = "english";
  }
  // const queryJson = {
  //   input_text: `Create a ${pages} layout for the theme. Create 20 to 30 words for each plan. ${name}. Each plan must have ${language} and {{${lang}}}, {{eng}} in English. The end result should be like this. List of discussion questions. Return as JSON. Do not contain data that violates the JSON format. Plans should only contain words.`,
  //   // input_text: `Create ${pages} layout for topic. Create 20 to 30 words for each plan. ${name}. Each plan must have {${lang}}, {eng} in ${language} and English. The end result should look like this. List of discussion questions. Return as JSON.`,
  //   output_format: "json",
  //   json_structure: {
  //     slides: {
  //       plans: [
  //         {
  //           [lang]: `{{${lang}}}`,
  //           eng: "{{eng}}",
  //         },
  //       ],
  //     },
  //   },
  // };
  let queryJson = {
    input_text: `Create a layout with ${pages} pages for the theme '${name}'.Make appropriate educational plans for the given topic. Each page should have plans with descriptions of 20 to 30 words in both ${language} and English. The plans should be structured in a way that each contains a version in ${language} and a version in English. The final output should include a list of discussion questions and return as JSON. Ensure that the data is formatted correctly and that the plans contain only textual information.
    Pay attention to the language of presentation - ${language}.
     Do not mix other topics
    Do not include any special characters (?, !, ., :, ) in the Title.
    Do not include any additional information in your response and stick to the format`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          ...Array.from({ length: pages }, () => {
            return {
              [lang]: `{{${lang}_content}}`,
              eng: "{{english_content}}",
            };
          }),
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
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",
    max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
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
      model: models["gpt-3"],
      // model: "gpt-3.5-turbo-16k-0613",
      // model: "gpt-4-turbo-preview",
      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });
    console.log(chatCompletion.choices[0].message.content);
    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  let leth = plans.length;

  console.log(plans.length, "plans length-1");
  if (leth < pages) {
    let queryJsons = {
      input_text: `Create a layout with ${pages} pages for the theme '${name}'. Each page should have plans with descriptions of 20 to 30 words in both ${language} and English. The plans should be structured in a way that each contains a version in ${language} and a version in English. The final output should include a list of discussion questions and return as JSON. Ensure that the data is formatted correctly and that the plans contain only textual information.
      
      Pay attention to the language of presentation - ${language}.
      Do not include any special characters (?, !, ., :, ) in the Title.
      Do not include any additional information in your response and stick to the format
      `,
      output_format: "json",
      json_structure: {
        slides: {
          plans: [
            ...Array.from({ length: pages + 1 }, () => {
              return {
                [lang]: `{{${lang}_content}}`,
                eng: "{{english_content}}",
              };
            }),
          ],
        },
      },
    };
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        // { role: "user", content: name },
        {
          role: "user",
          content: JSON.stringify(queryJsons),
        },
      ],
      // model: "gpt-3.5-turbo-1106",
      // model: "gpt-3.5-turbo-0125",
      model: models["gpt-3"],
      // model: "gpt-3.5-turbo-16k-0613",
      // model: "gpt-4-turbo-preview",
      max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
      response_format: {
        type: "json_object",
      },
    });

    const content = chatCompletion.choices[0].message.content || "";
    plans = JSON.parse(content).slides.plans;
  }

  console.log(plans.length, "plans length");
  let plansText = plans.map((plan: any) => {
    return `${xss(plan[lang])} && ${xss(
      plan[lang == "english" ? "english" : "eng"]
    )}`.replace(/\d+/g, "");
  });

  console.log(plansText);

  return plansText;
};

enum modelLang {
  gpt3 = "gpt-3",
  gpt4 = "gpt-4",
}

export let createPlansDescriptionLanguage = async (
  name: string,
  lang: string,
  language: string,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": "gpt-3.5-turbo-0125",
    "gpt-4": "gpt-4-turbo-preview",
  };

  const queryJson = {
    input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{${lang}}} for each theme must be in ${language}. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All data must be in ${language}. The title must contain the topic name for the slide section in ${language}. content should contain relevant information on this topic. The return value must be in JSON format. finish_reason cannot exceed 4096 tokens. Strictly follow the rules given in json_structure. Make no mistake. Do not forget that Content consists of 4 elements. It is required to have 4 elements in the Content part, not less. It is required to have 4 elements
    Elaborate on the content, provide as much information as possible.

    Pay attention to the language of presentation - ${language}.
    In the content section, give important information about the language and content. Pay attention to the ${language} when writing the information, then you can't make a mistake.The titles in the content section should not be the same. The titles should be different.
    Do not use interrogative sentences in the title part. Do not use interrogative sentences in the content part either.
    In the content section, give information in a suitable position for the title. Let it be the classification of the title. Follow this rule strictly
    Each image should be described in general by a set of keywords, such as "Mount Everest Sunset" or "Niagara Falls Rainbow".
    Do not reply as if you are talking about the slideshow itself. (ex. "Include pictures here about...")
    Do not include any special characters (?, !, ., :, ) in the Title.
    Do not include any additional information in your response and stick to the format
    `,
    // input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
    // input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{${lang}}} for each topic should be in ${languege} language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in ${languege}. In the title, the name of the topic for the slide section should be in ${languege}. ${lang}Content should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
          {
            title: "{{title}}",
            [`content`]: `{{${lang}Content}}`,
          },
        ],
      },
    },
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      // { role: "user", content: name },
      {
        role: "user",
        content: JSON.stringify(queryJson),
      },
    ],
    // model: "gpt-4-turbo-preview",
    model: models["gpt-3"],
    // model: "gpt-3.5-turbo-0125",
    max_tokens: 1000,
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
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 1200,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    } catch (error) {
      const chatCompletion = await openai.chat.completions.create({
        messages: [
          {
            role: "user",
            content: JSON.stringify(queryJson),
          },
        ],
        // model: "gpt-3.5-turbo-0125",
        model: models["gpt-3"],
        // model: "gpt-4-turbo-preview",
        max_tokens: 1500,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    }
  }

  // console.log(description);

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};

const test = async () => {
  // const plans = await createPlansLanguage(
  //   "Qon tomir kasalliklari",
  //   18,
  //   "uz",
  //   "uzbek",
  //   18,
  //   modelLang.gpt3
  // );
  const plans = [
    "Qon tomir kasalligining asosiy sabablarini tushuntirish && Identifying the main causes of hemophilia",
    "Qon tomir kasalliklarining turli turlari && Different types of hemophilia",
    "Qon tomir kasalligining xossaliklari va belgilari && Symptoms and signs of hemophilia",
    "Qon tomir kasalligining xossalik davri va dardlari && Disease duration and its treatments",
    "Qon tomir kasalligini oldini olish usullari && Methods of preventing hemophilia",
    "Qon tomir kasalligining ravishlari va mudofaalari && Therapies and treatments for hemophilia",
    "Qon tomir kasalligini taniganida qanday qilib amal qilish kerak && What to do when diagnosed with hemophilia",
    "Qon tomir kasalligini surish, urg'ochilari va nazariyasi && Heritage, risks, and genetics of hemophilia",
    "Qon tomir kasalligi bilan yashash && Living with hemophilia",
    "Qon tomir kasalliklari davriylikdagi o'zgarishlar && Changes in hemophilia dynamics",
    "Qon tomir kasalligining shifokorligi va davolash usullari && Doctoring and treatment methods for hemophilia",
    "Qon tomir kasalliklarining profilaktikasi && Prophylaxis for hemophilia",
    "Qon tomir kasalligining o'zgarib turish texnologiyasi && Changing hemophilia technology",
    "Qon tomir kasalligini chetlatish va aniqlash && Exclusion and detection of hemophilia",
    "Qon tomir kasalliklari tajribalariga asoslangan darslar && Lessons from experiences of hemophilia",
    "Qon tomir kasalliklari davlat dasturlari va ko'ngilocharliligidagi mustahkamlash && State programs and strengthening of support for hemophilia",
    "Qon tomir kasalligida klinika va asbobiy bosqichlar && Clinical and instrumental stages in hemophilia",
    "Qon tomir kasalligi yoki tomir kasalligini tushunish && Hemophilia or recognizing hemophilia",
    "Qon tomir kasalligini o'qimaymiz && Don't underestimate hemophilia",
  ];

  console.log(plans);

  for (let i = 0; i < plans.length; i++) {
    let plan = plans[i].split("&&")[1];
    const plansDescription = await createPlansDescriptionLanguage(
      plan,
      "uz",
      "uzbek",
      modelLang.gpt3
    );
    console.log(plansDescription);
  }
};

// test();
