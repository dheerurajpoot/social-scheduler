"use client"

import { Button } from "@/components/ui/button"
import { connectSocialAccount } from "@/lib/social-actions"
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

interface ConnectAccountButtonProps {
  platform: string
  platformName: string
}

export function ConnectAccountButton({ platform, platformName }: ConnectAccountButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleConnect = () => {
    startTransition(async () => {
      try {
        await connectSocialAccount(platform)
      } catch (error) {
        console.error("Failed to connect account:", error)
        alert("Failed to connect account. Please try again.")
      }
    })
  }

  return (
    <Button onClick={handleConnect} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        `Connect ${platformName}`
      )}
    </Button>
  )
}
