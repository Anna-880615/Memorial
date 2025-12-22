import { createClient } from '@supabase/supabase-js';
import { extractAdminToken, verifyAdminToken } from '../utils/auth.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: '服务器配置错误，请检查环境变量'
    });
  }

  // 检查管理员权限
  const adminToken = extractAdminToken(req);
  if (!adminToken || !verifyAdminToken(adminToken)) {
    return res.status(401).json({
      success: false,
      error: '需要管理员权限'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 获取查询参数
    const { date, user_ip, limit = 100 } = req.query;

    let query = supabase
      .from('flower_records')
      .select('*')
      .order('created_at', { ascending: false });

    // 如果指定了日期，过滤日期
    if (date) {
      query = query.eq('date', date);
    }

    // 如果指定了 IP，过滤 IP
    if (user_ip) {
      query = query.eq('user_ip', user_ip);
    }

    // 限制返回数量
    query = query.limit(parseInt(limit));

    const { data, error } = await query;

    if (error) throw error;

    // 按日期和 IP 分组统计
    // 重要：基于 created_at 的真实时间戳计算日期，而不是使用 date 字段
    // 这样可以确保日期和时间戳一致
    const stats = {};
    data.forEach(record => {
      // 从 created_at 计算真实的日期（转换为本地时区）
      let realDate;
      if (record.created_at) {
        const dateObj = new Date(record.created_at);
        // 使用 UTC 时间转换为本地时区的日期
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        realDate = `${year}-${month}-${day}`;
      } else {
        // 如果没有 created_at，使用 date 字段作为后备
        realDate = record.date;
      }
      
      const key = `${realDate}_${record.user_ip}`;
      if (!stats[key]) {
        stats[key] = {
          date: realDate, // 使用基于 created_at 计算的真实日期
          user_ip: record.user_ip,
          total_count: 0,
          records: []
        };
      }
      stats[key].total_count += record.flower_count;
      stats[key].records.push({
        id: record.id,
        flower_count: record.flower_count,
        created_at: record.created_at
      });
    });

    return res.status(200).json({
      success: true,
      records: data,
      stats: Object.values(stats),
      total: data.length
    });
  } catch (error) {
    console.error('获取送花记录失败:', error);
    return res.status(500).json({
      success: false,
      error: '获取送花记录失败'
    });
  }
}

