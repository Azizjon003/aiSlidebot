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

  // Doira ichiga matn qo'shish
  // E'tibor bering: Matnning joylashuvi va o'lchami doirani hisobga olgan holda moslashtirilgan
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
