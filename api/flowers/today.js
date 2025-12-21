import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({
      success: false,
      count: 0
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const userIp = req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
  const today = new Date().toISOString().split('T')[0];

  try {
    const { data, error } = await supabase
      .from('flower_records')
      .select('flower_count')
      .eq('date', today)
      .eq('user_ip', userIp);

    if (error) throw error;

    const count = data?.reduce((sum, r) => sum + r.flower_count, 0) || 0;

    return res.status(200).json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('获取今日送花数失败:', error);
    return res.status(500).json({
      success: false,
      count: 0
    });
  }
}
