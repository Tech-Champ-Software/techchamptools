"use client"

import { LogOut } from "lucide-react"
import { useAdminAuth } from "@/components/admin-auth"

interface LogoutButtonProps {
  isMobile?: boolean
}

export function LogoutButton({ isMobile = false }: LogoutButtonProps) {
  const { logout, user } = useAdminAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (isMobile) {
    return (
      <button
        onClick={handleLogout}
        className="text-sm font-medium text-muted-foreground hover:text-foreground"
        title={user?.email || "Logout"}
      >
        <LogOut className="h-4 w-4" />
      </button>
    )
  }

  return (
    <div className="space-y-1">
      {user && (
        <p className="text-xs text-muted-foreground truncate px-2" title={user.email || ""}>
          {user.email}
        </p>
      )}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </div>
  )
}
