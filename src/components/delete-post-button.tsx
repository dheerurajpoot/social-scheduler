"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePost } from "@/lib/post-actions"
import { useTransition } from "react"

interface DeletePostButtonProps {
  postId: string
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deletePost(postId)
        } catch (error) {
          alert("Failed to delete post. Please try again.")
        }
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isPending ? "Deleting..." : "Delete"}
    </Button>
  )
}
