import { createClient } from "@/lib/supabase/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Instagram,
	Youtube,
	Settings,
	CheckCircle,
	XCircle,
} from "lucide-react";
import { SocialMediaClientFactory } from "@/lib/social-media/client-factory";
import { ConnectAccountButton } from "./connect-account-button";
import { DisconnectAccountButton } from "./disconnect-account-button";
import { ToggleAccountButton } from "./toggle-account-button";

export default async function SocialAccountsManager() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// Get connected accounts
	const { data: connectedAccounts } = await supabase
		.from("social_accounts")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	const supportedPlatforms = SocialMediaClientFactory.getSupportedPlatforms();

	const getIcon = (platform: string) => {
		switch (platform) {
			case "instagram":
				return <Instagram className='h-6 w-6' />;
			case "youtube":
				return <Youtube className='h-6 w-6' />;
			default:
				return <Settings className='h-6 w-6' />;
		}
	};

	const getConnectedAccount = (platformId: string) => {
		return connectedAccounts?.find(
			(account: any) => account.platform === platformId
		);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	return (
		<div className='space-y-6'>
			<Card>
				<CardHeader>
					<CardTitle>Social Media Accounts</CardTitle>
					<CardDescription>
						Connect your social media accounts to start scheduling
						and publishing posts
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{supportedPlatforms.map((platform) => {
							const connectedAccount = getConnectedAccount(
								platform.id
							);

							return (
								<Card key={platform.id} className='relative'>
									<CardHeader>
										<div className='flex items-center justify-between'>
											<div className='flex items-center space-x-3'>
												<div className={platform.color}>
													{getIcon(platform.id)}
												</div>
												<div>
													<CardTitle className='text-lg'>
														{platform.name}
													</CardTitle>
													<CardDescription>
														{platform.description}
													</CardDescription>
												</div>
											</div>
											{connectedAccount && (
												<div className='flex items-center space-x-2'>
													{connectedAccount.is_active ? (
														<CheckCircle className='h-5 w-5 text-green-600' />
													) : (
														<XCircle className='h-5 w-5 text-gray-400' />
													)}
												</div>
											)}
										</div>
									</CardHeader>
									<CardContent>
										{connectedAccount ? (
											<div className='space-y-4'>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>
															Account:
														</span>
														<span className='text-sm text-gray-600'>
															{
																connectedAccount.account_name
															}
														</span>
													</div>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>
															Connected:
														</span>
														<span className='text-sm text-gray-600'>
															{formatDate(
																connectedAccount.created_at
															)}
														</span>
													</div>
													<div className='flex items-center justify-between'>
														<span className='text-sm font-medium'>
															Status:
														</span>
														<Badge
															className={
																connectedAccount.is_active
																	? "bg-green-100 text-green-800"
																	: "bg-gray-100 text-gray-800"
															}>
															{connectedAccount.is_active
																? "Active"
																: "Inactive"}
														</Badge>
													</div>
												</div>

												<div className='flex items-center justify-between pt-4 border-t'>
													<div className='flex items-center space-x-2'>
														<span className='text-sm'>
															Enable posting:
														</span>
														<ToggleAccountButton
															accountId={
																connectedAccount.id
															}
															isActive={
																connectedAccount.is_active
															}
														/>
													</div>
													<DisconnectAccountButton
														accountId={
															connectedAccount.id
														}
														platformName={
															platform.name
														}
													/>
												</div>
											</div>
										) : (
											<div className='text-center py-4'>
												<p className='text-sm text-gray-600 mb-4'>
													Connect your {platform.name}{" "}
													account to start scheduling
													posts
												</p>
												<ConnectAccountButton
													platform={platform.id}
													platformName={platform.name}
												/>
											</div>
										)}
									</CardContent>
								</Card>
							);
						})}
					</div>
				</CardContent>
			</Card>

			{connectedAccounts && connectedAccounts.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle>Account Statistics</CardTitle>
						<CardDescription>
							Overview of your connected social media accounts
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
							<div className='text-center p-4 border rounded-lg'>
								<div className='text-2xl font-bold text-blue-600'>
									{connectedAccounts.length}
								</div>
								<div className='text-sm text-gray-600'>
									Connected Accounts
								</div>
							</div>
							<div className='text-center p-4 border rounded-lg'>
								<div className='text-2xl font-bold text-green-600'>
									{
										connectedAccounts.filter(
											(account: any) => account.is_active
										).length
									}
								</div>
								<div className='text-sm text-gray-600'>
									Active Accounts
								</div>
							</div>
							<div className='text-center p-4 border rounded-lg'>
								<div className='text-2xl font-bold text-gray-600'>
									{
										new Set(
											connectedAccounts.map(
												(account: any) =>
													account.platform
											)
										).size
									}
								</div>
								<div className='text-sm text-gray-600'>
									Platforms
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
