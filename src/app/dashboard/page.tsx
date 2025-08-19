import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	LogOut,
	Calendar,
	BarChart3,
	Plus,
	Instagram,
	Youtube,
} from "lucide-react";
import { signOut } from "@/lib/actions";
import Link from "next/link";
import UpcomingPosts from "@/components/upcoming-posts";

export default async function DashboardPage() {
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

	// Get posts statistics
	const { count: totalPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id);

	const { count: scheduledPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id)
		.eq("status", "scheduled");

	const { count: publishedPosts } = await supabase
		.from("posts")
		.select("*", { count: "exact", head: true })
		.eq("user_id", user.id)
		.eq("status", "published");

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<header className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div className='flex items-center space-x-3'>
							<Calendar className='h-8 w-8 text-blue-600' />
							<h1 className='text-xl font-semibold text-gray-900'>
								Social Scheduler
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
					{/* Welcome Section */}
					<div className='text-center space-y-4'>
						<h2 className='text-3xl font-bold text-gray-900'>
							Welcome to Your Dashboard
						</h2>
						<p className='text-lg text-gray-600 max-w-2xl mx-auto'>
							Manage your social media posts, schedule content,
							and track analytics all in one place.
						</p>
					</div>

					{/* Stats */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<Card>
							<CardHeader className='pb-2'>
								<CardTitle className='text-sm font-medium text-gray-600'>
									Total Posts
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-gray-900'>
									{totalPosts || 0}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='pb-2'>
								<CardTitle className='text-sm font-medium text-gray-600'>
									Scheduled
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-blue-600'>
									{scheduledPosts || 0}
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className='pb-2'>
								<CardTitle className='text-sm font-medium text-gray-600'>
									Published
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='text-2xl font-bold text-green-600'>
									{publishedPosts || 0}
								</div>
							</CardContent>
						</Card>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{/* Quick Actions */}
						<div className='space-y-6'>
							<h3 className='text-lg font-semibold text-gray-900'>
								Quick Actions
							</h3>
							<div className='grid grid-cols-1 gap-4'>
								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<CardHeader>
										<CardTitle className='flex items-center space-x-2'>
											<Plus className='h-5 w-5 text-blue-600' />
											<span>Create New Post</span>
										</CardTitle>
										<CardDescription>
											Schedule a new post across your
											social media platforms
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href='/dashboard/posts/new'>
											<Button className='w-full bg-blue-600 hover:bg-blue-700'>
												Create Post
											</Button>
										</Link>
									</CardContent>
								</Card>

								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<CardHeader>
										<CardTitle className='flex items-center space-x-2'>
											<Calendar className='h-5 w-5 text-green-600' />
											<span>View Calendar</span>
										</CardTitle>
										<CardDescription>
											See all your scheduled posts in
											calendar view
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href='/dashboard/calendar'>
											<Button
												variant='outline'
												className='w-full bg-transparent'>
												Open Calendar
											</Button>
										</Link>
									</CardContent>
								</Card>

								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<CardHeader>
										<CardTitle className='flex items-center space-x-2'>
											<BarChart3 className='h-5 w-5 text-purple-600' />
											<span>View Analytics</span>
										</CardTitle>
										<CardDescription>
											Track performance and engagement
											metrics
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href='/dashboard/analytics'>
											<Button
												variant='outline'
												className='w-full bg-transparent'>
												View Analytics
											</Button>
										</Link>
									</CardContent>
								</Card>

								<Card className='hover:shadow-lg transition-shadow cursor-pointer'>
									<CardHeader>
										<CardTitle className='flex items-center space-x-2'>
											<BarChart3 className='h-5 w-5 text-orange-600' />
											<span>Manage Posts</span>
										</CardTitle>
										<CardDescription>
											View and edit all your posts in one
											place
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Link href='/dashboard/posts'>
											<Button
												variant='outline'
												className='w-full bg-transparent'>
												View Posts
											</Button>
										</Link>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Upcoming Posts */}
						<div>
							<UpcomingPosts />
						</div>
					</div>

					{/* Connected Accounts */}
					<Card>
						<CardHeader>
							<CardTitle>
								Connected Social Media Accounts
							</CardTitle>
							<CardDescription>
								Connect your social media accounts to start
								scheduling posts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='flex items-center justify-between p-4 border rounded-lg'>
									<div className='flex items-center space-x-3'>
										<Instagram className='h-6 w-6 text-pink-600' />
										<span className='font-medium'>
											Instagram
										</span>
									</div>
									<Link href='/dashboard/accounts'>
										<Button variant='outline' size='sm'>
											Manage
										</Button>
									</Link>
								</div>
								<div className='flex items-center justify-between p-4 border rounded-lg'>
									<div className='flex items-center space-x-3'>
										<Youtube className='h-6 w-6 text-red-600' />
										<span className='font-medium'>
											YouTube
										</span>
									</div>
									<Link href='/dashboard/accounts'>
										<Button variant='outline' size='sm'>
											Manage
										</Button>
									</Link>
								</div>
							</div>
							<div className='mt-4 text-center'>
								<Link href='/dashboard/accounts'>
									<Button className='bg-blue-600 hover:bg-blue-700'>
										Manage All Accounts
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
