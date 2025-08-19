import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CalendarView from "@/components/calendar-view";

export default async function CalendarPage() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	// Get all posts for the calendar
	const { data: posts, error } = await supabase
		.from("posts")
		.select("*")
		.eq("user_id", user.id)
		.order("scheduled_at", { ascending: true });

	if (error) {
		console.error("Error fetching posts:", error);
		return <div>Error loading calendar</div>;
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white shadow-sm border-b'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex justify-between items-center h-16'>
						<div>
							<h1 className='text-2xl font-semibold text-gray-900'>
								Calendar
							</h1>
							<p className='text-sm text-gray-600'>
								View and manage your scheduled posts
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<CalendarView posts={posts || []} />
			</main>
		</div>
	);
}
