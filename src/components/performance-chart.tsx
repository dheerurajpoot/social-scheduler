"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import type { TrendData } from "@/lib/analytics-service"

interface PerformanceChartProps {
  data: TrendData[]
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--chart-1))",
    },
    likes: {
      label: "Likes",
      color: "hsl(var(--chart-2))",
    },
    comments: {
      label: "Comments",
      color: "hsl(var(--chart-3))",
    },
    shares: {
      label: "Shares",
      color: "hsl(var(--chart-4))",
    },
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const chartData = data.map((item) => ({
    ...item,
    date: formatDate(item.date),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Engagement metrics over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="var(--color-views)" strokeWidth={2} name="Views" />
              <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} name="Likes" />
              <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} name="Comments" />
              <Line type="monotone" dataKey="shares" stroke="var(--color-shares)" strokeWidth={2} name="Shares" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
