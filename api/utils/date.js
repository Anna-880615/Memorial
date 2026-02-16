/**
 * 基于时区偏移计算用户本地日期（YYYY-MM-DD 格式）
 * @param {number} timezoneOffset - 时区偏移（分钟），正值表示 UTC+
 * @returns {string} - YYYY-MM-DD 格式的日期字符串
 */
export function getUserLocalDate(timezoneOffset) {
  const now = new Date();
  const userLocalTime = new Date(now.getTime() + timezoneOffset * 60000);
  const year = userLocalTime.getUTCFullYear();
  const month = String(userLocalTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(userLocalTime.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
