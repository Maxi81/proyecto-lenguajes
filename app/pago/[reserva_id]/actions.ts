"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function confirmPayment(
  reservaId: number
): Promise<{ error?: string } | void> {
  const reserva_id = reservaId;
  if (!reserva_id) return { error: "ID de reserva inválido" };

  const cookieStore = await cookies();

  // Cliente admin usando la SERVICE KEY para saltar RLS en esta acción controlada
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const { error } = await supabase
    .from("reservas")
    .update({ estado: "confirmada" })
    .eq("id", reserva_id);

  if (error) {
    console.error("Error al confirmar reserva:", error);
    return { error: "No se pudo confirmar la reserva." };
  }

  revalidatePath(`/pago/${reserva_id}`);
  redirect("/reservas/exito");
}
