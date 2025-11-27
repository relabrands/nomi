"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { Settings, DollarSign, Bell, Shield, Save, AlertTriangle } from "lucide-react"

export default function ConfiguracionAdminPage() {
  const [settings, setSettings] = useState({
    defaultCommission: "95",
    minWithdrawal: "500",
    maxWithdrawalPercentage: "80",
    defaultPaymentFrequency: "quincenal",
    emailNotifications: true,
    smsNotifications: false,
    alertThreshold: "80",
    autoApproveLimit: "5000",
    maintenanceMode: false,
  })

  const handleSave = () => {
    alert("Configuración guardada exitosamente")
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configuración del Sistema</h2>
          <p className="text-slate-500">Administre los parámetros globales de la plataforma Nomi</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Commission Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Configuración de Comisiones
              </CardTitle>
              <CardDescription>Parámetros financieros predeterminados para nuevas empresas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Comisión por Defecto (RD$)</Label>
                <Input
                  type="number"
                  value={settings.defaultCommission}
                  onChange={(e) => setSettings({ ...settings, defaultCommission: e.target.value })}
                />
                <p className="text-xs text-slate-500">Comisión aplicada a nuevas empresas en plan Standard</p>
              </div>

              <div className="space-y-2">
                <Label>Monto Mínimo de Retiro (RD$)</Label>
                <Input
                  type="number"
                  value={settings.minWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minWithdrawal: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>% Máximo de Retiro Permitido</Label>
                <Select
                  value={settings.maxWithdrawalPercentage}
                  onValueChange={(value) => setSettings({ ...settings, maxWithdrawalPercentage: value })}
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
                <Label>Frecuencia de Pago por Defecto</Label>
                <Select
                  value={settings.defaultPaymentFrequency}
                  onValueChange={(value) => setSettings({ ...settings, defaultPaymentFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificaciones
              </CardTitle>
              <CardDescription>Configure alertas y notificaciones del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por Email</Label>
                  <p className="text-xs text-slate-500">Recibir alertas importantes por correo</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones SMS</Label>
                  <p className="text-xs text-slate-500">Alertas críticas por mensaje de texto</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label>Umbral de Alerta de Crédito (%)</Label>
                <Input
                  type="number"
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
                />
                <p className="text-xs text-slate-500">Alertar cuando una empresa alcance este % de su límite</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Seguridad y Aprobaciones
              </CardTitle>
              <CardDescription>Configuración de seguridad y límites de auto-aprobación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Límite de Auto-Aprobación (RD$)</Label>
                <Input
                  type="number"
                  value={settings.autoApproveLimit}
                  onChange={(e) => setSettings({ ...settings, autoApproveLimit: e.target.value })}
                />
                <p className="text-xs text-slate-500">Retiros por encima de este monto requieren aprobación manual</p>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className={settings.maintenanceMode ? "border-amber-200 bg-amber-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Sistema
              </CardTitle>
              <CardDescription>Configuración general del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-2">
                    Modo Mantenimiento
                    {settings.maintenanceMode && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  </Label>
                  <p className="text-xs text-slate-500">Desactivar temporalmente todos los retiros</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>

              {settings.maintenanceMode && (
                <div className="p-3 bg-amber-100 rounded-lg text-sm text-amber-800">
                  El modo mantenimiento está activo. Los colaboradores no podrán realizar retiros.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
