"use client";

import Image from "next/image";
import { Card } from "./ui/card";

const amenities = [
  {
    title: "Piscina Climatizada",
    description:
      "Disfruta de nuestra piscina interior climatizada, abierta todo el año. Un espacio perfecto para relajarte o hacer ejercicio, con servicio de toallas incluido.",
    image: "/pool.jpg",
  },
  {
    title: "Spa y Bienestar",
    description:
      "Un refugio de tranquilidad donde el tiempo se detiene. Ofrecemos masajes terapéuticos, sauna seca y tratamientos faciales con productos orgánicos.",
    image: "/spa.jpg",
  },
  {
    title: "Habitaciones de Lujo",
    description:
      "Diseño elegante y comodidad superior. Nuestras suites cuentan con camas king-size, baño privado con bañera de hidromasaje y vistas panorámicas.",
    image: "/room.jpg",
  },
];

export function Amenities() {
  return (
    <section className="py-24 px-8 md:py-32 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-light mb-6 tracking-tight">
            Comodidades
          </h2>
          <p className="text-muted-foreground text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Diseñado para una estancia inolvidable. Explora los servicios
            exclusivos que ofrece Blue Dragon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-xl transition-all duration-500 border-border bg-card"
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image
                  src={amenity.image}
                  alt={amenity.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-serif font-light mb-4 tracking-tight">
                  {amenity.title}
                </h3>
                <p className="text-muted-foreground font-light leading-relaxed">
                  {amenity.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
