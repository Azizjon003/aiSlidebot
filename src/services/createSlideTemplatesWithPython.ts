export function generateSlides(data: any, template: string, time: string) {
  let slides = "";

  console.log(data?.name, "datas nimadirlar");
  slides += `[L_TS]\n [TITLE]${data.name}[/TITLE] [AUTHOR]${data.author}[/AUTHOR] [SLIDEBREAK]\n`; // Using the name of the course and author as the title of the presentation

  data.plans.forEach((plan: any, index: number) => {
    const slideTypeTag = "[L_PN]"; // Image slide for the third plan
    slides += `${slideTypeTag}\n`;

    slides += `[TITLE]${index + 1}.${plan.name.split("&&")[0]}[/TITLE]\n`; // Using plan name as the slide title

    console.log(plan.name);

    slides += `[SLIDEBREAK]\n`;
  });
  // slides += `[L_TS]\n [TITLE]${data.name}[/TITLE] [SLIDEBREAK]\n`; // Using the name of the course as the title of the presentation

  data.plans.forEach((plan: any, index: number) => {
    const slideTypeTag = (index + 1) % 2 == 0 ? "[L_IS]" : "[L_CS]"; // Image slide for the third plan
    slides += `${slideTypeTag}\n`;

    slides += `[TITLE]${plan.name.split("&&")[0]}[/TITLE]\n`; // Using plan name as the slide title

    console.log(plan.name);
    plan.description.forEach((desc: any) => {
      console.log(desc, "desc");
      if ((index + 1) % 2 == 0) {
        slides += `[IMAGE]${desc.name.split("&&")[1]}[/IMAGE]\n`;
      }
      desc.content.forEach((content: any, i: number) => {
        if ((index + 1) % 2 == 0) {
          if (i <= 1) {
            slides += `[CONTENT]• ${content.title} - ${
              content[`content`]
            }\n[/CONTENT]`;
          } else {
            slides += "";
          }
        } else {
          slides += `[CONTENT]• ${content.title} - ${
            content[`content`]
          }\n[/CONTENT]`; // Adding content as bullet points
        }
      });
    });

    // if ((index + 1) % 2 == 0) {
    //   slides += `[IMAGE]${desc[0].name.split("&&")[1]}[/IMAGE]\n`;
    // }

    slides += `[SLIDEBREAK]\n`;
  });

  // Add a thank you slide at the end
  slides += "[L_THS]\n";
  slides += `[TITLE]Thank you for your attention![/TITLE]\n`;
  slides += `[SLIDEBREAK]\n`;

  slides += `{{ ${template}_${time}`;
  return slides;
}
import { spawn } from "child_process";
import path from "path";

function runPythonScript(inputData: string) {
  return new Promise((resolve, reject) => {
    // Python skriptini boshlash
    const pythonProcess = spawn("python3", [
      path.join(__dirname, "../ai_generator/presentation.py"),
    ]);

    let outputData = "";
    let errorData = "";

    // Ma'lumotlarni uzatish
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

export async function handlePythonScript(input: any) {
  try {
    const result = await runPythonScript(input);
    console.log("Python Script Output:", result);
  } catch (error) {
    console.error("Error running Python script:", error);
  }
}
