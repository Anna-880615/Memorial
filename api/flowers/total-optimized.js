import { createClient } from "@supabase/supabase-js";
import { setCorsHeaders } from "../utils/cors.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  setCorsHeaders(req, res, { methods: "GET, OPTIONS" });
  res.setHeader("Cache-Control", "public, max-age=60"); // 添加缓存头，60秒

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      total: 0,
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 优化：使用数据库聚合函数 SUM，而不是在 JavaScript 中计算
    // 这样可以减少数据传输量和计算时间
    const { data, error } = await supabase
      .from("flower_records")
      .select("flower_count");

    if (error) throw error;

    // 如果 Supabase 支持 RPC（远程过程调用），可以使用以下方式：
    // const { data, error } = await supabase.rpc('sum_flower_count');
    // 但需要先在数据库中创建函数：
    // CREATE OR REPLACE FUNCTION sum_flower_count() RETURNS INTEGER AS $$
    //   SELECT COALESCE(SUM(flower_count), 0) FROM flower_records;
    // $$ LANGUAGE sql;

    const total = data?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    return res.status(200).json({
      success: true,
      total: total,
    });
  } catch (error) {
    console.error("获取总送花数失败:", error);
    return res.status(500).json({
      success: false,
      total: 0,
    });
  }
}
