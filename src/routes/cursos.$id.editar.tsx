import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { CourseDataForm } from "@/components/portal/CourseDataForm";
import { usePortalStore, type CourseData } from "@/lib/portal-store";

export const Route = createFileRoute("/cursos/$id/editar")({
  component: EditarCurso,
});

function EditarCurso() {
  const { id } = useParams({ from: "/cursos/$id/editar" });
  const navigate = useNavigate();
  const course = usePortalStore((s) => s.courses.find((c) => c.id === id));
  const updateCourse = usePortalStore((s) => s.updateCourse);

  const [data, setData] = useState<CourseData>(
    course?.data ?? {
      campus: "", programa: "", carrera: "", instructor: "",
      bloque: "", nrc: "", periodo: "", codigoBB: "", nombre: "",
    },
  );

  if (!course) {
    return (
      <PortalLayout title="Curso no encontrado">
        <Button onClick={() => navigate({ to: "/dashboard" })}>Volver</Button>
      </PortalLayout>
    );
  }

  const save = () => {
    updateCourse(id, {
      data,
      nombre: data.nombre || course.nombre,
      bloque: data.bloque || course.bloque,
      codigo: data.nrc || course.codigo,
    });
    navigate({ to: "/cursos/$id/participantes", params: { id } });
  };

  return (
    <PortalLayout title={`Editar Curso · ${course.codigo}`}>
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-1">1. Datos del Curso</h2>
        <p className="text-sm text-muted-foreground mb-6">Modifique la información general.</p>
        <CourseDataForm data={data} onChange={setData} />
        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>Cancelar</Button>
          <Button onClick={save} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Guardar y Continuar
          </Button>
        </div>
      </div>
    </PortalLayout>
  );
}