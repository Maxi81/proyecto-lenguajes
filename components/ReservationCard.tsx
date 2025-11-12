"use client";

import { useState, useMemo } from "react";
import { DayPicker } from "react-day-picker";
import type { DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { createPendingReservation } from "@/app/habitaciones/[id]/actions";

export type ReservationCardProps = {
  habitacionId: number;
  precioPorNoche: number;
  userId: string;
  existingReservations?: Array<{
    fecha_inicio: string;
    fecha_fin: string;
    estado: string;
  }>;
};

// DateRange type compatible con react-day-picker
// Usamos el tipo DateRange de la librería para evitar incompatibilidades

export function ReservationCard({
  habitacionId,
  precioPorNoche,
  userId,
  existingReservations,
}: ReservationCardProps) {
  // El rango puede iniciar sin selección
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // (Responsive eliminado) Siempre mostramos 1 mes.

  // Wrapper para ajustar el tipo esperado por form action
  async function handleCreateReservation(formData: FormData) {
    // Limpiar error antiguo
    setErrorMessage(null);
    const result = await createPendingReservation(formData);
    // Si la acción devuelve un error (que no es el redirect), lo mostramos
    if (result && typeof result === "object" && "error" in result) {
      const err = (result as { error?: unknown }).error;
      if (err) setErrorMessage(String(err));
    }
    // Si tiene éxito, el redirect() de la acción se encargará
  }

  // Calcular noches entre fechas (mínimo 1 si ambos existen)
  let noches = 0;
  if (range?.from && range?.to) {
    const msPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.round(
      (range.to.getTime() - range.from.getTime()) / msPerDay
    );
    noches = Math.max(1, diff);
  }
  const total = noches * precioPorNoche;

  // Construir fechas deshabilitadas: rangos confirmados
  const disabledDates = useMemo(() => {
    if (!existingReservations) return [];

    return existingReservations
      .filter((res) => res.estado === "confirmada") // Solo bloquear fechas confirmadas
      .map((res) => ({
        // Usamos T00:00:00 para evitar errores de zona horaria
        from: new Date(res.fecha_inicio + "T00:00:00"),
        to: new Date(res.fecha_fin + "T00:00:00"),
      }));
  }, [existingReservations]);

  return (
    <aside className="bg-white rounded-xl shadow-md p-6 mb-8 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        Reserva tu habitación
      </h2>

      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={1}
        disabled={[...disabledDates, { before: new Date() }]}
        className="border rounded-lg overflow-hidden"
        classNames={{
          // Contenedor principal
          month: "space-y-4 p-4",

          // Título del mes
          caption: "flex justify-center py-2 relative items-center",
          caption_label: "text-lg font-semibold text-gray-900",

          // Botones de flecha
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 flex items-center justify-center p-1 rounded-full hover:bg-gray-100 text-gray-800",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",

          // Estilos de la TABLA del calendario
          table: "w-full border-collapse", // <-- Usa todo el ancho
          head_row: "flex",
          head_cell: "text-gray-500 rounded-md w-full justify-center font-normal text-[0.8rem] p-1", // <-- Días de la semana

          row: "flex w-full mt-2", // <-- Fila de la semana
          cell: "p-0 m-0.5 text-center text-sm relative first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full focus-within:relative focus-within:z-20", // <-- Contenedor del día

          // Estilos de DÍAS individuales
          day: "h-9 w-9 p-0 font-normal rounded-full text-gray-800 hover:bg-gray-100",
          day_today: "bg-blue-100 text-blue-700 font-semibold",
          day_outside: "text-gray-400 opacity-70",
          day_disabled: "text-gray-300 opacity-50 line-through",

          // Estilos de RANGO
          day_range_start: "day-range-start bg-blue-600 text-white rounded-l-full hover:bg-blue-600",
          day_range_end: "day-range-end bg-blue-600 text-white rounded-r-full hover:bg-blue-600",
          day_selected: "bg-blue-500 text-white hover:bg-blue-600 rounded-full",
          day_range_middle: "bg-blue-100 text-blue-700 rounded-none",
        }}
      />

      <div className="mb-4 text-lg text-gray-700 space-y-1">
        <div>
          Precio por noche:
          <span className="font-semibold text-blue-600">
            {" "}
            ${precioPorNoche}
          </span>
        </div>
        <div>
          Noches: <span className="font-semibold">{noches}</span>
        </div>
        <div>
          Total: <span className="font-bold text-green-600">${total}</span>
        </div>
      </div>

      <form action={handleCreateReservation} className="space-y-4">
        <input type="hidden" name="habitacion_id" value={habitacionId} />
        <input type="hidden" name="profile_id" value={userId} />
        <input
          type="hidden"
          name="fecha_inicio"
          value={range?.from ? range.from.toISOString().slice(0, 10) : ""}
        />
        <input
          type="hidden"
          name="fecha_fin"
          value={range?.to ? range.to.toISOString().slice(0, 10) : ""}
        />

        {errorMessage && (
          <div className="text-red-600 text-sm font-medium p-3 bg-red-50 border border-red-300 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={!range?.from || !range?.to}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Reservar
        </button>
      </form>
    </aside>
  );
}

export default ReservationCard;
