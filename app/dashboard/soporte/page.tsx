"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EmployeeLayout } from "@/components/employee-layout"
import { MessageCircle, Phone, Mail, HelpCircle, Send, ChevronRight } from "lucide-react"

const faqs = [
  {
    question: "¿Cuánto tiempo tarda en llegar mi retiro?",
    answer: "Los retiros se procesan en minutos y llegan a tu cuenta bancaria casi instantáneamente.",
  },
  {
    question: "¿Cuál es la comisión por retiro?",
    answer: "La comisión depende del plan de tu empresa. Puedes ver el monto exacto antes de confirmar cada retiro.",
  },
  {
    question: "¿Puedo cambiar mi cuenta bancaria?",
    answer: "Sí, puedes actualizar tu cuenta bancaria desde la sección 'Mi Cuenta'.",
  },
  {
    question: "¿Cuánto puedo retirar?",
    answer:
      "Puedes retirar hasta el porcentaje de tu salario que tu empresa haya configurado, basado en los días trabajados.",
  },
]

export default function SoportePage() {
  const [message, setMessage] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const handleSendMessage = () => {
    if (message.trim()) {
      alert("Mensaje enviado. Te responderemos pronto.")
      setMessage("")
    }
  }

  return (
    <EmployeeLayout>
      <div className="px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-bold">Soporte</h2>
          <p className="text-sm text-muted-foreground">¿Cómo podemos ayudarte?</p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <Phone className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-medium">Llamar</p>
              <p className="text-xs text-muted-foreground">809-555-NOMI</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-medium">WhatsApp</p>
              <p className="text-xs text-muted-foreground">Chat directo</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <HelpCircle className="w-4 h-4" />
              Preguntas Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="w-full p-3 flex items-center justify-between text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="text-sm font-medium">{faq.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-3 pb-3">
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="w-4 h-4" />
              Enviar Mensaje
            </CardTitle>
            <CardDescription>Te responderemos en menos de 24 horas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tu mensaje</Label>
              <Textarea
                placeholder="Describe tu consulta o problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Mensaje
            </Button>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  )
}
