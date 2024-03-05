const natural = require("natural");

export function rejalarniAjratibOlish(matn: String) {
  // Rejalarni ajratib olish
  const rejaTokenizer = new natural.RegexpTokenizer({ pattern: /\d+\.\s/ });
  const rejalar = rejaTokenizer.tokenize(matn);

  return rejalar;
}
