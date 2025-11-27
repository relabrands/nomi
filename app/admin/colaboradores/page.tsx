"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Search, Users, Download, Filter } from "lucide-react"

type Employee = {
  id: string
  name: string
  cedula: string
  email: string
  company: string
  salary: number
  withdrawalPercentage: number
  totalWithdrawn: number
  status: "active" | "suspended"
}

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "María Rodríguez",
    cedula: "001-1234567-8",
    email: "maria@callcenter.do",
    company: "Call Center Dominicano",
    salary: 25000,
    withdrawalPercentage: 50,
    totalWithdrawn: 45000,
    status: "active",
  },
  {
    id: "2",
    name: "Juan Pérez",
    cedula: "002-2345678-9",
    email: "juan@retailcorp.do",
    company: "Retail Corp Caribe",
    salary: 30000,
    withdrawalPercentage: 80,
    totalWithdrawn: 62000,
    status: "active",
  },
  {
    id: "3",
    name: "Ana García",
    cedula: "003-3456789-0",
    email: "ana@manufacturing.do",
    company: "Manufacturing Santo Domingo",
    salary: 22000,
    withdrawalPercentage: 50,
    totalWithdrawn: 18000,
    status: "active",
  },
  {
    id: "4",
    name: "Carlos Martínez",
    cedula: "004-4567890-1",
    email: "carlos@services.do",
    company: "Services Group RD",
    salary: 28000,
    withdrawalPercentage: 80,
    totalWithdrawn: 89000,
    status: "active",
  },
  {
    id: "5",
    name: "Laura Sánchez",
    cedula: "005-5678901-2",
    email: "laura@callcenter.do",
    company: "Call Center Dominicano",
    salary: 35000,
    withdrawalPercentage: 50,
    totalWithdrawn: 52000,
    status: "suspended",
  },
  {
    id: "6",
    name: "Roberto Fernández",
    cedula: "006-6789012-3",
    email: "roberto@retailcorp.do",
    company: "Retail Corp Caribe",
    salary: 32000,
    withdrawalPercentage: 80,
    totalWithdrawn: 41000,
    status: "active",
  },
  {
    id: "7",
    name: "Carmen Díaz",
    cedula: "007-7890123-4",
    email: "carmen@manufacturing.do",
    company: "Manufacturing Santo Domingo",
    salary: 27000,
    withdrawalPercentage: 50,
    totalWithdrawn: 23000,
    status: "active",
  },
  {
    id: "8",
    name: "Pedro Gómez",
    cedula: "008-8901234-5",
    email: "pedro@services.do",
    company: "Services Group RD",
    salary: 45000,
    withdrawalPercentage: 80,
    totalWithdrawn: 112000,
    status: "active",
  },
]

export default function ColaboradoresAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const companies = [...new Set(mockEmployees.map((e) => e.company))]

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cedula.includes(searchTerm) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompany = companyFilter === "all" || emp.company === companyFilter
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter
    return matchesSearch && matchesCompany && matchesStatus
  })

  const totalEmployees = mockEmployees.length
  const activeEmployees = mockEmployees.filter((e) => e.status === "active").length
  const totalWithdrawn = mockEmployees.reduce((sum, e) => sum + e.totalWithdrawn, 0)

  return (
    <AdminLayout>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Colaboradores</p>
                <p className="text-2xl font-bold">{totalEmployees}</p>
              </div>
              <Users className="w-8 h-8 text-slate-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Colaboradores Activos</p>
                <p className="text-2xl font-bold text-emerald-600">{activeEmployees}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">
                {((activeEmployees / totalEmployees) * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Retirado (Histórico)</p>
                <p className="text-2xl font-bold">RD$ {(totalWithdrawn / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5" />
                Todos los Colaboradores
              </CardTitle>
              <CardDescription>Vista global de todos los colaboradores en la plataforma</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por nombre, cédula o email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las empresas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="suspended">Suspendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Salario</TableHead>
                  <TableHead>% Retiro</TableHead>
                  <TableHead>Total Retirado</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{emp.name}</div>
                        <div className="text-xs text-slate-500">{emp.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{emp.cedula}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{emp.company.split(" ")[0]}</Badge>
                    </TableCell>
                    <TableCell>RD$ {emp.salary.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className="bg-emerald-100 text-emerald-700">{emp.withdrawalPercentage}%</Badge>
                    </TableCell>
                    <TableCell>RD$ {emp.totalWithdrawn.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={emp.status === "active" ? "default" : "secondary"}
                        className={
                          emp.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                        }
                      >
                        {emp.status === "active" ? "Activo" : "Suspendido"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Mostrando {filteredEmployees.length} de {totalEmployees} colaboradores
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
