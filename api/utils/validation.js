/**
 * 输入验证和清理工具函数
 * 防止SQL注入、XSS等安全攻击
 */

/**
 * 验证并清理IP地址
 * @param {string} ip - IP地址
 * @returns {string|null} - 清理后的IP地址或null
 */
export function validateIpAddress(ip) {
  if (!ip || typeof ip !== 'string') {
    return null;
  }
  
  // 移除所有非IP地址字符（只允许数字、点、冒号、方括号）
  const cleaned = ip.trim().replace(/[^0-9.:\[\]]/g, '');
  
  // IPv4格式验证：xxx.xxx.xxx.xxx（每个段0-255）
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  // IPv6格式验证（简化版）
  const ipv6Regex = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  
  if (ipv4Regex.test(cleaned)) {
    // 验证IPv4每个段是否在0-255范围内
    const parts = cleaned.split('.');
    if (parts.every(part => {
      const num = parseInt(part, 10);
      return num >= 0 && num <= 255;
    })) {
      return cleaned;
    }
  }
  
  if (ipv6Regex.test(cleaned)) {
    return cleaned;
  }
  
  // 如果都不匹配，返回null
  return null;
}

/**
 * 验证并清理整数
 * @param {any} value - 要验证的值
 * @param {number} min - 最小值（可选）
 * @param {number} max - 最大值（可选）
 * @returns {number|null} - 验证后的整数或null
 */
export function validateInteger(value, min = null, max = null) {
  if (value === null || value === undefined) {
    return null;
  }
  
  // 转换为整数
  const num = parseInt(value, 10);
  
  // 检查是否为有效数字
  if (isNaN(num) || !isFinite(num)) {
    return null;
  }
  
  // 检查范围
  if (min !== null && num < min) {
    return null;
  }
  
  if (max !== null && num > max) {
    return null;
  }
  
  return num;
}

/**
 * 验证并清理日期字符串（YYYY-MM-DD格式）
 * @param {string} dateStr - 日期字符串
 * @returns {string|null} - 验证后的日期字符串或null
 */
export function validateDateString(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') {
    return null;
  }
  
  // 只允许数字和连字符
  const cleaned = dateStr.trim().replace(/[^0-9-]/g, '');
  
  // 验证格式：YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(cleaned)) {
    return null;
  }
  
  // 验证日期是否有效
  const date = new Date(cleaned + 'T00:00:00Z');
  if (isNaN(date.getTime())) {
    return null;
  }
  
  // 确保日期字符串匹配（防止无效日期如 2024-13-45）
  const [year, month, day] = cleaned.split('-').map(Number);
  if (date.getUTCFullYear() !== year ||
      date.getUTCMonth() + 1 !== month ||
      date.getUTCDate() !== day) {
    return null;
  }
  
  return cleaned;
}

/**
 * 验证并清理时区偏移（分钟）
 * @param {any} value - 时区偏移值
 * @returns {number|null} - 验证后的时区偏移或null
 */
export function validateTimezoneOffset(value) {
  // 时区偏移范围：-720 到 720 分钟（-12小时到+12小时）
  return validateInteger(value, -720, 720);
}

/**
 * 验证并清理文本内容
 * @param {string} text - 文本内容
 * @param {number} maxLength - 最大长度
 * @returns {string|null} - 清理后的文本或null
 */
export function validateText(text, maxLength = 10000) {
  if (!text || typeof text !== 'string') {
    return null;
  }
  
  // 移除控制字符（保留换行符和制表符）
  const cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // 检查长度（使用实际字符数）
  const charCount = Array.from(cleaned).length;
  if (charCount === 0 || charCount > maxLength) {
    return null;
  }
  
  return cleaned.trim();
}

/**
 * 验证留言ID
 * @param {any} id - ID值
 * @returns {number|null} - 验证后的ID或null
 */
export function validateMessageId(id) {
  // ID必须是正整数
  return validateInteger(id, 1, Number.MAX_SAFE_INTEGER);
}

/**
 * 验证送花数量
 * @param {any} count - 送花数量
 * @returns {number|null} - 验证后的数量或null
 */
export function validateFlowerCount(count) {
  // 送花数量必须是1-21之间的整数
  return validateInteger(count, 1, 21);
}

/**
 * 验证查询限制数量
 * @param {any} limit - 限制数量
 * @returns {number} - 验证后的限制数量（默认100，最大1000）
 */
export function validateLimit(limit) {
  const num = validateInteger(limit, 1, 1000);
  return num || 100; // 默认100
}

