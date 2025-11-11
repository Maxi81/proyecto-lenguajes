import { createClient } from "@/lib/supabase/server";
import AdminRoomForm from "@/components/admin-room-form";

type Props = {
  params: {
    id: string;
  };
};

export default async function EditRoomPage({ params }: Props) {
  // Await params since it's a Promise in Next.js 15
  const { id } = await params;
  
  const supabase = await createClient();

  const { data: habitacion, error } = await supabase
    .from("habitaciones")
    .select("*, imagenes(url_imagen)")
    .eq("id", Number(id))
    .maybeSingle();

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
      <div className="px-4 py-8">
        {/* Pass habitacion data to client form component */}
        {/* Note: AdminRoomForm is a client component and will call server actions exported elsewhere */}
        <AdminRoomForm habitacion={habitacion} />
      </div>
    </main>
  );
}
