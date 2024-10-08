import path from "path";
import PptxGenJS from "pptxgenjs";
import prisma from "../../prisma/prisma";

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

  pres.writeFile({
    fileName: paths,
  });
};

let test = async () => {
  console.log("test");
  const chat = await prisma.chat.findFirst({
    where: {
      id: "f776cbff-5a59-4b66-bede-64f84741d7b3",
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
