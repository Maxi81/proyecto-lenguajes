"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";

export async function createRoom(formData: FormData) {
  "use server";

  // Extract text fields
  const nombre = formData.get("nombre") as string | null;
  const numero_habitacion = formData.get("numero_habitacion") as string | null;
  const tipo = formData.get("tipo") as string | null;
  const descripcion = formData.get("descripcion") as string | null;
  const precio_por_noche = formData.get("precio_por_noche") as string | null;
  const capacidad = formData.get("capacidad") as string | null;

  const supabase = await createServerClient();

  try {
    // Insert habitación (text fields)
    const { data: insertData, error: insertError } = await supabase
      .from("habitaciones")
      .insert([
        {
          nombre,
          numero_habitacion,
          tipo,
          descripcion,
          precio_por_noche: precio_por_noche ? Number(precio_por_noche) : null,
          capacidad: capacidad ? Number(capacidad) : null,
        },
      ])
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting habitacion:", insertError);
      throw insertError;
    }

    const habitacionId = (insertData as any)?.id;
    if (!habitacionId) {
      throw new Error("No se obtuvo el id de la habitación creada");
    }

    // Handle image URL
    const imageUrl = formData.get("imagen_url") as string;
    
    if (imageUrl && imageUrl.trim() !== "") {
      const { error: imgInsertError } = await supabase
        .from("imagenes")
        .insert({
          habitacion_id: habitacionId,
          url_imagen: imageUrl.trim(),
        });

      if (imgInsertError) {
        console.error("Error inserting imagen record:", imgInsertError);
      }
    }

    // Revalidate and redirect back to admin dashboard
    revalidatePath("/dashboard/admin");
    redirect("/dashboard/admin");
  } catch (err) {
    console.error("createRoom error:", err);
    // In a real app you might return a structured error to the client
    redirect("/dashboard/admin");
  }
}
