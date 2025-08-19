import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import PostsList from "@/components/posts-list"

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>
              <p className="text-sm text-gray-600">Manage your social media posts</p>
            </div>
            <Link href="/dashboard/posts/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostsList />
      </main>
    </div>
  )
}
