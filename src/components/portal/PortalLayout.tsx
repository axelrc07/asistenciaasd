import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortalStore } from "@/lib/portal-store";
import { useEffect, type ReactNode } from "react";

export function PortalLayout({ title, children }: { title: string; children: ReactNode }) {
  const navigate = useNavigate();
  const isAuth = usePortalStore((s) => s.isAuth);
  const logout = usePortalStore((s) => s.logout);

  useEffect(() => {
    if (!isAuth) navigate({ to: "/" });
  }, [isAuth, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="bg-dark text-dark-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-bold leading-tight">PORTAL DOCENTE</div>
              <div className="text-xs text-white/60">Sistema de Control de Asistencias</div>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { logout(); navigate({ to: "/" }); }}
            className="text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Salir
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          <div className="w-24 h-1 bg-primary mt-2 rounded-full" />
        </div>
        {children}
      </main>

      <footer className="text-center text-xs text-muted-foreground py-6">
        © 2026 – Seminario de Complementación Práctica I
      </footer>
    </div>
  );
}

export function StatusBadge({ estado }: { estado: "ABIERTO" | "CERRADO" }) {
  const isOpen = estado === "ABIERTO";
  return (
    <span
      className={
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide " +
        (isOpen ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground")
      }
    >
      {estado}
    </span>
  );
}