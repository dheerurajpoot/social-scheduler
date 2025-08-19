import type { SocialMediaClient } from "./types"
import { InstagramClient } from "./instagram-client"
import { YouTubeClient } from "./youtube-client"

export class SocialMediaClientFactory {
  static getClient(platform: string): SocialMediaClient {
    switch (platform) {
      case "instagram":
        return new InstagramClient()
      case "youtube":
        return new YouTubeClient()
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  static getSupportedPlatforms() {
    return [
      {
        id: "instagram",
        name: "Instagram",
        icon: "Instagram",
        color: "text-pink-600",
        description: "Share photos and stories",
      },
      {
        id: "youtube",
        name: "YouTube",
        icon: "Youtube",
        color: "text-red-600",
        description: "Upload and share videos",
      },
    ]
  }
}
