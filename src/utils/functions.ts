export const addInlineKeyboard = (arr: any[]) => {
  let left = [];

  for (let i = 0; i < arr.length; i += 2) {
    let arrcha = [];
    let arrcha2 = [];
    let arrcha3 = [];
    if (arr[i].name.length > 25) {
      arrcha2.push({
        text: arr[i].name,
        callback_data: arr[i].id,
      });
    } else {
      arrcha.push({
        text: arr[i].name,
        callback_data: arr[i].id,
      });
    }

    if (i + 1 < arr.length) {
      if (arr[i + 1].name.length > 25) {
        arrcha3.push({
          text: arr[i + 1].name,
          callback_data: arr[i + 1].id,
        });
      } else {
        arrcha.push({
          text: arr[i + 1].name,
          callback_data: arr[i + 1].id,
        });
      }
    }

    left.push(arrcha);
    left.push(arrcha2);
    left.push(arrcha3);
  }

  return left;
};
