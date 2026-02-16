// 管理员认证工具函数
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * 获取用于签名 token 的密钥
 * 优先使用 TOKEN_SECRET 环境变量，否则基于 ADMIN_PASSWORD 派生
 */
function getTokenSecret() {
  return process.env.TOKEN_SECRET || process.env.ADMIN_PASSWORD || "";
}

/**
 * 验证管理员密码（防时序攻击）
 * @param {string} password - 用户输入的密码
 * @returns {boolean} - 密码是否正确
 */
export function verifyAdminPassword(password) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error("ADMIN_PASSWORD 环境变量未设置");
    return false;
  }

  if (!password || typeof password !== "string") {
    return false;
  }

  // 使用 timingSafeEqual 防止时序攻击
  const inputBuf = Buffer.from(password.padEnd(256, "\0"));
  const correctBuf = Buffer.from(adminPassword.padEnd(256, "\0"));
  return (
    inputBuf.length === correctBuf.length &&
    timingSafeEqual(inputBuf, correctBuf)
  );
}

/**
 * 生成 HMAC 签名的管理员 token
 * @param {string} password - 管理员密码
 * @returns {string|null} - 签名的 token 或 null
 */
export function generateAdminToken(password) {
  if (!verifyAdminPassword(password)) {
    return null;
  }

  const secret = getTokenSecret();
  const timestamp = Date.now().toString();
  const random = randomBytes(32).toString("hex");
  const payload = `${timestamp}.${random}`;

  // 使用 HMAC-SHA256 签名
  const signature = createHmac("sha256", secret).update(payload).digest("hex");

  // token 格式: base64(payload.signature)
  return Buffer.from(`${payload}.${signature}`).toString("base64");
}

/**
 * 验证管理员 token（验证签名 + 过期时间）
 * @param {string} token - 要验证的 token
 * @returns {boolean} - token 是否有效
 */
export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return false;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(".");

    // 格式: timestamp.random.signature
    if (parts.length !== 3) {
      return false;
    }

    const [timestamp, random, providedSignature] = parts;
    const payload = `${timestamp}.${random}`;

    // 重新计算签名并比较
    const secret = getTokenSecret();
    const expectedSignature = createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    // 使用 timingSafeEqual 比较签名
    const sigBuf = Buffer.from(providedSignature, "utf-8");
    const expectedBuf = Buffer.from(expectedSignature, "utf-8");
    if (
      sigBuf.length !== expectedBuf.length ||
      !timingSafeEqual(sigBuf, expectedBuf)
    ) {
      return false;
    }

    // 检查 token 是否过期（24小时）
    const tokenTime = parseInt(timestamp, 10);
    if (isNaN(tokenTime)) return false;

    const maxAge = 24 * 60 * 60 * 1000;
    return Date.now() - tokenTime < maxAge;
  } catch (error) {
    return false;
  }
}

/**
 * 从请求中提取管理员 token（仅从 Authorization header 和请求体）
 * @param {object} req - 请求对象
 * @returns {string|null} - token 或 null
 */
export function extractAdminToken(req) {
  // 从 Authorization header 获取
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // 从请求体获取
  if (req.body && req.body.adminToken) {
    return req.body.adminToken;
  }

  return null;
}

/**
 * 中间件：验证管理员权限
 * @param {object} req - 请求对象
 * @param {object} res - 响应对象
 * @param {function} next - 下一个中间件
 */
export function requireAdmin(req, res, next) {
  const token = extractAdminToken(req);

  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({
      success: false,
      error: "需要管理员权限",
    });
  }

  req.isAdmin = true;
  next();
}
