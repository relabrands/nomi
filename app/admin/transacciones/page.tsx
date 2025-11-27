import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminLayout } from "@/components/admin-layout"
import { Activity, Download, DollarSign, TrendingUp, Clock } from "lucide-react"

type Transaction = {
  id: string
  employee: string
  company: string
  amount: number
  commission: number
  netAmount: number
  status: "completed" | "pending" | "failed"
  date: string
  time: string
}

export default async function TransaccionesPage() {
  const supabase = await createClient()

  // Verify admin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/auth/login")
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      employees(full_name),
      companies:company_id(name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100)

  const txList = transactions || []

  // Calculate stats
  const totalAmount = txList.reduce((sum, t) => sum + (t.amount || 0), 0)
  const totalCommissions = txList.reduce((sum, t) => sum + (t.commission || 0), 0)
  const completedCount = txList.filter((t) => t.status === "completed").length
  const processingCount = txList.filter((t) => t.status === "pending").length

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("es-DO", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("es-DO", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Transacciones</p>
                <p className="text-2xl font-bold">{txList.length}</p>
              </div>
              <Activity className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Monto Total</p>
                <p className="text-2xl font-bold">RD$ {totalAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Comisiones Generadas</p>
                <p className="text-2xl font-bold text-emerald-600">RD$ {totalCommissions.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">En Proceso</p>
                <p className="text-2xl font-bold text-yellow-600">{processingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Historial de Transacciones
              </CardTitle>
              <CardDescription>Todas las transacciones de retiro en la plataforma</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Neto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No hay transacciones registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  txList.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-medium">{tx.employees?.full_name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tx.companies?.name?.split(" ")[0] || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>RD$ {tx.amount?.toLocaleString()}</TableCell>
                      <TableCell className="text-emerald-600">RD$ {tx.commission || 0}</TableCell>
                      <TableCell>RD$ {tx.net_amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            tx.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : tx.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }
                        >
                          {tx.status === "completed"
                            ? "Completado"
                            : tx.status === "pending"
                              ? "Procesando"
                              : tx.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{formatDate(tx.created_at)}</div>
                        <div className="text-xs text-slate-500">{formatTime(tx.created_at)}</div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-slate-500">Mostrando {txList.length} transacciones</div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
