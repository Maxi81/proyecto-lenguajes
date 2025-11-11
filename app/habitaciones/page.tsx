import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/room-card";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";

export default async function HabitacionesPage() {
  const supabase = await createClient();

  const { data: habitaciones, error } = await supabase
    .from("habitaciones")
    .select("*, imagenes(url_imagen, alt_text)");

  if (error) {
    console.error("Error fetching habitaciones:", error);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 pt-32 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Habitaciones</h1>
          <p className="text-gray-900 mt-2">
            Encuentra el alojamiento perfecto para tu próxima estadía.
          </p>
        </header>

        <section>
          {!habitaciones ||
          (Array.isArray(habitaciones) && habitaciones.length === 0) ? (
            <p className="text-center text-gray-900">
              No hay habitaciones disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(habitaciones as any[]).map((habitacion) => (
                <RoomCard
                  key={habitacion.id}
                  title={habitacion.nombre}
                  location={habitacion.descripcion}
                  tipo={habitacion.tipo}
                  beds={`${habitacion.capacidad} ${
                    habitacion.capacidad > 1 ? "camas" : "cama"
                  }`}
                  price={`$${habitacion.precio_por_noche} USD`}
                  image={habitacion.imagenes?.[0]?.url_imagen}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}
