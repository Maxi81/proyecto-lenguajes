import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { FetchDataSteps } from "@/components/tutorial/fetch-data-steps";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">¡Hola Amigo!</h1>
        <p className="text-xl text-gray-600">Has iniciado sesión correctamente</p>
      </div>
      <div className="mt-8">
        <pre className="text-xs font-mono p-3 rounded border bg-accent">
          Email: {data.claims.email}
        </pre>
      </div>
      <div>
        <h2 className="font-bold text-2xl mb-4">Next steps</h2>
        <FetchDataSteps />
      </div>
    </div>
  );
}
