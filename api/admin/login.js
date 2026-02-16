// 管理员登录API
import { generateAdminToken, verifyAdminPassword } from "../utils/auth.js";
import { setCorsHeaders, checkRateLimit, getClientIp } from "../utils/cors.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, {
    methods: "POST, OPTIONS",
    headers: "Content-Type, Authorization",
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  // 登录限速：每个 IP 每 15 分钟最多 5 次尝试
  const clientIp = getClientIp(req);
  const { allowed, retryAfter } = checkRateLimit(
    `login:${clientIp}`,
    5,
    15 * 60 * 1000,
  );
  if (!allowed) {
    return res.status(429).json({
      success: false,
      error: `登录尝试过于频繁，请 ${retryAfter} 秒后重试`,
    });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: "请输入密码",
      });
    }

    // 验证密码
    if (!verifyAdminPassword(password)) {
      return res.status(401).json({
        success: false,
        error: "密码错误",
      });
    }

    // 生成token
    const token = generateAdminToken(password);

    if (!token) {
      return res.status(500).json({
        success: false,
        error: "生成token失败",
      });
    }

    return res.status(200).json({
      success: true,
      token: token,
      message: "登录成功",
    });
  } catch (error) {
    console.error("管理员登录失败:", error.message);
    return res.status(500).json({
      success: false,
      error: "登录失败，请稍后重试",
    });
  }
}
