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
  
  const today = new Date().toISOString().split('T')[0];

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
