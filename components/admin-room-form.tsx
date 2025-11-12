"use client";

import React from "react";
import { updateRoom } from "@/app/dashboard/admin/editar/actions";

type Imagen = {
  url_imagen?: string;
};

type Habitacion = {
  id: string;
  nombre?: string;
  numero_habitacion?: string;
  tipo?: string;
  descripcion?: string;
  precio_por_noche?: number;
  capacidad?: number;
  imagenes?: Imagen[];
};

export default function AdminRoomForm({
  habitacion,
}: {
  habitacion: Habitacion;
}) {
  return (
    <div className="max-w-3xl mx-auto py-8 w-full">
      <h2 className="text-xl font-bold mb-4 text-gray-900">Editar Habitación</h2>

      <form action={updateRoom} className="space-y-4">
        <input type="hidden" name="id" value={habitacion.id} />

        <div>
          <label className="block text-sm font-medium text-gray-900">Nombre</label>
          <input
            name="nombre"
            defaultValue={habitacion.nombre ?? ""}
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
            defaultValue={habitacion.numero_habitacion ?? ""}
            required
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">Tipo</label>
          <select
            name="tipo"
            defaultValue={habitacion.tipo ?? "simple"}
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
            defaultValue={habitacion.descripcion ?? ""}
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
              defaultValue={habitacion.precio_por_noche ?? 0}
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
              defaultValue={habitacion.capacidad ?? 1}
              required
              className="mt-1 block w-full rounded border px-3 py-2 text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Imagen URL 1 (Principal)
          </label>
          <input
            name="imagen_url_1"
            type="text"
            placeholder="Pega la URL de la imagen principal aquí"
            defaultValue={habitacion.imagenes?.[0]?.url_imagen ?? ""}
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Imagen URL 2
          </label>
          <input
            name="imagen_url_2"
            type="text"
            placeholder="Pega la URL de la segunda imagen aquí"
            defaultValue={habitacion.imagenes?.[1]?.url_imagen ?? ""}
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900">
            Imagen URL 3
          </label>
          <input
            name="imagen_url_3"
            type="text"
            placeholder="Pega la URL de la tercera imagen aquí"
            defaultValue={habitacion.imagenes?.[2]?.url_imagen ?? ""}
            className="mt-1 block w-full rounded border px-3 py-2 text-white"
          />
        </div>

        <div>
          <button
            type="submit"
            className="rounded bg-black text-white px-4 py-2"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
