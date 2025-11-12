import { Navbar } from "@/components/Navbar";
import { RoomCard } from "@/components/room-card";
import { Footer } from "@/components/footer";
import { createClient } from "@/lib/supabase/server";

export default async function HabitacionesPage() {
  const supabase = await createClient();

  const { data: habitaciones, error } = await supabase
    .from("habitaciones")
    .select("*, imagenes(url_imagen, alt_text)")
    .eq("is_available", true);

  if (error) {
    console.error("Error fetching habitaciones:", error);
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <div className="w-full max-w-7xl mx-auto px-8 pt-32 pb-24">
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-light tracking-tight mb-4">
            Habitaciones
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Encuentra el alojamiento perfecto para tu próxima estadía.
          </p>
        </header>

        <section>
          {!habitaciones ||
          (Array.isArray(habitaciones) && habitaciones.length === 0) ? (
            <p className="text-center text-muted-foreground font-light">
              No hay habitaciones disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
              {(habitaciones as any[]).map((habitacion) => (
                <RoomCard
                  key={habitacion.id}
                  id={habitacion.id}
                  title={habitacion.nombre}
                  location={habitacion.descripcion}
                  tipo={habitacion.tipo}
                  beds={`${habitacion.capacidad} ${
                    habitacion.capacidad > 1 ? "camas" : "cama"
                  }`}
                  price={`$${habitacion.precio_por_noche} USD`}
                  image={habitacion.imagenes?.[0]?.url_imagen}
                  rating={habitacion.avg_rating}
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
