"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Acción 1: Confirmar Pago/Reserva (Procesar pago)
export async function confirmarReserva(reservaId: number) {
  const supabase = await createClient();
  await supabase.from('reservas').update({ estado: 'confirmada' }).eq('id', reservaId);
  revalidatePath('/dashboard/operator');
}

// Acción 2: Liberar/Cancelar Reserva
export async function cancelarReserva(reservaId: number) {
  const supabase = await createClient();
  await supabase.from('reservas').delete().eq('id', reservaId);
  revalidatePath('/dashboard/operator');
}

// Acción 3: Abrir/Cerrar Habitación
export async function toggleDisponibilidadHabitacion(habitacionId: number, estadoActual: boolean) {
  const supabase = await createClient();
  await supabase.from('habitaciones').update({ is_available: !estadoActual }).eq('id', habitacionId);
  revalidatePath('/dashboard/operator');
}
