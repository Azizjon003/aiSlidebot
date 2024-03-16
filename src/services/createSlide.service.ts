import PptxGenJS from "pptxgenjs";

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
    slide.addText(body[i].name, {
      x: 1,
      y: 1,
      fontSize: 24,
      color: "363636",
    });
    slide.addText(body[i].content, { x: 1, y: 3, fontSize: 14 });
  }
  let datas = await pres.writeFile({ fileName: path });

  // return datas;
}

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
