const base = require('./base')

module.exports = function (body, headers) {
  return base(206, body, headers)
}
