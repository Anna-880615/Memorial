// API配置文件
// 部署前请修改以下配置

const CONFIG = {
    // Supabase配置（从Supabase Dashboard获取）
    // 步骤：Settings → API → 复制 "Publishable and secret API keys" 标签页中的信息
    SUPABASE_URL: 'https://aephgzvwsgjjdeifripx.supabase.co', 
    // 例如：https://abcdefghijklmnop.supabase.co
    // ⚠️ 填入：Project URL（在API设置页面顶部）
    
    SUPABASE_KEY: 'sb_publishable_4lQ7GXsyDI7itWB2EWkPzw_-QVr4tT7', 
    // ⚠️ 填入：Publishable key（格式：sb_publishable_xxxxx）
    // 位置：Settings → API → "Publishable key" 部分的 API KEY
    
    // API端点配置
    API_ENDPOINT: '/api', // 生产环境使用相对路径
    
    // 开发环境自动检测
    isDevelopment: window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('localhost')
};

// 开发环境使用本地API
if (CONFIG.isDevelopment) {
    CONFIG.API_ENDPOINT = 'http://localhost:3000/api';
}

// 导出配置（如果需要）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
