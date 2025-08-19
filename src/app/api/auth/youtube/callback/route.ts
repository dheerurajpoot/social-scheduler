import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { YouTubeClient } from "@/lib/social-media/youtube-client";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const code = searchParams.get("code");
	const state = searchParams.get("state");
	const error = searchParams.get("error");

	if (error) {
		return NextResponse.redirect(
			new URL(`/dashboard/accounts?error=${error}`, request.url)
		);
	}

	if (!code || !state) {
		return NextResponse.redirect(
			new URL("/dashboard/accounts?error=missing_parameters", request.url)
		);
	}

	try {
		const client = new YouTubeClient();
		const accountData = await client.handleCallback(code, state);

		const supabase = await createClient();

		// Check if account already exists
		const { data: existingAccount } = await supabase
			.from("social_accounts")
			.select("*")
			.eq("user_id", accountData.user_id)
			.eq("platform", "youtube")
			.eq("account_id", accountData.account_id)
			.single();

		if (existingAccount) {
			// Update existing account
			await supabase
				.from("social_accounts")
				.update({
					access_token: accountData.access_token,
					refresh_token: accountData.refresh_token,
					token_expires_at: accountData.token_expires_at,
					is_active: true,
					updated_at: new Date().toISOString(),
				})
				.eq("id", existingAccount.id);
		} else {
			// Create new account
			await supabase.from("social_accounts").insert(accountData);
		}

		return NextResponse.redirect(
			new URL(
				"/dashboard/accounts?success=youtube_connected",
				request.url
			)
		);
	} catch (error) {
		console.error("YouTube callback error:", error);
		return NextResponse.redirect(
			new URL("/dashboard/accounts?error=connection_failed", request.url)
		);
	}
}
