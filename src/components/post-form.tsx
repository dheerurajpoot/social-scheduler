"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Save, Calendar } from "lucide-react"
import { createPost, updatePost } from "@/lib/post-actions"

interface PostFormProps {
  post?: {
    id: string
    title: string
    content: string
    status: string
    scheduled_at?: string
  }
  mode?: "create" | "edit"
}

function SubmitButton({ mode = "create" }: { mode?: "create" | "edit" }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-blue-600 hover:bg-blue-700">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {mode === "create" ? "Creating..." : "Updating..."}
        </>
      ) : (
        <>
          <Save className="mr-2 h-4 w-4" />
          {mode === "create" ? "Create Post" : "Update Post"}
        </>
      )}
    </Button>
  )
}

export default function PostForm({ post, mode = "create" }: PostFormProps) {
  const action = mode === "create" ? createPost : updatePost.bind(null, post?.id || "")
  const [state, formAction] = useActionState(action, null)

  // Format datetime for input
  const formatDateTimeLocal = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toISOString().slice(0, 16)
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>{mode === "create" ? "Create New Post" : "Edit Post"}</span>
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Create a new social media post to schedule across your platforms"
            : "Update your post content and scheduling"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          {state?.success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {state.success}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Post Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter a catchy title for your post"
                defaultValue={post?.title || ""}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content here..."
                defaultValue={post?.content || ""}
                required
                rows={6}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={post?.status || "draft"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
                <Input
                  id="scheduledAt"
                  name="scheduledAt"
                  type="datetime-local"
                  defaultValue={formatDateTimeLocal(post?.scheduled_at)}
                  className="h-12"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <SubmitButton mode={mode} />
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
