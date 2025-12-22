import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      count: 0
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // 获取用户 IP 地址（处理 Vercel 等 serverless 环境）
  let userIp = 'unknown';
  if (req.headers['x-forwarded-for']) {
    // x-forwarded-for 可能包含多个 IP（代理链），取第一个
    userIp = req.headers['x-forwarded-for'].split(',')[0].trim();
  } else if (req.headers['x-real-ip']) {
    userIp = req.headers['x-real-ip'];
  } else if (req.connection?.remoteAddress) {
    userIp = req.connection.remoteAddress;
  } else if (req.socket?.remoteAddress) {
    userIp = req.socket.remoteAddress;
  }
  
  // 优先使用前端传递的日期（查询参数），如果没有则使用中国时区计算
  let today;
  if (req.query && req.query.date) {
    // 使用前端传递的日期（前端已按本地时区计算）
    today = req.query.date;
  } else {
    // 使用中国时区（UTC+8）计算日期，确保按照日历日期重置
    const now = new Date();
    const chinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
    const year = chinaTime.getFullYear();
    const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
    const day = String(chinaTime.getDate()).padStart(2, '0');
    today = `${year}-${month}-${day}`;
  }

  try {
    const { data, error } = await supabase
      .from('flower_records')
      .select('flower_count')
      .eq('date', today)
      .eq('user_ip', userIp);

    if (error) throw error;

    const count = data?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    return res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('获取今日送花数失败:', error);
    return res.status(500).json({
      success: false,
      count: 0
    });
  }
}
