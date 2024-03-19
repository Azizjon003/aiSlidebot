import PptxGenJS from "pptxgenjs";
import prisma from "../../prisma/prisma";
import path from "path";

/**
 * PowerPoint prezentatsiyasini yaratish funksiyasi.
 * @param title - Prezentatsiyaning asosiy sarlavhasi.
 * @param points - Prezentatsiyadagi punktlar ro'yxati.
 * @param fileName - Yaratilgan prezentatsiya faylining nomi.
 */
export async function createPresentation(data: any): Promise<void> {
  let { title, body, path } = data;
  let pres = new PptxGenJS();
  let slide = pres.addSlide();

  // Slaydga sarlavha qo'shish
  slide.addText(title.name, {
    x: 1,
    y: 2.7,
    fontSize: 36,
    color: "363636",
  });

  // Slaydga punktlar ro'yxatini qo'shish
  // const bulletPoints = .map((point) => ({
  //   text: point,
  //   options: { bullet: true },
  // }));

  slide.addText(title.author, { x: 1, y: 4 });

  // // Prezentatsiyani saqlash

  for (let i = 0; i < body.length; i++) {
    slide = pres.addSlide();
    let slideData = body[i].content;

    for (let j = 0; j < slideData?.length; j++) {
      let slidesSubData: any = slideData[j];

      slide.addText(body[i].name, {
        x: 0.3,
        y: 0.7,
        fontSize: 20,
        bold: true,
        color: "000000",
      });
      if (i === 0) {
        // slide.addShape(pres.ShapeType.roundRect, {
        //   x: 0.3,
        //   y: 1.5,
        //   w: 9.5,
        //   h: 3.5,
        //   fill: { color: "ffffff" },
        //   line: {
        //     color: "0EC765",
        //   },
        //   rectRadius: 0.2, // Doira shaklini belgilash
        //   // Doira shaklini belgilash
        // });
        if (j === 0) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.3,
            y: 1.5,
            w: 9.5,
            h: 3.5,
            fill: { color: "ffffff" },
            line: {
              color: "0EC765",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });

          let titles = slidesSubData?.title;

          slide.addText(titles, {
            x: 0.35,
            y: 1.8,
            w: 1.5,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData.uzContent, {
            x: 2,
            y: 1.8,
            w: 6,
            h: 1,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 1) {
          let title = slidesSubData?.title;

          slide.addText(title, {
            x: 0.35,
            y: 2.7,
            w: 1.5,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData.uzContent, {
            x: 2,
            y: 2.7,
            w: 6,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 2) {
          let title = slidesSubData?.title;

          slide.addText(title, {
            x: 0.35,
            y: 3.5,
            w: 1.5,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData.uzContent, {
            x: 2,
            y: 3.5,
            w: 6,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        }
      } else if ((i + 1) % 2 === 0) {
        if (j === 0) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.3,
            y: 1.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "0EC765",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 0.3,
            y: 1.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 0.3,
            y: 1.3,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 1) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 5.7,
            y: 1.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "0EC765",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 5.7,
            y: 1.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 5.7,
            y: 1.3,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 2) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 5.7,
            y: 3.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "0EC765",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 5.7,
            y: 3.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 5.7,
            y: 3.3,
            w: 4,
            h: 1.5,
            fontSize: 10,

            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 3) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.3,
            y: 3.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "0EC765",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 0.3,
            y: 3.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 0.3,
            y: 3.3,
            w: 4,
            h: 1.5,
            fontSize: 10,

            color: "000000",
            align: "left",
            valign: "top",
          });
        }
      } else {
        if (j === 0) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.3,
            y: 1.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "ffffff",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 0.3,
            y: 1.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 0.3,
            y: 1.3,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 1) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 5.7,
            y: 1.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "ffffff",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 5.7,
            y: 1.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 5.7,
            y: 1.3,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 2) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 5.7,
            y: 3.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "ffffff",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });
          slide.addText(`${slidesSubData.title}`, {
            x: 5.7,
            y: 3.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });
          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(` \n${slidesSubData?.uzContent}`, {
            x: 5.7,
            y: 3.3,
            w: 4,
            h: 1.5,
            fontSize: 10,

            color: "000000",
            align: "left",
            valign: "top",
          });
        } else if (j === 3) {
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.3,
            y: 3.2,
            w: 4,
            h: 1.8,
            fill: { color: "ffffff" },
            line: {
              color: "ffffff",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(`${slidesSubData.title}`, {
            x: 0.3,
            y: 3.2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });
          slide.addText(`\n${slidesSubData?.uzContent}`, {
            x: 0.3,
            y: 3.3,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        }
      }
    }

    // slide.addText(body[i].content, { x: 1, y: 3, fontSize: 14 });
  }

  console.log("path", path);
  let datas = await pres.writeFile({ fileName: path });

  // return datas;
}

// let test = async () => {
//   console.log("test");
//   const chat = await prisma.chat.findFirst({
//     where: {
//       id: "5dabd9fd-b9e5-4a08-be81-001037519e95",
//     },
//   });
//   if (!chat) return;
//   const description = await prisma.description.findMany({
//     where: {
//       chat_id: chat.id,
//     },
//     include: {
//       plan: true,
//     },
//   });

//   let body = description;

//   const title = {
//     name: chat.name,
//     author: "Azizjon Aliqulov",
//   };

//   const filePath = path.join(__dirname, "../../output.pptx");
//   const data = {
//     title,
//     body,
//     path: filePath,
//   };

//   console.log(data.body.length, "data");

//   const slide = await createPresentation(data);
// };

// test();

// Funksiyani chaqirish misoli
// createPresentation({
//   title: {
//     name: "Prezentatsiya",
//     author: "Azizjon Aliqulov",
//   },
//   body: [
//     {
//       name: "Slayd 1",
//       content: "Bu prezentatsiya slaydi 1",
//     },
//     {
//       name: "Slayd 2",
//       content: "Bu prezentatsiya slaydi 2",
//     },
//   ],
//   path: "output.pptx",
// });
