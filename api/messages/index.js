import { createClient } from '@supabase/supabase-js';
import { extractAdminToken, verifyAdminToken } from '../utils/auth.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  // 设置CORS头，允许跨域访问
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      error: '服务器配置错误，请检查环境变量'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  if (req.method === 'GET') {
    // 获取留言列表
    try {
      // 检查是否是管理员请求（获取所有留言包括pending）
      const adminToken = extractAdminToken(req);
      const isAdmin = adminToken && verifyAdminToken(adminToken);
      
      let query = supabase
        .from('messages')
        .select('*');
      
      // 如果不是管理员，只返回已审核的留言
      if (!isAdmin) {
        query = query.eq('status', 'approved');
      }
      
      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(1000);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        messages: data || []
      });
    } catch (error) {
      console.error('获取留言失败:', error);
      return res.status(500).json({
        success: false,
        error: '获取留言失败'
      });
    }
  }

  if (req.method === 'POST') {
    // 提交新留言
    try {
      const { text, timestamp } = req.body;

      // 基础验证
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: '留言内容不能为空'
        });
      }

      if (text.length > 1000) {
        return res.status(400).json({
          success: false,
          error: '留言内容过长（最多1000字）'
        });
      }

      // 简单的敏感词过滤（您可以扩展这个列表）
      const sensitiveWords = []; // 在这里添加敏感词，例如：['敏感词1', '敏感词2']
      const containsSensitive = sensitiveWords.some(word => text.includes(word));
      
      if (containsSensitive) {
        return res.status(400).json({
          success: false,
          error: '留言包含不当内容'
        });
      }

      // 插入数据库
      const { data, error } = await supabase
        .from('messages')
        .insert([
          {
            text: text.trim(),
            timestamp: timestamp || Date.now(),
            status: 'pending' // 需要审核
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: data
      });
    } catch (error) {
      console.error('提交留言失败:', error);
      return res.status(500).json({
        success: false,
        error: '提交留言失败，请稍后重试'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
