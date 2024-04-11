import PptxGenJS from "pptxgenjs";
import prisma from "../../prisma/prisma";
import { searchImages } from "./searchImages.service";
import path from "path";

/**
 * PowerPoint prezentatsiyasini yaratish funksiyasi.
 * @param title - Prezentatsiyaning asosiy sarlavhasi.
 * @param points - Prezentatsiyadagi punktlar ro'yxati.
 * @param fileName - Yaratilgan prezentatsiya faylining nomi.
 */
export async function createPresentation(
  data: any,
  lang: string
): Promise<void> {
  let { title, body, path, changeAuthor } = data;
  let pres = new PptxGenJS();
  let slide = pres.addSlide();
  let imageName = body[0].name.split("&&")[1];
  const image = await searchImages(imageName);
  slide.addImage({
    path: image,
    x: "60%",
    y: "0%",

    sizing: {
      type: "cover",
      w: "40%",
      h: "100%",
    },
  });

  slide.addText(title.name, {
    x: "5%",
    y: "25%",
    w: "50%",
    h: "20%",
    fontSize: 24,
    fontFace: "Playfair Display",
    bold: true,
  });

  slide.addText(`Bajardi: ${title.author}`, {
    x: "5%",
    y: "65%",
    w: "50%",
    h: "15%",
    fontSize: 14,
    fontFace: "Playfair Display",
    italic: true,
  });

  if (changeAuthor) {
    slide.addText(`Tekshirdi: ${changeAuthor}`, {
      x: "5%",
      y: "75%",
      w: "50%",
      h: "15%",
      fontSize: 14,
      fontFace: "Playfair Display",
      italic: true,
    });
  }

  // Slaydga sarlavha qo'shish
  // slide.addText(title.name, {
  //   x: 1,
  //   y: 2.7,
  //   fontSize: 36,
  //   color: "363636",
  // });

  // Slaydga punktlar ro'yxatini qo'shish
  // const bulletPoints = .map((point) => ({
  //   text: point,
  //   options: { bullet: true },
  // }));

  // slide.addText(title.author, { x: 1, y: 4 });

  // // Prezentatsiyani saqlash

  for (let i = 0; i < body.length; i++) {
    slide = pres.addSlide();
    let slideData = body[i].content;

    for (let j = 0; j < slideData?.length; j++) {
      let slidesSubData: any = slideData[j];
      let imagesName = body[i].name.split("&&")[1];
      slide.addText(body[i].name.split("&&")[0], {
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
        //     color: "0B57D0",
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
              color: "0B57D0",
            },
            rectRadius: 0.2, // Doira shaklini belgilash
            // Doira shaklini belgilash
          });

          let titles = slidesSubData?.title;

          slide.addText(titles, {
            x: 0.35,
            y: 1.8,
            w: 3,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: 3.5,
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
            w: 3,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: 3.5,
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
            w: 3,
            h: 2,
            fontSize: 12,
            bold: true,
            color: "000000",
            align: "left",
            valign: "top",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: 3.5,
            y: 3.5,
            w: 6,
            h: 1.5,
            fontSize: 10,
            color: "000000",
            align: "left",
            valign: "top",
          });
        }
      } else if ((i + 1) % 3 === 0) {
        if (j === 0) {
          let images = await searchImages(imagesName, 2);
          slide.addImage({
            path: images,
            x: "10%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "10%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "10%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
          });
          // slide.addShape(pres.ShapeType.roundRect, {
          //   x: 0.3,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.8,
          //   fill: { color: "ffffff" },
          //   line: {
          //     color: "0B57D0",
          //   },
          //   rectRadius: 0.2, // Doira shaklini belgilash
          //   // Doira shaklini belgilash
          // });
          // slide.addText(`${slidesSubData.title}`, {
          //   x: 0.3,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   bold: true,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });

          // // Doira ichiga matn qo'shish
          // // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          // slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
          //   x: 0.3,
          //   y: 1.3,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });
        } else if (j === 1) {
          let images = await searchImages(imagesName, 3);

          slide.addImage({
            path: images,
            x: "40%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "40%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "40%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
          });

          // slide.addShape(pres.ShapeType.roundRect, {
          //   x: 5.7,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.8,
          //   fill: { color: "ffffff" },
          //   line: {
          //     color: "0B57D0",
          //   },
          //   rectRadius: 0.2, // Doira shaklini belgilash
          //   // Doira shaklini belgilash
          // });
          // slide.addText(`${slidesSubData.title}`, {
          //   x: 5.7,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   bold: true,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });

          // // Doira ichiga matn qo'shish
          // // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          // slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
          //   x: 5.7,
          //   y: 1.3,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });
        } else if (j === 2) {
          let images = await searchImages(imagesName, 4);

          slide.addImage({
            path: images,
            x: "70%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "70%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "70%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
          });
          // slide.addShape(pres.ShapeType.roundRect, {
          //   x: 5.7,
          //   y: 3.2,
          //   w: 4,
          //   h: 1.8,
          //   fill: { color: "ffffff" },
          //   line: {
          //     color: "0B57D0",
          //   },
          //   rectRadius: 0.2, // Doira shaklini belgilash
          //   // Doira shaklini belgilash
          // });
          // slide.addText(`${slidesSubData.title}`, {
          //   x: 5.7,
          //   y: 3.2,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   bold: true,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });

          // // Doira ichiga matn qo'shish
          // // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          // slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
          //   x: 5.7,
          //   y: 3.3,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,

          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });
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
              color: "0B57D0",
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
              color: "0B57D0",
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
              color: "0B57D0",
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
              color: "0B57D0",
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
          slide.addText(` \n${slidesSubData[`${lang}Content`]}`, {
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
          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
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
  }

  console.log("path", path);
  let datas = await pres.writeFile({ fileName: path });

  // return datas;
}

