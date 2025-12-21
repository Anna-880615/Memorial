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
