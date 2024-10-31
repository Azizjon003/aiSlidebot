import OpenAI from "openai";
import xss from "xss";
import { modelLang } from "./createPlansUseOpenAi";
require("dotenv").config();
const fs = require("fs");
const pdf = require("pdf-parse");
const key = process.env["OPEN_AI_KEY"] || "";

const openai = new OpenAI({
  apiKey: key,
});

async function readPdfText(filePath: string) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text.trim();
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    throw error;
  }
}
export let createPlansFile = async (
  pages: number,
  pagesCount: number,
  contentFile: string,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": "gpt-4o-mini",
    "gpt-4": "gpt-4o-2024-08-06",
  };

  let queryJson = {
    input_text: `Based on the text provided, create a structured outline (plan) with ${pagesCount} pages that captures the main sections and sub-sections of the document. Ensure that the outline reflects the key topics, processes, and any relevant models or frameworks mentioned in the text. The outline should include the following:

Major sections or concepts.
Subsections that break down the details of each concept.
If applicable, any sequential steps or processes described in the text.
Make sure the plan is well-organized and covers all the essential aspects highlighted in the document. The descriptions in each section should be concise and fit within the specified number of pages.
 Do not mix other topics
    Plans for the given topic should be in good content.  Do not reply as if you are talking about the plans itself. (ex. "Include pictures here about...")
    Do not include any special characters (?, !, ., :, ) in the Title.
    Do not include any additional information in your response and stick to the format
    Please format the data correctly
`,
    output_format: "json",
    json_structure: {
      slides: {
        plans: [
          ...Array.from({ length: pages }, () => {
            return {
              lang: `{{content}}`,
              eng: "{{english_content}}",
            };
          }),
        ],
      },
    },
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: contentFile },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],
    model: models["gpt-3"],
    max_tokens: pagesCount < 6 ? 1200 : pagesCount < 12 ? 1600 : 1800,
    response_format: {
      type: "json_object",
    },
  });

  const content = chatCompletion.choices[0].message.content || ""; // Handle null case

  let plans;

  try {
    plans = JSON.parse(content).slides.plans;
  } catch (error) {
    console.log(error);
  }

  let plansText = plans.map((plan: any) => {
    return `${xss(plan["lang"])} && ${xss(plan["eng"])}`.replace(/\d+/g, "");
  });

  return plansText;
};

export let createPlansDescriptionLanguage = async (
  name: string,
  contentFile: string,
  model: modelLang = modelLang.gpt3
) => {
  let models = {
    "gpt-3": "gpt-4o-mini",
    "gpt-4": "gpt-4o-2024-08-06",
  };

  const queryJson = {
    input_text: `"Provide 60 to 70 words of content on the topic: **${name}**. All content must be in the same language as the provided text.
  
  Return the result strictly as a JSON object following the given **json_structure**, without any deviations.
  
  **Requirements:**
  
  - **Title**: Include the topic name for the slide section as **${name}**.
  - **Content**:
    - Must consist of **four (4) elements**, not less.
    - Each element should have a unique title (titles should not be the same).
    - Provide relevant and important information about the topic.
    - Do not use interrogative sentences in titles or content.
    - Avoid using special characters (?, !, ., :, ) in the content.
  - **Language**: Ensure all data is written in the language of the provided text.
  - **Format**: Do not include any additional information outside of the specified format. Stick strictly to the **json_structure** provided.
  
  Elaborate on the content and provide as much important information as possible. Pay careful attention to the language to avoid any mistakes.`,
    output_format: "json",
    json_structure: {
      slide: {
        name: "{{name}}",
        content: [
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
          {
            title: "{{title}}",
            content: "{{content}}",
          },
        ],
      },
    },
  };

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: contentFile },
      {
        role: "system",
        content: JSON.stringify(queryJson),
      },
    ],

    model: models["gpt-3"],

    max_tokens: 1200,
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

        model: models["gpt-3"],

        max_tokens: 1500,
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
        max_tokens: 2000,
        response_format: {
          type: "json_object",
        },
      });
      description = await JSON.parse(
        chatCompletion.choices[0].message.content ?? ""
      ).slide.content;
    }
  }

  console.log(description);

  return {
    name: "Qon tomir kasalliklari ",
    content: description,
  };
};
