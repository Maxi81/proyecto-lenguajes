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
        habitacion_id: habitacionId,
        url_imagen: url.trim(),
        orden: index // Opcional: guardar el orden (0, 1, 2)
      }));
    
    // 3. Insertar todas las imágenes válidas
    if (imagenesParaInsertar.length > 0) {
      const { error: imgError } = await supabase
        .from('imagenes')
        .insert(imagenesParaInsertar);
      
      if (imgError) {
        console.error('Error insertando imágenes:', imgError);
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

export async function getStatsReservasPorTipo() {
  const supabase = await createServerClient();
  
  // Esta es la "Consulta Parametrizada" (por 'confirmada')
  const { data, error } = await supabase
    .from('reservas')
    .select('habitaciones(tipo)') // Trae el 'tipo' desde la tabla habitaciones
    .eq('estado', 'confirmada'); // El parámetro

  if (error) {
    console.error('Error fetching stats:', error);
    return [];
  }

  // Procesar los datos para que Recharts los entienda
  const counts = data.reduce((acc, reserva) => {
    const habitacion = reserva.habitaciones as any;
    const tipo = habitacion?.tipo || 'Desconocido';
    acc[tipo] = (acc[tipo] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return Object.keys(counts).map(tipo => ({
    name: tipo.charAt(0).toUpperCase() + tipo.slice(1), // Capitaliza (ej: "Doble")
    value: counts[tipo],
  }));
}

export async function getStatsIngresosPorMes() {
  const supabase = await createServerClient();
  
  // 1. Obtenemos todas las reservas confirmadas y su precio
  const { data, error } = await supabase
    .from('reservas')
    .select('fecha_inicio, fecha_fin, habitaciones(precio_por_noche)')
    .eq('estado', 'confirmada');

  if (error) {
    console.error('Error fetching stats ingresos:', error);
    return [];
  }

  // 2. Procesamos los datos en JS
  const ingresosPorMes = data.reduce((acc, reserva) => {
    const habitacion = reserva.habitaciones as any;
    if (!habitacion) return acc; // Omitir si la habitación fue borrada

    const inicio = new Date(reserva.fecha_inicio + 'T00:00:00');
    const fin = new Date(reserva.fecha_fin + 'T00:00:00');
    
    // Calcular noches
    const msPerDay = 1000 * 60 * 60 * 24;
    const noches = Math.round((fin.getTime() - inicio.getTime()) / msPerDay);

    const precio = habitacion.precio_por_noche;
    const totalReserva = noches * precio;

    // Agrupar por mes (formato YYYY-MM)
    const month = inicio.toISOString().slice(0, 7);

    acc[month] = (acc[month] || 0) + totalReserva;
    return acc;
  }, {} as { [key: string]: number });

  // 3. Convertir a formato Recharts y ordenar
  return Object.keys(ingresosPorMes)
    .map(month => ({
      name: month, // El mes (YYYY-MM)
      Ingresos: ingresosPorMes[month],
    }))
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar por fecha
}

export async function getStatsTopHabitaciones() {
  const supabase = await createServerClient();
  
  // 1. Obtenemos todas las reservas confirmadas y el nombre de la habitación
  const { data, error } = await supabase
    .from('reservas')
    .select('habitaciones(nombre)')
    .eq('estado', 'confirmada');

  if (error) {
    console.error('Error fetching stats top habitaciones:', error);
    return [];
  }

  // 2. Procesamos en JS
  const counts = data.reduce((acc, reserva) => {
    const habitacion = reserva.habitaciones as any;
    const nombre = habitacion?.nombre || 'Habitación Desconocida';
    acc[nombre] = (acc[nombre] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // 3. Convertir a formato Recharts y ordenar (Top 5)
  return Object.keys(counts)
    .map(nombre => ({
      name: nombre,
      Reservas: counts[nombre],
    }))
    .sort((a, b) => b.Reservas - a.Reservas) // Ordenar de mayor a menor
    .slice(0, 5); // Tomar solo las 5 primeras
}
