import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ["/", "/auth/login", "/auth/sign-up", "/auth/sign-up-success", "/auth/error", "/auth/callback"]
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith("/auth/"),
  )

  // Si no hay usuario y la ruta no es pública, redirigir a login
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // Si hay usuario, verificar permisos de rol para rutas protegidas
  if (user && !isPublicRoute) {
    const { data: profile } = await supabase.from("profiles").select("role, company_id").eq("id", user.id).single()

    if (profile) {
      const pathname = request.nextUrl.pathname

      // Verificar acceso a rutas de admin
      if (pathname.startsWith("/admin") && profile.role !== "admin") {
        const url = request.nextUrl.clone()
        url.pathname = profile.role === "hr" ? "/hr" : "/dashboard"
        return NextResponse.redirect(url)
      }

      // Verificar acceso a rutas de HR
      if (pathname.startsWith("/hr") && profile.role !== "hr" && profile.role !== "admin") {
        const url = request.nextUrl.clone()
        url.pathname = profile.role === "admin" ? "/admin" : "/dashboard"
        return NextResponse.redirect(url)
      }

      // Verificar acceso a rutas de empleado
      if (pathname.startsWith("/dashboard") && profile.role === "admin") {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
