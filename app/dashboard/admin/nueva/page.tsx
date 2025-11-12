"use client";

import React from "react";

import { createRoom } from "../actions";

export default function NewRoomPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Crear Nueva Habitación</h1>

      <form action={createRoom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900">Nombre</label>
          <input
            name="nombre"
            required
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Número de habitación
          </label>
          <input
            name="numero_habitacion"
            required
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Tipo</label>
          <select
            name="tipo"
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          >
            <option value="simple">Simple</option>
            <option value="doble">Doble</option>
            <option value="triple">Triple</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Descripción</label>
          <textarea
            name="descripcion"
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900">
              Precio por noche
            </label>
            <input
              name="precio_por_noche"
              type="text"
              inputMode="decimal"
              required
              className="mt-1 block w-full rounded border px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900">Capacidad</label>
            <input
              name="capacidad"
              type="text"
              inputMode="numeric"
              required
              className="mt-1 block w-full rounded border px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Imagen 1 (Principal) */}
        <div>
          <label htmlFor="imagen_url_1" className="block text-sm font-medium text-gray-700">
            Imagen URL 1 (Principal)
          </label>
          <input
            type="text"
            name="imagen_url_1"
            id="imagen_url_1"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Pega la URL de la imagen aquí"
          />
        </div>
        
        {/* Imagen 2 */}
        <div>
          <label htmlFor="imagen_url_2" className="block text-sm font-medium text-gray-700">
            Imagen URL 2
          </label>
          <input
            type="text"
            name="imagen_url_2"
            id="imagen_url_2"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Pega la URL de la imagen aquí"
          />
        </div>
        
        {/* Imagen 3 */}
        <div>
          <label htmlFor="imagen_url_3" className="block text-sm font-medium text-gray-700">
            Imagen URL 3
          </label>
          <input
            type="text"
            name="imagen_url_3"
            id="imagen_url_3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            placeholder="Pega la URL de la imagen aquí"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  );
}
