// Supabase 客户端单例
import { createClient } from "@supabase/supabase-js";

let supabaseClient = null;

/**
 * 获取 Supabase 客户端实例（单例模式）
 * @returns {{ client: object } | { error: string }} - Supabase 客户端或错误
 */
export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    return { client: null, error: "服务器配置错误，请检查环境变量" };
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, key);
  }

  return { client: supabaseClient, error: null };
}
