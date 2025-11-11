"use client";

import React from "react";

import { createRoom } from "../actions";

export default function NewRoomPage() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Crear Nueva Habitación</h1>

      <form action={createRoom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Número de habitación
          </label>
          <input
            name="numero_habitacion"
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select
            name="tipo"
            className="mt-1 block w-full rounded border px-3 py-2"
          >
            <option value="simple">Simple</option>
            <option value="doble">Doble</option>
            <option value="triple">Triple</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Descripción</label>
          <textarea
            name="descripcion"
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">
              Precio por noche
            </label>
            <input
              name="precio_por_noche"
              type="number"
              step="0.01"
              required
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Capacidad</label>
            <input
              name="capacidad"
              type="number"
              required
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Imágenes</label>
          <input
            name="images"
            type="file"
            multiple
            className="mt-1 block w-full"
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
