const base = require('./base')

module.exports = function (body, headers) {
  return base(403, body, headers)
}
