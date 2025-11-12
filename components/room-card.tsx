import * as React from "react";
import Link from "next/link";

type RoomCardProps = {
  id: number | string;
  title: string;
  location: string;
  tipo: string;
  beds?: string;
  rating?: string | number;
  price?: string | number;
  image?: string;
};

export function RoomCard({
  id,
  title,
  location,
  tipo,
  beds = "1 cama",
  rating,
  price = "$120 USD",
  image = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
}: RoomCardProps) {
  return (
    <Link href={`/habitaciones/${id}`}>
      <article className="max-w-sm cursor-pointer">
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-64 object-cover rounded-2xl shadow-md"
          />

          {/* Badge 'Favorito entre huéspedes' - oculto por ahora */}
          <div className="absolute left-4 top-4 bg-white/90 text-sm font-medium px-3 py-1 rounded-full shadow-sm opacity-0 pointer-events-none">
            Favorito entre huéspedes
          </div>

          {/* Heart icon - oculto por ahora */}
          <button className="absolute right-4 top-4 bg-white/90 p-2 rounded-full opacity-0 pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-800"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.7 7.6 6.4 6.1 7.9c-1.5 1.5-1.22 4.04.78 6.04L12 20.2l4.99-6.25c2-2 2.27-4.54.78-6.04-1.5-1.5-4.04-1.2-5.67.68z" />
            </svg>
          </button>

          {/* small dots like carousel indicator (decorative) */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
            <span className="w-2 h-2 bg-white/80 rounded-full" />
            <span className="w-2 h-2 bg-white/50 rounded-full" />
            <span className="w-2 h-2 bg-white/50 rounded-full" />
          </div>
        </div>

        <div className="mt-4">
          <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
          <div className="flex items-center justify-between text-sm text-gray-600 mt-1">
            <div>
              <p>{location}</p>
              <p className="text-xs text-gray-500 capitalize">{tipo}</p>
              <p className="text-xs text-gray-500">{beds}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {rating && Number(rating) > 0 ? (
                  `★ ${Number(rating).toFixed(1)}`
                ) : (
                  <span className="text-xs">Sin reseñas</span>
                )}
              </div>
              <div className="text-xs text-gray-500">{price} por noche</div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default RoomCard;
