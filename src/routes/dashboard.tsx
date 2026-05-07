import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalLayout, StatusBadge } from "@/components/portal/PortalLayout";
import { usePortalStore } from "@/lib/portal-store";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const courses = usePortalStore((s) => s.courses);
  const updateCourse = usePortalStore((s) => s.updateCourse);
  const deleteCourse = usePortalStore((s) => s.deleteCourse);

  return (
    <PortalLayout title="SISTEMA DE ASISTENCIAS">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-foreground">Cursos Registrados</h2>
        <Button
          onClick={() => navigate({ to: "/cursos/nuevo" })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4" /> Crear Nuevo Curso
        </Button>
      </div>

      {courses.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No hay cursos registrados.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => {
            const isOpen = c.estado === "ABIERTO";
            return (
              <div key={c.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                <div className="bg-dark text-dark-foreground px-5 py-3 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold">{c.codigo}</span>
                  <StatusBadge estado={c.estado} />
                </div>
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground leading-snug">{c.nombre}</h3>
                    <p className="text-xs text-muted-foreground mt-1">Bloque: <span className="font-mono">{c.bloque}</span></p>
                  </div>

                  <div className="space-y-2 mt-auto">
                    {isOpen && (
                      <Button
                        onClick={() => navigate({ to: "/cursos/$id/asistencia", params: { id: c.id } })}
                        className="w-full bg-dark hover:bg-dark/90 text-dark-foreground"
                      >
                        Tomar Asistencia
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: "/cursos/$id/reporte", params: { id: c.id } })}
                      className="w-full"
                    >
                      Ver Reporte
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate({ to: "/cursos/$id/editar", params: { id: c.id } })}
                      className="w-full border-primary text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      Editar Datos
                    </Button>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-3 border-t border-border">
                    <button
                      onClick={() =>
                        updateCourse(c.id, { estado: isOpen ? "CERRADO" : "ABIERTO" })
                      }
                      className="text-foreground hover:text-primary underline-offset-2 hover:underline"
                    >
                      {isOpen ? "Cerrar Curso" : "Reabrir Curso"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el curso ${c.codigo}?`)) deleteCourse(c.id);
                      }}
                      className="text-destructive hover:underline"
                    >
                      Eliminar Curso
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}

// silence unused
void Link;