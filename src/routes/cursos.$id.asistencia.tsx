import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortalStore, type AttendanceMark } from "@/lib/portal-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cursos/$id/asistencia")({
  component: Asistencia,
});

const MARKS: { key: AttendanceMark; label: string; cls: string }[] = [
  { key: "A", label: "Asistió", cls: "bg-success text-success-foreground" },
  { key: "F", label: "Faltó", cls: "bg-destructive text-destructive-foreground" },
  { key: "T", label: "Tardanza", cls: "bg-warning text-warning-foreground" },
  { key: "J", label: "Justificada", cls: "bg-info text-info-foreground" },
];

function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function Asistencia() {
  const { id } = useParams({ from: "/cursos/$id/asistencia" });
  const navigate = useNavigate();
  const course = usePortalStore((s) => s.courses.find((c) => c.id === id));
  const saveAttendance = usePortalStore((s) => s.saveAttendance);

  const [date, setDate] = useState(todayStr());
  const existing = useMemo(
    () => course?.attendance.find((a) => a.date === date),
    [course, date],
  );
  const [marks, setMarks] = useState<Record<string, AttendanceMark>>(existing?.marks ?? {});

  if (!course) {
    return (
      <PortalLayout title="Curso no encontrado">
        <Button onClick={() => navigate({ to: "/dashboard" })}>Volver</Button>
      </PortalLayout>
    );
  }

  const onDateChange = (d: string) => {
    setDate(d);
    const found = course.attendance.find((a) => a.date === d);
    setMarks(found?.marks ?? {});
  };

  const setMark = (sid: string, m: AttendanceMark) =>
    setMarks((prev) => ({ ...prev, [sid]: m }));

  const save = () => {
    saveAttendance(id, { date, marks });
    alert("Asistencia guardada.");
  };

  return (
    <PortalLayout title={`Asistencia · ${course.nombre}`}>
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6 flex flex-wrap items-end gap-4">
        <div className="space-y-2">
          <Label htmlFor="fecha">FECHA</Label>
          <Input id="fecha" type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
        <div className="text-sm text-muted-foreground">
          {course.students.length} alumno(s) · {Object.keys(marks).length} marcado(s)
        </div>
        <div className="ml-auto flex gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/cursos/$id/participantes", params: { id } })}>
            ← Participantes
          </Button>
          <Button onClick={save} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Guardar Asistencia
          </Button>
          <Button variant="outline" onClick={() => navigate({ to: "/cursos/$id/reporte", params: { id } })}>
            Ver Reporte
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="bg-dark text-dark-foreground px-5 py-3 font-semibold">Marcar Asistencia</div>
        {course.students.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">
            No hay alumnos. Agregue participantes primero.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-5 py-2 font-semibold">CÓDIGO</th>
                <th className="text-left px-5 py-2 font-semibold">NOMBRE</th>
                <th className="text-center px-5 py-2 font-semibold">MARCAR</th>
              </tr>
            </thead>
            <tbody>
              {course.students.map((s) => {
                const cur = marks[s.id];
                return (
                  <tr key={s.id} className="border-t border-border">
                    <td className="px-5 py-2 font-mono">{s.id}</td>
                    <td className="px-5 py-2">{s.fullName}</td>
                    <td className="px-5 py-2">
                      <div className="flex justify-center gap-2">
                        {MARKS.map((m) => (
                          <button
                            key={m.key}
                            onClick={() => setMark(s.id, m.key)}
                            title={m.label}
                            className={cn(
                              "w-9 h-9 rounded-md font-bold text-sm border transition",
                              cur === m.key
                                ? m.cls + " border-transparent shadow"
                                : "bg-background text-foreground border-border hover:bg-muted",
                            )}
                          >
                            {m.key}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {MARKS.map((m) => (
          <span key={m.key} className="inline-flex items-center gap-2">
            <span className={cn("w-5 h-5 rounded inline-flex items-center justify-center font-bold", m.cls)}>{m.key}</span>
            {m.label}
          </span>
        ))}
      </div>
    </PortalLayout>
  );
}