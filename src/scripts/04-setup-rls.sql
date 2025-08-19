-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles: users can only see and modify their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Social accounts: users can only manage their own accounts
CREATE POLICY "Users can manage own social accounts" ON public.social_accounts FOR ALL USING (auth.uid() = user_id);

-- Media files: users can only manage their own media
CREATE POLICY "Users can manage own media" ON public.media_files FOR ALL USING (auth.uid() = user_id);

-- Posts: users can only manage their own posts
CREATE POLICY "Users can manage own posts" ON public.posts FOR ALL USING (auth.uid() = user_id);

-- Post media: users can only manage media for their own posts
CREATE POLICY "Users can manage own post media" ON public.post_media FOR ALL USING (
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_media.post_id AND posts.user_id = auth.uid())
);

-- Post platforms: users can only manage platforms for their own posts
CREATE POLICY "Users can manage own post platforms" ON public.post_platforms FOR ALL USING (
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = post_platforms.post_id AND posts.user_id = auth.uid())
);

-- Post analytics: users can only view analytics for their own posts
CREATE POLICY "Users can view own post analytics" ON public.post_analytics FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.post_platforms pp
        JOIN public.posts p ON p.id = pp.post_id
        WHERE pp.id = post_analytics.post_platform_id AND p.user_id = auth.uid()
    )
);

-- Scheduled jobs: users can only view jobs for their own posts
CREATE POLICY "Users can view own scheduled jobs" ON public.scheduled_jobs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.posts WHERE posts.id = scheduled_jobs.post_id AND posts.user_id = auth.uid())
);
