"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EmployeeLayout } from "@/components/employee-layout"
import { CheckCircle2, Clock, XCircle, DollarSign, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Transaction } from "@/lib/types"

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    label: "Completado",
    className: "bg-emerald-100 text-emerald-700",
    iconClass: "text-emerald-500",
  },
  pending: {
    icon: Clock,
    label: "Procesando",
    className: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-500",
  },
  approved: {
    icon: CheckCircle2,
    label: "Aprobado",
    className: "bg-blue-100 text-blue-700",
    iconClass: "text-blue-500",
  },
  rejected: {
    icon: XCircle,
    label: "Rechazado",
    className: "bg-red-100 text-red-700",
    iconClass: "text-red-500",
  },
}

export default function HistorialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get employee ID
      const { data: employee } = await supabase
        .from("employees")
        .select("id")
        .or(`user_id.eq.${user.id},profile_id.eq.${user.id}`)
        .single()

      if (employee) {
        const { data: txData } = await supabase
          .from("transactions")
          .select("*")
          .eq("employee_id", employee.id)
          .order("created_at", { ascending: false })

        setTransactions(txData || [])
      }

      setIsLoading(false)
    }

    fetchTransactions()
  }, [router, supabase])

  const totalWithdrawn = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.net_amount || 0), 0)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-DO", { day: "numeric", month: "short", year: "numeric" })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })
  }

  if (isLoading) {
    return (
      <EmployeeLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </EmployeeLayout>
    )
  }

  return (
    <EmployeeLayout>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Historial de Retiros</h2>
          <p className="text-sm text-muted-foreground">Todos tus movimientos en Nomi</p>
        </div>

        {/* Summary Card */}
        <Card className="bg-accent/10 border-accent/20">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Retirado</p>
              <p className="text-2xl font-bold text-accent">RD$ {totalWithdrawn.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
          </div>
        </Card>

        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <Card className="p-8 text-center">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">No tienes retiros registrados</p>
            </Card>
          ) : (
            transactions.map((tx) => {
              const config = statusConfig[tx.status as keyof typeof statusConfig] || statusConfig.pending
              const StatusIcon = config.icon

              return (
                <Card key={tx.id} className="overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center`}>
                        <StatusIcon className={`w-5 h-5 ${config.iconClass}`} />
                      </div>
                      <div>
                        <div className="font-medium">Retiro Nomi</div>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(tx.created_at)} - {formatTime(tx.created_at)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">RD$ {(tx.net_amount || 0).toLocaleString()}</div>
                      <Badge className={config.className}>{config.label}</Badge>
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </EmployeeLayout>
  )
}
