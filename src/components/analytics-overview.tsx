import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Heart, MessageCircle, Share, TrendingUp, Trophy } from "lucide-react"
import type { AnalyticsOverview } from "@/lib/analytics-service"

interface AnalyticsOverviewProps {
  data: AnalyticsOverview
}

export default function AnalyticsOverviewComponent({ data }: AnalyticsOverviewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  const metrics = [
    {
      title: "Total Posts",
      value: data.totalPosts,
      icon: <Trophy className="h-4 w-4" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Views",
      value: formatNumber(data.totalViews),
      icon: <Eye className="h-4 w-4" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Likes",
      value: formatNumber(data.totalLikes),
      icon: <Heart className="h-4 w-4" />,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Comments",
      value: formatNumber(data.totalComments),
      icon: <MessageCircle className="h-4 w-4" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Shares",
      value: formatNumber(data.totalShares),
      icon: <Share className="h-4 w-4" />,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Avg Engagement Rate",
      value: `${data.avgEngagementRate}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{metric.title}</CardTitle>
            <div className={`${metric.bgColor} ${metric.color} p-2 rounded-lg`}>{metric.icon}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
            {metric.title === "Avg Engagement Rate" && (
              <p className="text-xs text-gray-600 mt-1">Top platform: {data.topPlatform}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
