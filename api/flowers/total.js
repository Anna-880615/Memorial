import { setCorsHeaders } from "../../lib/cors.js";
import { getSupabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  setCorsHeaders(req, res, { methods: "GET, OPTIONS" });

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { client: supabase, error: configError } = getSupabase();
  if (configError) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({ success: false, total: 0 });
  }

  try {
    const { data, error } = await supabase
      .from("flower_totals")
      .select("total")
      .eq("id", 1)
      .single();

    if (error) throw error;

    const total = data?.total || 0;

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=30, stale-while-revalidate=60",
    );
    return res.status(200).json({
      success: true,
      total: total,
    });
  } catch (error) {
    console.error("获取总送花数失败:", error.message);
    res.setHeader("Cache-Control", "no-store");
    return res.status(500).json({
      success: false,
      total: 0,
    });
  }
}
