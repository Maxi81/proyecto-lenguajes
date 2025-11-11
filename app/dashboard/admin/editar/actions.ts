import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateRoom(formData: FormData) {
  "use server";

  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing id");
  }

  const nombre = formData.get("nombre") as string | null;
  const numero_habitacion = formData.get("numero_habitacion") as string | null;
  const tipo = formData.get("tipo") as string | null;
  const descripcion = formData.get("descripcion") as string | null;
  const precio_por_noche = formData.get("precio_por_noche") as string | null;
  const capacidad = formData.get("capacidad") as string | null;

  const supabase = await createClient();

  try {
    // Update textual fields
    await supabase
      .from("habitaciones")
      .update({
        nombre,
        numero_habitacion,
        tipo,
        descripcion,
        precio_por_noche: precio_por_noche ? Number(precio_por_noche) : null,
        capacidad: capacidad ? Number(capacidad) : null,
      })
      .eq("id", id);

    // Handle new image files if provided
    const files = formData.getAll("images") as File[];
    for (const file of files) {
      if (!file || (file as any).size === 0) continue;

      const filePath = `${id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("habitaciones")
        .upload(filePath, file as any);

      if (uploadError) {
        console.error("upload error:", uploadError);
        continue;
      }

      const { data: publicData } = supabase.storage
        .from("habitaciones")
        .getPublicUrl(filePath);
      const publicUrl =
        (publicData as any)?.publicUrl ||
        (publicData as any)?.publicURL ||
        null;

      if (publicUrl) {
        await supabase.from("imagenes").insert([
          {
            url_imagen: publicUrl,
            habitacion_id: id,
          },
        ]);
      }
    }

    revalidatePath("/dashboard/admin");
    redirect("/dashboard/admin");
  } catch (err) {
    console.error("updateRoom error:", err);
    redirect("/dashboard/admin");
  }
}
