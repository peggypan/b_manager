function trim(value) {
  return String(value == null ? '' : value).trim();
}

/**
 * 联系人 + 联系电话 + 微信号（入驻/发布通用）
 * @returns {string} 错误提示，空字符串表示通过
 */
function requireContactFields(fields, options = {}) {
  const contactLabel = options.contactLabel || '联系人';
  const { contact, phone, wechat } = fields;
  if (!trim(contact)) return `请填写${contactLabel}`;
  if (!trim(phone)) return '请填写联系电话';
  if (!trim(wechat)) return '请填写微信号';
  return '';
}

module.exports = {
  trim,
  requireContactFields,
};
