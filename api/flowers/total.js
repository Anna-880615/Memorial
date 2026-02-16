import { setCorsHeaders } from "../utils/cors.js";
import { getSupabase } from "../utils/supabase.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, { methods: "GET, OPTIONS" });
  res.setHeader("Cache-Control", "public, max-age=60");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    return res.status(500).json({ success: false, total: 0 });
  }

  try {
    const { data, error } = await supabase
      .from("flower_records")
      .select("flower_count");

    if (error) throw error;

    const total = data?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    return res.status(200).json({
      success: true,
      total: total,
    });
  } catch (error) {
    console.error("获取总送花数失败:", error.message);
    return res.status(500).json({
      success: false,
      total: 0,
    });
  }
}
