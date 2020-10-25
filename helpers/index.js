const modules = ["dbHelper"];

const result = {};
modules.forEach((module) => {
  result[module] = require(`./${module}`);
});

module.exports = result;
