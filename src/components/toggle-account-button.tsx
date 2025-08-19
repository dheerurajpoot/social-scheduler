"use client"

import { Switch } from "@/components/ui/switch"
import { toggleAccountStatus } from "@/lib/social-actions"
import { useTransition } from "react"

interface ToggleAccountButtonProps {
  accountId: string
  isActive: boolean
}

export function ToggleAccountButton({ accountId, isActive }: ToggleAccountButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      try {
        await toggleAccountStatus(accountId, checked)
      } catch (error) {
        console.error("Failed to toggle account status:", error)
        alert("Failed to update account status. Please try again.")
      }
    })
  }

  return <Switch checked={isActive} onCheckedChange={handleToggle} disabled={isPending} />
}
