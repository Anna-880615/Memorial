// API配置文件
// 部署前请修改以下配置

const CONFIG = {
  // API端点配置
  API_ENDPOINT: "/api", // 生产环境使用相对路径

  // Supabase Storage 配置（用于视频文件）
  // 格式：https://你的项目ID.supabase.co/storage/v1/object/public/存储桶名称/
  SUPABASE_STORAGE_URL:
    "https://aephgzvwsgjjdeifripx.supabase.co/storage/v1/object/public/videos/",

  // 开发环境自动检测
  isDevelopment:
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.includes("localhost"),
};

// 开发环境使用本地API
if (CONFIG.isDevelopment) {
  CONFIG.API_ENDPOINT = "http://localhost:3000/api";
}

// 导出配置（如果需要）
if (typeof module !== "undefined" && module.exports) {
  module.exports = CONFIG;
}
