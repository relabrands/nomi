"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { HRLayout } from "@/components/hr-layout"
import { Search, Plus, Upload, Download, Edit, UserX, UserCheck, Users, Loader2 } from "lucide-react"
import type { Employee, Company } from "@/lib/types"

export default function ColaboradoresHRPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const supabase = createClient()

  const [newEmployeeForm, setNewEmployeeForm] = useState({
    employeeCode: "",
    cedula: "",
    name: "",
    email: "",
    monthlySalary: "",
  })

  useEffect(() => {
    async function fetchData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Get profile with company_id
      const { data: profile } = await supabase.from("profiles").select("company_id").eq("id", user.id).single()

      if (!profile?.company_id) {
        setIsLoading(false)
        return
      }

      // Fetch company
      const { data: companyData } = await supabase.from("companies").select("*").eq("id", profile.company_id).single()

      setCompany(companyData)

      // Fetch employees
      const { data: employeesData } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", profile.company_id)
        .order("created_at", { ascending: false })

      setEmployees(employeesData || [])
      setIsLoading(false)
    }

    fetchData()
  }, [supabase])

  const companyWithdrawalPercentage = company?.availability_percentage || 50

  const filteredEmployees = employees.filter(
    (e) =>
      e.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cedula?.includes(searchTerm) ||
      e.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    let password = ""
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleAddEmployee = async () => {
    if (!company) return

    setIsSaving(true)
    const generatedPassword = generatePassword()
    const salary = Number.parseFloat(newEmployeeForm.monthlySalary) || 0
    const maxWithdrawal = (salary * companyWithdrawalPercentage) / 100

    const { data, error } = await supabase
      .from("employees")
      .insert({
        company_id: company.id,
        employee_code: newEmployeeForm.employeeCode,
        cedula: newEmployeeForm.cedula,
        full_name: newEmployeeForm.name,
        email: newEmployeeForm.email,
        salary: salary,
        available_balance: maxWithdrawal,
        total_withdrawn: 0,
        status: "active",
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Error adding employee:", error)
      alert("Error al agregar colaborador: " + error.message)
    } else if (data) {
      setEmployees([data, ...employees])
      setAddDialogOpen(false)
      setNewEmployeeForm({
        employeeCode: "",
        cedula: "",
        name: "",
        email: "",
        monthlySalary: "",
      })

      alert(
        `Colaborador agregado exitosamente!\n\nSe enviará un correo de bienvenida a ${data.email} con:\n- Usuario: ${data.email}\n- Contraseña temporal: ${generatedPassword}`,
      )
    }
    setIsSaving(false)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee({ ...employee })
    setEditDialogOpen(true)
  }

  const handleSaveEdit = async () => {
    if (!editingEmployee) return

    setIsSaving(true)
    const salary = editingEmployee.salary
    const maxWithdrawal = (salary * companyWithdrawalPercentage) / 100

    const { error } = await supabase
      .from("employees")
      .update({
        employee_code: editingEmployee.employee_code,
        cedula: editingEmployee.cedula,
        full_name: editingEmployee.full_name,
        email: editingEmployee.email,
        salary: salary,
        available_balance: maxWithdrawal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingEmployee.id)

    if (error) {
      console.log("[v0] Error updating employee:", error)
      alert("Error al actualizar colaborador")
    } else {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...editingEmployee,
                available_balance: maxWithdrawal,
              }
            : emp,
        ),
      )
      setEditDialogOpen(false)
      setEditingEmployee(null)
    }
    setIsSaving(false)
  }

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active"

    const { error } = await supabase
      .from("employees")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id)

    if (error) {
      console.log("[v0] Error toggling status:", error)
      alert("Error al cambiar el estado")
    } else {
      setEmployees(
        employees.map((emp) =>
          emp.id === id ? { ...emp, status: newStatus as "active" | "suspended" | "pending" } : emp,
        ),
      )
    }
  }

  if (isLoading) {
    return (
      <HRLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </HRLayout>
    )
  }

  return (
    <HRLayout>
      {/* Info Banner */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="text-blue-600 text-xl">i</div>
            <div>
              <p className="text-sm text-blue-800">
                <strong>Porcentaje de Retiro:</strong> El administrador ha configurado que los colaboradores pueden
                retirar hasta el <strong>{companyWithdrawalPercentage}%</strong> de su salario. El máximo de retiro se
                calcula automáticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestión de Colaboradores
              </CardTitle>
              <CardDescription>
                Administre sus empleados, configure salarios y vea sus límites de retiro
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Descargar Plantilla
              </Button>

              <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Upload className="w-4 h-4" />
                    Cargar Excel
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Carga Masiva de Colaboradores</DialogTitle>
                    <DialogDescription>
                      Suba un archivo Excel o CSV con la información de los colaboradores.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-sm text-slate-600 mb-2">
                        Arrastre su archivo aquí o haga clic para seleccionar
                      </p>
                      <p className="text-xs text-slate-400">Formatos soportados: .xlsx, .xls, .csv</p>
                      <Input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" />
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Seleccionar Archivo
                      </Button>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Upload className="mr-2 h-4 w-4" />
                      Procesar Archivo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4" />
                    Agregar Colaborador
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Colaborador</DialogTitle>
                    <DialogDescription>
                      Complete los datos del colaborador. Se generará una contraseña automática y se enviará por correo.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Código de Empleado *</Label>
                        <Input
                          placeholder="EMP-001"
                          value={newEmployeeForm.employeeCode}
                          onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, employeeCode: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cédula *</Label>
                        <Input
                          placeholder="001-1234567-8"
                          value={newEmployeeForm.cedula}
                          onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, cedula: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Nombre Completo *</Label>
                      <Input
                        placeholder="María Rodríguez"
                        value={newEmployeeForm.name}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Correo Electrónico *</Label>
                      <Input
                        type="email"
                        placeholder="maria@empresa.com"
                        value={newEmployeeForm.email}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Salario Mensual (RD$) *</Label>
                      <Input
                        type="number"
                        placeholder="25000"
                        value={newEmployeeForm.monthlySalary}
                        onChange={(e) => setNewEmployeeForm({ ...newEmployeeForm, monthlySalary: e.target.value })}
                      />
                      {newEmployeeForm.monthlySalary && (
                        <p className="text-xs text-emerald-600">
                          Máximo de retiro: RD${" "}
                          {(
                            (Number.parseFloat(newEmployeeForm.monthlySalary) * companyWithdrawalPercentage) /
                            100
                          ).toLocaleString()}{" "}
                          ({companyWithdrawalPercentage}% del salario)
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700"
                      onClick={handleAddEmployee}
                      disabled={
                        !newEmployeeForm.name ||
                        !newEmployeeForm.cedula ||
                        !newEmployeeForm.email ||
                        !newEmployeeForm.monthlySalary ||
                        isSaving
                      }
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                      Agregar Colaborador
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, cédula o código..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Código</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Salario</TableHead>
                  <TableHead>Máx. Retiro</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No hay colaboradores registrados
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((emp) => {
                    const maxWithdrawal = (emp.salary * companyWithdrawalPercentage) / 100

                    return (
                      <TableRow key={emp.id}>
                        <TableCell className="font-mono text-sm">{emp.employee_code || "-"}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{emp.full_name}</div>
                            <div className="text-xs text-slate-500">{emp.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{emp.cedula || "-"}</TableCell>
                        <TableCell>RD$ {emp.salary.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            RD$ {maxWithdrawal.toLocaleString()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              emp.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }
                          >
                            {emp.status === "active" ? "Activo" : "Suspendido"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditEmployee(emp)}>
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant={emp.status === "active" ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleStatusToggle(emp.id, emp.status)}
                            >
                              {emp.status === "active" ? (
                                <>
                                  <UserX className="w-3 h-3 mr-1" />
                                  Suspender
                                </>
                              ) : (
                                <>
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Activar
                                </>
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Colaborador</DialogTitle>
            <DialogDescription>Modifique la información del colaborador.</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Código de Empleado</Label>
                  <Input
                    value={editingEmployee.employee_code || ""}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, employee_code: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cédula</Label>
                  <Input
                    value={editingEmployee.cedula || ""}
                    onChange={(e) => setEditingEmployee({ ...editingEmployee, cedula: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input
                  value={editingEmployee.full_name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Correo Electrónico</Label>
                <Input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Salario Mensual (RD$)</Label>
                <Input
                  type="number"
                  value={editingEmployee.salary}
                  onChange={(e) =>
                    setEditingEmployee({ ...editingEmployee, salary: Number.parseFloat(e.target.value) || 0 })
                  }
                />
                <p className="text-xs text-emerald-600">
                  Máximo de retiro: RD${" "}
                  {((editingEmployee.salary * companyWithdrawalPercentage) / 100).toLocaleString()} (
                  {companyWithdrawalPercentage}% del salario)
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </HRLayout>
  )
}
