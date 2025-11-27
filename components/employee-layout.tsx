"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Home, Clock, User, MessageCircle, Gift } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/dashboard/historial", label: "Historial", icon: Clock },
  { href: "/dashboard/cuenta", label: "Mi Cuenta", icon: User },
  { href: "/dashboard/soporte", label: "Soporte", icon: MessageCircle },
]

export function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [userName, setUserName] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchUserData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()
        if (profile) {
          setUserName(profile.full_name)
        }
      }
    }
    fetchUserData()
  }, [supabase])

  const initials = userName
    ? userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
    : "U"

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Container */}
      <div className="max-w-md mx-auto min-h-screen bg-background flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <Link href="/dashboard">
              <div className="flex items-center gap-2">
                <div className="text-xl">💚</div>
                <span className="font-bold text-lg">Nomi</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <button className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <Link href="/dashboard/cuenta">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                  {initials}
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Bottom Navigation */}
        <div className="sticky bottom-0 bg-background border-t border-border safe-area-inset-bottom">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs mt-1">{item.label}</span>
                </Link>
              )
            })}
            <Link
              href="/dashboard/invitar"
              className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${pathname === "/dashboard/invitar" ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              <Gift className="w-5 h-5" />
              <span className="text-xs mt-1">Invitar</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
