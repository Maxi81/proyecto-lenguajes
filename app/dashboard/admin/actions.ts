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

    // Handle files
    const files = formData.getAll("images") as File[];
    for (const file of files) {
      if (!file || (file as any).size === 0) continue;

      // Build a unique path inside the 'habitaciones' bucket
      const filePath = `${habitacionId}/${Date.now()}-${file.name}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("habitaciones")
        .upload(filePath, file as any);
      // Debug: log upload result
      console.log(
        "Uploaded file to storage path:",
        filePath,
        "uploadError:",
        uploadError
      );

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        continue;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from("habitaciones")
        .getPublicUrl(filePath);
      const publicUrl =
        (publicData as any)?.publicUrl ||
        (publicData as any)?.publicURL ||
        null;

      // Debug: log the generated public URL
      console.log("Public URL for", filePath, ":", publicUrl);

      // Insert image record linking to the habitación
      try {
        const { data: imgInsertData, error: imgInsertError } = await supabase
          .from("imagenes")
          .insert([
            {
              url_imagen: publicUrl,
              habitacion_id: habitacionId, // ASSUMPTION: imagenes table uses habitacion_id FK
            },
          ]);

        // Debug: log result of image insert
        console.log(
          "Inserted imagen record for habitacion",
          habitacionId,
          "result:",
          imgInsertData,
          "error:",
          imgInsertError
        );
        if (imgInsertError) {
          console.error("Error inserting imagen record:", imgInsertError);
        }
      } catch (err) {
        console.error("Error inserting imagen record (catch):", err);
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
