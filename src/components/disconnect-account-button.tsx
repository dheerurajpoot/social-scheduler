"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { disconnectSocialAccount } from "@/lib/social-actions"
import { useTransition } from "react"

interface DisconnectAccountButtonProps {
  accountId: string
  platformName: string
}

export function DisconnectAccountButton({ accountId, platformName }: DisconnectAccountButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleDisconnect = () => {
    if (confirm(`Are you sure you want to disconnect your ${platformName} account? This action cannot be undone.`)) {
      startTransition(async () => {
        try {
          await disconnectSocialAccount(accountId)
        } catch (error) {
          console.error("Failed to disconnect account:", error)
          alert("Failed to disconnect account. Please try again.")
        }
      })
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDisconnect}
      disabled={isPending}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
    >
      <Trash2 className="h-4 w-4 mr-1" />
      {isPending ? "Disconnecting..." : "Disconnect"}
    </Button>
  )
}
