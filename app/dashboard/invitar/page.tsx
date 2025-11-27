"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmployeeLayout } from "@/components/employee-layout"
import { Gift, Copy, Share2, Users, CheckCircle2 } from "lucide-react"

export default function InvitarPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "LUIS2024"
  const referralLink = `https://nomi.do/ref/${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Únete a Nomi",
          text: "Accede a tu salario cuando lo necesites con Nomi. Usa mi código de referido.",
          url: referralLink,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      handleCopy()
    }
  }

  return (
    <EmployeeLayout>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Invitar Amigos</h2>
          <p className="text-sm text-muted-foreground">Comparte Nomi y gana beneficios</p>
        </div>

        {/* Reward Banner */}
        <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-accent/20">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-lg font-bold mb-2">¡Gana RD$ 200!</h3>
            <p className="text-sm text-muted-foreground">
              Por cada amigo que se registre y haga su primer retiro, ambos reciben RD$ 200 de bonificación.
            </p>
          </CardContent>
        </Card>

        {/* Referral Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tu Código de Referido</CardTitle>
            <CardDescription>Comparte este código con tus amigos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input value={referralCode} readOnly className="text-center font-mono text-lg font-bold" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">o comparte el link</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input value={referralLink} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>

            <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Compartir con Amigos
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Tus Referidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Amigos Invitados</div>
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="text-2xl font-bold text-accent">RD$ 600</div>
                <div className="text-xs text-muted-foreground">Ganado en Bonos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">¿Cómo Funciona?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                  1
                </div>
                <div>
                  <p className="text-sm font-medium">Comparte tu código</p>
                  <p className="text-xs text-muted-foreground">
                    Envía tu código o link a amigos que trabajen en empresas con Nomi
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                  2
                </div>
                <div>
                  <p className="text-sm font-medium">Tu amigo se registra</p>
                  <p className="text-xs text-muted-foreground">Usando tu código al crear su cuenta en Nomi</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shrink-0">
                  3
                </div>
                <div>
                  <p className="text-sm font-medium">Ambos ganan</p>
                  <p className="text-xs text-muted-foreground">
                    Cuando tu amigo haga su primer retiro, ambos reciben RD$ 200
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  )
}
