import PptxGenJS from "pptxgenjs";

class MyPresentation {
  private pptx: PptxGenJS;

  constructor() {
    this.pptx = new PptxGenJS();
    this.pptx.layout = "LAYOUT_WIDE";
  }

  addTitleSlide(title: string, author: string): void {
    let slide = this.pptx.addSlide();
    slide.addText(title, {
      x: 1.0,
      y: 0.5,
      w: 8.0,
      h: 1.5,
      align: "center",
      fontSize: 44,
      color: "363636",
    });
    slide.addText(`Muallif: ${author}`, {
      x: 1.0,
      y: 2.0,
      w: 8.0,
      h: 0.5,
      align: "center",
      fontSize: 24,
      color: "6f6f6f",
    });
    slide.addShape("line", {
      x: 0.0,
      y: 1.6,
      w: "100%",
      line: { color: "DDDDDD", width: 1.5 },
    });
  }

  // ... (other methods) ...

  save(filename: string): Promise<string> {
    return this.pptx.writeFile({ fileName: filename });
  }
}

// Usage
const myPres = new MyPresentation();
myPres.addTitleSlide("KOMPYUTER HAQIDA", "Erali Temirov");
myPres
  .save("Kompyuter_Haqida.pptx")
  .then((fileName) => {
    console.log(`Taqdimot saqlandi: ${fileName}`);
  })
  .catch((error) => {
    console.error("Xatolik yuz berdi:", error);
  });
