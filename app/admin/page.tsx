import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { Building2, DollarSign, TrendingUp, AlertTriangle, Users, ArrowUpRight } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Verify user is authenticated and is admin
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

  // Fetch companies data
  const { data: companies } = await supabase.from("companies").select("*")

  // Fetch employees count
  const { data: employees } = await supabase.from("employees").select("id, status")

  // Fetch transactions
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
    .limit(10)

  // Calculate stats from real data
  const totalColocado = companies?.reduce((sum, c) => sum + (c.credit_used || 0), 0) || 0
  const totalIngresos = transactions?.reduce((sum, t) => sum + (t.commission || 0), 0) || 0
  const empresasActivas = companies?.filter((c) => c.status === "active").length || 0
  const totalEmpresas = companies?.length || 0
  const totalEmpleados = employees?.length || 0
  const activeEmpleados = employees?.filter((e) => e.status === "active").length || 0

  // Companies near credit limit (alerts)
  const alerts =
    companies
      ?.filter((c) => {
        const percentage = c.credit_limit > 0 ? (c.credit_used / c.credit_limit) * 100 : 0
        return percentage >= 70
      })
      .map((c) => ({
        company: c.name,
        percentage: Math.round((c.credit_used / c.credit_limit) * 100),
      })) || []

  // Format recent transactions
  const recentTransactions =
    transactions?.map((t) => ({
      id: t.id,
      employee: t.employees?.full_name || "N/A",
      company: t.companies?.name || "N/A",
      amount: t.amount,
      status: t.status === "completed" ? "completado" : t.status === "pending" ? "procesando" : t.status,
      time: getTimeAgo(new Date(t.created_at)),
    })) || []

  return (
    <AdminLayout>
      {/* Global Stats */}
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-slate-900">Vista Global de Capital</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colocado</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                RD${" "}
                {totalColocado >= 1000000 ? `${(totalColocado / 1000000).toFixed(1)}M` : totalColocado.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-emerald-600 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Capital activo
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos Comisiones</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                RD${" "}
                {totalIngresos >= 1000000 ? `${(totalIngresos / 1000000).toFixed(2)}M` : totalIngresos.toLocaleString()}
              </div>
              <div className="flex items-center text-xs text-emerald-600 mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                Total acumulado
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Activas</CardTitle>
              <Building2 className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{empresasActivas}</div>
              <p className="text-xs text-slate-500">De {totalEmpresas} totales</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmpleados.toLocaleString()}</div>
              <p className="text-xs text-slate-500">{activeEmpleados} activos</p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-900">Tasa de Mora</CardTitle>
              <AlertTriangle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700">0.0%</div>
              <p className="text-xs text-emerald-700">Métrica crucial</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Actividad del Mes</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl font-bold text-slate-900">{transactions?.length || 0}</div>
              <div className="text-sm text-slate-500">Retiros Procesados</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-3xl font-bold text-slate-900">
                RD${" "}
                {transactions && transactions.length > 0
                  ? Math.round(
                      transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length,
                    ).toLocaleString()
                  : 0}
              </div>
              <div className="text-sm text-slate-500">Promedio por Retiro</div>
            </div>
          </CardContent>
        </Card>

        {/* Risk & Alerts */}
        {alerts.length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <AlertTriangle className="h-5 w-5" />
                Alertas del Sistema
              </CardTitle>
              <CardDescription className="text-amber-800">Empresas que requieren atención</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-lg bg-white p-3 text-sm">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-slate-700">
                      <strong>{alert.company}</strong> alcanzó el {alert.percentage}% de su límite.
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {alerts.length === 0 && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <TrendingUp className="h-5 w-5" />
                Todo en Orden
              </CardTitle>
              <CardDescription className="text-emerald-800">No hay alertas pendientes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-emerald-700">
                Todas las empresas están operando dentro de sus límites de crédito.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimos retiros procesados en la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">{tx.employee}</div>
                      <div className="text-sm text-slate-500">{tx.company}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">RD$ {tx.amount.toLocaleString()}</div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={tx.status === "completado" ? "default" : "secondary"}
                        className={
                          tx.status === "completado"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {tx.status}
                      </Badge>
                      <span className="text-xs text-slate-400">{tx.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No hay transacciones recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Ahora"
  if (diffMins < 60) return `Hace ${diffMins} min`
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`
  return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`
}
