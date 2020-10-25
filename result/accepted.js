const base = require('./base')

module.exports = function (body, headers) {
  return base(202, body, headers)
}
