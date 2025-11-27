"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminLayout } from "@/components/admin-layout"
import { Plus, Edit, Search, Building2, AlertTriangle, Loader2 } from "lucide-react"
import type { Company } from "@/lib/types"

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [employeeCounts, setEmployeeCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const supabase = createClient()

  const [editForm, setEditForm] = useState({
    creditLimit: "",
    withdrawalPercentage: "",
    paymentFrequency: "biweekly" as "weekly" | "biweekly" | "monthly",
  })

  const [newCompanyForm, setNewCompanyForm] = useState({
    name: "",
    rnc: "",
    email: "",
    phone: "",
    creditLimit: "",
    withdrawalPercentage: "50",
    withdrawalLimitPerEmployee: "",
    paymentFrequency: "biweekly" as "weekly" | "biweekly" | "monthly",
  })

  useEffect(() => {
    async function fetchCompanies() {
      const { data: companiesData, error } = await supabase
        .from("companies")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log("[v0] Error fetching companies:", error)
        return
      }

      setCompanies(companiesData || [])

      // Fetch employee counts for each company
      if (companiesData) {
        const counts: Record<string, number> = {}
        for (const company of companiesData) {
          const { count } = await supabase
            .from("employees")
            .select("*", { count: "exact", head: true })
            .eq("company_id", company.id)
          counts[company.id] = count || 0
        }
        setEmployeeCounts(counts)
      }

      setIsLoading(false)
    }

    fetchCompanies()
  }, [supabase])

  const filteredCompanies = companies.filter(
    (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.rnc?.includes(searchTerm),
  )

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company)
    setEditForm({
      creditLimit: company.credit_limit.toString(),
      withdrawalPercentage: company.availability_percentage.toString(),
      paymentFrequency: company.payment_frequency,
    })
    setDialogOpen(true)
  }

  const handleSaveCompanyEdit = async () => {
    if (!editingCompany) return

    setIsSaving(true)
    const { error } = await supabase
      .from("companies")
      .update({
        credit_limit: Number.parseFloat(editForm.creditLimit) || editingCompany.credit_limit,
        availability_percentage:
          Number.parseInt(editForm.withdrawalPercentage) || editingCompany.availability_percentage,
        payment_frequency: editForm.paymentFrequency,
        updated_at: new Date().toISOString(),
      })
      .eq("id", editingCompany.id)

    if (error) {
      console.log("[v0] Error updating company:", error)
      alert("Error al actualizar la empresa")
    } else {
      setCompanies(
        companies.map((c) =>
          c.id === editingCompany.id
            ? {
                ...c,
                credit_limit: Number.parseFloat(editForm.creditLimit) || c.credit_limit,
                availability_percentage: Number.parseInt(editForm.withdrawalPercentage) || c.availability_percentage,
                payment_frequency: editForm.paymentFrequency,
              }
            : c,
        ),
      )
      setDialogOpen(false)
      setEditingCompany(null)
    }
    setIsSaving(false)
  }

  const handleAddCompany = async () => {
    setIsSaving(true)

    const { data, error } = await supabase
      .from("companies")
      .insert({
        name: newCompanyForm.name,
        rnc: newCompanyForm.rnc,
        email: newCompanyForm.email,
        phone: newCompanyForm.phone || null,
        credit_limit: Number.parseFloat(newCompanyForm.creditLimit) || 1000000,
        credit_used: 0,
        withdrawal_limit_per_employee: Number.parseFloat(newCompanyForm.withdrawalLimitPerEmployee) || 50000,
        availability_percentage: Number.parseInt(newCompanyForm.withdrawalPercentage) || 50,
        payment_frequency: newCompanyForm.paymentFrequency,
        status: "active",
        allow_weekend_withdrawals: false,
        payroll_cutoff_days: 3,
      })
      .select()
      .single()

    if (error) {
      console.log("[v0] Error creating company:", error)
      alert("Error al crear la empresa: " + error.message)
    } else if (data) {
      setCompanies([data, ...companies])
      setAddDialogOpen(false)
      setNewCompanyForm({
        name: "",
        rnc: "",
        email: "",
        phone: "",
        creditLimit: "",
        withdrawalPercentage: "50",
        withdrawalLimitPerEmployee: "",
        paymentFrequency: "biweekly",
      })
    }
    setIsSaving(false)
  }

  const handleToggleStatus = async (companyId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active"

    const { error } = await supabase
      .from("companies")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", companyId)

    if (error) {
      console.log("[v0] Error toggling company status:", error)
      alert("Error al cambiar el estado de la empresa")
    } else {
      setCompanies(
        companies.map((c) =>
          c.id === companyId ? { ...c, status: newStatus as "active" | "suspended" | "pending" } : c,
        ),
      )
    }
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Gestión de Empresas
              </CardTitle>
              <CardDescription>
                Administre empresas clientes, límites de crédito y porcentajes de retiro
              </CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Empresa</DialogTitle>
                  <DialogDescription>Configure todos los parámetros para la nueva empresa cliente.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company-name">Nombre de Empresa *</Label>
                      <Input
                        id="company-name"
                        placeholder="Ej: Call Center RD"
                        value={newCompanyForm.name}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company-rnc">RNC *</Label>
                      <Input
                        id="company-rnc"
                        placeholder="Ej: 101-234567-8"
                        value={newCompanyForm.rnc}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, rnc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-email">Correo de Contacto *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="rrhh@empresa.com"
                        value={newCompanyForm.email}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        placeholder="809-555-1234"
                        value={newCompanyForm.phone}
                        onChange={(e) => setNewCompanyForm({ ...newCompanyForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credit-limit">Límite de Crédito (RD$) *</Label>
                    <Input
                      id="credit-limit"
                      type="number"
                      placeholder="5000000"
                      value={newCompanyForm.creditLimit}
                      onChange={(e) => setNewCompanyForm({ ...newCompanyForm, creditLimit: e.target.value })}
                    />
                    <p className="text-xs text-slate-500">Capital máximo que Nomi desplegará para esta empresa</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-limit">Límite por Colaborador (RD$)</Label>
                    <Input
                      id="withdrawal-limit"
                      type="number"
                      placeholder="50000"
                      value={newCompanyForm.withdrawalLimitPerEmployee}
                      onChange={(e) =>
                        setNewCompanyForm({ ...newCompanyForm, withdrawalLimitPerEmployee: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>% Retiro para Colaboradores</Label>
                      <Select
                        value={newCompanyForm.withdrawalPercentage}
                        onValueChange={(value) => setNewCompanyForm({ ...newCompanyForm, withdrawalPercentage: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30% del salario</SelectItem>
                          <SelectItem value="50">50% del salario</SelectItem>
                          <SelectItem value="80">80% del salario</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Frecuencia de Pago</Label>
                      <Select
                        value={newCompanyForm.paymentFrequency}
                        onValueChange={(value: "weekly" | "biweekly" | "monthly") =>
                          setNewCompanyForm({ ...newCompanyForm, paymentFrequency: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="biweekly">Quincenal</SelectItem>
                          <SelectItem value="monthly">Mensual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleAddCompany}
                    disabled={
                      !newCompanyForm.name ||
                      !newCompanyForm.rnc ||
                      !newCompanyForm.creditLimit ||
                      !newCompanyForm.email ||
                      isSaving
                    }
                  >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                    Crear Empresa
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre o RNC..."
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
                  <TableHead>Empresa</TableHead>
                  <TableHead>RNC</TableHead>
                  <TableHead>Límite Crédito</TableHead>
                  <TableHead>Uso Capital</TableHead>
                  <TableHead>% Retiro</TableHead>
                  <TableHead>Frecuencia</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                      No hay empresas registradas
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCompanies.map((company) => {
                    const usagePercent =
                      company.credit_limit > 0 ? (company.credit_used / company.credit_limit) * 100 : 0
                    const isHighUsage = usagePercent >= 80

                    return (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium">
                              {company.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-xs text-slate-500">
                                {employeeCounts[company.id] || 0} colaboradores
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{company.rnc || "-"}</TableCell>
                        <TableCell>RD$ {(company.credit_limit / 1000000).toFixed(1)}M</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={isHighUsage ? "text-amber-600 font-medium" : ""}>
                                {usagePercent.toFixed(0)}%
                              </span>
                              {isHighUsage && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                            </div>
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  usagePercent >= 90
                                    ? "bg-red-500"
                                    : usagePercent >= 80
                                      ? "bg-amber-500"
                                      : "bg-emerald-500"
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-100 text-emerald-700">{company.availability_percentage}%</Badge>
                        </TableCell>
                        <TableCell className="capitalize">
                          {company.payment_frequency === "weekly"
                            ? "Semanal"
                            : company.payment_frequency === "biweekly"
                              ? "Quincenal"
                              : "Mensual"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              company.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {company.status === "active" ? "Activa" : "Suspendida"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditCompany(company)}>
                              <Edit className="w-3 h-3 mr-1" />
                              Editar
                            </Button>
                            <Button
                              variant={company.status === "active" ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleStatus(company.id, company.status)}
                            >
                              {company.status === "active" ? "Suspender" : "Activar"}
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar {editingCompany?.name}</DialogTitle>
            <DialogDescription>Modifique los parámetros de crédito y configuración de la empresa.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Límite de Crédito (RD$)</Label>
              <Input
                type="number"
                value={editForm.creditLimit}
                onChange={(e) => setEditForm({ ...editForm, creditLimit: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>% Retiro para Colaboradores</Label>
              <Select
                value={editForm.withdrawalPercentage}
                onValueChange={(value) => setEditForm({ ...editForm, withdrawalPercentage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30% del salario</SelectItem>
                  <SelectItem value="50">50% del salario</SelectItem>
                  <SelectItem value="80">80% del salario</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">Este porcentaje aplica a todos los colaboradores de la empresa</p>
            </div>
            <div className="space-y-2">
              <Label>Frecuencia de Pago</Label>
              <Select
                value={editForm.paymentFrequency}
                onValueChange={(value: "weekly" | "biweekly" | "monthly") =>
                  setEditForm({ ...editForm, paymentFrequency: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="biweekly">Quincenal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSaveCompanyEdit} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
