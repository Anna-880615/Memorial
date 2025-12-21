// 管理员登录API
import { generateAdminToken, verifyAdminPassword } from '../utils/auth.js';

export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        error: '请输入密码'
      });
    }

    // 验证密码
    if (!verifyAdminPassword(password)) {
      return res.status(401).json({
        success: false,
        error: '密码错误'
      });
    }

    // 生成token
    const token = generateAdminToken(password);

    if (!token) {
      return res.status(500).json({
        success: false,
        error: '生成token失败'
      });
    }

    return res.status(200).json({
      success: true,
      token: token,
      message: '登录成功'
    });
  } catch (error) {
    console.error('管理员登录失败:', error);
    return res.status(500).json({
      success: false,
      error: '登录失败，请稍后重试'
    });
  }
}

