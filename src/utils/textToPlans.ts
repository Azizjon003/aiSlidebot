const natural = require("natural");

export function rejalarniAjratibOlish(matn: String) {
  // Rejalarni ajratib olish
  const planTokenizer = new natural.RegexpTokenizer({ pattern: /\d+\.\s/ });
  const plans = planTokenizer.tokenize(matn);

  return plans;
}

export function plansInsert(text: string) {
  // Regex pattern to match the outline format.
  // This pattern looks for a line starting with a number followed by a dot and space,
  // then any text until the end of the line, then the translated title in the next line.
  let texts = String(text);
  const parseOutline = (text: string) => {
    const regex = /^(\d+)\.\s(.+?)\n\s*\1\.1\.\s(.+)$/gm;
    let outlines = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      outlines.push({
        section: match[1],
        uzTitle: match[2].trim(),
        enTitle: match[3].trim(),
      });
    }

    return outlines;
  };

  const outlines = parseOutline(texts.trim());
  return outlines;
}

export function JsonToPlans(object: any) {
  let plans = object.map();
}
