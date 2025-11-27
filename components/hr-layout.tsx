"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, Activity, Settings, Menu, X, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/hr", label: "Dashboard", icon: LayoutDashboard },
  { href: "/hr/colaboradores", label: "Colaboradores", icon: Users },
  { href: "/hr/retiros", label: "Retiros", icon: Activity },
  { href: "/hr/configuracion", label: "Configuración", icon: Settings },
]

export function HRLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [companyName, setCompanyName] = useState("")
  const [employeeCount, setEmployeeCount] = useState(0)
  const [userName, setUserName] = useState("")
  const supabase = createClient()

  useEffect(() => {
    async function fetchHRData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get profile
      const { data: profile } = await supabase.from("profiles").select("full_name, company_id").eq("id", user.id).single()

      if (profile) {
        setUserName(profile.full_name)

        if (profile.company_id) {
          // Get company name
          const { data: company } = await supabase
            .from("companies")
            .select("name")
            .eq("id", profile.company_id)
            .single()

          if (company) setCompanyName(company.name)

          // Get employee count
          const { count } = await supabase
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("company_id", profile.company_id)
            .eq("status", "active")

          setEmployeeCount(count || 0)
        }
      }
    }

    fetchHRData()
  }, [supabase])

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <div className="flex items-center gap-2">
            <div className="text-2xl">💚</div>
            <div>
              <div className="font-bold text-lg">Nomi</div>
              <div className="text-xs text-slate-400">Portal RRHH</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-slate-800"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold">
              {companyName ? companyName.charAt(0) : "C"}
            </div>
            <div>
              <div className="text-sm font-medium">{companyName || "Cargando..."}</div>
              <div className="text-xs text-slate-400">{userName || "Admin RRHH"}</div>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Panel de Recursos Humanos</h1>
              <p className="text-xs text-slate-500">Gestión de nómina y colaboradores</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            {employeeCount} Colaboradores Activos
          </Badge>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
