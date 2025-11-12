"use client";

import { createClient } from "@/lib/supabase/client";
import { ImageCarousel } from "@/components/ImageCarousel";
import { ReviewForm } from "@/components/ReviewForm";
import { ReservationCard } from "@/components/ReservationCard";
import { Navbar } from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

type Profile = { email?: string | null } | null;
type Review = {
  id: number;
  rating: number;
  comentario: string;
  profiles?: Profile;
};
type Imagen = { url_imagen: string; alt_text?: string | null };
type ReservaResumen = {
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};
type HabitacionType = {
  id: number;
  nombre: string;
  descripcion: string;
  avg_rating: number | null;
  precio_por_noche: number;
  capacidad: number;
  tipo: string;
  imagenes?: Imagen[];
  reviews?: Review[];
  reservas?: ReservaResumen[];
};
type UserType = { id: string } | null;

export default function HabitacionDetailPage() {
  const supabase = createClient();
  const params = useParams();
  const [habitacion, setHabitacion] = useState<HabitacionType | null>(null);
  const [reservasBloqueadas, setReservasBloqueadas] = useState<
    { fecha_inicio: string; fecha_fin: string }[]
  >([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const habitacionId = Number(params.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!habitacionId) return;

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from("habitaciones")
        .select("*, imagenes(url_imagen), reviews(*, profiles(email))")
        .eq("id", habitacionId)
        .single();

      if (error) {
        console.error("Error fetching habitacion:", error);
      } else {
        setHabitacion(data);
      }

      // Cargar las fechas bloqueadas
      const { data: reservasData, error: reservasError } = await supabase.rpc(
        "get_public_reservas",
        { p_habitacion_id: habitacionId }
      );

      if (reservasError) {
        console.error("Error fetching public reservas:", reservasError);
      } else {
        setReservasBloqueadas(reservasData);
      }

      setLoading(false);
    };

    fetchData();
  }, [habitacionId, supabase]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </main>
    );
  }

  if (!habitacion) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <h2 className="text-2xl">Habitación no encontrada</h2>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Columna izquierda (contenido principal) */}
            <div className="lg:col-span-2">
              {habitacion.imagenes && habitacion.imagenes.length > 0 && (
                <div className="w-full h-[600px] rounded-xl overflow-hidden mb-8 shadow-lg bg-black">
                  <ImageCarousel images={habitacion.imagenes} />
                </div>
              )}

              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                {habitacion.nombre}
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Calificación:{" "}
                {habitacion.avg_rating
                  ? habitacion.avg_rating.toFixed(1)
                  : "Sin reseñas"}{" "}
                / 5
              </p>

              <p className="text-lg text-gray-700 mb-6">
                {habitacion.descripcion}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-gray-600 mb-1">Precio por noche</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${habitacion.precio_por_noche}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-gray-600 mb-1">Capacidad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {habitacion.capacidad} persona
                    {habitacion.capacidad > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-sm text-gray-600 mb-1">
                    Tipo de habitación
                  </p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">
                    {habitacion.tipo}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                ¿Qué ofrece este lugar?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg text-gray-700 mb-12">
                <div>☕ Cocina equipada</div>
                <div>📶 Wifi de alta velocidad</div>
                <div>❄️ Aire acondicionado</div>
                <div>🖥️ Zona de trabajo</div>
                <div>🅿️ Estacionamiento gratuito</div>
                <div>🚿 Baño privado</div>
                <div>🧺 Lavadora</div>
                <div>📺 Televisión con cable</div>
                <div>🔥 Calefacción</div>
                <div>🏊‍♀️ Piscina</div>
                <div>🚬 Se permite fumar</div>
                <div>🐾 Apto para mascotas</div>
              </div>

              {habitacion.reviews && habitacion.reviews.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-8">
                    Reseñas ({habitacion.reviews.length})
                  </h2>
                  <div className="space-y-4">
                    {habitacion.reviews.map((review: Review) => (
                      <div
                        key={review.id}
                        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <p className="font-semibold text-gray-900">
                            {review.profiles?.email || "Usuario anónimo"}
                          </p>
                          <p className="text-lg font-bold text-yellow-500">
                            ★ {review.rating}/5
                          </p>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comentario}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {user ? (
                <ReviewForm habitacionId={habitacion.id} userId={user.id} />
              ) : (
                <section className="mt-12 border-t pt-8">
                  <p className="text-lg text-gray-700">
                    <a
                      href="/auth/login"
                      className="text-blue-600 hover:underline"
                    >
                      Inicia sesión
                    </a>{" "}
                    para dejar una reseña
                  </p>
                </section>
              )}
            </div>

            {/* Columna derecha (reservación) */}
            <div className="lg:col-span-1">
              {user ? (
                <ReservationCard
                  habitacionId={habitacion.id}
                  precioPorNoche={habitacion.precio_por_noche}
                  userId={user.id}
                  existingReservations={reservasBloqueadas}
                />
              ) : (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">
                    ¿Quieres reservar?
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Inicia sesión para seleccionar fechas y crear una
                    reservación.
                  </p>
                  <a
                    href="/auth/login"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    Iniciar sesión
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
