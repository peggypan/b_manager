/** 会员到期日，与小程序 utils/memberExpire.js 逻辑一致 */

export function normalizeExpireDate(raw?: string | null): string {
  if (!raw || !String(raw).trim()) return '';
  const s = String(raw).trim();
  const full = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (full) return `${full[1]}-${full[2]}-${full[3]}`;
  const monthOnly = s.match(/^(\d{4})-(\d{2})$/);
  if (monthOnly) return `${monthOnly[1]}-${monthOnly[2]}-01`;
  return '';
}

export function formatExpireLabel(raw?: string | null): string {
  const ymd = normalizeExpireDate(raw);
  if (!ymd) return '—';
  const [y, mo, d] = ymd.split('-').map(Number);
  return `${y}年${mo}月${d}日`;
}

export function isExpireDatePast(raw?: string | null): boolean {
  const ymd = normalizeExpireDate(raw);
  if (!ymd) return true;
  const [y, mo, d] = ymd.split('-').map(Number);
  const end = new Date(y, mo - 1, d, 23, 59, 59, 999);
  return Date.now() > end.getTime();
}

export function addYearsExpireDate(wholeYears: number): string {
  const dt = new Date();
  dt.setFullYear(dt.getFullYear() + wholeYears);
  const y = dt.getFullYear();
  const mo = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${mo}-${day}`;
}

export function toExpireDateStorage(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === 'string') return normalizeExpireDate(value) || undefined;
  if (typeof value === 'object' && value !== null && 'format' in value) {
    const formatted = (value as { format: (f: string) => string }).format('YYYY-MM-DD');
    return normalizeExpireDate(formatted) || undefined;
  }
  return undefined;
}
