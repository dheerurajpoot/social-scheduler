-- Create indexes for better query performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_social_accounts_user_id ON public.social_accounts(user_id);
CREATE INDEX idx_social_accounts_platform ON public.social_accounts(platform);
CREATE INDEX idx_media_files_user_id ON public.media_files(user_id);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_at ON public.posts(scheduled_at);
CREATE INDEX idx_post_platforms_post_id ON public.post_platforms(post_id);
CREATE INDEX idx_post_platforms_status ON public.post_platforms(status);
CREATE INDEX idx_post_analytics_post_platform_id ON public.post_analytics(post_platform_id);
CREATE INDEX idx_scheduled_jobs_scheduled_for ON public.scheduled_jobs(scheduled_for);
CREATE INDEX idx_scheduled_jobs_status ON public.scheduled_jobs(status);
