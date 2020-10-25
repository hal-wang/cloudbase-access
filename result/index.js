const modules = [
  "accepted",
  "badRequest",
  "base",
  "errRequest",
  "forbidden",
  "noContent",
  "notFound",
  "ok",
  "partialContent",
];

const result = {};
modules.forEach((module) => {
  result[module] = require(`./${module}`);
});

module.exports = result;
