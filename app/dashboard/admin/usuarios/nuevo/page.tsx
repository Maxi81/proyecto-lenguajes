"use client";

import { createUser } from "../actions";

export default function NuevoOperadorPage() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Crear Nuevo Operador
        </h1>

        <form action={createUser} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email del nuevo operador"
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-900">
              Contraseña Temporal
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Contraseña temporal"
              required
              className="rounded-md border border-gray-300 px-3 py-2 text-gray-900"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-black text-white px-4 py-2 font-semibold hover:bg-gray-800"
          >
            Crear Operador
          </button>
        </form>
      </div>
    </div>
  );
}
