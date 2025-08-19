import { createClient } from "@/lib/supabase/server";

export interface AnalyticsOverview {
	totalPosts: number;
	totalViews: number;
	totalLikes: number;
	totalComments: number;
	totalShares: number;
	avgEngagementRate: number;
	topPlatform: string;
}

export interface PlatformAnalytics {
	platform: string;
	posts: number;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	engagementRate: number;
}

export interface PostPerformance {
	id: string;
	title: string;
	platform: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
	engagementRate: number;
	publishedAt: string;
}

export interface TrendData {
	date: string;
	views: number;
	likes: number;
	comments: number;
	shares: number;
}

export async function getAnalyticsOverview(
	userId: string
): Promise<AnalyticsOverview> {
	const supabase = await createClient();

	// Get total posts
	const { count: totalPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("status", "published");

	// Get analytics data
	const { data: analyticsData } = await supabase
		.from("post_analytics")
		.select(
			`
      metric_type,
      value,
      post_platforms!inner(
        social_accounts!inner(
          platform,
          posts!inner(user_id)
        )
      )
    `
		)
		.eq("post_platforms.social_accounts.posts.user_id", userId);

	// Process analytics data
	let totalViews = 0;
	let totalLikes = 0;
	let totalComments = 0;
	let totalShares = 0;
	const platformCounts: Record<string, number> = {};

	analyticsData?.forEach((item: any) => {
		const platform = item.post_platforms?.social_accounts?.platform;
		if (platform) {
			platformCounts[platform] = (platformCounts[platform] || 0) + 1;
		}

		switch (item.metric_type) {
			case "views":
				totalViews += item.value;
				break;
			case "likes":
				totalLikes += item.value;
				break;
			case "comments":
				totalComments += item.value;
				break;
			case "shares":
				totalShares += item.value;
				break;
		}
	});

	const topPlatform =
		Object.entries(platformCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
		"None";
	const totalEngagement = totalLikes + totalComments + totalShares;
	const avgEngagementRate =
		totalViews > 0 ? (totalEngagement / totalViews) * 100 : 0;

	return {
		totalPosts: totalPosts || 0,
		totalViews,
		totalLikes,
		totalComments,
		totalShares,
		avgEngagementRate: Math.round(avgEngagementRate * 100) / 100,
		topPlatform,
	};
}

export async function getPlatformAnalytics(
	userId: string
): Promise<PlatformAnalytics[]> {
	const supabase = await createClient();

	const { data } = await supabase
		.from("social_accounts")
		.select(
			`
      platform,
      post_platforms!inner(
        posts!inner(user_id, status),
        post_analytics(metric_type, value)
      )
    `
		)
		.eq("user_id", userId)
		.eq("post_platforms.posts.status", "published");

	const platformStats: Record<string, PlatformAnalytics> = {};

	data?.forEach((account: any) => {
		const platform = account.platform;
		if (!platformStats[platform]) {
			platformStats[platform] = {
				platform,
				posts: 0,
				views: 0,
				likes: 0,
				comments: 0,
				shares: 0,
				engagementRate: 0,
			};
		}

		account.post_platforms?.forEach((postPlatform: any) => {
			platformStats[platform].posts += 1;

			postPlatform.post_analytics?.forEach((analytics: any) => {
				switch (analytics.metric_type) {
					case "views":
						platformStats[platform].views += analytics.value;
						break;
					case "likes":
						platformStats[platform].likes += analytics.value;
						break;
					case "comments":
						platformStats[platform].comments += analytics.value;
						break;
					case "shares":
						platformStats[platform].shares += analytics.value;
						break;
				}
			});
		});

		// Calculate engagement rate
		const stats = platformStats[platform];
		const totalEngagement = stats.likes + stats.comments + stats.shares;
		stats.engagementRate =
			stats.views > 0 ? (totalEngagement / stats.views) * 100 : 0;
	});

	return Object.values(platformStats);
}

export async function getTopPosts(
	userId: string,
	limit = 10
): Promise<PostPerformance[]> {
	const supabase = await createClient();

	const { data } = await supabase
		.from("posts")
		.select(
			`
      id,
      title,
      published_at,
      post_platforms!inner(
        social_accounts!inner(platform),
        post_analytics(metric_type, value)
      )
    `
		)
		.eq("user_id", userId)
		.eq("status", "published")
		.order("published_at", { ascending: false });

	const postPerformance: PostPerformance[] = [];

	data?.forEach((post: any) => {
		post.post_platforms?.forEach((postPlatform: any) => {
			let views = 0,
				likes = 0,
				comments = 0,
				shares = 0;

			postPlatform.post_analytics?.forEach((analytics: any) => {
				switch (analytics.metric_type) {
					case "views":
						views += analytics.value;
						break;
					case "likes":
						likes += analytics.value;
						break;
					case "comments":
						comments += analytics.value;
						break;
					case "shares":
						shares += analytics.value;
						break;
				}
			});

			const totalEngagement = likes + comments + shares;
			const engagementRate =
				views > 0 ? (totalEngagement / views) * 100 : 0;

			postPerformance.push({
				id: post.id,
				title: post.title,
				platform: postPlatform.social_accounts?.platform || "Unknown",
				views,
				likes,
				comments,
				shares,
				engagementRate: Math.round(engagementRate * 100) / 100,
				publishedAt: post.published_at || "",
			});
		});
	});

	return postPerformance
		.sort((a, b) => b.engagementRate - a.engagementRate)
		.slice(0, limit);
}

export async function getTrendData(
	userId: string,
	days = 30
): Promise<TrendData[]> {
	const supabase = await createClient();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - days);

	const { data } = await supabase
		.from("post_analytics")
		.select(
			`
      metric_type,
      value,
      recorded_at,
      post_platforms!inner(
        social_accounts!inner(
          posts!inner(user_id)
        )
      )
    `
		)
		.eq("post_platforms.social_accounts.posts.user_id", userId)
		.gte("recorded_at", startDate.toISOString())
		.order("recorded_at", { ascending: true });

	const trendMap: Record<string, TrendData> = {};

	data?.forEach((item: any) => {
		const date = new Date(item.recorded_at).toISOString().split("T")[0];

		if (!trendMap[date]) {
			trendMap[date] = {
				date,
				views: 0,
				likes: 0,
				comments: 0,
				shares: 0,
			};
		}

		switch (item.metric_type) {
			case "views":
				trendMap[date].views += item.value;
				break;
			case "likes":
				trendMap[date].likes += item.value;
				break;
			case "comments":
				trendMap[date].comments += item.value;
				break;
			case "shares":
				trendMap[date].shares += item.value;
				break;
		}
	});

	return Object.values(trendMap).sort((a, b) => a.date.localeCompare(b.date));
}
