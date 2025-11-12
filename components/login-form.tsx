"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { getUserRole, getRoleRedirectPath } from "@/lib/roles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Determinar el rol del usuario según su email
      const userRole = getUserRole(email);
      const redirectPath = getRoleRedirectPath(userRole);

      // Redirigir al usuario según su rol
      router.push(redirectPath);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <Card className="border-border bg-card">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-serif font-light tracking-tight">
            Iniciar Sesión
          </CardTitle>
          <CardDescription className="text-muted-foreground font-light">
            Ingresa tus credenciales para acceder a tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-light tracking-wide uppercase text-muted-foreground"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-border bg-background font-light"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-sm font-light tracking-wide uppercase text-muted-foreground"
                  >
                    Contraseña
                  </Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-xs font-light text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-border bg-background font-light"
                />
              </div>
              {error && (
                <p className="text-sm text-destructive font-light">{error}</p>
              )}
              <Button
                type="submit"
                className="w-full mt-2 bg-primary text-primary-foreground hover:bg-foreground rounded-sm py-6 font-light tracking-wide"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </div>
            <div className="mt-6 text-center text-sm font-light text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/sign-up"
                className="text-foreground hover:text-accent transition-colors underline-offset-4 hover:underline"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
