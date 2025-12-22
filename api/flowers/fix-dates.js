import { createClient } from '@supabase/supabase-js';
import { extractAdminToken, verifyAdminToken } from '../utils/auth.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
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
    // 获取所有需要修复的记录（date 和 created_at 日期不一致的）
    const { data: allRecords, error: fetchError } = await supabase
      .from('flower_records')
      .select('id, date, created_at, user_ip, flower_count')
      .order('created_at', { ascending: false });

    if (fetchError) throw fetchError;

    let fixedCount = 0;
    let errorCount = 0;
    const errors = [];

    // 遍历每条记录，修复日期
    for (const record of allRecords) {
      if (!record.created_at) continue;

      // 基于 created_at 计算正确的日期（UTC）
      const createdDate = new Date(record.created_at);
      const correctYear = createdDate.getUTCFullYear();
      const correctMonth = String(createdDate.getUTCMonth() + 1).padStart(2, '0');
      const correctDay = String(createdDate.getUTCDate()).padStart(2, '0');
      const correctDate = `${correctYear}-${correctMonth}-${correctDay}`;

      // 如果日期不一致，更新它
      if (record.date !== correctDate) {
        const { error: updateError } = await supabase
          .from('flower_records')
          .update({ date: correctDate })
          .eq('id', record.id);

        if (updateError) {
          errorCount++;
          errors.push({
            id: record.id,
            error: updateError.message
          });
        } else {
          fixedCount++;
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `修复完成：成功修复 ${fixedCount} 条记录，失败 ${errorCount} 条`,
      fixedCount,
      errorCount,
      totalRecords: allRecords.length,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('修复日期失败:', error);
    return res.status(500).json({
      success: false,
      error: '修复失败：' + (error.message || '请稍后重试')
    });
  }
}

