import { createClient } from "@/lib/supabase/server";
import { confirmarReserva, cancelarReserva, toggleDisponibilidadHabitacion } from "./actions";

export default async function OperatorDashboard() {
  const supabase = await createClient();

  // Consulta 1: Obtener reservas con información de habitaciones
  const { data: reservas } = await supabase
    .from('reservas')
    .select('*, habitaciones(nombre)')
    .order('fecha_inicio', { ascending: false });

  // Consulta 2: Obtener todas las habitaciones
  const { data: habitaciones } = await supabase
    .from('habitaciones')
    .select('*')
    .order('nombre');

  return (
    <main className="p-8 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Panel de Operador</h1>

      {/* SECCIÓN 1: GESTIONAR RESERVAS */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Gestionar Reservas</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Habitación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Fechas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservas?.map((reserva) => (
                <tr key={reserva.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {reserva.habitaciones?.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reserva.fecha_inicio} al {reserva.fecha_fin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold capitalize text-blue-700">
                    {reserva.estado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 flex">
                    {/* Botón 1: Confirmar Pago */}
                    {reserva.estado === 'pendiente' && (
                      <form action={confirmarReserva.bind(null, reserva.id)}>
                        <button type="submit" className="text-green-600 hover:text-green-900">
                          Confirmar Pago
                        </button>
                      </form>
                    )}
                    {/* Botón 2: Liberar/Cancelar */}
                    {reserva.estado !== 'cancelada' && (
                      <form action={cancelarReserva.bind(null, reserva.id)}>
                        <button type="submit" className="text-red-600 hover:text-red-900">
                          Liberar Reserva
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECCIÓN 2: GESTIONAR HABITACIONES */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Control de Habitaciones</h2>
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Nombre Habitación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Estado Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {habitaciones?.map((habitacion) => (
                <tr key={habitacion.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {habitacion.nombre}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${habitacion.is_available ? 'text-green-700' : 'text-red-700'}`}>
                    {habitacion.is_available ? 'Abierta (Disponible)' : 'Cerrada (Mantenimiento)'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <form action={toggleDisponibilidadHabitacion.bind(null, habitacion.id, habitacion.is_available)}>
                      <button type="submit" className="text-blue-600 hover:text-blue-900">
                        {habitacion.is_available ? 'Cerrar Habitación' : 'Abrir Habitación'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}