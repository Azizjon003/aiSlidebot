import path from "path";
import PptxGenJS from "pptxgenjs";

function roundReact(): void {
  let pres = new PptxGenJS();
  let slide = pres.addSlide();

  // Doira yaratish
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

  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 3.5,
      fontSize: 14,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

  // Prezentatsiyani saqlash
  pres.writeFile({ fileName: "DoiraShakliVaMatn.pptx" }).then(() => {
    console.log("Prezentatsiya yaratildi va saqlandi.");
  });
}

// Funksiyani chaqirish

// roundReact();

// Kichik doirachalardan tashkil topish

function roundReactSmall(): void {
  let pres = new PptxGenJS();
  let slide = pres.addSlide();

  // Doira yaratish
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

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.3,
      y: 1.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

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

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 5.7,
      y: 1.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

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

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 5.7,
      y: 3.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );

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

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  slide.addText(
    "To'rtburchak ichidagi matn va budnasdnsaldnasldasnldj asndkjasndlj kasndljkasn dkjasndkjlasnd kjasndkjlnas dkjnaskjldnask djasndlkjasndkjlasn  lndkaslndkljasn jkdnaskjld naslkndaskjl ndkjlasndsa",
    {
      x: 0.3,
      y: 3.2,
      w: 4,
      h: 1.5,
      fontSize: 12,

      color: "000000",
      align: "left",
      valign: "top",
    }
  );
  // Prezentatsiyani saqlash
  pres.writeFile({ fileName: "DoiraShakliVaMatnKichik.pptx" }).then(() => {
    console.log("Prezentatsiya yaratildi va saqlandi.");
  });
}

function addSectionSlide(
  pres: PptxGenJS,
  title: string,
  bulletPoints: string[]
): void {
  let slide = pres.addSlide();
  slide.addText(title, {
    x: 0.5,
    y: 0.5,
    w: "90%",
    h: 0.8,
    fontSize: 24,
    color: "000000",
    bold: true,
  });
  bulletPoints.forEach((point, i) => {
    slide.addText(point, {
      x: 0.5,
      y: 1.5 + i * 0.5,
      w: "90%",
      h: 0.5,
      fontSize: 14,
      color: "000000",
      bullet: { type: "number" },
    });
  });
}

