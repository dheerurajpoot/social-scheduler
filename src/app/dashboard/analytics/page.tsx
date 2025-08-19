import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, ArrowLeft } from "lucide-react";
import { signOut } from "@/lib/actions";
import Link from "next/link";
import AnalyticsOverviewComponent from "@/components/analytics-overview";
import PerformanceChart from "@/components/performance-chart";
import PlatformAnalyticsComponent from "@/components/platform-analytics";
import TopPosts from "@/components/top-posts";
import {
	getAnalyticsOverview,
	getPlatformAnalytics,
	getTopPosts,
	getTrendData,
} from "@/lib/analytics-service";

export default async function AnalyticsPage() {
	if (!isSupabaseConfigured) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50'>
				<h1 className='text-2xl font-bold mb-4 text-gray-900'>
					Connect Supabase to get started
				</h1>
			</div>
		);
	}

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	// Get user profile
	const { data: profile } = await supabase
		.from("user_profiles")
		.select("*")
		.eq("id", user.id)
		.single();

	// Fetch analytics data
	const [overview, platformAnalytics, topPosts, trendData] =
		await Promise.all([
			getAnalyticsOverview(user.id),
			getPlatformAnalytics(user.id),
			getTopPosts(user.id, 10),
			getTrendData(user.id, 30),
		]);

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-3'>
							<Link href='/dashboard'>
								<Button variant='ghost' size='sm'>
									<ArrowLeft className='h-4 w-4 mr-2' />
									Back to Dashboard
								</Button>
							</Link>
							<div className='h-6 w-px bg-gray-300' />
							<BarChart3 className='h-8 w-8 text-blue-600' />
							<h1 className='text-xl font-semibold text-gray-900'>
								Analytics Dashboard
							</h1>
						</div>
						<div className='flex items-center space-x-4'>
							<span className='text-sm text-gray-600'>
								Welcome, {profile?.full_name || user.email}
							</span>
							<form action={signOut}>
								<Button
									type='submit'
									variant='outline'
									size='sm'>
									<LogOut className='h-4 w-4 mr-2' />
									Sign Out
								</Button>
							</form>
						</div>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<div className='space-y-8'>
					{/* Page Title */}
					<div className='text-center space-y-4'>
						<h2 className='text-3xl font-bold text-gray-900'>
							Analytics Overview
						</h2>
						<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
							Track your social media performance, engagement
							metrics, and content insights.
						</p>
					</div>

					{/* Analytics Overview */}
					<AnalyticsOverviewComponent data={overview} />

					{/* Performance Trends */}
					<PerformanceChart data={trendData} />

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Platform Analytics */}
						<div>
							<PlatformAnalyticsComponent
								data={platformAnalytics}
							/>
						</div>

						{/* Top Posts */}
						<div>
							<TopPosts data={topPosts} />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
