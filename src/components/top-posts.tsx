import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Heart, MessageCircle, Share, TrendingUp, Edit } from "lucide-react"
import Link from "next/link"
import type { PostPerformance } from "@/lib/analytics-service"

interface TopPostsProps {
  data: PostPerformance[]
}

export default function TopPosts({ data }: TopPostsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram":
        return "bg-pink-100 text-pink-800"
      case "youtube":
        return "bg-red-100 text-red-800"
      case "facebook":
        return "bg-blue-100 text-blue-800"
      case "twitter":
        return "bg-sky-100 text-sky-800"
      case "linkedin":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your best performing posts by engagement rate</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No analytics data yet</h3>
          <p className="text-gray-600">Publish some posts and check back later to see your top performers.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Posts</CardTitle>
        <CardDescription>Your best performing posts by engagement rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((post, index) => (
            <div
              key={`${post.id}-${post.platform}`}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <Badge className={getPlatformColor(post.platform)}>{post.platform}</Badge>
                    <span className="text-sm text-gray-500">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
                </div>
                <Link href={`/dashboard/posts/${post.id}/edit`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="font-medium">{formatNumber(post.views)}</div>
                    <div className="text-gray-500">Views</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-500" />
                  <div>
                    <div className="font-medium">{formatNumber(post.likes)}</div>
                    <div className="text-gray-500">Likes</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">{formatNumber(post.comments)}</div>
                    <div className="text-gray-500">Comments</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Share className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">{formatNumber(post.shares)}</div>
                    <div className="text-gray-500">Shares</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium">{post.engagementRate}%</div>
                    <div className="text-gray-500">Engagement</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
