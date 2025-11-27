"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmployeeLayout } from "@/components/employee-layout"
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Employee, Company } from "@/lib/types"

export default function EmployeeDashboard() {
  const [withdrawAmount, setWithdrawAmount] = useState([500])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const router = useRouter()

  const supabase = createClient()
  const commission = 75

  useEffect(() => {
    async function fetchEmployeeData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Fetch employee record
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (employeeError || !employeeData) {
        // Try by profile_id
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        if (profile) {
          const { data: empByProfile } = await supabase
            .from("employees")
            .select("*")
            .eq("profile_id", profile.id)
            .single()

          if (empByProfile) {
            setEmployee(empByProfile)
            // Fetch company
            const { data: companyData } = await supabase
              .from("companies")
              .select("*")
              .eq("id", empByProfile.company_id)
              .single()
            setCompany(companyData)
          }
        }
      } else {
        setEmployee(employeeData)
        // Fetch company
        const { data: companyData } = await supabase
          .from("companies")
          .select("*")
          .eq("id", employeeData.company_id)
          .single()
        setCompany(companyData)
      }

      setIsLoading(false)
    }

    fetchEmployeeData()
  }, [router, supabase])

  // Calculate values based on real data
  const userName = employee?.full_name || "Usuario"
  const totalSalary = employee?.salary || 0
  const availablePercentage = company?.availability_percentage || 50
  const maxAvailable = (totalSalary * availablePercentage) / 100
  const availableToWithdraw = Math.min(employee?.available_balance || 0, maxAvailable)
  const progressPercentage = totalSalary > 0 ? (availableToWithdraw / totalSalary) * 100 : 0
  const receivedAmount = withdrawAmount[0] - commission

  // Calculate work cycle days (assuming biweekly)
  const today = new Date()
  const dayOfMonth = today.getDate()
  const workCycleDay = dayOfMonth <= 15 ? dayOfMonth : dayOfMonth - 15
  const totalCycleDays = 15

  const handleWithdrawalRequest = () => {
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmWithdrawal = async () => {
    if (!employee || !company) return

    setIsProcessing(true)

    try {
      // Create transaction in Supabase
      const { error: txError } = await supabase.from("transactions").insert({
        employee_id: employee.id,
        company_id: employee.company_id,
        amount: withdrawAmount[0],
        commission: commission,
        net_amount: receivedAmount,
        status: "pending",
        bank_name: employee.bank_name,
        bank_account: employee.bank_account,
      })

      if (txError) throw txError

      // Update employee available balance
      const newBalance = (employee.available_balance || 0) - withdrawAmount[0]
      const newTotalWithdrawn = (employee.total_withdrawn || 0) + withdrawAmount[0]

      const { error: empError } = await supabase
        .from("employees")
        .update({
          available_balance: newBalance,
          total_withdrawn: newTotalWithdrawn,
        })
        .eq("id", employee.id)

      if (empError) throw empError

      // Update local state
      setEmployee({
        ...employee,
        available_balance: newBalance,
        total_withdrawn: newTotalWithdrawn,
      })

      setIsSuccess(true)
    } catch (error) {
      console.log("[v0] Error processing withdrawal:", error)
      alert("Error al procesar el retiro. Intente nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCloseSuccess = () => {
    setIsSuccess(false)
    setIsConfirmDialogOpen(false)
    setWithdrawAmount([500])
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
      <div className="px-6 py-8 space-y-8">
        {/* Greeting */}
        <div>
          <h3 className="text-lg font-bold">Hola, {userName.split(" ")[0]}</h3>
          <p className="text-sm text-muted-foreground">Bienvenido a Nomi</p>
        </div>

        {/* The Money Ring - Circular Progress */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-64 h-64">
            <svg className="w-64 h-64 -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" className="fill-none stroke-muted" strokeWidth="12" />
              <circle
                cx="100"
                cy="100"
                r="85"
                className="fill-none stroke-accent transition-all duration-500"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${progressPercentage * 5.34} 534`}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xs text-muted-foreground mb-1">Tu dinero disponible</div>
              <div className="text-4xl font-bold text-foreground">RD$ {availableToWithdraw.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-2">
                Día {workCycleDay} de {totalCycleDays}
              </div>
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-sm text-muted-foreground">Tu Salario Quincenal</div>
            <div className="text-2xl font-bold text-foreground">RD$ {totalSalary.toLocaleString()}</div>
          </div>
        </div>

        {/* Withdrawal Action Card */}
        <Card className="bg-card border-2 border-border shadow-lg">
          <div className="p-6 space-y-6">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-4">¿Cuánto necesitas?</div>

              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-accent">RD$ {withdrawAmount[0].toLocaleString()}</div>
              </div>

              <Slider
                value={withdrawAmount}
                onValueChange={setWithdrawAmount}
                max={Math.max(availableToWithdraw, 500)}
                min={500}
                step={500}
                className="w-full mb-3"
                disabled={availableToWithdraw < 500}
              />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>RD$ 500</span>
                <span>RD$ {availableToWithdraw.toLocaleString()}</span>
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monto solicitado</span>
                <span className="font-semibold">RD$ {withdrawAmount[0].toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Comisión Nomi</span>
                <span className="font-semibold">RD$ {commission}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-foreground">Recibes en tu cuenta</span>
                <span className="text-2xl font-bold text-accent">RD$ {receivedAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* Main Action Button */}
            <Button
              size="lg"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg h-14 text-base font-bold"
              onClick={handleWithdrawalRequest}
              disabled={availableToWithdraw < 500 || withdrawAmount[0] > availableToWithdraw}
            >
              {availableToWithdraw < 500 ? "Saldo insuficiente" : "Solicitar Retiro"}
              {availableToWithdraw >= 500 && <ArrowRight className="w-5 h-5 ml-2" />}
            </Button>

            <div className="text-xs text-center text-muted-foreground">
              Se descontará automáticamente de tu próxima quincena
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="max-w-sm">
          {!isSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle>Confirmar Retiro</DialogTitle>
                <DialogDescription>Estás a punto de solicitar un retiro de tu salario devengado.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monto solicitado</span>
                    <span className="font-semibold">RD$ {withdrawAmount[0].toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="font-semibold">RD$ {commission}</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between">
                    <span className="font-bold">Recibirás</span>
                    <span className="text-xl font-bold text-accent">RD$ {receivedAmount.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  El monto será depositado en tu cuenta bancaria registrada en minutos.
                </p>
              </div>
              <DialogFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12"
                  onClick={handleConfirmWithdrawal}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Retiro"
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setIsConfirmDialogOpen(false)}
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center py-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">¡Solicitud Exitosa!</h3>
                  <p className="text-muted-foreground">
                    Tu retiro de <span className="font-bold text-accent">RD$ {receivedAmount.toLocaleString()}</span>{" "}
                    está en camino.
                  </p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3 w-full text-center">
                  <p className="text-xs text-muted-foreground">
                    Recibirás el dinero en tu cuenta en los próximos minutos.
                  </p>
                </div>
              </div>
              <Button
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleCloseSuccess}
              >
                Entendido
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </EmployeeLayout>
  )
}
