import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/Navbar";
import AdminRoomForm from "@/components/admin-room-form";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditRoomPage({ params }: Props) {
  const supabase = await createClient();

  const { data: habitacion, error } = await supabase
    .from("habitaciones")
    .select("*, imagenes(url_imagen)")
    .eq("id", params.id)
    .single();

  if (error) {
    console.error("Error fetching habitacion:", error);
  }

  if (!habitacion) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Habitación no encontrada</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="absolute inset-x-0 top-0 z-50">
        <Navbar />
      </div>
      <div className="pt-28 px-4">
        {/* Pass habitacion data to client form component */}
        {/* Note: AdminRoomForm is a client component and will call server actions exported elsewhere */}
        {/* @ts-expect-error server -> client prop serializability */}
        <AdminRoomForm habitacion={habitacion} />
      </div>
    </main>
  );
}
