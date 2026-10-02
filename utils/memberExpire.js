/**
 * 会员到期日（与后台 admin 一致）
 * 存库 / 本地：YYYY-MM-DD；展示：2026年12月1日
 * 兼容历史 YYYY-MM（按该月 1 日存盘）
 */

function normalizeExpireDate(raw) {
  if (!raw || !String(raw).trim()) return '';
  const s = String(raw).trim();
  const full = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;
  const monthOnly = s.match(/^(\d{4})-(\d{2})$/);
  if (monthOnly) return `${monthOnly[1]}-${monthOnly[2]}-01`;
  return '';
}

function formatExpireLabel(raw) {
  const ymd = normalizeExpireDate(raw);
  if (!ymd) return '';
  const parts = ymd.split('-').map(Number);
  return `${parts[0]}年${parts[1]}月${parts[2]}日`;
}

/** 到期日当天 23:59:59 之后视为过期 */
function isExpireDatePast(raw) {
  const ymd = normalizeExpireDate(raw);
  if (!ymd) return true;
  const parts = ymd.split('-').map(Number);
  const end = new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59, 999);
  return Date.now() > end.getTime();
}

/** 从今天起增加 wholeYears 年，返回 YYYY-MM-DD */
function addYearsExpireDate(wholeYears) {
  const d = new Date();
  d.setFullYear(d.getFullYear() + wholeYears);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

module.exports = {
  normalizeExpireDate,
  formatExpireLabel,
  isExpireDatePast,
  addYearsExpireDate,
};
