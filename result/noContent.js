const base = require('./base')

module.exports = function (body, headers) {
  return base(204, body, headers)
}
