"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPost(prevState: any, formData: FormData) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to create a post" };
	}

	const title = formData.get("title");
	const content = formData.get("content");
	const scheduledAt = formData.get("scheduledAt");

	if (!title || !content) {
		return { error: "Title and content are required" };
	}

	try {
		const postData: any = {
			user_id: user.id,
			title: title.toString(),
			content: content.toString(),
			status: scheduledAt ? "scheduled" : "draft",
		};

		if (scheduledAt) {
			postData.scheduled_at = new Date(
				scheduledAt.toString()
			).toISOString();
		}

		const { data, error } = await supabase
			.from("posts")
			.insert(postData)
			.select()
			.single();

		if (error) {
			return { error: error.message };
		}

		revalidatePath("/dashboard/posts");
		return { success: "Post created successfully!", postId: data.id };
	} catch (error) {
		console.error("Create post error:", error);
		return { error: "An unexpected error occurred. Please try again." };
	}
}

export async function updatePost(
	postId: string,
	prevState: any,
	formData: FormData
) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { error: "You must be logged in to update a post" };
	}

	const title = formData.get("title");
	const content = formData.get("content");
	const scheduledAt = formData.get("scheduledAt");
	const status = formData.get("status");

	if (!title || !content) {
		return { error: "Title and content are required" };
	}

	try {
		const updateData: any = {
			title: title.toString(),
			content: content.toString(),
			status: status?.toString() || "draft",
			updated_at: new Date().toISOString(),
		};

		if (scheduledAt) {
			updateData.scheduled_at = new Date(
				scheduledAt.toString()
			).toISOString();
		}

		const { error } = await supabase
			.from("posts")
			.update(updateData)
			.eq("id", postId)
			.eq("user_id", user.id);

		if (error) {
			return { error: error.message };
		}

		revalidatePath("/dashboard/posts");
		return { success: "Post updated successfully!" };
	} catch (error) {
		console.error("Update post error:", error);
		return { error: "An unexpected error occurred. Please try again." };
	}
}

export async function deletePost(postId: string) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	try {
		const { error } = await supabase
			.from("posts")
			.delete()
			.eq("id", postId)
			.eq("user_id", user.id);

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard/posts");
	} catch (error) {
		console.error("Delete post error:", error);
		throw error;
	}
}
