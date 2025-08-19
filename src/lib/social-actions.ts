"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SocialMediaClientFactory } from "./social-media/client-factory";

export async function connectSocialAccount(platform: string) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	try {
		const client = SocialMediaClientFactory.getClient(platform);
		const authUrl = await client.connect(user.id);
		redirect(authUrl);
	} catch (error) {
		console.error("Connect social account error:", error);
		throw error;
	}
}

export async function disconnectSocialAccount(accountId: string) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	try {
		const { error } = await supabase
			.from("social_accounts")
			.delete()
			.eq("id", accountId)
			.eq("user_id", user.id);

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/accounts");
	} catch (error) {
		console.error("Disconnect social account error:", error);
		throw error;
	}
}

export async function toggleAccountStatus(
	accountId: string,
	isActive: boolean
) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	try {
		const { error } = await supabase
			.from("social_accounts")
			.update({
				is_active: isActive,
				updated_at: new Date().toISOString(),
			})
			.eq("id", accountId)
			.eq("user_id", user.id);

		if (error) {
			throw error;
		}

		revalidatePath("/dashboard");
		revalidatePath("/dashboard/accounts");
	} catch (error) {
		console.error("Toggle account status error:", error);
		throw error;
	}
}
