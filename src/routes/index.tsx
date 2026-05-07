import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortalStore } from "@/lib/portal-store";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const login = usePortalStore((s) => s.login);
  const isAuth = usePortalStore((s) => s.isAuth);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuth) navigate({ to: "/dashboard" });
  }, [isAuth, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await login(user, pass);
    if (result.success) {
      navigate({ to: "/dashboard" });
    } else {
      setError(result.error || "Credenciales inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card rounded-xl shadow-lg border border-border p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <GraduationCap className="w-9 h-9 text-primary" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">PORTAL DOCENTE</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistema de Control de Asistencias</p>
            <div className="w-16 h-1 bg-primary mt-4 rounded-full" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">Usuario</Label>
              <Input id="user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="admin" autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pass">Contraseña</Label>
              <Input id="pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 text-base font-semibold">
              Ingresar al Sistema
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Demo: <span className="font-mono">admin / admin123</span>
          </p>
        </div>
      </main>
      <footer className="text-center text-xs text-muted-foreground py-6">
        © 2026 – Seminario de Complementación Práctica I
      </footer>
    </div>
  );
}
