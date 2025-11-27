"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Building2,
  Shield,
  Smartphone,
  Smile,
  Zap,
  Lock,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Play,
  Globe,
  X,
} from "lucide-react"
import Link from "next/link"

export default function NomiPage() {
  const [withdrawAmount, setWithdrawAmount] = useState([5000])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-accent-foreground">
                N
              </div>
              <span className="text-xl font-bold">Nomi</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#empresas" className="text-sm font-medium hover:text-accent transition-colors">
                Para Empresas
              </a>
              <a href="#colaboradores" className="text-sm font-medium hover:text-accent transition-colors">
                Para Colaboradores
              </a>
              <a href="#seguridad" className="text-sm font-medium hover:text-accent transition-colors">
                Seguridad
              </a>
              <a href="#preguntas" className="text-sm font-medium hover:text-accent transition-colors">
                Preguntas Frecuentes
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/#contact">Solicitar Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 md:py-24 lg:py-32 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                En Vivo en República Dominicana
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                Tu sueldo, cuando realmente lo necesitas.
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty">
                Sin descargar nada. Sin ocupar espacio en tu celular. Accede a tu salario trabajado al instante desde
                cualquier navegador.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base" asChild>
                  <Link href="/#contact">
                    Conectar mi Empresa
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base bg-transparent">
                  <Play className="mr-2 h-4 w-4" />
                  Ver cómo funciona
                </Button>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-accent" />
                  PWA - Funciona en cualquier navegador
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="w-4 h-4 text-accent" />
                  <span className="line-through">Sin descargas</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 mx-auto max-w-sm">
                {/* Phone Browser Frame */}
                <div className="bg-background border-8 border-foreground rounded-[3rem] shadow-2xl p-3">
                  {/* Browser Address Bar */}
                  <div className="bg-muted rounded-2xl px-3 py-2 mb-4 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-accent" />
                    <div className="text-[10px] text-muted-foreground">app.nomi.do</div>
                  </div>

                  {/* Transaction Card */}
                  <div className="bg-card rounded-2xl shadow-xl p-5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Transferencia exitosa</div>
                        <div className="text-2xl font-bold">RD$ 5,000</div>
                      </div>
                    </div>

                    <div className="bg-accent/5 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Monto solicitado</span>
                        <span className="font-semibold">RD$ 5,000</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Comisión</span>
                        <span className="font-semibold">RD$ 95</span>
                      </div>
                      <div className="h-px bg-border my-1" />
                      <div className="flex justify-between">
                        <span className="font-semibold text-sm">Total recibido</span>
                        <span className="font-bold text-lg text-accent">RD$ 4,905</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="w-4 h-4 text-accent" />
                      Disponible en tu cuenta en segundos
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full -z-10" />
            </div>
          </div>
        </div>
      </section>

      <section id="colaboradores" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                Tan fácil como enviar un WhatsApp.
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Tus colaboradores reciben un link seguro. Entran, ven su disponible y transfieren a su banco. Sin
                instalaciones complejas.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Smartphone className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Acceso Instantáneo</div>
                    <div className="text-sm text-muted-foreground">
                      Abre el navegador, ingresa y retira. Sin descargas ni registro complicado.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <Zap className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Transferencia 24/7</div>
                    <div className="text-sm text-muted-foreground">
                      Disponible cuando lo necesites, cualquier día, cualquier hora.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Tarifa Fija: RD$ 95</div>
                    <div className="text-sm text-muted-foreground">
                      Sin sorpresas. Precio transparente por cada retiro.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile App Demo Mockup */}
            <div className="lg:order-2">
              <div className="relative mx-auto max-w-sm">
                {/* Phone Frame */}
                <div className="bg-background border-8 border-foreground rounded-[3rem] shadow-2xl p-6">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Hola, María</div>
                        <div className="text-2xl font-bold">RD$ 12,450</div>
                        <div className="text-xs text-muted-foreground"> Disponible para retirar</div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Smile className="w-6 h-6 text-accent" />
                      </div>
                    </div>

                    {/* Slider Control */}
                    <Card className="p-6 space-y-4 bg-card border-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <span className="text-sm text-muted-foreground">¿Cuánto necesitas?</span>
                          <span className="text-3xl font-bold text-accent">
                            RD$ {withdrawAmount[0].toLocaleString()}
                          </span>
                        </div>
                        <Slider
                          value={withdrawAmount}
                          onValueChange={setWithdrawAmount}
                          max={12450}
                          min={500}
                          step={500}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>RD$ 500</span>
                          <span>RD$ 12,450</span>
                        </div>
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Comisión</span>
                          <span className="font-semibold">RD$ 95</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Recibirás</span>
                          <span className="text-accent">RD$ {(withdrawAmount[0] - 95).toLocaleString()}</span>
                        </div>
                      </div>

                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg" asChild>
                        <Link href="/auth/login">Transferir Ahora</Link>
                      </Button>
                    </Card>

                    {/* Info */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                      <Calendar className="w-4 h-4" />
                      Se descontará de tu próxima quincena
                    </div>
                  </div>
                </div>

                <div className="absolute -inset-4 bg-accent/5 blur-2xl rounded-full -z-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="empresas" className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Desktop Dashboard Mockup */}
            <div className="relative">
              {/* Laptop/Browser Frame */}
              <div className="bg-muted/50 rounded-2xl p-4 shadow-2xl border border-border">
                {/* Browser Header */}
                <div className="bg-card rounded-t-lg px-4 py-2 flex items-center gap-2 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex-1 bg-muted rounded px-3 py-1 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-accent" />
                    <span className="text-xs text-muted-foreground">dashboard.nomi.do/rrhh</span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="bg-card rounded-b-lg p-6 space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <Card className="p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Retiros Hoy</div>
                      <div className="text-xl font-bold">24</div>
                      <div className="text-xs text-accent">+12% vs ayer</div>
                    </Card>
                    <Card className="p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Monto Total</div>
                      <div className="text-xl font-bold">RD$ 89K</div>
                      <div className="text-xs text-muted-foreground">Esta semana</div>
                    </Card>
                    <Card className="p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Empleados</div>
                      <div className="text-xl font-bold">156</div>
                      <div className="text-xs text-accent">87% activos</div>
                    </Card>
                  </div>

                  {/* Recent Withdrawals Table */}
                  <Card className="border">
                    <div className="p-3 border-b">
                      <div className="text-sm font-semibold">Retiros Recientes</div>
                    </div>
                    <div className="divide-y">
                      {[
                        { name: "María Rodríguez", amount: 5000, time: "Hace 5 min" },
                        { name: "Juan Pérez", amount: 3500, time: "Hace 12 min" },
                        { name: "Ana Santos", amount: 8000, time: "Hace 18 min" },
                      ].map((item, i) => (
                        <div key={i} className="p-3 flex items-center justify-between text-xs">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-muted-foreground">{item.time}</div>
                          </div>
                          <div className="font-semibold">RD$ {item.amount.toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              <div className="absolute -inset-4 bg-primary/5 blur-2xl rounded-full -z-10" />
            </div>

            {/* Text Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance">
                Control total para Recursos Humanos.
              </h2>

              <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                Olvídate de las hojas de cálculo. Nomi se sincroniza con tu nómina y gestiona los descuentos
                automáticamente.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Building2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Dashboard en Tiempo Real</div>
                    <div className="text-sm text-muted-foreground">
                      Monitorea todos los retiros, empleados activos y métricas clave desde un solo lugar.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Descuentos Automáticos</div>
                    <div className="text-sm text-muted-foreground">
                      Se integra con tu sistema de nómina para descontar los adelantos sin trabajo manual.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Cero Riesgo Financiero</div>
                    <div className="text-sm text-muted-foreground">
                      Nomi adelanta el capital. Tu empresa no invierte nada.
                    </div>
                  </div>
                </div>
              </div>

              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/#contact">
                  Solicitar Demo Ejecutiva
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="seguridad" className="py-16 md:py-24 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Blindaje Legal Corporativo.</h2>

              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl text-pretty">
                Nomi opera con total transparencia y cumplimiento normativo en República Dominicana.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <Card className="p-6 text-center border-2 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-accent" />
                </div>
                <div className="font-semibold mb-2">Regulado</div>
                <div className="text-sm text-muted-foreground">
                  Operamos bajo el marco regulatorio de la República Dominicana
                </div>
              </Card>

              <Card className="p-6 text-center border-2 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-6 h-6 text-accent" />
                </div>
                <div className="font-semibold mb-2">Datos Protegidos</div>
                <div className="text-sm text-muted-foreground">
                  Encriptación bancaria de 256 bits para toda tu información
                </div>
              </Card>

              <Card className="p-6 text-center border-2 hover:border-accent/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-6 h-6 text-accent" />
                </div>
                <div className="font-semibold mb-2">Auditado</div>
                <div className="text-sm text-muted-foreground">Procesos auditados por firmas independientes</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">¿Listo para transformar tu nómina?</h2>
            <p className="text-lg text-muted-foreground">
              Agenda una demo personalizada y descubre cómo Nomi puede beneficiar a tu empresa y colaboradores.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Solicitar Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent">
                Contactar Ventas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-bold text-accent-foreground">
                N
              </div>
              <span className="text-xl font-bold">Nomi</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="/terminos" className="hover:text-foreground transition-colors">
                Términos
              </Link>
              <Link href="/privacidad" className="hover:text-foreground transition-colors">
                Privacidad
              </Link>
              <Link href="/auth/login" className="hover:text-foreground transition-colors">
                Iniciar Sesión
              </Link>
            </div>

            <div className="text-sm text-muted-foreground">© 2025 Nomi. Todos los derechos reservados.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
