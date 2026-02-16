import { extractAdminToken, verifyAdminToken } from "../utils/auth.js";
import { validateText, validateInteger } from "../utils/validation.js";
import { setCorsHeaders, checkRateLimit, getClientIp } from "../utils/cors.js";
import { getSupabase } from "../utils/supabase.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, {
    methods: "GET, POST, OPTIONS",
    headers: "Content-Type, Authorization",
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    return res.status(500).json({ success: false, error: configError });
  }

  if (req.method === "GET") {
    // 获取留言列表
    try {
      // 检查是否是管理员请求（获取所有留言包括pending）
      const adminToken = extractAdminToken(req);
      const isAdmin = adminToken && verifyAdminToken(adminToken);

      // 只有非管理员请求才使用缓存（管理员需要看到最新的待审核留言）
      if (!isAdmin) {
        // 添加 HTTP 缓存头：留言列表缓存20秒
        res.setHeader("Cache-Control", "public, max-age=20");
      } else {
        // 管理员请求不缓存，确保看到最新数据
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      }

      let query = supabase.from("messages").select("*");

      // 如果不是管理员，只返回已审核的留言
      if (!isAdmin) {
        query = query.eq("status", "approved");
      }

      const { data, error } = await query
        .order("timestamp", { ascending: false })
        .limit(1000);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        messages: data || [],
      });
    } catch (error) {
      console.error("获取留言失败:", error);
      return res.status(500).json({
        success: false,
        error: "获取留言失败",
      });
    }
  }

  if (req.method === "POST") {
    // 留言限速：每个 IP 每小时最多 10 条
    const clientIp = getClientIp(req);
    const { allowed, retryAfter } = checkRateLimit(
      `msg:${clientIp}`,
      10,
      60 * 60 * 1000,
    );
    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: `提交过于频繁，请 ${retryAfter} 秒后重试`,
      });
    }

    // 提交新留言
    try {
      const { text, timestamp } = req.body;

      // 验证并清理留言内容
      const validatedText = validateText(text, 1000);
      if (!validatedText) {
        return res.status(400).json({
          success: false,
          error: "留言内容无效或过长（最多1000字）",
        });
      }

      // 验证时间戳（如果提供）
      const validatedTimestamp = timestamp
        ? validateInteger(timestamp, 0, Number.MAX_SAFE_INTEGER)
        : Date.now();
      if (!validatedTimestamp) {
        return res.status(400).json({
          success: false,
          error: "时间戳无效",
        });
      }

      // 简单的敏感词过滤（您可以扩展这个列表）
      const sensitiveWords = []; // 在这里添加敏感词，例如：['敏感词1', '敏感词2']
      const containsSensitive = sensitiveWords.some((word) =>
        text.includes(word),
      );

      if (containsSensitive) {
        return res.status(400).json({
          success: false,
          error: "留言包含不当内容",
        });
      }

      // 插入数据库（使用验证后的数据）
      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            text: validatedText, // 使用验证后的文本
            timestamp: validatedTimestamp, // 使用验证后的时间戳
            status: "pending", // 需要审核
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: data,
      });
    } catch (error) {
      console.error("提交留言失败:", error);
      return res.status(500).json({
        success: false,
        error: "提交留言失败，请稍后重试",
      });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
