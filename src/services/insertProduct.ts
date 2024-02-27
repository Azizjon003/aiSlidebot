import path from "path";
import excelJs from "exceljs";
import prisma from "../../prisma/prisma";

const insertProduct = async () => {
  try {
    const url = path.join(__dirname, "../../data/products.xlsx");
    const workbook = new excelJs.Workbook();
    await workbook.xlsx.readFile(url);

    const worksheet = await workbook.getWorksheet(1);
    let row = worksheet?.getRow(1);
    let data: any = [];

    worksheet?.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        // 1 - header satrni o'qimaymiz
        let rowData: any = [];
        row.eachCell((cell) => {
          rowData.push(cell.value);
        });
        data.push(rowData);
      }
      // console.log(data);
    });

    for (let i = 0; i < data.length; i++) {
      let product = data[i][0];
      const produtcs = await prisma.product.create({
        data: {
          name: product,
          description: data[i][0],
          price: 0,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// insertProduct();

const updateproduct = async () => {
  let data = await prisma.product.updateMany({
    where: {},
    data: {
      created_at: new Date(),
      updated_at: new Date(),
    },
  });
  console.log(data);
};

updateproduct();
