export function generateFormattedStringFromData(data: any, lang: string) {
  let resultString = "";

  // Har bir 'plans' elementini ko'rib chiqamiz
  data.plans.forEach((plan: any) => {
    // Har bir 'description' elementini ko'rib chiqamiz
    plan.description.forEach((desc: any) => {
      // Agar 'TITLE' mavjud bo'lsa, uni qo'shamiz
      if (desc.name) {
        resultString += `[TITLE]${desc.name.split("&&")[0]}[/TITLE]\n`;
      }
      // Har bir 'content' elementini ko'rib chiqamiz
      desc.content.forEach((content: any) => {
        if (content.title) {
          resultString += `[HEADING]${content.title}[/HEADING]\n`;
        }
        if (content.uzContent) {
          resultString += `[CONTENT]${content[`${lang}Content`]}[/CONTENT]\n`;
        }
        // Agar rasm haqida ma'lumot bo'lsa (bu yerda keyingi ishlarni qo'shishingiz mumkin)
        // Misol uchun:
      });
      resultString += `[IMAGE]${plan.name.split("&&")[1]}[/IMAGE]\n`;
      resultString += "\n"; // Har bir tavsifdan keyin yangi qator
    });
  });

  return resultString;
}
import { spawn } from "child_process";
import path from "path";

function runPythonScriptDocx(inputData: string) {
  return new Promise((resolve, reject) => {
    // Python skriptini boshlash
    const pythonProcess = spawn("python3", [
      path.join(__dirname, "../ai_generator/abstract.py"),
    ]);

    let outputData = "";
    let errorData = "";

    // Ma'lumotlarni uzatish
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();

    // Python skripti natijasini qabul qilish
    pythonProcess.stdout.on("data", (data: any) => {
      // console.log("Data from Python script:", data.toString());
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

export async function handlePythonScriptDocx(input: any) {
  try {
    const result = await runPythonScriptDocx(input);
    console.log("Python Script Output:", result);
  } catch (error) {
    console.error("Error running Python script:", error);
  }
}
