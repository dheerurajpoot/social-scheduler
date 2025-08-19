-- Insert sample data for development/testing
-- Note: This will only work after users are created through Supabase Auth

-- Sample social media platforms data (this would be populated when users connect their accounts)
-- INSERT INTO public.social_accounts (user_id, platform, account_name, account_id, is_active)
-- VALUES 
--   ('user-uuid-here', 'instagram', '@mycompany', 'instagram_account_id', true),
--   ('user-uuid-here', 'youtube', 'My Company Channel', 'youtube_channel_id', true);

-- Sample post statuses for reference
-- INSERT INTO public.posts (user_id, title, content, status, scheduled_at)
-- VALUES 
--   ('user-uuid-here', 'Welcome Post', 'Welcome to our social media scheduler!', 'draft', NULL),
--   ('user-uuid-here', 'Scheduled Post', 'This post is scheduled for later', 'scheduled', NOW() + INTERVAL '1 hour');
