var gis = require("g-i-s");
gis("Topic : Nature conservation methods", logResults);

function logResults(error: any, results: any) {
  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(results, null, "  "));
  }
}
