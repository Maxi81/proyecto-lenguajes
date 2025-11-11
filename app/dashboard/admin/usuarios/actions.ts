"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateUserRole(formData: FormData) {
  const user_id = formData.get("user_id") as string;
  const role = formData.get("role") as string;

  if (!user_id || !role) {
    console.error("Missing user_id or role");
    return;
  }

  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", user_id);

    if (error) {
      console.error("Error updating user role:", error);
      return;
    }

    // Revalidate the page to show updated data
    revalidatePath("/dashboard/admin/usuarios");
    revalidatePath("/dashboard/admin");
  } catch (err) {
    console.error("updateUserRole error:", err);
  }
}

export async function deleteUser(formData: FormData) {
  const id = formData.get("user_id") as string;

  if (!id) {
    console.error("Missing user_id");
    return;
  }

  // Create admin client with Service Role key
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    // Delete user from Supabase Auth using admin API
    const { error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error("Error deleting user:", error);
      return;
    }

    // Revalidate both pages
    revalidatePath("/dashboard/admin/usuarios");
    revalidatePath("/dashboard/admin");
  } catch (err) {
    console.error("deleteUser error:", err);
  }
}

export async function createUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    console.error("Missing email or password");
    return;
  }

  // Create admin client with Service Role key
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  try {
    // Create user in Supabase Auth using admin API
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error("Error creating user:", authError);
      return;
    }

    if (authData.user) {
      // Update profile role to 'operador' (trigger already created it as 'cliente')
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: "operador" })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return;
      }
    }
  } catch (err) {
    console.error("createUser error:", err);
    return;
  }

  // Revalidate and redirect
  revalidatePath("/dashboard/admin");
  redirect("/dashboard/admin");
}
