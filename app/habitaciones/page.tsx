import { Navbar } from "@/components/Navbar";
import RoomCard from "@/components/room-card";
import { Footer } from "@/components/footer";

export default function HabitacionesPage() {
  const rooms = [
    {
      title: "Departamento en San Jorge",
      location: "San Jorge",
      beds: "1 cama",
      rating: "4,71",
      price: "$123 USD",
      image:
        "https://images.unsplash.com/photo-1501117716987-c8e3b5b4f2c4?w=1200&q=80",
    },
    {
      title: "Soar Luxury Loft",
      location: "Centro",
      beds: "1 dormitorio · 1 cama queen",
      rating: "4,99",
      price: "$222 USD",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    },
    {
      title: "Depto céntrico",
      location: "Ciudad",
      beds: "2 dormitorios · 4 camas",
      rating: "4,93",
      price: "$192 USD",
      image:
        "https://images.unsplash.com/photo-1560448070-c9e6a1a2e7b9?w=1200&q=80",
    },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>

      <div className="w-full max-w-6xl mx-auto px-4 pt-32 pb-24">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Habitaciones</h1>
          <p className="text-gray-600 mt-2">
            Encuentra el alojamiento perfecto para tu próxima estadía.
          </p>
        </header>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((r, idx) => (
              <RoomCard
                key={idx}
                title={r.title}
                location={r.location}
                beds={r.beds}
                rating={r.rating}
                price={r.price}
                image={r.image}
              />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
