import path from "path";
import PptxGenJS from "pptxgenjs";
import prisma from "../../prisma/prisma";
import { searchImages } from "./searchImages.service";

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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          // slide.addText(`\n${slidesSubData[`content`]}`, {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          // slide.addText(`\n${slidesSubData[`content`]}`, {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          // slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          slide.addText(` \n${slidesSubData[`content`]}`, {
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
          slide.addText(`\n${slidesSubData[`content`]}`, {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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

          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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
          slide.addText(slidesSubData[`content`], {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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
          // slide.addText(`\n${slidesSubData[`content`]}`, {
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

          slide.addText(`\n${slidesSubData[`content`]}`, {
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

export const createSlideEducationTemplate = async (data: any) => {
  const pres = new PptxGenJS();
  pres.theme = { bodyFontFace: "Playfair Display" };
  pres.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: {
      path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/image_2024-10-06_23-59-34.png",
    },
  });

  let { title, body, paths, changeAuthor } = data;
  console.log(body);
  const slide = pres.addSlide("MASTER_SLIDE");

  slide.addText(title.name, {
    x: "15%",
    y: "35%",
    fontSize: 40,
    h: "20%",
    bold: true,
    color: "FFFFFF",
  });

  slide.addText(title.author, {
    x: "30%",
    y: "60%",
    fontSize: 14,
    h: "10%",
    color: "ffffff",
  });

  slide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/pc.png",
    x: "0%",
    y: "50%",
    w: "40%",
    h: "50%",
  });

  slide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/icon.png",
    x: "0%",
    y: "0%",
    w: "20%",
    h: "30%",
  });
  slide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/person.png",
    x: "70%",
    y: "40%",
    w: "30%",
    h: "60%",
  });

  slide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/cloud.png",
    x: "70%",
    y: "0%",
    w: "30%",
    h: "40%",
  });

  const secondSlide = pres.addSlide("MASTER_SLIDE");

  secondSlide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/l-voice.png",
    x: "70%",
    y: "0%",
    w: "30%",
    h: "40%",
  });

  secondSlide.addImage({
    path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/r-voice.png",
    x: "0%",
    y: "0%",
    w: "30%",
    h: "40%",
  });

  secondSlide.addText("REJA", {
    x: "25%",
    y: "15%",
    fontSize: 40,
    h: "20%",
    bold: true,
    color: "FFFFFF",
  });

  // for (let plan of data.plans) {
  //   console.log(plan, index);
  //   secondSlide.addText(plan, {
  //     x: "30%",
  //     y: "60%",
  //     fontSize: 11,
  //     h: "10%",
  //   });
  // }
  let plans = body.map((item: any, index: number) => {
    return `${index + 1}. ${item.name.split("&&")[0]}`;
  });
  let planLength =
    plans.length > 10 ? Math.ceil(plans.length / 2) : plans.length;
  for (let i = 0; i < planLength; i++) {
    let planName = plans[i];
    secondSlide.addText(`${planName}`, {
      x: "25%",
      y: `${30 + i * 7}%`,
      fontSize: 12,
      h: "10%",
      color: "FFFFFF",
    });
  }

  for (let i = 0; i < body.length; i++) {
    const slide = pres.addSlide("MASTER_SLIDE");

    let slideData = body[i];

    // console;

    if (i == 0 || i == 2) {
      let titles = body[i].name.split("&&")[0];
      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/search.png",
        x: "0%",
        y: "0%",
        w: "20%",
        h: "30%",
      });

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/person2.png",
        x: "70%",
        y: "50%",
        w: "30%",
        h: "50%",
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: "18%",
        y: "10%",
        w: "80%",
        h: "20%",
        fill: { color: "ffce31" },
        rectRadius: 0.2,
      });

      slide.addText(titles, {
        x: "20%",
        y: "10%",
        w: "80%",
        h: "20%",
        fontSize: 14,
        color: "000000",
      });

      for (let k = 0; k < 4; k++) {
        const contentText = slideData.content[k].content;
        const title = slideData.content[k].title;

        console.log("contentText", contentText, title);
        slide.addText(`${title} - ${contentText}`, {
          x: "10%",
          y: `${30 + k * 10}%`,
          fontSize: 11,
          h: "10%",
          color: "FFFFFF",
        });
      }
    }

    if (i == 1 || i == 3) {
      let titles = body[i].name.split("&&")[0];

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/search.png",
        x: "0%",
        y: "0%",
        w: "20%",
        h: "30%",
      });

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/person3.png",
        x: "0%",
        y: "30%",
        w: "40%",
        h: "70%",
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: "38.3%",
        y: "15.09%",

        w: "60%",
        h: "80%",
        fill: { color: "ffce31" },
        rectRadius: 0.1,
      });

      slide.addText(titles, {
        x: "40%",
        y: "16%",
        w: "60%",
        h: "20%",
        fontSize: 14,
        color: "000000",
      });

      for (let k = 0; k < 4; k++) {
        const contentText = slideData.content[k].content;
        const title = slideData.content[k].title;
        slide.addText(`${title} - ${contentText}`, {
          x: "40%",
          y: `${30 + k * 15}%`,
          fontSize: 11,
          w: "60%",
          h: "10%",
          color: "000000",
        });
      }
    }

    if (i > 3 && i % 2 == 0 && i % 3 !== 0) {
      let titles = body[i].name.split("&&")[0];

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/cloud.png",
        x: "0%",
        y: "0%",
        w: "20%",
        h: "30%",
      });

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/globus.png",
        x: "70%",
        y: "0%",
        w: "40%",
        h: "40%",
      });

      slide.addText(titles, {
        x: "25%",
        y: "25%",
        fontSize: 30,
        h: "20%",
        bold: true,
        color: "FFFFFF",
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: "5%",
        y: "45%",
        w: "40%",
        h: "50%",
        fill: { color: "ffce31" },
        rectRadius: 0.2,
      });
      slide.addShape(pres.ShapeType.roundRect, {
        x: "55%",
        y: "45%",
        w: "40%",
        h: "50%",
        fill: { color: "ffce31" },
        rectRadius: 0.2,
      });

      for (let k = 0; k < 4; k++) {
        const contentText = slideData.content[k].content;
        const title = slideData.content[k].title;
        console.log("contentText", contentText, title);
        if (k < 2) {
          slide.addText(`${title} - ${contentText}`, {
            x: "8%",
            y: `${50 + k * 15}%`,
            fontSize: 11,
            h: "10%",
            w: "38%",
            color: "000000",
          });
        } else {
          slide.addText(`${title} - ${contentText}`, {
            x: "58%",
            y: `${50 + (k - 2) * 15}%`,
            fontSize: 11,
            h: "10%",
            w: "38%",
            color: "000000",
          });
        }
      }
    }

    if (i > 3 && i % 2 !== 0 && i % 3 !== 0) {
      let titles = body[i].name.split("&&")[0];
      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/person-girl.png",
        x: "0%",
        y: "20%",
        w: "30%",
        h: "70%",
      });

      console.log(titles);
      slide.addText(titles, {
        x: "40%",
        y: "10%",
        fontSize: 25,
        h: "20%",
        w: "50%",
        bold: true,
        color: "FFFFFF",
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: "40%",
        y: "35%",
        w: "58%",
        h: "50%",
        fill: { color: "ffce31" },
        rectRadius: 0.2,
      });

      for (let k = 0; k < 2; k++) {
        const contentText = slideData.content[k].content;
        const title = slideData.content[k].title;
        slide.addText(`${title} - ${contentText}`, {
          x: "42%",
          y: `${40 + k * 15}%`,
          fontSize: 11,
          h: "10%",
          w: "56%",
          color: "000000",
        });
      }
    }

    if (i > 3 && i % 3 == 0) {
      console.log(data[i], i);
      const sevenSlideText = body[i].name.split("&&")[0];
      slide.addText(sevenSlideText, {
        x: "10%",
        y: "10%",
        fontSize: 25,
        h: "20%",
        w: "50%",
        bold: true,
        color: "FFFFFF",
      });

      const titleOne = slideData.content[0].title;
      const titleTwo = slideData.content[1].title;
      const titleThree = slideData.content[2].title;

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/card.png",
        x: "15%",
        y: "35%",
        w: "35%",
        h: "20%",
      });

      slide.addText(titleOne, {
        x: "17%",
        y: "36%",
        w: "35%",
        h: "20%",
        fontSize: 12,
        color: "000000",
      });

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/card.png",
        x: "55%",
        y: "35%",
        w: "35%",
        h: "20%",
      });

      slide.addText(titleTwo, {
        x: "57%",
        y: "36%",
        w: "35%",
        h: "20%",
        fontSize: 12,
        color: "000000",
      });

      slide.addImage({
        path: "https://s3.timeweb.cloud/729e17de-andasoft-buckets/magicslide/icons/card.png",
        x: "35%",
        y: "60%",
        w: "35%",
        h: "20%",
      });

      slide.addText(titleThree, {
        x: "37%",
        y: "61%",
        w: "35%",
        h: "20%",
        fontSize: 12,
        color: "000000",
      });
    }
  }

  const thankYouSlide = pres.addSlide("MASTER_SLIDE");

  thankYouSlide.addText("Thank You", {
    fontSize: 70,
    color: "ffffff",
    x: "15%",
    y: "15%",
    h: "40%",
    w: "60%",
  });

  await pres.writeFile({
    fileName: paths,
  });
};

let test = async () => {
  console.log("test");
  const chat = await prisma.chat.findFirst({
    where: {
      id: "29d7bb27-1c17-480e-be8d-6889bccb745d",
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

  // const slide = await createSlideWithAnimationDarkMode(data, "uz");

  const slide = await createSlideEducationTemplate(data);
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
