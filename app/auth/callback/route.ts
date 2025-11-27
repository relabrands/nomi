import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Obtener el perfil del usuario para redirigir según el rol
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile) {
          switch (profile.role) {
            case "admin":
              return NextResponse.redirect(`${origin}/admin`)
            case "hr":
              return NextResponse.redirect(`${origin}/hr`)
            default:
              return NextResponse.redirect(`${origin}/dashboard`)
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si hay error, redirigir a la página de error
  return NextResponse.redirect(`${origin}/auth/error?error=auth_callback_failed`)
}
