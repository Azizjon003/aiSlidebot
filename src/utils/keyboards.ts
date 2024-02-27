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
