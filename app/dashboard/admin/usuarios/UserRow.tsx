"use client";

import { updateUserRole, deleteUser } from "./actions";

type UserRowProps = {
  user: {
    id: string;
    email: string | null;
    role: string | null;
  };
};

export function UserRow({ user }: UserRowProps) {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
        {user.email}
      </td>

      {/* Si es admin, solo mostrar el texto "Admin" sin botones */}
      {user.role === "admin" ? (
        <td className="px-6 py-4 whitespace-nowrap" colSpan={2}>
          <span className="font-bold p-1 text-gray-900">Admin</span>
        </td>
      ) : (
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            <form action={updateUserRole} className="flex items-center gap-2">
              <input type="hidden" name="user_id" value={user.id} />
              <select
                name="role"
                defaultValue={user.role || "cliente"}
                className="bg-white text-black p-1 rounded-md"
              >
                <option value="cliente">Cliente</option>
                <option value="operador">Operador</option>
              </select>
              <button
                type="submit"
                className="rounded bg-blue-600 text-white px-3 py-1 text-sm font-semibold hover:bg-blue-700"
              >
                Actualizar
              </button>
            </form>

            <form
              action={deleteUser}
              onSubmit={(e) => {
                if (
                  !confirm(
                    "¿Estás seguro de que quieres eliminar a este usuario? Esta acción es irreversible."
                  )
                ) {
                  e.preventDefault();
                }
              }}
            >
              <input type="hidden" name="user_id" value={user.id} />
              <button
                type="submit"
                className="rounded bg-red-600 text-white px-3 py-1 text-sm font-semibold hover:bg-red-700"
              >
                Eliminar
              </button>
            </form>
          </div>
        </td>
      )}
    </tr>
  );
}
