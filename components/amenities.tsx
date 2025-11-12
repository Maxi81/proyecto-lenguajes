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
    <section className="py-16 px-4 md:py-24 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Nuestras Mejores Comodidades</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Diseñado para una estancia inolvidable. Explora los servicios exclusivos que ofrece Blue Dragon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {amenities.map((amenity, index) => (
            <Card
              key={index}
              className="overflow-hidden group hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={amenity.image}
                  alt={amenity.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{amenity.title}</h3>
                <p className="text-gray-600 mb-4">{amenity.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