export const createSlideWithAnimationDarkMode = async (
  data: any,
  lang: string
) => {
  let { title, body, paths, changeAuthor } = data;
  let pres = new PptxGenJS();
  pres.theme = { bodyFontFace: "Playfair Display" };
  let slide = pres.addSlide();

  slide.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  slide.addImage({
    path: path.join(__dirname, "../../image2.png"),
    x: 0,
    y: 0,
    w: "40%",
    h: "100%",
  });

  slide.addText(title.name, {
    x: "45%",
    y: "25%",
    w: "50%",
    h: "15%",
    fontSize: 24,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  slide.addText(`Bajardi: ${title.author}`, {
    x: "45%",
    y: "55%",
    w: "50%",
    h: "15%",
    fontSize: 14,
    fontFace: "Playfair Display",
    italic: true,
    color: "f0f0f0",
  });

  if (changeAuthor) {
    slide.addText(`Tekshirdi: ${changeAuthor}`, {
      x: "45%",
      y: "65%",
      w: "50%",
      h: "15%",
      fontSize: 14,
      fontFace: "Playfair Display",
      italic: true,
      color: "f0f0f0",
    });
  }
  let plans = body.map((item: any, index: number) => {
    return `${index + 1}. ${item.name.split("&&")[0]}`;
  });

  let plansString = plans.join("\n");

  let planSlide = pres.addSlide();
  planSlide.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  planSlide.addText(title.name, {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 16,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  planSlide.addText(plansString, {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "90%",
    fontSize: 12,
    bold: true,
    color: "f0f0f0",
  });

  for (let i = 0; i < body.length; i++) {
    slide = pres.addSlide();
    let slideData = body[i].content;
    slide.addImage({
      path: path.join(__dirname, "../../image.png"),
      x: 0,
      y: 0,
      w: "100%",
      h: "100%",
    });
    for (let j = 0; j < slideData?.length; j++) {
      let slidesSubData: any = slideData[j];
      let imagesName = body[i].name.split("&&")[1];
      let titles = body[i].name.split("&&")[0];
      if (i === 0) {
        if (j === 0) {
          // let title = slidesSubData?.title;
          slide.addText(titles, {
            x: "5%",
            y: "5%",
            w: "90%",
            h: "10%",
            fontSize: 16,
            fontFace: "Playfair Display",
            bold: true,
            color: "f0f0f0",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "15%",
            w: "90%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
          });
        } else if (j === 1) {
          let title = slidesSubData?.title;

          slide.addShape(pres.ShapeType.roundRect, {
            x: "5%",
            y: "30%",
            w: "90%",
            h: "20%",
            fill: {
              color: "0d092c",
              transparency: 30,
            },
            line: {
              color: "332f4c",
              transparency: 0,
            },
            rectRadius: 0.2, // Doira shaklini belgilash
          });

          slide.addText(title, {
            x: "5%",
            y: "30%",
            w: "90%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
            align: "left",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "35%",
            w: "90%",
            h: "15%",
            fontSize: 8,
            italic: true,
            color: "f0f0f0",
            align: "left",
          });
        } else if (j === 2) {
          let title = slidesSubData?.title;
          slide.addShape(pres.ShapeType.roundRect, {
            x: "5%",
            y: "53%",
            w: "90%",
            h: "20%",
            fill: {
              color: "0d092c",
              transparency: 30,
            },
            line: {
              color: "332f4c",
              transparency: 0,
            },
            rectRadius: 0.2, // Doira shaklini belgilash
          });

          slide.addText(title, {
            x: "5%",
            y: "53%",
            w: "90%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
            align: "left",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "57%",
            w: "90%",
            h: "15%",
            fontSize: 8,
            italic: true,
            color: "f0f0f0",
            align: "left",
          });
        } else if (j === 3) {
          let title = slidesSubData?.title;
          slide.addShape(pres.ShapeType.roundRect, {
            x: "5%",
            y: "75%",
            w: "90%",
            h: "20%",
            fill: {
              color: "0d092c",
              transparency: 30,
            },
            line: {
              color: "332f4c",
              transparency: 0,
            },
            rectRadius: 0.2, // Doira shaklini belgilash
          });

          slide.addText(title, {
            x: "5%",
            y: "75%",
            w: "90%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
            align: "left",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "80%",
            w: "90%",
            h: "15%",
            fontSize: 8,
            italic: true,
            color: "f0f0f0",
            align: "left",
          });
        }
      } else if ((i + 1) % 3 === 0) {
        if (j === 0) {
          let title = slidesSubData?.title;
          slide.addText(titles, {
            x: "5%",
            y: "5%",
            w: "90%",
            h: "10%",
            fontSize: 16,
            fontFace: "Playfair Display",
            bold: true,
            color: "f0f0f0",
          });

          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "15%",
            w: "90%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
          });

          slide.addText(title, {
            x: 0.3,
            y: 1.7,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(slidesSubData[`${lang}Content`], {
            x: 0.3,
            y: 2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });
        } else if (j === 1) {
          slide.addText(slidesSubData.title, {
            x: 5.7,
            y: 1.7,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });

          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(slidesSubData[`${lang}Content`], {
            x: 5.7,
            y: 2,
            w: 4,
            h: 1.5,
            fontSize: 10,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });
        } else if (j === 2) {
          slide.addText(slidesSubData.title, {
            x: 5.7,
            y: 3.5,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });
          // Doira ichiga matn qo'shish
          // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          slide.addText(slidesSubData[`${lang}Content`], {
            x: 5.7,
            y: 4,
            w: 4,
            h: 1.5,
            fontSize: 10,

            color: "f0f0f0",
            align: "left",
            valign: "top",
          });
        } else if (j === 3) {
          slide.addText(`Matnning joylashuvi va o'lchami doirani`, {
            x: 0.3,
            y: 3.5,
            w: 4,
            h: 1.5,
            fontSize: 10,
            bold: true,
            color: "f0f0f0",
            align: "left",
            valign: "top",
          });
          slide.addText(
            "// E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan ",
            {
              x: 0.3,
              y: 4,
              w: 4,
              h: 1.5,
              fontSize: 10,
              color: "f0f0f0",
              align: "left",
              valign: "top",
            }
          );
        }
      } else if ((i + 1) % 2 === 0) {
        if (j === 0) {
          let title = slidesSubData?.title;
          slide.addText(titles, {
            x: "5%",
            y: "15%",
            w: "90%",
            h: "10%",
            fontSize: 16,
            fontFace: "Playfair Display",
            bold: true,
            color: "f0f0f0",
          });
        } else if (j === 1) {
          slide.addText(slidesSubData.title, {
            x: "5%",
            y: "40%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
          slide.addText(slidesSubData[`${lang}Content`], {
            x: "5%",
            y: "50%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
        } else if (j === 2) {
          slide.addText(slidesSubData.title, {
            x: "35%",
            y: "40%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
          slide.addText(slidesSubData[`${lang}Content`], {
            x: "35%",
            y: "50%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
        } else if (j === 3) {
          slide.addText(slidesSubData.title, {
            x: "65%",
            y: "40%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
          slide.addText(slidesSubData[`${lang}Content`], {
            x: "65%",
            y: "50%",
            w: "25%",
            h: "10%",
            fontSize: 10,
            italic: true,
            color: "f0f0f0",
            align: "center",
          });
        }
      } else {
        if (j === 1) {
          let title = slidesSubData?.title;
          slide.addText(titles, {
            x: "5%",
            y: "5%",
            w: "90%",
            h: "10%",
            fontSize: 16,
            fontFace: "Playfair Display",
            bold: true,
            color: "f0f0f0",
          });
          let images = await searchImages(imagesName, 3);

          slide.addImage({
            path: images,
            x: "40%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "40%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "40%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
            color: "f0f0f0",
          });
        } else if (j === 0) {
          let images = await searchImages(imagesName, 2);
          slide.addImage({
            path: images,
            x: "10%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "10%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "10%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
            color: "f0f0f0",
          });
          // slide.addShape(pres.ShapeType.roundRect, {
          //   x: 0.3,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.8,
          //   fill: { color: "ffffff" },
          //   line: {
          //     color: "0B57D0",
          //   },
          //   rectRadius: 0.2, // Doira shaklini belgilash
          //   // Doira shaklini belgilash
          // });
          // slide.addText(`${slidesSubData.title}`, {
          //   x: 0.3,
          //   y: 1.2,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   bold: true,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });

          // // Doira ichiga matn qo'shish
          // // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
          // slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
          //   x: 0.3,
          //   y: 1.3,
          //   w: 4,
          //   h: 1.5,
          //   fontSize: 10,
          //   color: "000000",
          //   align: "left",
          //   valign: "top",
          // });
        } else if (j === 2) {
          let images = await searchImages(imagesName, 4);

          slide.addImage({
            path: images,
            x: "70%",
            y: "30%",

            sizing: {
              type: "cover",
              w: "20%",
              h: "20%",
            },
          });

          slide.addText(`${slidesSubData.title}`, {
            x: "70%",
            y: "50%",
            w: "20%",
            h: "10%",
            fontSize: 12,
            bold: true,
            color: "f0f0f0",
          });

          slide.addText(`\n${slidesSubData[`${lang}Content`]}`, {
            x: "70%",
            y: "60%",
            w: "20%",
            h: "30%",
            fontSize: 10,
            bold: false,
            color: "f0f0f0",
          });
        }
      }
    }
  }

  console.log("path", paths);
  let datas = await pres.writeFile({ fileName: paths });
};

let test = async () => {
  console.log("test");
  const chat = await prisma.chat.findFirst({
    where: {
      id: "1d50c2dc-4f1c-4d95-a67e-0e40ff1bd58d",
    },
  });
  if (!chat) return;
  const description = await prisma.description.findMany({
    where: {
      chat_id: chat.id,
    },
    include: {
      plan: true,
    },
  });

  let body = description;

  const title = {
    name: chat.name,
    author: "Azizjon Aliqulov",
  };

  const filePath = path.join(__dirname, "../../output2.pptx");

  console.log("filePath", filePath);
  const data = {
    title,
    body,
    paths: filePath,
  };

  console.log(data.body.length, "data");

  const slide = await createSlideWithAnimationDarkMode(data, "uz");
};
// test();
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
