"use client";

// Convertido a Componente Cliente: carga datos en el navegador
import { createClient } from "@/lib/supabase/client";
import { PaypalClientButton } from "@/components/PaypalClientButton";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

// Tipos de ayuda
type HabitacionType = { id: number; nombre: string; precio_por_noche: number };
type ReservaType = {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  habitaciones: HabitacionType | null; // join como objeto
};

export default function PagoPage() {
  const params = useParams<{ reserva_id: string }>();
  const supabase = useMemo(() => createClient(), []);

  const [reserva, setReserva] = useState<ReservaType | null>(null);
  const [loading, setLoading] = useState(true);

  // Normalizar el parámetro por si llega como string[]
  const reservaIdParam = Array.isArray(params?.reserva_id)
    ? params.reserva_id[0]
    : params?.reserva_id;
  const reservaIdNum = Number(reservaIdParam);

  useEffect(() => {
    const fetchReserva = async () => {
      if (!reservaIdNum) {
        setLoading(false);
        return; // ID inválido
      }
      const { data, error } = await supabase
        .from("reservas")
        .select(
          "id, fecha_inicio, fecha_fin, estado, habitaciones(id, nombre, precio_por_noche)"
        )
        .eq("id", reservaIdNum)
        .single();
      if (error || !data) {
        console.error("Error fetching reserva:", error);
        setReserva(null);
      } else {
        setReserva(data as unknown as ReservaType);
      }
      setLoading(false);
    };
    fetchReserva();
  }, [reservaIdNum, supabase]);

  // Estados de carga / error
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Cargando reserva…</p>
      </main>
    );
  }

  if (!reserva) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl">Reserva no encontrada o ID inválido</p>
      </main>
    );
  }

  // Cálculo en cliente
  const start = new Date(reserva.fecha_inicio);
  const end = new Date(reserva.fecha_fin);
  const msPerDay = 1000 * 60 * 60 * 24;
  let noches = Math.round((end.getTime() - start.getTime()) / msPerDay);
  noches = Math.max(1, noches);
  const precioPorNoche = reserva.habitaciones?.precio_por_noche ?? 0;
  const total = noches * precioPorNoche;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">
          Pago de Reserva
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow p-6 text-gray-900">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Resumen
              </h2>
              <p className="text-lg">
                <span className="font-medium">Habitación:</span>{" "}
                {reserva.habitaciones?.nombre ?? "—"}
              </p>
              <p className="text-lg">
                <span className="font-medium">Fecha inicio:</span>{" "}
                {reserva.fecha_inicio}
              </p>
              <p className="text-lg">
                <span className="font-medium">Fecha fin:</span>{" "}
                {reserva.fecha_fin}
              </p>
              <p className="text-lg">
                <span className="font-medium">Noches:</span> {noches}
              </p>
              <p className="text-lg">
                <span className="font-medium">Precio por noche:</span> $
                {precioPorNoche}
              </p>
              <p className="text-xl font-bold mt-4">Total: ${total}</p>
            </div>
          </div>
          {/* Pago con PayPal */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow p-6 space-y-4">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Pagar con PayPal
              </h2>
              <PaypalClientButton total={total} reservaId={reserva.id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
