import { createClient } from '@supabase/supabase-js';
import { validateIpAddress, validateFlowerCount, validateTimezoneOffset } from '../utils/validation.js';

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
  
  // 获取并验证用户 IP 地址（处理 Vercel 等 serverless 环境）
  let userIp = 'unknown';
  if (req.headers['x-forwarded-for']) {
    // x-forwarded-for 可能包含多个 IP（代理链），取第一个
    const rawIp = req.headers['x-forwarded-for'].split(',')[0].trim();
    userIp = validateIpAddress(rawIp) || 'unknown';
  } else if (req.headers['x-real-ip']) {
    userIp = validateIpAddress(req.headers['x-real-ip']) || 'unknown';
  } else if (req.connection?.remoteAddress) {
    userIp = validateIpAddress(req.connection.remoteAddress) || 'unknown';
  } else if (req.socket?.remoteAddress) {
    userIp = validateIpAddress(req.socket.remoteAddress) || 'unknown';
  }
  
  // 如果IP验证失败，使用默认值（但记录警告）
  if (userIp === 'unknown') {
    console.warn('无法获取有效的用户IP地址');
  }
  
  const { count } = req.body;

  try {
    // 验证送花数量
    const validatedCount = validateFlowerCount(count);
    if (!validatedCount) {
      return res.status(400).json({
        success: false,
        message: '送花数量无效，必须是1-21之间的整数'
      });
    }

    // 验证并获取用户时区偏移（前端传递的是 -getTimezoneOffset()）
    const timezoneOffset = validateTimezoneOffset(req.headers['x-timezone-offset']);
    
    if (timezoneOffset === null) {
      return res.status(400).json({
        success: false,
        message: '缺少或无效的时区信息，无法确定日期'
      });
    }

    // 重要：基于用户本地时间计算日期
    // 使用当前UTC时间 + 时区偏移 = 用户本地时间
    const now = new Date();
    const userLocalTime = new Date(now.getTime() + timezoneOffset * 60000);
    const year = userLocalTime.getUTCFullYear();
    const month = String(userLocalTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(userLocalTime.getUTCDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    const maxPerDay = 21;

    // 检查今日已送数量
    // 重要：需要基于用户本地时间查询，而不是简单的 date 字段匹配
    // 因为不同时区的用户可能有不同的"今天"
    const { data: allUserRecords, error: fetchError } = await supabase
      .from('flower_records')
      .select('flower_count, created_at')
      .eq('user_ip', userIp);

    if (fetchError) throw fetchError;

    // 基于用户本地时间计算今日已送数量
    let todayCount = 0;
    if (allUserRecords) {
      todayCount = allUserRecords
        .filter(record => {
          if (!record.created_at) return false;
          // 将UTC时间戳转换为用户本地时间，然后判断日期
          const recordDate = new Date(record.created_at);
          const recordLocalTime = new Date(recordDate.getTime() + timezoneOffset * 60000);
          const recordYear = recordLocalTime.getUTCFullYear();
          const recordMonth = String(recordLocalTime.getUTCMonth() + 1).padStart(2, '0');
          const recordDay = String(recordLocalTime.getUTCDate()).padStart(2, '0');
          const recordDateStr = `${recordYear}-${recordMonth}-${recordDay}`;
          return recordDateStr === today;
        })
        .reduce((sum, r) => sum + r.flower_count, 0);
    }

    if (todayCount + validatedCount > maxPerDay) {
      return res.status(400).json({
        success: false,
        message: `今天最多只能送${maxPerDay}朵花，您还可以送${maxPerDay - todayCount}朵`
      });
    }

    // 插入送花记录
    // date 字段存储基于用户本地时间计算的日期（用于快速查询和统计）
    const { error: insertError } = await supabase
      .from('flower_records')
      .insert([
        {
          user_ip: userIp,
          flower_count: validatedCount, // 使用验证后的数量
          date: today // 基于用户本地时间计算的日期
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
      todayCount: todayCount + validatedCount,
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
