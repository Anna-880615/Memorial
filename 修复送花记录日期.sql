-- 修复送花记录日期脚本
-- 在 Supabase Dashboard 的 SQL Editor 中执行此脚本
-- 此脚本会基于 created_at 时间戳重新计算并更新 date 字段

-- 方法1：使用 UTC 日期（推荐，确保日期和时间戳一致）
-- 这会基于 created_at 的 UTC 日期来更新 date 字段
UPDATE flower_records
SET date = DATE(created_at AT TIME ZONE 'UTC')
WHERE date != DATE(created_at AT TIME ZONE 'UTC');

-- 查看修复结果
SELECT 
    id,
    user_ip,
    flower_count,
    date as old_date,
    DATE(created_at AT TIME ZONE 'UTC') as correct_date,
    created_at,
    CASE 
        WHEN date = DATE(created_at AT TIME ZONE 'UTC') THEN '✓ 正确'
        ELSE '✗ 需要修复'
    END as status
FROM flower_records
ORDER BY created_at DESC
LIMIT 50;

-- 如果需要使用中国时区（UTC+8）来计算日期，可以使用以下脚本：
-- UPDATE flower_records
-- SET date = DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Shanghai')
-- WHERE date != DATE(created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Shanghai');

