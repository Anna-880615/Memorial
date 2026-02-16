import { createClient } from "@supabase/supabase-js";
import {
  validateIpAddress,
  validateTimezoneOffset,
} from "../utils/validation.js";
import { setCorsHeaders } from "../utils/cors.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  setCorsHeaders(req, res, { methods: "GET, OPTIONS" });
  // 添加 HTTP 缓存头：今日送花数需要实时性，缓存10秒
  res.setHeader("Cache-Control", "public, max-age=10");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      count: 0,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 获取并验证用户 IP 地址
  // 优先使用 Vercel 平台设置的可信头（不可被客户端伪造）
  let userIp = "unknown";
  if (req.headers["x-vercel-forwarded-for"]) {
    const rawIp = req.headers["x-vercel-forwarded-for"].split(",")[0].trim();
    userIp = validateIpAddress(rawIp) || "unknown";
  } else if (req.headers["x-forwarded-for"]) {
    const rawIp = req.headers["x-forwarded-for"].split(",")[0].trim();
    userIp = validateIpAddress(rawIp) || "unknown";
  } else if (req.headers["x-real-ip"]) {
    userIp = validateIpAddress(req.headers["x-real-ip"]) || "unknown";
  } else if (req.connection?.remoteAddress) {
    userIp = validateIpAddress(req.connection.remoteAddress) || "unknown";
  } else if (req.socket?.remoteAddress) {
    userIp = validateIpAddress(req.socket.remoteAddress) || "unknown";
  }

  // 获取并验证用户时区偏移
  const rawOffset =
    req.headers["x-timezone-offset"] ||
    (req.query && req.query.timezoneOffset) ||
    null;
  const timezoneOffset = validateTimezoneOffset(rawOffset);

  if (timezoneOffset === null) {
    return res.status(400).json({
      success: false,
      count: 0,
      error: "缺少时区信息",
    });
  }

  // 基于用户本地时间计算今天的日期
  const now = new Date();
  const userLocalTime = new Date(now.getTime() + timezoneOffset * 60000);
  const year = userLocalTime.getUTCFullYear();
  const month = String(userLocalTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(userLocalTime.getUTCDate()).padStart(2, "0");
  const today = `${year}-${month}-${day}`;

  try {
    // 获取该用户的所有记录，然后基于本地时间过滤
    const { data: allRecords, error } = await supabase
      .from("flower_records")
      .select("flower_count, created_at")
      .eq("user_ip", userIp);

    if (error) throw error;

    // 基于用户本地时间计算今日已送数量
    const count = allRecords
      ? allRecords
          .filter((record) => {
            if (!record.created_at) return false;
            // 将UTC时间戳转换为用户本地时间，然后判断日期
            const recordDate = new Date(record.created_at);
            const recordLocalTime = new Date(
              recordDate.getTime() + timezoneOffset * 60000,
            );
            const recordYear = recordLocalTime.getUTCFullYear();
            const recordMonth = String(
              recordLocalTime.getUTCMonth() + 1,
            ).padStart(2, "0");
            const recordDay = String(recordLocalTime.getUTCDate()).padStart(
              2,
              "0",
            );
            const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`;
            return recordDateStr === today;
          })
          .reduce((sum, r) => sum + r.flower_count, 0)
      : 0;

    return res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error("获取今日送花数失败:", error);
    return res.status(500).json({
      success: false,
      count: 0,
    });
  }
}
