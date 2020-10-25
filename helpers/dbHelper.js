const getResBadContent = function (res) {
  if (res.code) return `${res.code}, ${res.message}`;
  else return;
};
module.exports.getResBadContent = getResBadContent;

// cloudbase 访问数据库，如果报错则 throw 错误字符串
const throwResBadContent = function (res) {
  const resBadContent = getResBadContent(res);
  if (resBadContent) throw new Error(resBadContent);
};
module.exports.throwResBadContent = throwResBadContent;

module.exports.getField = async function (db, col, doc, field) {
  const fieldObj = {};
  fieldObj[field] = true;

  const res = await db.collection(col).doc(doc).field(fieldObj).get();
  throwResBadContent(res);
  if (!res.data || res.data.length <= 0 || !res.data[0][field]) return [];
  return res.data[0][field];
};

module.exports.updateField = async function (db, col, doc, field, value) {
  const fieldObj = {};
  fieldObj[field] = value;

  const res = await db.collection(col).doc(doc).update(fieldObj);
  throwResBadContent(res);
  return res.updated;
};
