-- Supabase数据库初始化SQL
-- 在Supabase Dashboard的SQL Editor中执行此脚本

-- 创建留言表
CREATE TABLE IF NOT EXISTS messages (
  id BIGSERIAL PRIMARY KEY,
  text TEXT NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- 创建送花记录表
CREATE TABLE IF NOT EXISTS flower_records (
  id BIGSERIAL PRIMARY KEY,
  user_ip VARCHAR(45),
  flower_count INTEGER NOT NULL CHECK (flower_count > 0),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引提高查询性能
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_flower_records_date ON flower_records(date);
CREATE INDEX IF NOT EXISTS idx_flower_records_user_ip ON flower_records(user_ip, date);

-- 添加注释
COMMENT ON TABLE messages IS '用户留言表';
COMMENT ON TABLE flower_records IS '送花记录表';
COMMENT ON COLUMN messages.status IS '留言状态: pending待审核, approved已通过, rejected已拒绝';

-- ============================================
-- 送花总数原子计数器
-- ============================================

-- 单行计数器表，O(1) 读取总数（替代全表扫描）
CREATE TABLE IF NOT EXISTS flower_totals (
  id INTEGER PRIMARY KEY DEFAULT 1,
  total INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);
INSERT INTO flower_totals (id, total) VALUES (1, 0)
  ON CONFLICT (id) DO NOTHING;

-- 从现有记录回填总数（部署后执行一次）
-- UPDATE flower_totals
-- SET total = (SELECT COALESCE(SUM(flower_count), 0) FROM flower_records),
--     updated_at = NOW()
-- WHERE id = 1;

-- 原子递增送花总数，返回新的总数
CREATE OR REPLACE FUNCTION increment_flower_total(amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_total INTEGER;
BEGIN
  UPDATE flower_totals
  SET total = total + amount,
      updated_at = NOW()
  WHERE id = 1
  RETURNING total INTO new_total;

  IF new_total IS NULL THEN
    INSERT INTO flower_totals (id, total)
    VALUES (1, amount)
    ON CONFLICT (id) DO UPDATE SET total = flower_totals.total + EXCLUDED.total
    RETURNING total INTO new_total;
  END IF;

  RETURN new_total;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE flower_totals IS '送花总数计数器（单行表）';
COMMENT ON FUNCTION increment_flower_total(INTEGER) IS '原子递增送花总数并返回新值';

-- ============================================
-- 数据库限速（替代内存中的 Map）
-- ============================================

-- 限速日志表
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id BIGSERIAL PRIMARY KEY,
  user_ip VARCHAR(45) NOT NULL,
  endpoint VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_log_lookup
  ON rate_limit_log(user_ip, endpoint, created_at DESC);

-- 自动清理过期记录
CREATE OR REPLACE FUNCTION cleanup_rate_limit_log()
RETURNS void AS $$
  DELETE FROM rate_limit_log WHERE created_at < NOW() - INTERVAL '2 hours';
$$ LANGUAGE SQL;

-- 原子限速检查：检查并记录请求，返回是否允许
-- 使用 pg_advisory_xact_lock 防止并发竞态条件
CREATE OR REPLACE FUNCTION check_and_log_rate_limit(
  p_user_ip VARCHAR(45),
  p_endpoint VARCHAR(50),
  p_max_requests INTEGER,
  p_window_seconds INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_user_ip || ':' || p_endpoint));

  SELECT COUNT(*) INTO recent_count
  FROM rate_limit_log
  WHERE user_ip = p_user_ip
    AND endpoint = p_endpoint
    AND created_at > NOW() - (p_window_seconds || ' seconds')::INTERVAL;

  IF recent_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  INSERT INTO rate_limit_log (user_ip, endpoint) VALUES (p_user_ip, p_endpoint);
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE rate_limit_log IS '接口限速日志表';
COMMENT ON FUNCTION check_and_log_rate_limit(VARCHAR, VARCHAR, INTEGER, INTEGER) IS '原子限速检查，返回TRUE允许/FALSE拒绝';

-- pg_cron 定时清理（如果 pg_cron 可用，在 Supabase SQL Editor 中单独执行）
-- SELECT cron.schedule(
--   'cleanup-rate-limit-log',
--   '0 3 * * *',
--   'DELETE FROM rate_limit_log WHERE created_at < NOW() - INTERVAL ''2 hours'''
-- );

-- ============================================
-- 安全加固：启用 RLS 并收回公开 API 权限
-- ============================================
-- 说明：所有读写都通过服务端 API（使用 service_role 密钥）完成。
-- service_role 自动绕过 RLS 且保留全部权限，因此服务端代码不受影响；
-- 但匿名访客无法再通过 Supabase Data API 直接读写这些表/函数。
-- 这与 Supabase 自 2026-04-28 起推行的"新表默认不暴露"策略一致。

ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE flower_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE flower_totals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_log ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON messages, flower_records, flower_totals, rate_limit_log
  FROM anon, authenticated;

REVOKE EXECUTE ON FUNCTION increment_flower_total(INTEGER),
                            check_and_log_rate_limit(VARCHAR, VARCHAR, INTEGER, INTEGER),
                            cleanup_rate_limit_log()
  FROM anon, authenticated, public;
