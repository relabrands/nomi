"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HRLayout } from "@/components/hr-layout"
import { Search, Activity, Download, DollarSign, Clock, TrendingUp } from "lucide-react"

type Withdrawal = {
  id: string
  employee: string
  employeeCode: string
  amount: number
  commission: number
  netAmount: number
  status: "completado" | "procesando" | "fallido"
  date: string
  time: string
}

const mockWithdrawals: Withdrawal[] = [
  {
    id: "RET-001",
    employee: "María Rodríguez",
    employeeCode: "EMP-001",
    amount: 3500,
    commission: 75,
    netAmount: 3425,
    status: "completado",
    date: "2024-11-26",
    time: "10:30 AM",
  },
  {
    id: "RET-002",
    employee: "Juan Pérez",
    employeeCode: "EMP-002",
    amount: 2000,
    commission: 75,
    netAmount: 1925,
    status: "procesando",
    date: "2024-11-26",
    time: "10:18 AM",
  },
  {
    id: "RET-003",
    employee: "Ana García",
    employeeCode: "EMP-003",
    amount: 4500,
    commission: 75,
    netAmount: 4425,
    status: "completado",
    date: "2024-11-26",
    time: "09:45 AM",
  },
  {
    id: "RET-004",
    employee: "Carlos Martínez",
    employeeCode: "EMP-004",
    amount: 1500,
    commission: 75,
    netAmount: 1425,
    status: "completado",
    date: "2024-11-25",
    time: "04:30 PM",
  },
  {
    id: "RET-005",
    employee: "Laura Sánchez",
    employeeCode: "EMP-005",
    amount: 5000,
    commission: 75,
    netAmount: 4925,
    status: "completado",
    date: "2024-11-25",
    time: "03:15 PM",
  },
  {
    id: "RET-006",
    employee: "María Rodríguez",
    employeeCode: "EMP-001",
    amount: 2500,
    commission: 75,
    netAmount: 2425,
    status: "completado",
    date: "2024-11-24",
    time: "11:00 AM",
  },
]

export default function RetirosHRPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredWithdrawals = mockWithdrawals.filter((w) => {
    const matchesSearch =
      w.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.employeeCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || w.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = mockWithdrawals.reduce((sum, w) => sum + w.amount, 0)
  const totalCommissions = mockWithdrawals.reduce((sum, w) => sum + w.commission, 0)
  const completedCount = mockWithdrawals.filter((w) => w.status === "completado").length
  const processingCount = mockWithdrawals.filter((w) => w.status === "procesando").length

  return (
    <HRLayout>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Retiros</p>
                <p className="text-2xl font-bold">{mockWithdrawals.length}</p>
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
                <p className="text-sm text-slate-600">Completados</p>
                <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
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
                Historial de Retiros
              </CardTitle>
              <CardDescription>Todos los retiros realizados por sus colaboradores</CardDescription>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Buscar por colaborador, código o ID de retiro..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="procesando">Procesando</SelectItem>
                <SelectItem value="fallido">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Comisión</TableHead>
                  <TableHead>Neto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((w) => (
                  <TableRow key={w.id}>
                    <TableCell className="font-mono text-sm">{w.id}</TableCell>
                    <TableCell className="font-medium">{w.employee}</TableCell>
                    <TableCell className="font-mono text-sm">{w.employeeCode}</TableCell>
                    <TableCell>RD$ {w.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-slate-500">RD$ {w.commission}</TableCell>
                    <TableCell>RD$ {w.netAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          w.status === "completado"
                            ? "bg-emerald-100 text-emerald-700"
                            : w.status === "procesando"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }
                      >
                        {w.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{w.date}</div>
                      <div className="text-xs text-slate-500">{w.time}</div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Mostrando {filteredWithdrawals.length} de {mockWithdrawals.length} retiros
          </div>
        </CardContent>
      </Card>
    </HRLayout>
  )
}
