import PPTXGenJS from "pptxgenjs";
import OpenAI from "openai";
import { create } from "domain";
require("dotenv").config();
const key = process.env["OPEN_AI_KEY"] || "";
const openai = new OpenAI({
  apiKey: String(key), // This is the default and can be omitted
});
async function createPresentation(presentationTitle: string) {
  const queryJson = `{
    "input_text": "Generate a 10 slide presentation for the topic. Produce 200 to 400 words per slide. ${presentationTitle}. Each slide should have a {{header}}, {{content}}. The final slide should be a list of discussion questions. Return as JSON.",
    "output_format": "json",
    "json_structure": {
        "slides":"{{presentation_slides}}"
    }
  }`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: queryJson }],
      max_tokens: 4096,
    });

    console.log(response.choices[0].message.content);

    // const slideData = JSON.parse(response.choices[0].message.content).slides;
    const pptx = new PPTXGenJS();

    // slideData.forEach((slide: any) => {
    //   const slideObj = pptx.addSlide();
    //   if (slide.header) {
    //     slideObj.addText(slide.header, {
    //       x: 0.5,
    //       y: 0.25,
    //       fontSize: 18,
    //       bold: true,
    //     });
    //   }
    //   if (slide.content) {
    //     slideObj.addText(slide.content, { x: 0.5, y: 1, fontSize: 14 });
    //   }
    // });

    // pptx.writeFile("output.pptx");
  } catch (error) {
    console.error(error);
  }
}
export async function createPlans(name: string, pages: number) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: name },
      {
        role: "system",

        content: `"input_text": "Create ${pages} plans for the topic. Create 50 to 80 words for each plan. ${name}. Each plan should have {{uz}}, {{eng}} in Uzbek and English. Final the result should be the following. List of discussion questions. Return as JSON.",
        "output_format": "json",
        "json_structure": {
            "slides":"{{
              "plans":[{
          "uzTitle": "{{uzTitle}}",
          "enTitle": "{{enTitle}}"
              }]
            }}"
        }
      }`,
      },
    ],
    // model: "gpt-3.5-turbo-1106",
    model: "gpt-3.5-turbo-16k-0613",
    max_tokens: 4096,
  });
  const plans = JSON.parse(String(chatCompletion.choices[0].message.content))
    .slides.plans;

  let plansText = plans.map((plan: any) => {
    return `${plan.uzTitle} && ${plan.enTitle}`;
  });

  console.log(plansText);

  return plansText;
}

export async function createPlansDescription(name: string) {
  const queryJson = {
    input_text: `Provide the necessary information on the topic. Create 50 to 60 words for your topic. ${name}. {{uz}} for each topic should be in Uzbek language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. Every information should be in Uzbek language. In Title, the name of the topic for the part of the slide should be in Uzbek. And in UzContent, there should be the necessary information for this topic. The return value should be in JSON format`,
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
    model: "gpt-3.5-turbo-0125",
    max_tokens: 1024,
    frequency_penalty: 0,
    response_format: {
      type: "json_object",
    },
  });

  console.log(chatCompletion);
  const description = JSON.parse(
    String(chatCompletion.choices[0].message.content)
  );

  // let descriptionText = description.map((plan: any) => {
  //   return `${plan.uzTitle} && ${plan.enTitle}`;
  // });

  // console.log(descriptionText);

  // return descriptionText;

  return {
    name: description.name,
    content: description.content,
  };
}

// createPlans("Qon tomir kasalliklari", 15);

createPlansDescription(
  "Qon tomirlarining asosiy kasalliklarini qanday aniqlaymiz? && How can we identify the main diseases of blood clots?"
);

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
    input_text: `Provide the necessary information on the topic. Create 20 to 40 words for your topic. ${name}. {{${lang}}} for each topic should be in ${languege} language. The end result should be like this. List of discussion questions. Return as JSON based on the given structure. Please do not deviate from the given structure. All information must be in Uzbek. In the title, the name of the topic for the slide section should be in ${languege}. ${lang}Content should have the necessary information on this topic. The return value must be in JSON format.finish_reason should not exceed 4096 tokens.`,
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

createPlansDescriptionLanguage("Vascular diseases", "eng", "English");
