"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  content: string
  status: string
  scheduled_at: string | null
  created_at: string
}

interface CalendarViewProps {
  posts: Post[]
}

export default function CalendarView({ posts }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week">("month")

  // Get the first day of the current month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

  // Get the first day of the calendar grid (might be from previous month)
  const firstDayOfCalendar = new Date(firstDayOfMonth)
  firstDayOfCalendar.setDate(firstDayOfCalendar.getDate() - firstDayOfMonth.getDay())

  // Generate calendar days
  const calendarDays = []
  const currentCalendarDate = new Date(firstDayOfCalendar)

  for (let i = 0; i < 42; i++) {
    // 6 weeks * 7 days
    calendarDays.push(new Date(currentCalendarDate))
    currentCalendarDate.setDate(currentCalendarDate.getDate() + 1)
  }

  // Group posts by date
  const postsByDate = posts.reduce(
    (acc, post) => {
      if (post.scheduled_at) {
        const date = new Date(post.scheduled_at).toDateString()
        if (!acc[date]) acc[date] = []
        acc[date].push(post)
      }
      return acc
    },
    {} as Record<string, Post[]>,
  )

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "published":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>{formatMonthYear(currentDate)}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("month")}
                  className="h-8"
                >
                  Month
                </Button>
                <Button
                  variant={view === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("week")}
                  className="h-8"
                >
                  Week
                </Button>
              </div>
              <Link href="/dashboard/posts/new">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" />
                  New Post
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-0">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="p-4 text-center font-medium text-gray-600 border-r last:border-r-0">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const dateString = date.toDateString()
              const dayPosts = postsByDate[dateString] || []
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <div
                  key={index}
                  className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${
                    !isCurrentMonthDay ? "bg-gray-50 text-gray-400" : "bg-white"
                  } ${isTodayDate ? "bg-blue-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-sm font-medium ${
                        isTodayDate
                          ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          : ""
                      }`}
                    >
                      {date.getDate()}
                    </span>
                  </div>

                  {/* Posts for this day */}
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <Link key={post.id} href={`/dashboard/posts/${post.id}/edit`}>
                        <div className="text-xs p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer truncate">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="truncate">{post.title}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">+{dayPosts.length - 3} more</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">Post Status:</span>
              <div className="flex items-center space-x-3">
                <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>
                <Badge className="bg-green-100 text-green-800">Published</Badge>
                <Badge className="bg-red-100 text-red-800">Failed</Badge>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Total scheduled posts: {posts.filter((p) => p.status === "scheduled").length}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
