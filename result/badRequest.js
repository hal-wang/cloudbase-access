const base = require('./base')

module.exports = function (body, headers) {
  return base(400, body, headers)
}
