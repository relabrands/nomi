"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  showIcon?: boolean
  showText?: boolean
  className?: string
}

export function LogoutButton({ variant = "ghost", showIcon = true, showText = true, className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  return (
    <Button variant={variant} onClick={handleLogout} disabled={isLoading} className={className}>
      {showIcon && <LogOut className="h-4 w-4" />}
      {showText && <span className={showIcon ? "ml-2" : ""}>Cerrar Sesión</span>}
    </Button>
  )
}
