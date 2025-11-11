"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Crear cliente Supabase en cliente
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        alert(error.message ?? "Error en el inicio de sesión");
        return;
      }

      console.log("Login success:", data);

      // Obtener user desde el resultado de autenticación
      const signedUser = (data as any)?.user ?? null;

      // Por defecto trataremos como 'cliente' si no hay perfil
      let role = "cliente";

      if (signedUser && signedUser.id) {
        try {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", signedUser.id)
            .single();

          if (profileError) {
            console.warn("Error fetching profile:", profileError);
            role = "cliente";
          } else {
            role = (profile as any)?.role ?? "cliente";
          }
        } catch (err) {
          console.error("Unexpected error fetching profile:", err);
          role = "cliente";
        }
      }

      // Redirigir según el role
      if (role === "admin") {
        router.push("/dashboard/admin");
      } else if (role === "operador") {
        router.push("/dashboard/operator");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      alert("Ocurrió un error inesperado. Revisa la consola.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
  <h1 className="text-2xl font-bold mb-4 text-gray-900">Iniciar Sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex justify-center rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-800 focus:outline-none"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
