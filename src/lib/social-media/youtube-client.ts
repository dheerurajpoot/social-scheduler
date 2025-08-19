import type { SocialMediaClient, SocialAccount, PostContent, PublishResult } from "./types"

export class YouTubeClient implements SocialMediaClient {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.YOUTUBE_CLIENT_ID || ""
    this.clientSecret = process.env.YOUTUBE_CLIENT_SECRET || ""
    this.redirectUri =
      process.env.YOUTUBE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/youtube/callback`
  }

  async connect(userId: string): Promise<string> {
    const state = `${userId}-${Date.now()}`
    const scopes = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly"

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes,
      response_type: "code",
      access_type: "offline",
      prompt: "consent",
      state,
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async handleCallback(code: string, state: string): Promise<SocialAccount> {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || "Failed to get access token")
      }

      // Get channel info
      const channelResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&access_token=${tokenData.access_token}`,
      )
      const channelData = await channelResponse.json()

      if (!channelData.items || channelData.items.length === 0) {
        throw new Error("No YouTube channel found")
      }

      const channel = channelData.items[0]
      const userId = state.split("-")[0]

      return {
        id: "", // Will be set by database
        user_id: userId,
        platform: "youtube",
        account_name: channel.snippet.title,
        account_id: channel.id,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("YouTube callback error:", error)
      throw error
    }
  }

  async publish(account: SocialAccount, content: PostContent): Promise<PublishResult> {
    try {
      // Note: YouTube API requires video upload for posting
      // This is a simplified example - real implementation would handle video uploads

      console.log("Publishing to YouTube:", {
        account: account.account_name,
        content: content.title,
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        platform_post_id: `yt_${Date.now()}`,
      }
    } catch (error) {
      console.error("YouTube publish error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to publish to YouTube",
      }
    }
  }

  async refreshToken(account: SocialAccount): Promise<SocialAccount> {
    try {
      const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: account.refresh_token || "",
          grant_type: "refresh_token",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_description || "Failed to refresh token")
      }

      return {
        ...account,
        access_token: data.access_token,
        refresh_token: data.refresh_token || account.refresh_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("YouTube token refresh error:", error)
      throw error
    }
  }

  async getAccountInfo(account: SocialAccount): Promise<any> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${account.account_id}&access_token=${account.access_token}`,
      )
      const data = await response.json()
      return data.items?.[0] || null
    } catch (error) {
      console.error("YouTube account info error:", error)
      throw error
    }
  }
}
