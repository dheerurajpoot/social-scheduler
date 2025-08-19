-- Insert sample analytics data for demonstration
-- This script adds sample analytics data to showcase the analytics dashboard

-- First, let's add some sample posts if they don't exist
INSERT INTO posts (id, user_id, title, content, status, scheduled_at, published_at, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    id,
    'Sample Post ' || generate_series,
    'This is sample content for post ' || generate_series || '. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'published',
    NOW() - INTERVAL '1 day' * generate_series,
    NOW() - INTERVAL '1 day' * generate_series,
    NOW() - INTERVAL '1 day' * generate_series,
    NOW() - INTERVAL '1 day' * generate_series
FROM user_profiles, generate_series(1, 5)
WHERE NOT EXISTS (SELECT 1 FROM posts WHERE user_id = user_profiles.id)
LIMIT 5;

-- Add sample social accounts if they don't exist
INSERT INTO social_accounts (id, user_id, platform, account_name, account_id, is_active, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    up.id,
    platform_name,
    'Sample ' || platform_name || ' Account',
    'sample_' || platform_name || '_' || up.id,
    true,
    NOW(),
    NOW()
FROM user_profiles up
CROSS JOIN (VALUES ('instagram'), ('youtube')) AS platforms(platform_name)
WHERE NOT EXISTS (
    SELECT 1 FROM social_accounts sa 
    WHERE sa.user_id = up.id AND sa.platform = platform_name
);

-- Add sample post_platforms connections
INSERT INTO post_platforms (id, post_id, social_account_id, platform_post_id, status, published_at, created_at)
SELECT 
    uuid_generate_v4(),
    p.id,
    sa.id,
    'platform_post_' || p.id || '_' || sa.platform,
    'published',
    p.published_at,
    p.created_at
FROM posts p
JOIN social_accounts sa ON sa.user_id = p.user_id
WHERE p.status = 'published'
AND NOT EXISTS (
    SELECT 1 FROM post_platforms pp 
    WHERE pp.post_id = p.id AND pp.social_account_id = sa.id
);

-- Add sample analytics data
INSERT INTO post_analytics (id, post_platform_id, metric_type, value, recorded_at, created_at)
SELECT 
    uuid_generate_v4(),
    pp.id,
    metric,
    CASE 
        WHEN metric = 'views' THEN (RANDOM() * 1000 + 100)::INTEGER
        WHEN metric = 'likes' THEN (RANDOM() * 100 + 10)::INTEGER
        WHEN metric = 'comments' THEN (RANDOM() * 20 + 1)::INTEGER
        WHEN metric = 'shares' THEN (RANDOM() * 10 + 1)::INTEGER
        ELSE 0
    END,
    pp.published_at + INTERVAL '1 hour' * generate_series,
    NOW()
FROM post_platforms pp
CROSS JOIN (VALUES ('views'), ('likes'), ('comments'), ('shares')) AS metrics(metric)
CROSS JOIN generate_series(0, 7) -- Generate data for 8 time points
WHERE NOT EXISTS (
    SELECT 1 FROM post_analytics pa 
    WHERE pa.post_platform_id = pp.id AND pa.metric_type = metric
);

-- Update analytics with more realistic trending data
UPDATE post_analytics 
SET value = value + (RANDOM() * 50)::INTEGER
WHERE recorded_at > NOW() - INTERVAL '7 days';
