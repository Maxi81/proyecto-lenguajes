// src/components/Navbar.jsx

"use client"; // Necesario para usar 'usePathname'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Importamos el hook
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export const Navbar = () => {
  const pathname = usePathname(); // Obtenemos la ruta actual (ej: "/", "/habitaciones")
  const isHomePage = pathname === "/"; // Verificamos si estamos en la página principal
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Crear cliente supabase en cliente y comprobar usuario actual
    const supabase = createClient();

    let mounted = true;

    async function checkUser() {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setIsLoggedIn(!!data?.user);
      } catch (err) {
        console.error("Error checking supabase user:", err);
        if (!mounted) return;
        setIsLoggedIn(false);
      }
    }

    checkUser();

    // Optional: listen to auth state changes to update UI
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => {
      mounted = false;
      // unsubscribe listener
      if (
        listener &&
        typeof listener.subscription?.unsubscribe === "function"
      ) {
        // @ts-ignore
        listener.subscription.unsubscribe();
      }
    };
  }, []);

  // Clases dinámicas:
  // Si es la página principal, el fondo es transparente (bg-black/60).
  // Si es otra página, el fondo es blanco con sombra y texto negro.
  const headerClasses = isHomePage
    ? "absolute bg-black/60 backdrop-blur-sm text-white"
    : "sticky bg-white shadow-md text-gray-800";

  const linkHoverClass = isHomePage
    ? "hover:text-cyan-300"
    : "hover:text-cyan-500";

  const buttonClasses = isHomePage
    ? "border border-white hover:bg-white hover:text-black"
    : "border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white";

  return (
    <header
      className={`top-0 left-0 w-full z-10 transition-all duration-300 ${headerClasses}`}
    >
      <nav className="container mx-auto flex items-center justify-between p-6">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">GROOVY</Link>
        </div>

        {/* Links de Navegación */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/habitaciones" className={linkHoverClass}>
            Habitaciones
          </Link>
          <Link href="/contacto" className={linkHoverClass}>
            Contacto
          </Link>
        </div>

        {/* Grupo de botones: Autenticación */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Botones según estado de autenticación */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <Link
                href="/reservas-pendientes"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonClasses}`}
              >
                Pagar Reserva
              </Link>
              <button
                onClick={async () => {
                  try {
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    setIsLoggedIn(false);
                    // Redirigir al home o login tras logout
                    router.push("/");
                  } catch (err) {
                    console.error("Error signing out:", err);
                    alert("Error al cerrar sesión. Revisa la consola.");
                  }
                }}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonClasses}`}
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonClasses}`}
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/auth/sign-up"
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonClasses}`}
              >
                Registrarte
              </Link>
            </>
          )}
        </div>

        {/* Icono de Menú para Móvil */}
        <div className="md:hidden">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};