function createPedagogyPresentation() {
  let pres = new PptxGenJS();
  let presSlide = pres.addSlide();
  const imagePath = path.join(__dirname, "../../_ (40).jpeg");
  presSlide.addImage({
    path: imagePath,
    x: "60%",
    y: "0%",

    sizing: {
      type: "cover",
      w: "40%",
      h: "100%",
    },
  });

  presSlide.addText("Personal Relationships in Pedagogy", {
    x: "5%",
    y: "25%",
    w: "50%",
    h: "20%",
    fontSize: 24,
    fontFace: "Playfair Display",
    bold: true,
  });

  presSlide.addText("By: John Doe", {
    x: "5%",
    y: "65%",
    w: "50%",
    h: "20%",
    fontSize: 14,
    fontFace: "Playfair Display",
    italic: true,
  });

  // 2 slide

  let two = pres.addSlide();

  two.addText("Business vs Personal Relationships ", {
    x: "15%",
    y: "10%",
    w: "70%",
    h: "20%",
    fontSize: 20,
    fontFace: "Playfair Display",
    bold: true,
  });

  two.addImage({
    path: imagePath,
    x: "10%",
    y: "30%",

    sizing: {
      type: "cover",
      w: "20%",
      h: "20%",
    },
  });

  two.addText("Business Relationships", {
    x: "10%",
    y: "50%",
    w: "20%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  two.addText(
    "Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    {
      x: "10%",
      y: "60%",
      w: "20%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  two.addImage({
    path: imagePath,
    x: "40%",
    y: "30%",

    sizing: {
      type: "cover",
      w: "20%",
      h: "20%",
    },
  });

  two.addText("Business Relationships", {
    x: "40%",
    y: "50%",
    w: "20%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  two.addText(
    "Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    {
      x: "40%",
      y: "60%",
      w: "20%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  two.addImage({
    path: imagePath,
    x: "70%",
    y: "30%",

    sizing: {
      type: "cover",
      w: "20%",
      h: "20%",
    },
  });

  two.addText("Business Relationships", {
    x: "70%",
    y: "50%",
    w: "20%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  two.addText(
    "Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    {
      x: "70%",
      y: "60%",
      w: "20%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  const three = pres.addSlide();

  three.addText("Personal Relationships", {
    x: "15%",
    y: "10%",
    w: "70%",
    h: "20%",
    fontSize: 20,
    fontFace: "Playfair Display",
    bold: true,
  });

  three.addShape(pres.ShapeType.roundRect, {
    x: "10%",
    y: "30%",
    w: "25%",
    h: "40%",
    fill: { color: "008000" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
  });

  three.addText("Personal Relationships", {
    x: "10%",
    y: "35%",
    w: "25%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "10%",
      y: "40%",
      w: "25%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  three.addShape(pres.ShapeType.roundRect, {
    x: "40%",
    y: "30%",
    w: "25%",
    h: "40%",
    fill: { color: "008000" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
  });

  three.addText("Personal Relationships", {
    x: "40%",
    y: "35%",
    w: "25%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "40%",
      y: "40%",
      w: "25%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  three.addShape(pres.ShapeType.roundRect, {
    x: "70%",
    y: "30%",
    w: "25%",
    h: "40%",
    fill: { color: "008000" },
    line: {
      color: "0EC765",
    },
    rectRadius: 0.2, // Doira shaklini belgilash
  });

  three.addText("Personal Relationships", {
    x: "70%",
    y: "35%",
    w: "25%",
    h: "10%",
    fontSize: 12,
    bold: true,
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "70%",
      y: "40%",
      w: "25%",
      h: "15%",
      fontSize: 10,
      bold: false,
    }
  );

  const four = pres.addSlide();

  four.addText("Personal Relationships in Pedagogy", {
    x: "15%",
    y: "10%",
    w: "70%",
    h: "20%",
    fontSize: 20,
    fontFace: "Playfair Display",
    bold: true,
  });

  pres.writeFile({ fileName: "DoiraShakliVaMatnKichik.pptx" }).then(() => {
    console.log("Prezentatsiya yaratildi va saqlandi.");
  });
}

// createPedagogyPresentation();

const createAnimationSlide = async () => {
  const pptx = new PptxGenJS();
  pptx.theme = { bodyFontFace: "Playfair Display" };

  const slide = pptx.addSlide();
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

  slide.addText("Personal Relationships in Pedagogy", {
    x: "45%",
    y: "25%",
    w: "50%",
    h: "20%",
    fontSize: 24,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  slide.addText("By: John Doe", {
    x: "45%",
    y: "55%",
    w: "50%",
    h: "20%",
    fontSize: 14,
    fontFace: "Playfair Display",
    italic: true,
    color: "f0f0f0",
  });

  const two = pptx.addSlide();

  two.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });
  let plans = [
    "1. Business Relationships",
    "2. Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    "3. Business Relationships",

    "4. Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    "5. Business Relationships",
    "6. Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    "7. Business Relationships",

    "8. Business relationships are somewhat formal, with a focus on results, deadlines, and professionalism.",
    "9. Business Relationships",
  ];

  let PlanString = plans.join("\n\n");
  two.addText(PlanString, {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "90%",
    fontSize: 12,
    bold: true,
    color: "f0f0f0",
  });

  const three = pptx.addSlide();

  three.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  three.addText("Personal Relationships", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 16,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "15%",
      w: "90%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
    }
  );

  three.addShape(pptx.ShapeType.roundRect, {
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

  three.addText("Personal Relationships", {
    x: "5%",
    y: "30%",
    w: "90%",
    h: "10%",
    fontSize: 12,
    bold: true,
    color: "f0f0f0",
    align: "left",
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "35%",
      w: "90%",
      h: "15%",
      fontSize: 8,
      italic: true,
      color: "f0f0f0",
      align: "left",
    }
  );

  three.addShape(pptx.ShapeType.roundRect, {
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

  three.addText("Personal Relationships", {
    x: "5%",
    y: "53%",
    w: "90%",
    h: "10%",
    fontSize: 12,
    bold: true,
    color: "f0f0f0",
    align: "left",
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "57%",
      w: "90%",
      h: "15%",
      fontSize: 8,
      italic: true,
      color: "f0f0f0",
      align: "left",
    }
  );

  three.addShape(pptx.ShapeType.roundRect, {
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

  three.addText("Personal Relationships", {
    x: "5%",
    y: "75%",
    w: "90%",
    h: "10%",
    fontSize: 12,
    bold: true,
    color: "f0f0f0",
    align: "left",
  });

  three.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "80%",
      w: "90%",
      h: "15%",
      fontSize: 8,
      italic: true,
      color: "f0f0f0",
      align: "left",
    }
  );

  const four = pptx.addSlide();

  four.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  four.addText("Personal Relationships", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 16,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  four.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "15%",
      w: "90%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
    }
  );

  // four.addShape(pptx.ShapeType.roundRect, {
  //   x: 0.3,
  //   y: 1.2,
  //   w: 4,
  //   h: 1.8,
  //   fill: { color: "ffffff", transparency: 100 },
  //   line: {
  //     color: "ffffff",
  //   },
  //   rectRadius: 0.2, // Doira shaklini belgilash
  //   // Doira shaklini belgilash
  // });
  four.addText(`dsajkdnas dsnajkdnsak dnsajkndjksa`, {
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
  four.addText(`dasnjdsa dsajkdnsak dnsajkdnsja dnjksandjksa`, {
    x: 0.3,
    y: 2,
    w: 4,
    h: 1.5,
    fontSize: 10,
    color: "f0f0f0",
    align: "left",
    valign: "top",
  });
  // four.addShape(pptx.ShapeType.roundRect, {
  //   x: 5.7,
  //   y: 1.2,
  //   w: 4,
  //   h: 1.8,
  //   fill: { color: "ffffff", transparency: 100 },
  //   line: {
  //     color: "ffffff",
  //   },
  //   rectRadius: 0.2, // Doira shaklini belgilash
  //   // Doira shaklini belgilash
  // });
  four.addText(`dsanjkdnas dsanjkdnsajdsa kjdnsakd sadjksa`, {
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
  four.addText(`Content dsajdhsa dsahdusaid dsahuidbiusa dsabiudbsai dasda`, {
    x: 5.7,
    y: 2,
    w: 4,
    h: 1.5,
    fontSize: 10,
    color: "f0f0f0",
    align: "left",
    valign: "top",
  });
  // four.addShape(pptx.ShapeType.roundRect, {
  //   x: 5.7,
  //   y: 3.2,
  //   w: 4,
  //   h: 1.8,
  //   fill: { color: "ffffff", transparency: 100 },
  //   line: {
  //     color: "ffffff",
  //   },
  //   rectRadius: 0.2,
  // });
  four.addText("Doiraning nmadirlarabsdas dsabdjhas das", {
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
  four.addText(`dasjkdnsakjd dnjskadksandsa kjdnsajkdsad skjdnsakjdnsakj`, {
    x: 5.7,
    y: 4,
    w: 4,
    h: 1.5,
    fontSize: 10,

    color: "f0f0f0",
    align: "left",
    valign: "top",
  });
  // four.addShape(pptx.ShapeType.roundRect, {
  //   x: 0.3,
  //   y: 3.2,
  //   w: 4,
  //   h: 1.8,
  //   fill: { color: "ffffff", transparency: 100 },

  //   rectRadius: 0.2, // Doira shaklini belgilash
  //   // Doira shaklini belgilash
  // });

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
  four.addText(`Matnning joylashuvi va o'lchami doirani`, {
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
  four.addText(
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

  let five = pptx.addSlide();
  five.addImage({
    path: path.join(__dirname, "../../image.png"),
    x: 0,
    y: 0,
    w: "100%",
    h: "100%",
  });

  five.addText("Personal Relationships in Pedagogy", {
    x: "5%",
    y: "5%",
    w: "90%",
    h: "10%",
    fontSize: 16,
    fontFace: "Playfair Display",
    bold: true,
    color: "f0f0f0",
  });

  five.addText(`NImadirlar `);
  five.addText(
    "Personal relationships are informal, with a focus on trust, empathy, and mutual respect.",
    {
      x: "5%",
      y: "15%",
      w: "90%",
      h: "10%",
      fontSize: 10,
      italic: true,
      color: "f0f0f0",
    }
  );

  pptx
    .writeFile({ fileName: "Animated_Presentation.pptx" })
    .then((fileName) => {
      console.log(`Created: ${fileName}`);
    });
};

createAnimationSlide();
