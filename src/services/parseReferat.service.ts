import { spawn } from "child_process";
import path from "path";
import prisma from "../../prisma/prisma";

export function parseJsonToTags(
  jsonData: any,
  rightContent: string,
  university: string,
  theme: string
): string {
  const tags: string[] = [
    `[RIGHTCONTENT]${rightContent}[/RIGHTCONTENT]`,
    `[UNIVERSITY]${university}[/UNIVERSITY]`,
    `[THEME]${theme}[/THEME]`,
  ];

  // Title tag from the first plan's name
  if (jsonData.plans && jsonData.plans.length > 0) {
    const firstPlan = jsonData.plans[0];
    tags.push(`[TITLE]${firstPlan.name.split(" && ")[0]}[/TITLE]`); // Add the main title from the first plan
  }

  // Process each plan in the JSON data
  jsonData?.plans?.forEach((plan: any) => {
    // Add subtitle (plan's name)
    tags.push(`[SUBTITLE]${plan.name.split(" && ")[0]}[/SUBTITLE]`);
    tags.push(`[HEADING]${plan.name.split(" && ")[0]}[/HEADING]`);

    // Add content from the description
    console.log(plan, "plans");
    console.log(plan.description[0].content, "description");
    plan?.description?.forEach((description: any) => {
      description?.content?.forEach((content: any) => {
        // Uncomment below line if you need heading for each content
        // tags.push(`[HEADING]${content.title}[/HEADING]`);
        // Add content (uzContent)
        tags.push(`[CONTENT]${content.content}[/CONTENT]`);
      });
    });
  });

  return tags.join("\n");
}

function runPythonScriptReferat(inputData: string, lang: string) {
  return new Promise((resolve, reject) => {
    // Python skriptini boshlash
    console.log("=================");
    console.log(path.join(__dirname, "../ai_generator/createReferat.py"));
    console.log("=================");
    const pythonProcess = spawn("python3", [
      path.join(
        __dirname,
        `../ai_generator/createReferat${
          lang == "eng" ? "eng" : lang == "ru" ? "ru" : ""
        }.py`
      ),
    ]);

    let outputData = "";
    let errorData = "";

    // Ma'lumotlarni uzatish

    console.log("=================");
    console.log(inputData);
    console.log("=================");
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    // Python skripti natijasini qabul qilish
    pythonProcess.stdout.on("data", (data: any) => {
      // outputData += data.toString();
    });

    // Xatolarni qabul qilish
    pythonProcess.stderr.on("data", (data: any) => {
      errorData += data.toString();
    });

    // Skript tugaganda ishni qo'lda to'xtatish
    pythonProcess.on("close", (code: any) => {
      console.log(`Python process closed with code ${code}`);

      if (code === 0) {
        resolve(outputData);
      } else {
        reject(
          new Error(`Python process exited with code ${code}: ${errorData}`)
        );
      }
    });
  });
}

export async function handlePythonScriptReferat(input: any, lang: string) {
  try {
    const result = await runPythonScriptReferat(input, lang);
    console.log("Python Script Output:", result);
  } catch (error) {
    console.error("Error running Python script:", error);
  }
}

const test = async () => {
  const description = await prisma.plan.findMany({
    where: {
      chat_id: "a40ee10d-db05-4edf-958d-0cebb1d257f2",
    },
    include: {
      description: true,
    },
  });

  let rightContent = `Bajardi: Anonymous
  Fan:Unknown`;

  const contentText = parseJsonToTags(
    {
      plans: description,
    },
    rightContent,
    "O'quv yurti",
    "Unknown"
  );

  const id = "165386";
  const filePath = path.join(__dirname, `../../output2${id}.docx`);

  const createdFile = await handlePythonScriptReferat(
    `${id}{{${contentText}`,
    "uz"
  );
};
