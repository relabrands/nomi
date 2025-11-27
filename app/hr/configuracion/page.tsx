"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HRLayout } from "@/components/hr-layout"
import { Bell, Calendar, Shield, Save, Info } from "lucide-react"

export default function ConfiguracionHRPage() {
  const [settings, setSettings] = useState({
    payrollCutoffDay: "15",
    weekendWithdrawals: true,
    vacationBlock: false,
    emailNotifications: true,
    withdrawalNotifications: true,
  })

  // These are set by admin and read-only for HR
  const adminSettings = {
    withdrawalPercentage: 80,
    paymentFrequency: "Quincenal",
    commission: 75,
  }

  const handleSave = () => {
    alert("Configuración guardada exitosamente")
  }

  return (
    <HRLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
          <p className="text-slate-500">Administre las preferencias de su empresa en Nomi</p>
        </div>

        {/* Admin-controlled settings (read-only) */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Shield className="w-5 h-5" />
              Configuración del Administrador
            </CardTitle>
            <CardDescription className="text-blue-700">
              Estos parámetros son configurados por el administrador de Nomi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-slate-500">Porcentaje de Retiro</div>
                <div className="text-2xl font-bold text-blue-600">{adminSettings.withdrawalPercentage}%</div>
                <p className="text-xs text-slate-400 mt-1">Máximo que pueden retirar los colaboradores</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-slate-500">Frecuencia de Pago</div>
                <div className="text-2xl font-bold text-blue-600">{adminSettings.paymentFrequency}</div>
                <p className="text-xs text-slate-400 mt-1">Ciclo de nómina configurado</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-slate-500">Comisión por Retiro</div>
                <div className="text-2xl font-bold text-blue-600">RD$ {adminSettings.commission}</div>
                <p className="text-xs text-slate-400 mt-1">Plan Premium</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-sm text-blue-700">
              <Info className="w-4 h-4" />
              Contacte al administrador de Nomi para modificar estos parámetros
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Payroll Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Configuración de Nómina
              </CardTitle>
              <CardDescription>Configure las fechas y reglas de su ciclo de pago</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Día de Corte de Nómina</Label>
                <Select
                  value={settings.payrollCutoffDay}
                  onValueChange={(value) => setSettings({ ...settings, payrollCutoffDay: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Día 1 del mes</SelectItem>
                    <SelectItem value="15">Día 15 del mes</SelectItem>
                    <SelectItem value="ultimo">Último día del mes</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500">El ciclo de disponibilidad se reinicia en esta fecha</p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <div>
                  <Label>Permitir Retiros en Fines de Semana</Label>
                  <p className="text-xs text-slate-500">
                    Los colaboradores pueden solicitar retiros sábados y domingos
                  </p>
                </div>
                <Switch
                  checked={settings.weekendWithdrawals}
                  onCheckedChange={(checked) => setSettings({ ...settings, weekendWithdrawals: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Bloquear Durante Vacaciones</Label>
                  <p className="text-xs text-slate-500">Suspender retiros automáticamente durante vacaciones</p>
                </div>
                <Switch
                  checked={settings.vacationBlock}
                  onCheckedChange={(checked) => setSettings({ ...settings, vacationBlock: checked })}
                />
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
              <CardDescription>Configure qué alertas desea recibir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificaciones por Email</Label>
                  <p className="text-xs text-slate-500">Recibir resúmenes diarios de actividad</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Retiros</Label>
                  <p className="text-xs text-slate-500">Notificar cuando un colaborador solicite un retiro</p>
                </div>
                <Switch
                  checked={settings.withdrawalNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, withdrawalNotifications: checked })}
                />
              </div>
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
    </HRLayout>
  )
}
