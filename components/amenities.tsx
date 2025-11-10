"use client";

import Image from "next/image";
import { Card } from "./ui/card";

const amenities = [
  {
    title: "Swimming Pool",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.",
    image: "/pool.jpg",
  },
  {
    title: "Iconic Spa",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.",
    image: "/spa.jpg",
  },
  {
    title: "Luxurious Rooms",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore.",
    image: "/room.jpg",
  },
];

export function Amenities() {
  return (
    <section className="py-16 px-4 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Amenities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cursus tempus, tincidunt quis sem sapien id non eget sed in
            consequat tellus phasellus orci in semper elit porttitor eget metus.
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
                <button className="text-sm font-semibold uppercase tracking-wider hover:underline">
                  READ MORE
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors">
            GET BOOKINGS
          </button>
        </div>
      </div>
    </section>
  );
}
