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

    // 重要：不信任前端传递的日期，而是基于当前时间戳计算日期
    // 这样可以确保 date 字段和 created_at 时间戳的日期一致
    // 使用当前时间戳，转换为用户时区（通过前端传递的时区偏移，如果没有则使用UTC）
    const now = new Date();
    
    // 尝试从请求头获取时区信息（如果前端传递了）
    const timezoneOffset = req.headers['x-timezone-offset'] 
      ? parseInt(req.headers['x-timezone-offset']) 
      : null;
    
    let today;
    if (timezoneOffset !== null) {
      // 使用前端传递的时区偏移计算日期
      const localTime = new Date(now.getTime() + timezoneOffset * 60000);
      const year = localTime.getUTCFullYear();
      const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
      const day = String(localTime.getUTCDate()).padStart(2, '0');
      today = `${year}-${month}-${day}`;
    } else {
      // 如果没有时区信息，使用前端传递的日期作为参考
      // 但我们会基于 created_at 来验证和修正
      if (date) {
        today = date;
      } else {
        // 最后的后备方案：使用 UTC 日期
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0');
        const day = String(now.getUTCDate()).padStart(2, '0');
        today = `${year}-${month}-${day}`;
      }
    }
    
    const maxPerDay = 21;

    // 检查今日已送数量（基于计算的日期）
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

    // 插入送花记录（先不设置 date，让数据库生成 created_at）
    const { data: insertedData, error: insertError } = await supabase
      .from('flower_records')
      .insert([
        {
          user_ip: userIp,
          flower_count: count,
          date: today // 临时使用，稍后会基于 created_at 更新
        }
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // 重要：基于 created_at 的真实时间戳重新计算日期
    // 这样可以确保 date 字段和 created_at 时间戳的日期一致
    if (insertedData && insertedData.created_at) {
      const createdDate = new Date(insertedData.created_at);
      
      // 使用前端传递的时区偏移计算正确的日期
      // getTimezoneOffset() 返回的是 UTC 时间 - 本地时间的差值（分钟）
      // 例如 UTC+8 返回 -480，UTC-5 返回 300
      // 要获取本地时间，需要：UTC时间 - offset
      const timezoneOffset = req.headers['x-timezone-offset'] 
        ? parseInt(req.headers['x-timezone-offset']) 
        : null;
      
      let correctDate;
      if (timezoneOffset !== null) {
        // 使用前端传递的时区偏移
        // 注意：前端传递的是 -getTimezoneOffset()，所以这里直接相加即可
        // createdDate 是 UTC 时间，转换为用户本地时间
        const localTime = new Date(createdDate.getTime() + timezoneOffset * 60000);
        const year = localTime.getUTCFullYear();
        const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
        const day = String(localTime.getUTCDate()).padStart(2, '0');
        correctDate = `${year}-${month}-${day}`;
      } else {
        // 如果没有时区信息，直接使用 created_at 的 UTC 日期
        // 这作为后备方案
        const year = createdDate.getUTCFullYear();
        const month = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(createdDate.getUTCDate()).padStart(2, '0');
        correctDate = `${year}-${month}-${day}`;
      }
      
      // 如果计算的日期和之前的不同，更新 date 字段
      if (correctDate !== today) {
        console.log(`日期修正: ${today} -> ${correctDate} (IP: ${userIp}, 时区偏移: ${timezoneOffset})`);
        const { error: updateError } = await supabase
          .from('flower_records')
          .update({ date: correctDate })
          .eq('id', insertedData.id);
        
        if (updateError) {
          console.error('更新日期失败:', updateError);
          // 不抛出错误，因为记录已经插入成功
        } else {
          today = correctDate; // 更新 today 变量，用于后续返回
        }
      }
    }

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
