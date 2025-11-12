"use server";
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

    // 1. Leer las 3 URLs del formulario
    const urls = [
      formData.get('imagen_url_1') as string,
      formData.get('imagen_url_2') as string,
      formData.get('imagen_url_3') as string,
    ];

    // 2. Filtrar las que no estén vacías y darles formato
    const imagenesParaInsertar = urls
      .filter(url => url && url.trim() !== '') // Quitar strings vacíos o null
      .map((url, index) => ({
        habitacion_id: id,
        url_imagen: url.trim(),
        orden: index // Guardar el orden (0, 1, 2)
      }));

    // 3. Si hay imágenes válidas, eliminar las viejas e insertar las nuevas
    if (imagenesParaInsertar.length > 0) {
      // Eliminar todas las imágenes antiguas
      await supabase.from("imagenes").delete().eq("habitacion_id", id);

      // Insertar las nuevas imágenes
      const { error: imgError } = await supabase
        .from("imagenes")
        .insert(imagenesParaInsertar);

      if (imgError) {
        console.error('Error insertando imágenes:', imgError);
      }
    }

    revalidatePath("/dashboard/admin");
    redirect("/dashboard/admin");
  } catch (err) {
    console.error("updateRoom error:", err);
    redirect("/dashboard/admin");
  }
}
