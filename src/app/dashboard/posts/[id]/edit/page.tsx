import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PostForm from "@/components/post-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditPostPageProps {
	params: {
		id: string;
	};
}

export default async function EditPostPage({ params }: EditPostPageProps) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	const { data: post, error } = await supabase
		.from("posts")
		.select("*")
		.eq("id", params.id)
		.eq("user_id", user.id)
		.single();

	if (error || !post) {
		redirect("/dashboard/posts");
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center h-16'>
						<Link href='/dashboard/posts'>
							<Button variant='ghost' size='sm' className='mr-4'>
								<ArrowLeft className='h-4 w-4 mr-2' />
								Back to Posts
							</Button>
						</Link>
						<div>
							<h1 className='text-2xl font-semibold text-gray-900'>
								Edit Post
							</h1>
							<p className='text-sm text-gray-600'>
								Update your social media content
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<PostForm post={post} mode='edit' />
			</main>
		</div>
	);
}
