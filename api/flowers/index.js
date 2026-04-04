import {
  validateIpAddress,
  validateFlowerCount,
  validateTimezoneOffset,
} from "../../lib/validation.js";
import { setCorsHeaders, getValidatedClientIp } from "../../lib/cors.js";
import { getSupabase } from "../../lib/supabase.js";
import { getUserLocalDate } from "../../lib/date.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, {
    methods: "POST, OPTIONS",
    headers: "Content-Type",
  });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    return res.status(500).json({ success: false, error: configError });
  }

  const userIp = getValidatedClientIp(req, validateIpAddress);
  if (userIp === "unknown") {
    console.warn("无法获取有效的用户IP地址");
  }

  if (!req.body) {
    return res.status(400).json({ success: false, error: "请求体不能为空" });
  }

  const { count } = req.body;

  try {
    const validatedCount = validateFlowerCount(count);
    if (!validatedCount) {
      return res.status(400).json({
        success: false,
        message: "送花数量无效，必须是1-21之间的整数",
      });
    }

    const timezoneOffset = validateTimezoneOffset(
      req.headers["x-timezone-offset"],
    );
    if (timezoneOffset === null) {
      return res.status(400).json({
        success: false,
        message: "缺少或无效的时区信息，无法确定日期",
      });
    }

    const today = getUserLocalDate(timezoneOffset);
    const maxPerDay = 21;

    // 在数据库层面按 date 字段过滤，只查询今天该 IP 的记录
    const { data: todayRecords, error: fetchError } = await supabase
      .from("flower_records")
      .select("flower_count")
      .eq("user_ip", userIp)
      .eq("date", today);

    if (fetchError) throw fetchError;

    const todayCount = todayRecords
      ? todayRecords.reduce((sum, r) => sum + r.flower_count, 0)
      : 0;

    if (todayCount + validatedCount > maxPerDay) {
      return res.status(400).json({
        success: false,
        message: `今天最多只能送${maxPerDay}朵花，您还可以送${maxPerDay - todayCount}朵`,
      });
    }

    // 插入送花记录
    const { error: insertError } = await supabase
      .from("flower_records")
      .insert([
        {
          user_ip: userIp,
          flower_count: validatedCount,
          date: today,
        },
      ]);

    if (insertError) throw insertError;

    // 原子递增送花总数（替代全表扫描）
    const { data: newTotal, error: updateError } = await supabase.rpc(
      "increment_flower_total",
      { amount: validatedCount },
    );

    if (updateError) {
      console.error("Failed to increment flower total:", updateError.message);
    }
    const total = newTotal ?? 0;

    return res.status(200).json({
      success: true,
      todayCount: todayCount + validatedCount,
      total: total,
    });
  } catch (error) {
    console.error("送花失败:", error.message);
    return res.status(500).json({
      success: false,
      message: "送花失败，请稍后重试",
    });
  }
}
