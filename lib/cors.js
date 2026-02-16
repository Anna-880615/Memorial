// CORS 和限速工具函数

const ALLOWED_ORIGINS = ["https://menglong.org", "https://www.menglong.org"];

// 开发环境额外允许的来源
if (
  process.env.NODE_ENV !== "production" ||
  process.env.VERCEL_ENV === "development"
) {
  ALLOWED_ORIGINS.push(
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
  );
}

/**
 * 设置 CORS 头（限制允许的来源）
 * @param {object} req - 请求对象
 * @param {object} res - 响应对象
 * @param {object} options - 配置选项
 * @param {string} options.methods - 允许的 HTTP 方法
 * @param {string} options.headers - 允许的请求头
 */
export function setCorsHeaders(req, res, options = {}) {
  const origin = req.headers.origin;
  const methods = options.methods || "GET, POST, OPTIONS";
  const headers = options.headers || "Content-Type";

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }

  res.setHeader("Access-Control-Allow-Methods", methods);
  res.setHeader("Access-Control-Allow-Headers", headers);
}

// 内存中的限速记录（Vercel serverless 函数实例间不共享，但同一实例内有效）
const rateLimitStore = new Map();

// 定期清理过期记录，防止内存泄漏
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries(windowMs) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now - entry.startTime > windowMs * 2) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * 简单的内存限速器
 * @param {string} key - 限速键（如 IP 地址 + 端点）
 * @param {number} maxRequests - 时间窗口内最大请求数
 * @param {number} windowMs - 时间窗口（毫秒）
 * @returns {{ allowed: boolean, remaining: number, retryAfter: number }}
 */
export function checkRateLimit(key, maxRequests, windowMs) {
  cleanupExpiredEntries(windowMs);

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now - entry.startTime > windowMs) {
    rateLimitStore.set(key, { count: 1, startTime: now });
    return { allowed: true, remaining: maxRequests - 1, retryAfter: 0 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    const retryAfter = Math.ceil((entry.startTime + windowMs - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  return { allowed: true, remaining: maxRequests - entry.count, retryAfter: 0 };
}

/**
 * 获取客户端原始 IP（优先使用 Vercel 可信头）
 * @param {object} req - 请求对象
 * @returns {string} - IP 地址
 */
export function getClientIp(req) {
  if (req.headers["x-vercel-forwarded-for"]) {
    return req.headers["x-vercel-forwarded-for"].split(",")[0].trim();
  }
  if (req.headers["x-forwarded-for"]) {
    return req.headers["x-forwarded-for"].split(",")[0].trim();
  }
  if (req.headers["x-real-ip"]) {
    return req.headers["x-real-ip"];
  }
  return (
    req.connection?.remoteAddress || req.socket?.remoteAddress || "unknown"
  );
}

/**
 * 获取经过验证的客户端 IP（带格式校验）
 * @param {object} req - 请求对象
 * @param {function} validateIpAddress - IP 验证函数
 * @returns {string} - 验证后的 IP 地址，验证失败返回 'unknown'
 */
export function getValidatedClientIp(req, validateIpAddress) {
  const rawIp = getClientIp(req);
  return validateIpAddress(rawIp) || "unknown";
}
