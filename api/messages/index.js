import { extractAdminToken, verifyAdminToken } from "../../lib/auth.js";
import { validateText } from "../../lib/validation.js";
import { setCorsHeaders, getClientIp } from "../../lib/cors.js";
import { checkDbRateLimit } from "../../lib/db-rate-limit.js";
import { getSupabase } from "../../lib/supabase.js";

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

      let query = supabase.from("messages").select("*", { count: "exact" });

      // 如果不是管理员，只返回已审核的留言
      if (!isAdmin) {
        query = query.eq("status", "approved");
      }

      query = query.order("timestamp", { ascending: false });

      if (isAdmin) {
        // 管理员：不分页，返回全部（上限1000），不缓存
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

        const { data, error, count: totalCount } = await query.limit(1000);
        if (error) throw error;

        return res.status(200).json({
          success: true,
          messages: data || [],
          hasMore: false,
          total: totalCount || 0,
        });
      } else {
        // 公开访客：分页（默认50条），CDN缓存
        const page = Math.max(0, parseInt(req.query.page || "0", 10));
        const limit = Math.min(100, parseInt(req.query.limit || "50", 10));
        const from = page * limit;
        const to = from + limit - 1;

        const { data, error, count: totalCount } = await query.range(from, to);
        if (error) throw error;

        const hasMore = (totalCount || 0) > to + 1;

        res.setHeader(
          "Cache-Control",
          "public, s-maxage=20, stale-while-revalidate=40",
        );
        res.setHeader("Vary", "Authorization");

        return res.status(200).json({
          success: true,
          messages: data || [],
          hasMore,
          total: totalCount || 0,
        });
      }
    } catch (error) {
      console.error("获取留言失败:", error);
      res.setHeader("Cache-Control", "no-store");
      return res.status(500).json({
        success: false,
        error: "获取留言失败",
      });
    }
  }

  if (req.method === "POST") {
    // 留言限速：每个 IP 每小时最多 10 条（数据库限速，跨实例有效）
    const clientIp = getClientIp(req);
    const { allowed, retryAfter } = await checkDbRateLimit(
      supabase,
      clientIp,
      "messages",
      10,
      3600,
    );
    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: `提交过于频繁，请 ${retryAfter} 秒后重试`,
      });
    }

    // 提交新留言
    try {
      const { text } = req.body;

      // 验证并清理留言内容
      const validatedText = validateText(text, 1000);
      if (!validatedText) {
        return res.status(400).json({
          success: false,
          error: "留言内容无效或过长（最多1000字）",
        });
      }

      // 使用服务器时间，不信任客户端时钟
      const validatedTimestamp = Date.now();

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
            text: validatedText,
            timestamp: validatedTimestamp,
            status: "pending",
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
