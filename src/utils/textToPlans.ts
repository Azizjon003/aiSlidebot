const natural = require("natural");

export function rejalarniAjratibOlish(matn: String) {
  // Rejalarni ajratib olish
  const planTokenizer = new natural.RegexpTokenizer({ pattern: /\d+\.\s/ });
  const plans = planTokenizer.tokenize(matn);

  return plans;
}
