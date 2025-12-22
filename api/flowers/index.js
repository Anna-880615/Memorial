import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      message: '服务器配置错误，请检查环境变量'
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
  
  // 调试日志（生产环境可以移除）
  console.log('送花请求 - 用户IP:', userIp, '请求头:', {
    'x-forwarded-for': req.headers['x-forwarded-for'],
    'x-real-ip': req.headers['x-real-ip']
  });
  
  const { count, date } = req.body;

  try {
    // 验证输入
    if (!count || count <= 0) {
      return res.status(400).json({
        success: false,
        message: '送花数量无效'
      });
    }

    // 使用前端传递的日期，如果没有则使用本地时区的日期
    // 注意：Vercel 服务器默认是 UTC 时区，所以如果前端没传日期，我们需要使用固定时区（如中国时区 UTC+8）
    let today;
    if (date) {
        // 使用前端传递的日期（前端已按本地时区计算）
        today = date;
    } else {
        // 如果没有传递日期，使用中国时区（UTC+8）计算日期
        // 这样可以确保按照日历日期（晚上24点）重置
        const now = new Date();
        const chinaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
        const year = chinaTime.getFullYear();
        const month = String(chinaTime.getMonth() + 1).padStart(2, '0');
        const day = String(chinaTime.getDate()).padStart(2, '0');
        today = `${year}-${month}-${day}`;
    }
    const maxPerDay = 21;

    // 检查今日已送数量
    const { data: todayRecords, error: todayError } = await supabase
      .from('flower_records')
      .select('flower_count')
      .eq('date', today)
      .eq('user_ip', userIp);

    if (todayError) throw todayError;

    const todayCount = todayRecords?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    if (todayCount + count > maxPerDay) {
      return res.status(400).json({
        success: false,
        message: `今天最多只能送${maxPerDay}朵花，您还可以送${maxPerDay - todayCount}朵`
      });
    }

    // 插入送花记录
    const { error: insertError } = await supabase
      .from('flower_records')
      .insert([
        {
          user_ip: userIp,
          flower_count: count,
          date: today
        }
      ]);

    if (insertError) throw insertError;

    // 获取更新后的总数
    const { data: totalData, error: totalError } = await supabase
      .from('flower_records')
      .select('flower_count');

    if (totalError) throw totalError;

    const total = totalData?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    return res.status(200).json({
      success: true,
      todayCount: todayCount + count,
      total: total
    });
  } catch (error) {
    console.error('送花失败:', error);
    return res.status(500).json({
      success: false,
      message: '送花失败，请稍后重试'
    });
  }
}
