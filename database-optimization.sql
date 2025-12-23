-- 数据库索引优化脚本
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本
-- 这些索引将显著提升查询性能

-- ============================================
-- 1. 送花记录表 (flower_records) 索引优化
-- ============================================

-- 优化：基于 user_ip 和 created_at 的查询（用于今日送花数查询）
-- 这个索引会加速 /api/flowers/today.js 的查询
CREATE INDEX IF NOT EXISTS idx_flower_records_user_ip_created_at 
ON flower_records(user_ip, created_at DESC);

-- 优化：基于 date 字段的查询（用于按日期统计）
CREATE INDEX IF NOT EXISTS idx_flower_records_date 
ON flower_records(date DESC);

-- 优化：基于 user_ip 和 date 的联合查询（用于检查每日限额）
CREATE INDEX IF NOT EXISTS idx_flower_records_user_ip_date 
ON flower_records(user_ip, date DESC);

-- ============================================
-- 2. 留言表 (messages) 索引优化
-- ============================================

-- 优化：基于 status 和 timestamp 的查询（用于获取已审核留言）
-- 这个索引会加速 /api/messages/index.js 的查询
CREATE INDEX IF NOT EXISTS idx_messages_status_timestamp 
ON messages(status, timestamp DESC);

-- 优化：基于 timestamp 的排序查询
CREATE INDEX IF NOT EXISTS idx_messages_timestamp_desc 
ON messages(timestamp DESC);

-- ============================================
-- 3. 分析表统计信息（可选，用于查询优化器）
-- ============================================

-- 更新表统计信息，帮助查询优化器选择最佳执行计划
ANALYZE flower_records;
ANALYZE messages;

-- ============================================
-- 4. 查看索引使用情况（执行后可以查看）
-- ============================================

-- 查看所有索引
-- SELECT 
--     tablename,
--     indexname,
--     indexdef
-- FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;

