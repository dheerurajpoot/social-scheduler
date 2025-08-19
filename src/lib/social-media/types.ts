export interface SocialAccount {
  id: string
  user_id: string
  platform: "instagram" | "youtube" | "facebook" | "twitter" | "linkedin"
  account_name: string
  account_id: string
  access_token?: string
  refresh_token?: string
  token_expires_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PostContent {
  title: string
  content: string
  media_urls?: string[]
  scheduled_at?: string
}

export interface PublishResult {
  success: boolean
  platform_post_id?: string
  error?: string
}

export interface SocialMediaClient {
  connect(userId: string): Promise<string> // Returns OAuth URL
  handleCallback(code: string, state: string): Promise<SocialAccount>
  publish(account: SocialAccount, content: PostContent): Promise<PublishResult>
  refreshToken(account: SocialAccount): Promise<SocialAccount>
  getAccountInfo(account: SocialAccount): Promise<any>
}
