import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // If the env vars are not set, skip middleware check. You can remove this
  // once you setup the project.
  if (!hasEnvVars) {
    return supabaseResponse;
  }

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  // Also fetch the full user to get the user.id value
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user ?? null;

  // Default role is null (no user). If a user exists but no profile is found,
  // we'll treat them as 'cliente' per the requirement.
  let role: string | null = null;
  if (user && user.id) {
    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // If the profiles table doesn't have an entry, default to 'cliente'
        console.warn(
          "profiles.select error:",
          profileError.message ?? profileError
        );
        role = "cliente";
      } else {
        role = profile?.role ?? "cliente";
      }
    } catch (err) {
      console.error("Error fetching profile role:", err);
      role = "cliente";
    }
  }

  const pathname = request.nextUrl.pathname;

  // Public pages: home and login should remain accessible
  const isPublicPath =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/contacto" ||
    pathname.startsWith("/auth");

  // If the user is not authenticated and the path is not public, redirect to /login
  if (!claims && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If path is /login and the user is already logged in, redirect to home
  if (pathname === "/login" && claims) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Role-based guards
  // If accessing /dashboard/admin and role is not 'admin' -> redirect to /
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If accessing /dashboard/operator and role is neither 'operator' nor 'admin' -> redirect to /
  if (
    pathname.startsWith("/dashboard/operator") &&
    role !== "operador" &&
    role !== "admin"
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
