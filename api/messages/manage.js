// 留言管理API（审核、删除）
import { createClient } from '@supabase/supabase-js';
import { extractAdminToken, verifyAdminToken } from '../utils/auth.js';
import { validateMessageId } from '../utils/validation.js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS');
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

  // 验证管理员权限
  const adminToken = extractAdminToken(req);
  if (!adminToken || !verifyAdminToken(adminToken)) {
    return res.status(401).json({
      success: false,
      error: '需要管理员权限'
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { id, action } = req.body;

  // 验证留言ID
  const validatedId = validateMessageId(id);
  if (!validatedId) {
    return res.status(400).json({
      success: false,
      error: '留言ID无效'
    });
  }

  // PATCH: 审核留言（通过/拒绝）
  if (req.method === 'PATCH') {
    try {
      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          error: '操作类型无效，必须是 approve 或 reject'
        });
      }

      const status = action === 'approve' ? 'approved' : 'rejected';

      // 更新留言状态（使用验证后的ID）
      const { data, error } = await supabase
        .from('messages')
        .update({ status: status })
        .eq('id', validatedId)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          success: false,
          error: '留言不存在'
        });
      }

      return res.status(200).json({
        success: true,
        message: data,
        statusText: status === 'approved' ? '已通过审核' : '已拒绝'
      });
    } catch (error) {
      console.error('审核留言失败:', error);
      return res.status(500).json({
        success: false,
        error: '审核留言失败，请稍后重试'
      });
    }
  }

  // DELETE: 删除留言
  if (req.method === 'DELETE') {
    try {
      // 先检查留言是否存在（使用验证后的ID）
      const { data: message, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('id', validatedId)
        .single();

      if (fetchError || !message) {
        return res.status(404).json({
          success: false,
          error: '留言不存在'
        });
      }

      // 删除留言（使用验证后的ID）
      const { error: deleteError } = await supabase
        .from('messages')
        .delete()
        .eq('id', validatedId);

      if (deleteError) throw deleteError;

      return res.status(200).json({
        success: true,
        message: '留言已删除'
      });
    } catch (error) {
      console.error('删除留言失败:', error);
      return res.status(500).json({
        success: false,
        error: '删除留言失败，请稍后重试'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}

