import type { SocialMediaClient, SocialAccount, PostContent, PublishResult } from "./types"

export class InstagramClient implements SocialMediaClient {
  private clientId: string
  private clientSecret: string
  private redirectUri: string

  constructor() {
    this.clientId = process.env.INSTAGRAM_CLIENT_ID || ""
    this.clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || ""
    this.redirectUri =
      process.env.INSTAGRAM_REDIRECT_URI || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/instagram/callback`
  }

  async connect(userId: string): Promise<string> {
    const state = `${userId}-${Date.now()}`
    const scopes = "user_profile,user_media"

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: scopes,
      response_type: "code",
      state,
    })

    return `https://api.instagram.com/oauth/authorize?${params.toString()}`
  }

  async handleCallback(code: string, state: string): Promise<SocialAccount> {
    try {
      // Exchange code for access token
      const tokenResponse = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: "authorization_code",
          redirect_uri: this.redirectUri,
          code,
        }),
      })

      const tokenData = await tokenResponse.json()

      if (!tokenResponse.ok) {
        throw new Error(tokenData.error_description || "Failed to get access token")
      }

      // Get user info
      const userResponse = await fetch(
        `https://graph.instagram.com/me?fields=id,username&access_token=${tokenData.access_token}`,
      )
      const userData = await userResponse.json()

      const userId = state.split("-")[0]

      return {
        id: "", // Will be set by database
        user_id: userId,
        platform: "instagram",
        account_name: userData.username,
        account_id: userData.id,
        access_token: tokenData.access_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Instagram callback error:", error)
      throw error
    }
  }

  async publish(account: SocialAccount, content: PostContent): Promise<PublishResult> {
    try {
      // Note: Instagram Basic Display API doesn't support posting
      // This would require Instagram Graph API and a business account
      // For demo purposes, we'll simulate a successful post

      console.log("Publishing to Instagram:", {
        account: account.account_name,
        content: content.title,
      })

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        platform_post_id: `ig_${Date.now()}`,
      }
    } catch (error) {
      console.error("Instagram publish error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to publish to Instagram",
      }
    }
  }

  async refreshToken(account: SocialAccount): Promise<SocialAccount> {
    try {
      // Instagram Basic Display API tokens can be refreshed
      const response = await fetch("https://graph.instagram.com/refresh_access_token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "ig_refresh_token",
          access_token: account.access_token,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to refresh token")
      }

      return {
        ...account,
        access_token: data.access_token,
        token_expires_at: new Date(Date.now() + data.expires_in * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Instagram token refresh error:", error)
      throw error
    }
  }

  async getAccountInfo(account: SocialAccount): Promise<any> {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,media_count&access_token=${account.access_token}`,
      )
      return await response.json()
    } catch (error) {
      console.error("Instagram account info error:", error)
      throw error
    }
  }
}
