import { extractAdminToken, verifyAdminToken } from "../../lib/auth.js";
import { validateDateString, validateIpAddress, validateLimit } from "../../lib/validation.js";
import { setCorsHeaders } from "../../lib/cors.js";
import { getSupabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, {
    methods: "GET, OPTIONS",
    headers: "Content-Type, Authorization",
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    return res.status(500).json({ success: false, error: configError });
  }

  // 检查管理员权限
  const adminToken = extractAdminToken(req);
  if (!adminToken || !verifyAdminToken(adminToken)) {
    return res.status(401).json({
      success: false,
      error: "需要管理员权限",
    });
  }

  try {
    const { date, user_ip, limit } = req.query;

    let query = supabase
      .from("flower_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (date) {
      const validatedDate = validateDateString(date);
      if (!validatedDate) {
        return res.status(400).json({
          success: false,
          error: "日期格式无效，必须是 YYYY-MM-DD 格式",
        });
      }
      query = query.eq("date", validatedDate);
    }

    if (user_ip) {
      const validatedIp = validateIpAddress(user_ip);
      if (!validatedIp) {
        return res.status(400).json({
          success: false,
          error: "IP地址格式无效",
        });
      }
      query = query.eq("user_ip", validatedIp);
    }

    const validatedLimit = validateLimit(limit);
    query = query.limit(validatedLimit);

    const { data, error } = await query;

    if (error) throw error;

    // 按日期和 IP 分组统计
    const stats = {};
    data.forEach((record) => {
      const realDate = record.date || "unknown";
      const key = `${realDate}_${record.user_ip}`;
      if (!stats[key]) {
        stats[key] = {
          date: realDate,
          user_ip: record.user_ip,
          total_count: 0,
          records: [],
        };
      }
      stats[key].total_count += record.flower_count;
      stats[key].records.push({
        id: record.id,
        flower_count: record.flower_count,
        created_at: record.created_at,
      });
    });

    return res.status(200).json({
      success: true,
      records: data,
      stats: Object.values(stats),
      total: data.length,
    });
  } catch (error) {
    console.error("获取送花记录失败:", error.message);
    return res.status(500).json({
      success: false,
      error: "获取送花记录失败",
    });
  }
}
