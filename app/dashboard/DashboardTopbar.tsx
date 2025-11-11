"use client";

import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function DashboardTopbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Comprueba si estamos en una página principal del dashboard
  const isMainDashboard =
    pathname === "/dashboard/admin" ||
    pathname === "/dashboard/operator" ||
    pathname === "/dashboard/client";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleVolver = () => {
    // Vuelve a la página principal del dashboard correspondiente
    if (pathname.startsWith("/dashboard/admin")) {
      router.push("/dashboard/admin");
    } else if (pathname.startsWith("/dashboard/operator")) {
      router.push("/dashboard/operator");
    } else if (pathname.startsWith("/dashboard/client")) {
      router.push("/dashboard/client");
    } else {
      router.back(); // Opción de seguridad si no es ninguna
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Panel de Control</h2>

      <div>
        {isMainDashboard ? (
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        ) : (
          <button
            onClick={handleVolver}
            className="rounded-md bg-gray-600 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        )}
      </div>
    </header>
  );
}
