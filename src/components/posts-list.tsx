import { createClient } from "@/lib/supabase/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Clock, CheckCircle, FileText } from "lucide-react";
import Link from "next/link";
import { DeletePostButton } from "./delete-post-button";

interface Post {
	id: string;
	title: string;
	content: string;
	status: string;
	scheduled_at: string | null;
	created_at: string;
	updated_at: string;
}

export default async function PostsList() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return <div>Please log in to view your posts.</div>;
	}

	const { data: posts, error } = await supabase
		.from("posts")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	if (error) {
		return <div>Error loading posts: {error.message}</div>;
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "draft":
				return <FileText className='h-4 w-4' />;
			case "scheduled":
				return <Clock className='h-4 w-4' />;
			case "published":
				return <CheckCircle className='h-4 w-4' />;
			default:
				return <FileText className='h-4 w-4' />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "draft":
				return "bg-gray-100 text-gray-800";
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "published":
				return "bg-green-100 text-green-800";
			case "failed":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (!posts || posts.length === 0) {
		return (
			<Card className='text-center py-12'>
				<CardContent>
					<FileText className='h-12 w-12 text-gray-400 mx-auto mb-4' />
					<h3 className='text-lg font-semibold text-gray-900 mb-2'>
						No posts yet
					</h3>
					<p className='text-gray-600 mb-6'>
						Create your first social media post to get started.
					</p>
					<Link href='/dashboard/posts/new'>
						<Button className='bg-blue-600 hover:bg-blue-700'>
							Create Your First Post
						</Button>
					</Link>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className='space-y-4'>
			{posts.map((post: Post) => (
				<Card
					key={post.id}
					className='hover:shadow-md transition-shadow'>
					<CardHeader>
						<div className='flex items-start justify-between'>
							<div className='space-y-2'>
								<CardTitle className='text-lg'>
									{post.title}
								</CardTitle>
								<div className='flex items-center space-x-4 text-sm text-gray-600'>
									<Badge
										className={`${getStatusColor(
											post.status
										)} flex items-center space-x-1`}>
										{getStatusIcon(post.status)}
										<span className='capitalize'>
											{post.status}
										</span>
									</Badge>
									{post.scheduled_at && (
										<div className='flex items-center space-x-1'>
											<Calendar className='h-4 w-4' />
											<span>
												Scheduled:{" "}
												{formatDate(post.scheduled_at)}
											</span>
										</div>
									)}
								</div>
							</div>
							<div className='flex items-center space-x-2'>
								<Link href={`/dashboard/posts/${post.id}/edit`}>
									<Button variant='outline' size='sm'>
										<Edit className='h-4 w-4 mr-1' />
										Edit
									</Button>
								</Link>
								<DeletePostButton postId={post.id} />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<CardDescription className='text-base line-clamp-3'>
							{post.content}
						</CardDescription>
						<div className='mt-4 text-xs text-gray-500'>
							Created: {formatDate(post.created_at)}
							{post.updated_at !== post.created_at && (
								<span className='ml-4'>
									Updated: {formatDate(post.updated_at)}
								</span>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
