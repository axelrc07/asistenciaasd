import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { CourseDataForm } from "@/components/portal/CourseDataForm";
import { usePortalStore, type CourseData, type Course } from "@/lib/portal-store";

export const Route = createFileRoute("/cursos/nuevo")({
  component: NuevoCurso,
});

function NuevoCurso() {
  const navigate = useNavigate();
  const addCourse = usePortalStore((s) => s.addCourse);

  const [data, setData] = useState<CourseData>({
    campus: "",
    programa: "",
    carrera: "",
    instructor: "",
    bloque: "",
    nrc: "",
    periodo: "",
    codigoBB: "",
    nombre: "",
    semestre: "2026-I",
  });

  const submit = () => {
    if (!data.nombre || !data.bloque || !data.nrc) {
      alert("Complete al menos Nombre, Bloque y NRC.");
      return;
    }
    const id = "c" + Date.now();
    const newCourse: Course = {
      id,
      codigo: data.nrc || "NEW",
      nombre: data.nombre || "Curso sin nombre",
      bloque: data.bloque,
      estado: "ABIERTO",
      data,
      students: [],
      attendance: [],
    };
    addCourse(newCourse);
    navigate({ to: "/cursos/$id/participantes", params: { id } });
  };

  return (
    <PortalLayout title="Crear Nuevo Curso">
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-1">1. Datos del Curso</h2>
        <p className="text-sm text-muted-foreground mb-6">Complete la información general del curso.</p>
        <CourseDataForm data={data} onChange={setData} />
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
            Cancelar
          </Button>
          <Button onClick={submit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Guardar y Continuar
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}