import PPTXGenJS from "pptxgenjs";
import OpenAI from "openai";
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
    max_tokens: 4096,
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
