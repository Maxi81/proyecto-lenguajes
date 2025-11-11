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
      <h2 className="text-xl font-bold mb-4">Editar Habitación</h2>

      <form action={updateRoom} className="space-y-4">
        <input type="hidden" name="id" value={habitacion.id} />

        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input
            name="nombre"
            defaultValue={habitacion.nombre ?? ""}
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
            defaultValue={habitacion.numero_habitacion ?? ""}
            required
            className="mt-1 block w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Tipo</label>
          <select
            name="tipo"
            defaultValue={habitacion.tipo ?? "simple"}
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
            defaultValue={habitacion.descripcion ?? ""}
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
              defaultValue={habitacion.precio_por_noche ?? 0}
              required
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Capacidad</label>
            <input
              name="capacidad"
              type="number"
              defaultValue={habitacion.capacidad ?? 1}
              required
              className="mt-1 block w-full rounded border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Imágenes (subir nuevas)
          </label>
          <input
            name="images"
            type="file"
            multiple
            className="mt-1 block w-full"
          />
          <div className="mt-2 flex gap-2 flex-wrap">
            {habitacion.imagenes?.map((img, i) => (
              <img
                key={i}
                src={img.url_imagen}
                className="w-28 h-20 object-cover rounded"
                alt=""
              />
            ))}
          </div>
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
