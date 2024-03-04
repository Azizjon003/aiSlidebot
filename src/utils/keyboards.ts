import { Markup } from "telegraf";

export const keyboards = (arr: any[]) => {
  let keyboard = Markup.keyboard(arr)
    .resize()
    .oneTime()
    .placeholder("Filialni tanlang");

  return keyboard;
};

export function createInlineKeyboard(buttons: any[]) {
  return Markup.inlineKeyboard(
    buttons.map((button) =>
      Markup.button.callback(button.text, button.callbackData)
    )
  );
}

export function chunkArrayInline(array: any[], chunkSize: number) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
