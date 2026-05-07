import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortalStore, type AttendanceMark } from "@/lib/portal-store";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas-pro";

export const Route = createFileRoute("/cursos/$id/reporte")({
  component: Reporte,
});

const markCls: Record<AttendanceMark, string> = {
  A: "bg-success text-success-foreground",
  F: "bg-destructive text-destructive-foreground",
  T: "bg-warning text-warning-foreground",
  J: "bg-info text-info-foreground",
};

function Reporte() {
  const { id } = useParams({ from: "/cursos/$id/reporte" });
  const navigate = useNavigate();
  const course = usePortalStore((s) => s.courses.find((c) => c.id === id));
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`reporte-${course?.codigo ?? id}.pdf`);
  };

  if (!course) {
    return (
      <PortalLayout title="Curso no encontrado">
        <Button onClick={() => navigate({ to: "/dashboard" })}>Volver</Button>
      </PortalLayout>
    );
  }

  const dates = [...course.attendance].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <PortalLayout title={`Reporte · ${course.nombre}`}>
      <div className="bg-card rounded-xl border border-border shadow-sm p-6 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Curso</p>
          <p className="font-semibold">{course.codigo} · {course.nombre}</p>
          <p className="text-xs text-muted-foreground mt-1">Instructor: {course.data.instructor || "—"}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate({ to: "/dashboard" })}>Volver</Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <Download className="w-4 h-4" /> Descargar PDF
          </Button>
          <Button onClick={() => window.print()} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Printer className="w-4 h-4" /> Imprimir
          </Button>
        </div>
      </div>

      <div ref={reportRef} className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
        <div className="bg-dark text-dark-foreground px-5 py-3 font-semibold">Reporte de Asistencia</div>
        {course.students.length === 0 ? (
          <p className="text-muted-foreground text-center py-12">No hay participantes.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left px-4 py-2 font-semibold">CÓDIGO</th>
                <th className="text-left px-4 py-2 font-semibold">NOMBRE</th>
                {dates.map((d) => (
                  <th key={d.date} className="px-3 py-2 text-center font-semibold whitespace-nowrap">
                    {d.date}
                  </th>
                ))}
                {dates.length === 0 && (
                  <th className="px-4 py-2 text-center text-muted-foreground">Sin registros</th>
                )}
              </tr>
            </thead>
            <tbody>
              {course.students.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="px-4 py-2 font-mono">{s.id}</td>
                  <td className="px-4 py-2">{s.fullName}</td>
                  {dates.map((d) => {
                    const m = d.marks[s.id];
                    return (
                      <td key={d.date} className="px-3 py-2 text-center">
                        {m ? (
                          <span className={cn("inline-flex w-7 h-7 rounded items-center justify-center font-bold", markCls[m])}>
                            {m}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    );
                  })}
                  {dates.length === 0 && <td />}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PortalLayout>
  );
}