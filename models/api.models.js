const fs = require("fs/promises");

exports.readEndpoints = () => {
  return fs.readFile("./endpoints.json", "utf8").then((endpoints) => {
    console.log(endpoints);
    return JSON.parse(endpoints);
  });
};
