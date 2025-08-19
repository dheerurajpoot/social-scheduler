import { createClient } from "@/lib/supabase/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Edit } from "lucide-react";
import Link from "next/link";

export default async function UpcomingPosts() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// Get upcoming scheduled posts
	const { data: upcomingPosts } = await supabase
		.from("posts")
		.select("*")
		.eq("user_id", user.id)
		.eq("status", "scheduled")
		.gte("scheduled_at", new Date().toISOString())
		.order("scheduled_at", { ascending: true })
		.limit(5);

	const formatDateTime = (dateString: string) => {
		const date = new Date(dateString);
		return {
			date: date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			}),
			time: date.toLocaleTimeString("en-US", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};
	};

	const getTimeUntil = (dateString: string) => {
		const now = new Date();
		const scheduled = new Date(dateString);
		const diffMs = scheduled.getTime() - now.getTime();

		if (diffMs < 0) return "Overdue";

		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) {
			return `in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
		} else if (diffHours > 0) {
			return `in ${diffHours} hour${diffHours > 1 ? "s" : ""}`;
		} else {
			const diffMinutes = Math.floor(diffMs / (1000 * 60));
			return `in ${diffMinutes} minute${diffMinutes > 1 ? "s" : ""}`;
		}
	};

	if (!upcomingPosts || upcomingPosts.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center space-x-2'>
						<Clock className='h-5 w-5 text-blue-600' />
						<span>Upcoming Posts</span>
					</CardTitle>
					<CardDescription>Your next scheduled posts</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='text-center py-8'>
						<Calendar className='h-12 w-12 text-gray-400 mx-auto mb-4' />
						<p className='text-gray-600 mb-4'>
							No upcoming scheduled posts
						</p>
						<Link href='/dashboard/posts/new'>
							<Button className='bg-blue-600 hover:bg-blue-700'>
								Schedule Your First Post
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className='flex items-center space-x-2'>
					<Clock className='h-5 w-5 text-blue-600' />
					<span>Upcoming Posts</span>
				</CardTitle>
				<CardDescription>Your next scheduled posts</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{upcomingPosts.map((post:any) => {
						const { date, time } = formatDateTime(
							post.scheduled_at!
						);
						const timeUntil = getTimeUntil(post.scheduled_at!);

						return (
							<div
								key={post.id}
								className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'>
								<div className='flex-1'>
									<div className='flex items-center space-x-3 mb-2'>
										<h4 className='font-medium text-gray-900 truncate'>
											{post.title}
										</h4>
										<Badge className='bg-blue-100 text-blue-800 text-xs'>
											{timeUntil}
										</Badge>
									</div>
									<p className='text-sm text-gray-600 line-clamp-2 mb-2'>
										{post.content}
									</p>
									<div className='flex items-center space-x-4 text-xs text-gray-500'>
										<div className='flex items-center space-x-1'>
											<Calendar className='h-3 w-3' />
											<span>{date}</span>
										</div>
										<div className='flex items-center space-x-1'>
											<Clock className='h-3 w-3' />
											<span>{time}</span>
										</div>
									</div>
								</div>
								<Link href={`/dashboard/posts/${post.id}/edit`}>
									<Button variant='outline' size='sm'>
										<Edit className='h-4 w-4 mr-1' />
										Edit
									</Button>
								</Link>
							</div>
						);
					})}
				</div>
				<div className='mt-4 text-center'>
					<Link href='/dashboard/calendar'>
						<Button
							variant='outline'
							className='w-full bg-transparent'>
							View Full Calendar
						</Button>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
