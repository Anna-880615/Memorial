// 管理员认证工具函数

/**
 * 验证管理员密码
 * @param {string} password - 用户输入的密码
 * @returns {boolean} - 密码是否正确
 */
export function verifyAdminPassword(password) {
  // 从环境变量获取管理员密码，如果没有设置则使用默认值
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin2025';
  return password === adminPassword;
}

/**
 * 生成简单的管理员token（用于会话管理）
 * @param {string} password - 管理员密码
 * @returns {string|null} - 如果密码正确返回token，否则返回null
 */
export function generateAdminToken(password) {
  if (!verifyAdminPassword(password)) {
    return null;
  }
  
  // 生成简单的token（实际生产环境应使用JWT）
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return Buffer.from(`${timestamp}-${random}-admin`).toString('base64');
}

/**
 * 验证管理员token
 * @param {string} token - 要验证的token
 * @returns {boolean} - token是否有效
 */
export function verifyAdminToken(token) {
  if (!token) return false;
  
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const parts = decoded.split('-');
    
    // 检查token格式
    if (parts.length !== 3 || parts[2] !== 'admin') {
      return false;
    }
    
    // 检查token是否过期（24小时）
    const timestamp = parseInt(parts[0]);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24小时
    
    return (now - timestamp) < maxAge;
  } catch (error) {
    return false;
  }
}

/**
 * 从请求中提取管理员token
 * @param {object} req - Express请求对象
 * @returns {string|null} - token或null
 */
export function extractAdminToken(req) {
  // 从Authorization header获取
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // 从请求体获取
  if (req.body && req.body.adminToken) {
    return req.body.adminToken;
  }
  
  // 从查询参数获取（不推荐，但为了兼容性保留）
  if (req.query && req.query.adminToken) {
    return req.query.adminToken;
  }
  
  return null;
}

/**
 * 中间件：验证管理员权限
 * @param {object} req - Express请求对象
 * @param {object} res - Express响应对象
 * @param {function} next - 下一个中间件
 */
export function requireAdmin(req, res, next) {
  const token = extractAdminToken(req);
  
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({
      success: false,
      error: '需要管理员权限'
    });
  }
  
  // 将管理员标识添加到请求对象
  req.isAdmin = true;
  next();
}

