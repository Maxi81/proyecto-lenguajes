"use server";

import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { updateUserRole } from "./usuarios/actions";
import { UserRow } from "./usuarios/UserRow";
import { getStatsReservasPorTipo, getStatsIngresosPorMes, getStatsTopHabitaciones } from "./actions";
import { ReservasPieChart } from "./ReservasPieChart";
import { IngresosLineChart } from "./IngresosLineChart";
import { TopHabitacionesBarChart } from "./TopHabitacionesBarChart";

// Server Action to delete a room
export async function deleteRoom(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (!id) return;

  const supabase = await createClient();
  try {
    await supabase.from("habitaciones").delete().eq("id", id);
    // Revalidate the admin dashboard path so the list updates
    revalidatePath("/dashboard/admin");
  } catch (err) {
    console.error("Error deleting room:", err);
  }
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Query 1: Habitaciones
  const { data: habitaciones, error: habitacionesError } = await supabase
    .from("habitaciones")
    .select("*, imagenes(url_imagen)");

  if (habitacionesError) {
    console.error("Error fetching habitaciones:", habitacionesError);
  }

  // Query 2: Profiles (usuarios)
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, email, role")
    .in("role", ["operador", "admin"])
    .order("email");

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
  }

  // Query 3: Stats para el gráfico
  const pieChartData = await getStatsReservasPorTipo();

  // Query 4: Stats de ingresos por mes
  const lineChartData = await getStatsIngresosPorMes();

  // Query 5: Stats de habitaciones más populares
  const barChartData = await getStatsTopHabitaciones();

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center">
      <div className="w-full max-w-6xl flex justify-between items-center">
  <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
        <Link
          href="/dashboard/admin/nueva"
          className="rounded-md bg-black text-white px-4 py-2"
        >
          Crear Nueva Habitación
        </Link>
      </div>

      {/* Sección del gráfico */}
      <section className="bg-white rounded-lg shadow p-6 my-6 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Reservas por Tipo de Habitación (Confirmadas)
        </h2>
        <ReservasPieChart data={pieChartData} />
      </section>

      {/* Sección del gráfico de ingresos */}
      <section className="bg-white rounded-lg shadow p-6 my-6 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Ingresos por Mes (Confirmadas)
        </h2>
        <IngresosLineChart data={lineChartData} />
      </section>

      {/* Sección del gráfico de habitaciones más populares */}
      <section className="bg-white rounded-lg shadow p-6 my-6 w-full max-w-6xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">
          Top 5 Habitaciones Más Populares
        </h2>
        <TopHabitacionesBarChart data={barChartData} />
      </section>

      <div className="w-full max-w-6xl">
        {!habitaciones ||
        (Array.isArray(habitaciones) && habitaciones.length === 0) ? (
              <p className="text-center text-gray-900">
            No hay habitaciones registradas
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Precio por Noche
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(habitaciones as any[]).map((h) => (
                  <tr key={h.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">{h.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      ${h.precio_por_noche}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {h.imagenes?.[0]?.url_imagen ? (
                        <img
                          src={h.imagenes[0].url_imagen}
                          alt=""
                          className="w-24 h-16 object-cover rounded"
                        />
                        ) : (
                        <span className="text-gray-900">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2 text-gray-900">
                      <Link
                        href={`/dashboard/admin/editar/${h.id}`}
                        className="text-blue-600 hover:underline px-3 py-1 border rounded"
                      >
                        Editar
                      </Link>

                      <form action={deleteRoom}>
                        <input type="hidden" name="id" value={h.id} />
                        <button
                          type="submit"
                          className="text-red-600 hover:underline px-3 py-1 border rounded"
                        >
                          Borrar
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Separador y sección de gestión de usuarios */}
      <hr className="w-full max-w-6xl border-gray-300 my-8" />

      <div className="w-full max-w-6xl flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestionar Usuarios
        </h2>
        <Link
          href="/dashboard/admin/usuarios/nuevo"
          className="rounded-md bg-black text-white px-4 py-2"
        >
          Crear Nuevo Operador
        </Link>
      </div>

      <div className="w-full max-w-6xl mt-6">
        {!profiles || profiles.length === 0 ? (
          <p className="text-center text-gray-900">No hay usuarios registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Rol
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
