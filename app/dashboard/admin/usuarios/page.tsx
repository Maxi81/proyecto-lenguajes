import { createClient } from "@/lib/supabase/server";
import { UserRow } from "./UserRow";

export default async function UsuariosPage() {
  const supabase = await createClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, email, role")
    .order("email");

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center p-8">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Gestión de Usuarios
        </h1>

        {!users || users.length === 0 ? (
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
                {users.map((user) => (
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
