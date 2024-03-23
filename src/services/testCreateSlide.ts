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
  const slide = pptx.addSlide();

  // Matn blokiga animatsiya qo'shish
  const textboxOpts: any = { x: 1, y: 1, w: 8, h: 2, fill: "F1F1F1" };
  const textOpts = { color: "363636", align: pptx.AlignH.center };

  // Animatsiya parametrlari
  const animOpts = {
    animStart: "click", // Animatsiya boshlanishi: click, withPrev, afterPrev
    anim: "fade", // Animatsiya turi: fade, zoom, none
    animDuration: 1, // Animatsiya davomiyligi (soniyada)
    animDelay: 0, // Animatsiya kechiktirishi (soniyada)
  };

  // Matn blokini va unga animatsiya qo'shish

  slide.addText("Hello, World!", textboxOpts); // Animatsiyani qo'shish

  // Prezentatsiyani saqlash
  pptx
    .writeFile({ fileName: "Animated_Presentation.pptx" })
    .then((fileName) => {
      console.log(`Created: ${fileName}`);
    });
};

createAnimationSlide();
