import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // Asegura que se ejecute siempre

export default async function ReservasPendientesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Si no está logueado, lo mandamos al login
    redirect("/login");
  }

  // Buscar la reserva 'pendiente' más reciente de este usuario
  const { data: reserva, error } = await supabase
    .from("reservas")
    .select("id")
    .eq("profile_id", user.id)
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false }) // La más nueva
    .limit(1)
    .single();

  if (error || !reserva) {
    // Si no tiene reservas pendientes, lo mandamos a la página de habitaciones
    // (Puedes cambiar esto a una página de "No tienes reservas pendientes")
    redirect("/habitaciones");
  }

  // ¡Éxito! Redirigir al usuario a la página de pago correcta
  redirect(`/pago/${reserva.id}`);

  // Esta página nunca muestra UI, solo redirige.
  return null;
}
