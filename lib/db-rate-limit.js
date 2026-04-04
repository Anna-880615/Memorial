/**
 * 数据库限速器（替代内存中的 Map，跨 serverless 实例有效）
 * 调用 Postgres 函数 check_and_log_rate_limit() 实现原子限速
 */

/**
 * 检查是否允许请求（基于数据库的限速）
 * @param {object} supabase - Supabase 客户端
 * @param {string} userIp - 用户 IP 地址
 * @param {string} endpoint - 接口标识（如 'messages'）
 * @param {number} maxRequests - 时间窗口内最大请求数
 * @param {number} windowSeconds - 时间窗口（秒）
 * @returns {{ allowed: boolean, retryAfter: number }}
 */
export async function checkDbRateLimit(
  supabase,
  userIp,
  endpoint,
  maxRequests,
  windowSeconds,
) {
  try {
    const { data: allowed, error } = await supabase.rpc(
      "check_and_log_rate_limit",
      {
        p_user_ip: userIp,
        p_endpoint: endpoint,
        p_max_requests: maxRequests,
        p_window_seconds: windowSeconds,
      },
    );

    if (error) {
      // 失败时放行，不因限速故障阻止用户
      console.warn("Rate limit check failed:", error.message);
      return { allowed: true, retryAfter: 0 };
    }

    return { allowed, retryAfter: allowed ? 0 : windowSeconds };
  } catch (err) {
    console.warn("Rate limit error:", err.message);
    return { allowed: true, retryAfter: 0 };
  }
}
