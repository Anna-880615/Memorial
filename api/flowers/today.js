import {
  validateIpAddress,
  validateTimezoneOffset,
} from "../utils/validation.js";
import { setCorsHeaders, getValidatedClientIp } from "../utils/cors.js";
import { getSupabase } from "../utils/supabase.js";
import { getUserLocalDate } from "../utils/date.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, { methods: "GET, OPTIONS" });
  res.setHeader("Cache-Control", "public, max-age=10");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    return res.status(500).json({ success: false, count: 0 });
  }

  const userIp = getValidatedClientIp(req, validateIpAddress);

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

  const today = getUserLocalDate(timezoneOffset);

  try {
    // 在数据库层面按 date 字段过滤，只查询今天该 IP 的记录
    const { data: todayRecords, error } = await supabase
      .from("flower_records")
      .select("flower_count")
      .eq("user_ip", userIp)
      .eq("date", today);

    if (error) throw error;

    const count = todayRecords
      ? todayRecords.reduce((sum, r) => sum + r.flower_count, 0)
      : 0;

    return res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error("获取今日送花数失败:", error.message);
    return res.status(500).json({
      success: false,
      count: 0,
    });
  }
}
