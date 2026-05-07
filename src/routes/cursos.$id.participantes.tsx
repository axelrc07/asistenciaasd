import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortalStore } from "@/lib/portal-store";

export const Route = createFileRoute("/cursos/$id/participantes")({
  component: Participantes,
});

function Participantes() {
  const { id } = useParams({ from: "/cursos/$id/participantes" });
  const navigate = useNavigate();
  const course = usePortalStore((s) => s.courses.find((c) => c.id === id));
  const addStudent = usePortalStore((s) => s.addStudent);
  const removeStudent = usePortalStore((s) => s.removeStudent);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  if (!course) {
    return (
      <PortalLayout title="Curso no encontrado">
        <Button onClick={() => navigate({ to: "/dashboard" })}>Volver</Button>
      </PortalLayout>
    );
  }

  const add = () => {
    if (!code.trim() || !name.trim()) {
      alert("Ingrese código y nombre del alumno.");
      return;
    }
    if (course.students.some((s) => s.id === code.trim())) {
      alert("Ya existe un alumno con ese código.");
      return;
    }
    addStudent(id, { id: code.trim(), fullName: name.trim().toUpperCase() });
    setCode("");
    setName("");
  };

  return (
    <PortalLayout title={`Participantes · ${course.nombre}`}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-foreground mb-1">2. Agregar Alumno</h2>
          <p className="text-sm text-muted-foreground mb-5">Registre los participantes del curso.</p>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">CÓDIGO</Label>
              <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Ej: 1001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">NOMBRE COMPLETO</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="APELLIDOS, NOMBRES" />
            </div>
            <Button onClick={add} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <UserPlus className="w-4 h-4" /> Agregar
            </Button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden lg:col-span-2">
          <div className="bg-dark text-dark-foreground px-5 py-3 flex items-center justify-between">
            <span className="font-semibold">Lista de Participantes</span>
            <span className="text-xs text-white/70">{course.students.length} alumno(s)</span>
          </div>
          {course.students.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No hay alumnos registrados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-foreground">
                <tr>
                  <th className="text-left px-5 py-2 font-semibold">CÓDIGO</th>
                  <th className="text-left px-5 py-2 font-semibold">NOMBRE</th>
                  <th className="px-5 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {course.students.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-5 py-2 font-mono">{s.id}</td>
                    <td className="px-5 py-2">{s.fullName}</td>
                    <td className="px-5 py-2 text-right">
                      <button
                        onClick={() => removeStudent(id, s.id)}
                        className="text-destructive hover:opacity-80 inline-flex items-center"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between gap-3">
        <Button variant="outline" onClick={() => navigate({ to: "/cursos/$id/editar", params: { id } })}>
          ← Datos del curso
        </Button>
        <Button
          onClick={() => navigate({ to: "/cursos/$id/asistencia", params: { id } })}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Continuar a Asistencia →
        </Button>
      </div>
    </PortalLayout>
  );
}