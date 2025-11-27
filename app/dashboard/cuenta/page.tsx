"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { EmployeeLayout } from "@/components/employee-layout"
import { User, CreditCard, Building2, Mail, Phone, Edit, Save, Shield } from "lucide-react"

export default function CuentaPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: "Luis Mendez",
    cedula: "001-1234567-8",
    email: "luis.mendez@empresa.com",
    phone: "809-555-1234",
    bankName: "Banco Popular Dominicano",
    accountNumber: "****4567",
    accountType: "Ahorros",
  })

  const companyInfo = {
    name: "Retail Corp Caribe",
    employeeCode: "EMP-042",
    salary: 30000,
    withdrawalPercentage: 80,
  }

  const handleSave = () => {
    setIsEditing(false)
    alert("Información actualizada exitosamente")
  }

  return (
    <EmployeeLayout>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Mi Cuenta</h2>
          <p className="text-sm text-muted-foreground">Administra tu información personal</p>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="w-4 h-4" />
                Información Personal
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => (isEditing ? handleSave() : setIsEditing(true))}>
                {isEditing ? (
                  <>
                    <Save className="w-3 h-3 mr-1" />
                    Guardar
                  </>
                ) : (
                  <>
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Nombre Completo</Label>
              {isEditing ? (
                <Input value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
              ) : (
                <p className="font-medium">{userData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Cédula</Label>
              <p className="font-medium font-mono">{userData.cedula}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Correo Electrónico
              </Label>
              {isEditing ? (
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              ) : (
                <p className="font-medium">{userData.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" />
                Teléfono
              </Label>
              {isEditing ? (
                <Input value={userData.phone} onChange={(e) => setUserData({ ...userData, phone: e.target.value })} />
              ) : (
                <p className="font-medium">{userData.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank Account Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="w-4 h-4" />
              Cuenta Bancaria
            </CardTitle>
            <CardDescription>Donde recibes tus retiros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="font-medium">{userData.bankName}</p>
                <p className="text-sm text-muted-foreground">
                  {userData.accountType} - {userData.accountNumber}
                </p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">Verificada</Badge>
            </div>
            <Button variant="outline" className="w-full bg-transparent">
              Cambiar Cuenta Bancaria
            </Button>
          </CardContent>
        </Card>

        {/* Company Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="w-4 h-4" />
              Información Laboral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Empresa</p>
                <p className="font-medium">{companyInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Código</p>
                <p className="font-medium font-mono">{companyInfo.employeeCode}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salario</p>
                <p className="font-medium">RD$ {companyInfo.salary.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Máx. Retiro</p>
                <p className="font-medium text-accent">{companyInfo.withdrawalPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="w-4 h-4" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Cambiar Contraseña
            </Button>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  )
}
