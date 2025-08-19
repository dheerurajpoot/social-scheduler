"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Instagram, Youtube, Facebook, Twitter, Linkedin } from "lucide-react"
import type { PlatformAnalytics } from "@/lib/analytics-service"

interface PlatformAnalyticsProps {
  data: PlatformAnalytics[]
}

export default function PlatformAnalyticsComponent({ data }: PlatformAnalyticsProps) {
  const chartConfig = {
    engagementRate: {
      label: "Engagement Rate (%)",
      color: "hsl(var(--chart-1))",
    },
    posts: {
      label: "Posts",
      color: "hsl(var(--chart-2))",
    },
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="h-5 w-5 text-pink-600" />
      case "youtube":
        return <Youtube className="h-5 w-5 text-red-600" />
      case "facebook":
        return <Facebook className="h-5 w-5 text-blue-600" />
      case "twitter":
        return <Twitter className="h-5 w-5 text-sky-600" />
      case "linkedin":
        return <Linkedin className="h-5 w-5 text-blue-700" />
      default:
        return null
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* Platform Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Engagement rates and post counts by platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="engagementRate"
                  fill="var(--color-engagementRate)"
                  name="Engagement Rate (%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Platform Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((platform) => (
          <Card key={platform.platform}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                {getPlatformIcon(platform.platform)}
                <CardTitle className="text-lg capitalize">{platform.platform}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Posts</div>
                  <div className="font-semibold text-lg">{platform.posts}</div>
                </div>
                <div>
                  <div className="text-gray-600">Engagement</div>
                  <div className="font-semibold text-lg">{platform.engagementRate.toFixed(1)}%</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Views</div>
                  <div className="font-medium">{formatNumber(platform.views)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Likes</div>
                  <div className="font-medium">{formatNumber(platform.likes)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Comments</div>
                  <div className="font-medium">{formatNumber(platform.comments)}</div>
                </div>
                <div>
                  <div className="text-gray-600">Shares</div>
                  <div className="font-medium">{formatNumber(platform.shares)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
