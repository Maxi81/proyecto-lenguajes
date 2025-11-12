"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function submitReview(formData: FormData) {
  const rating = formData.get("rating");
  const comment = formData.get("comment");
  const habitacion_id = formData.get("habitacion_id");
  const user_id = formData.get("user_id");

  // Validar que todos los campos estén presentes
  if (!rating || !comment || !habitacion_id || !user_id) {
    return {
      error: "Faltan datos requeridos para enviar la reseña",
      success: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("reviews").insert({
    rating: Number(rating),
    comment: comment,
    habitacion_id: Number(habitacion_id),
    user_id: String(user_id),
  });

  if (error) {
    console.error("Error inserting review:", error);
    return {
      error: "Error al guardar la reseña. Intenta de nuevo.",
      success: false,
    };
  }

  // Revalidar la página para mostrar la nueva reseña
  revalidatePath(`/habitaciones/${habitacion_id}`);

  return {
    success: true,
    message: "Reseña guardada exitosamente",
  };
}

// Crea una reserva pendiente a partir del formulario de fechas
export async function createPendingReservation(formData: FormData) {
  const habitacion_id = formData.get("habitacion_id");
  const profile_id = formData.get("profile_id");
  const fecha_inicio = formData.get("fecha_inicio"); // YYYY-MM-DD
  const fecha_fin = formData.get("fecha_fin");

  if (!habitacion_id || !profile_id || !fecha_inicio || !fecha_fin) {
    return {
      success: false,
      error: "Faltan datos requeridos para crear la reserva",
    };
  }

  // Validación simple del rango de fechas
  try {
    const start = new Date(String(fecha_inicio));
    const end = new Date(String(fecha_fin));
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end <= start
    ) {
      return { success: false, error: "Rango de fechas inválido" };
    }
  } catch {
    return { success: false, error: "Fechas inválidas" };
  }

  const supabase = await createClient();

  // Insertar reserva con estado 'pendiente' y devolver el id recién creado
  const { data: newReservation, error } = await supabase
    .from("reservas")
    .insert({
      habitacion_id: Number(habitacion_id),
      profile_id: String(profile_id),
      fecha_inicio: String(fecha_inicio),
      fecha_fin: String(fecha_fin),
      estado: "pendiente",
    })
    .select("id")
    .single();

  if (error || !newReservation) {
    console.error("Error creating pending reservation:", error);
    // Detectar el error de solapamiento (código Postgres '23P01')
    if (
      error &&
      typeof (error as { code?: string }).code === "string" &&
      (error as { code?: string }).code === "23P01"
    ) {
      return {
        success: false,
        error:
          "Lo sentimos, esas fechas ya no están disponibles. Por favor, selecciona otras.",
      };
    }

    return {
      success: false,
      error:
        "No se pudo crear la reserva. Verifica la disponibilidad o intenta nuevamente.",
    };
  }

  // Revalidar el detalle de la habitación (opcional, por si hay contadores/estado)
  revalidatePath(`/habitaciones/${habitacion_id}`);

  // Redirigir a la página de pago con el ID de la nueva reserva
  redirect(`/pago/${newReservation.id}`);
}
