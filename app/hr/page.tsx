import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HRLayout } from "@/components/hr-layout"
import { DollarSign, Users, TrendingUp, Clock, ArrowUpRight } from "lucide-react"

export default async function HRDashboard() {
  const supabase = await createClient()

  // Verify user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("role, company_id").eq("id", user.id).single()

  if (!profile || (profile.role !== "hr" && profile.role !== "admin")) {
    redirect("/auth/login")
  }

  // Fetch company data
  const { data: company } = await supabase.from("companies").select("*").eq("id", profile.company_id).single()

  // Fetch employees for this company
  const { data: employees } = await supabase.from("employees").select("*").eq("company_id", profile.company_id)

  // Fetch recent transactions for this company
  const { data: transactions } = await supabase
    .from("transactions")
    .select(
      `
      *,
      employees(full_name)
    `,
    )
    .eq("company_id", profile.company_id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Calculate stats
  const totalCapitalDeployed = employees?.reduce((sum, e) => sum + (e.total_withdrawn || 0), 0) || 0
  const totalPayroll = employees?.reduce((sum, e) => sum + (e.salary || 0), 0) || 0
  const totalEmployees = employees?.length || 0
  const activeEmployees = employees?.filter((e) => e.status === "active").length || 0
  const retirosDelMes = transactions?.length || 0
  const promedioRetiro =
    transactions && transactions.length > 0
      ? Math.round(transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length)
      : 0

  // Format recent withdrawals
  const recentWithdrawals =
    transactions?.map((t) => ({
      id: t.id,
      employee: t.employees?.full_name || "N/A",
      amount: t.amount,
      status: t.status === "completed" ? "completado" : t.status === "pending" ? "procesando" : t.status,
      time: getTimeAgo(new Date(t.created_at)),
    })) || []

  return (
    <HRLayout>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Capital Desplegado</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  RD${" "}
                  {totalCapitalDeployed >= 1000000
                    ? `${(totalCapitalDeployed / 1000000).toFixed(1)}M`
                    : totalCapitalDeployed >= 1000
                      ? `${(totalCapitalDeployed / 1000).toFixed(0)}K`
                      : totalCapitalDeployed.toLocaleString()}
                </p>
                <div className="flex items-center text-xs text-emerald-600 mt-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  Total retirado
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Nómina Total</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  RD${" "}
                  {totalPayroll >= 1000000 ? `${(totalPayroll / 1000000).toFixed(2)}M` : totalPayroll.toLocaleString()}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Colaboradores</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalEmployees}</p>
                <p className="text-xs text-slate-500 mt-1">{activeEmployees} activos</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Retiros del Mes</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{retirosDelMes}</p>
                <p className="text-xs text-slate-500 mt-1">Prom: RD$ {promedioRetiro.toLocaleString()}</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Info Card */}
      {company && (
        <Card className="mb-8 border-emerald-200 bg-emerald-50">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-emerald-900">{company.name}</h3>
                <p className="text-sm text-emerald-700">Plan Premium - Comisión RD$75 por retiro</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  Porcentaje Retiro: {company.availability_percentage || 50}%
                </Badge>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  Frecuencia:{" "}
                  {company.payment_frequency === "weekly"
                    ? "Semanal"
                    : company.payment_frequency === "biweekly"
                      ? "Quincenal"
                      : "Mensual"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimos retiros de sus colaboradores</CardDescription>
        </CardHeader>
        <CardContent>
          {recentWithdrawals.length > 0 ? (
            <div className="space-y-4">
              {recentWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">{withdrawal.employee}</div>
                      <div className="text-sm text-slate-500">{withdrawal.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">RD$ {withdrawal.amount.toLocaleString()}</div>
                    <Badge
                      className={
                        withdrawal.status === "completado"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    >
                      {withdrawal.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No hay retiros recientes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </HRLayout>
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
