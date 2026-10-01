/**
 * Date utility helpers for KOBIS daily box office.
 * Box office data is finalized daily after midnight, so only dates up to yesterday are available.
 */

export function formatDateToDash(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function dashToKobisDt(dashDate: string): string {
  return dashDate.replace(/-/g, '');
}

export function kobisDtToDash(kobisDt: string): string {
  if (kobisDt.length === 8) {
    return `${kobisDt.slice(0, 4)}-${kobisDt.slice(4, 6)}-${kobisDt.slice(6, 8)}`;
  }
  return kobisDt;
}

/**
 * Returns yesterday's date in YYYY-MM-DD.
 * Today's box office is not available until the next day, and the user requested:
 * "오늘 이전의 날짜만 선택 가능하도록 해 줘"
 */
export function getYesterdayDash(): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return formatDateToDash(yesterday);
}

/**
 * Returns formatted Korean string, e.g. "2026년 9월 30일 (수)"
 */
export function formatKoreanDate(dashDate: string): string {
  if (!dashDate || dashDate.length !== 10) return dashDate;
  const [year, month, day] = dashDate.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayOfWeekNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayOfWeekNames[dateObj.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

/**
 * Check if the given date string is strictly before today (<= yesterday)
 */
export function isDateSelectable(dashDate: string): boolean {
  const yesterday = getYesterdayDash();
  return dashDate <= yesterday;
}

/**
 * Format Korean Won amounts into human readable units (e.g. 6.2억원, 6,240만원)
 */
export function formatKoreanCurrency(amountStr: string | number): string {
  const num = typeof amountStr === 'string' ? parseInt(amountStr, 10) : amountStr;
  if (isNaN(num)) return '-';
  if (num >= 100000000) {
    const eok = (num / 100000000).toFixed(1);
    return `${eok}억원`;
  }
  if (num >= 10000) {
    const man = Math.floor(num / 10000);
    return `${man.toLocaleString()}만원`;
  }
  return `${num.toLocaleString()}원`;
}

/**
 * Format integer numbers with comma
 */
export function formatNumber(numStr: string | number): string {
  const num = typeof numStr === 'string' ? parseInt(numStr, 10) : numStr;
  if (isNaN(num)) return '0';
  return num.toLocaleString();
}
