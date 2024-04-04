export const inlineKeyboardNumbers = (startNumber: number, endNumber: number) => {
    const array = [];
    for (let i = startNumber; i <= endNumber; i++) {
        array.push({
            text: ` ${i} `,
            callback_data: i,
        });
    }
    return array;
}