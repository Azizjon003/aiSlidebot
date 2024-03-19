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

  // Slayd 1: Personal Relationships in Pedagogy
  addSectionSlide(pres, "Personal Relationships in Pedagogy", [
    "In pedagogy personal relationships can be divided into two categories: official and unofficial.",
    "Both are important for the development of children and adults alike.",
  ]);

  // Slayd 2: Business vs Personal Relationships
  addSectionSlide(pres, "Business vs Personal Relationships", [
    "Business relationships are somewhat formal with a focus on results, deadlines, and professionalism.",
    "Personal relationships are more casual and allow for a deeper understanding and connection with students and colleagues.",
  ]);

  // Slayd 3: Rational vs Emotional Relationships
  addSectionSlide(pres, "Rational vs Emotional Relationships", [
    "Rational relationships are based on logic, reason, and mutual benefit.",
    "Emotional relationships are based on empathy, understanding, and feelings.",
  ]);

  // Qolgan slaydlarni shu tarzda qo'shing...

  // Prezentatsiyani saqlash
  pres
    .writeFile({ fileName: "Personal-Relationships-in-Pedagogy.pptx" })
    .then(() => {
      console.log("Prezentatsiya yaratildi va saqlandi.");
    });
}

createPedagogyPresentation();
