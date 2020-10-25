const base = require('./base')

module.exports = function (body, headers) {
  return base(404, body, headers)
}
