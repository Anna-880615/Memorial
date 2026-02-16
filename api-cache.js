// 客户端缓存工具类
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.defaultTTL = 30000; // 默认30秒缓存
  }

  /**
   * 生成缓存键
   */
  getCacheKey(url, options = {}) {
    const method = options.method || "GET";
    const body = options.body ? JSON.stringify(options.body) : "";
    const headers = options.headers ? JSON.stringify(options.headers) : "";
    return `${method}:${url}:${body}:${headers}`;
  }

  /**
   * 获取缓存数据
   */
  get(url, options = {}) {
    const key = this.getCacheKey(url, options);
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    const now = Date.now();
    if (now > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存数据
   */
  set(url, data, options = {}) {
    const key = this.getCacheKey(url, options);
    const ttl = options.ttl || this.defaultTTL;
    const expiresAt = Date.now() + ttl;

    this.cache.set(key, {
      data,
      expiresAt,
      createdAt: Date.now(),
    });
  }

  /**
   * 清除缓存
   */
  clear(url = null, options = {}) {
    if (url) {
      const key = this.getCacheKey(url, options);
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * 清除所有过期的缓存
   */
  cleanExpired() {
    const now = Date.now();
    for (const [key, cached] of this.cache.entries()) {
      if (now > cached.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// 全局缓存实例
const apiCache = new ApiCache();

// 定期清理过期缓存（每5分钟）
setInterval(
  () => {
    apiCache.cleanExpired();
  },
  5 * 60 * 1000,
);

// 增强的 fetch 函数，支持缓存
async function cachedFetch(url, options = {}) {
  const method = options.method || "GET";

  // GET 请求才使用缓存
  if (method === "GET") {
    const cached = apiCache.get(url, options);
    if (cached !== null) {
      return cached;
    }
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // 只有成功的 GET 请求才缓存
    if (method === "GET" && response.ok && data.success !== false) {
      // 根据不同的API设置不同的缓存时间
      let ttl = 30000; // 默认30秒
      if (url.includes("/flowers/today")) {
        ttl = 10000; // 今日送花数：10秒缓存（因为需要实时性）
      } else if (url.includes("/flowers/total")) {
        ttl = 60000; // 总送花数：60秒缓存
      } else if (url.includes("/messages")) {
        ttl = 20000; // 留言列表：20秒缓存
      }

      apiCache.set(url, data, { ...options, ttl });
    }

    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}
