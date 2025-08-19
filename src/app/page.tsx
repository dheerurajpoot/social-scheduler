import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
	if (!isSupabaseConfigured) {
		return (
			<div className='flex min-h-screen items-center justify-center bg-gray-50'>
				<div className='text-center space-y-4'>
					<h1 className='text-2xl font-bold text-gray-900'>
						Connect Supabase to get started
					</h1>
					<p className='text-gray-600'>
						Please configure your Supabase integration in Project
						Settings
					</p>
				</div>
			</div>
		);
	}

	const supabase = await createClient();

	try {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			redirect("/auth/login");
		}

		console.log("User authenticated, redirecting to dashboard:", user.id);

		// If user is authenticated, redirect to dashboard
		redirect("/dashboard");
	} catch (error) {
		console.error("Authentication error:", error);
		redirect("/auth/login");
	}
}
