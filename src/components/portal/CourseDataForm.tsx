import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { MOCK_OPTIONS, type CourseData } from "@/lib/portal-store";

type Props = {
  data: CourseData;
  onChange: (next: CourseData) => void;
};

export function CourseDataForm({ data, onChange }: Props) {
  const set = <K extends keyof CourseData>(k: K, v: CourseData[K]) =>
    onChange({ ...data, [k]: v });

  const fields: Array<{ key: keyof CourseData; label: string; options: string[] }> = [
    { key: "campus", label: "CAMPUS", options: MOCK_OPTIONS.campus },
    { key: "programa", label: "PROGRAMA", options: MOCK_OPTIONS.programa },
    { key: "carrera", label: "CARRERA", options: MOCK_OPTIONS.carrera },
    { key: "instructor", label: "INSTRUCTOR", options: MOCK_OPTIONS.instructor },
    { key: "bloque", label: "BLOQUE", options: MOCK_OPTIONS.bloque },
    { key: "nrc", label: "NRC", options: MOCK_OPTIONS.nrc },
    { key: "periodo", label: "PERIODO", options: MOCK_OPTIONS.periodo },
    { key: "codigoBB", label: "CODIGO BB", options: MOCK_OPTIONS.codigoBB },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="nombre">NOMBRE DEL CURSO</Label>
        <Input
          id="nombre"
          value={data.nombre ?? ""}
          onChange={(e) => set("nombre", e.target.value)}
          placeholder="Ej: Redes y Seguridad"
        />
      </div>
      {fields.map((f) => (
        <div key={f.key} className="space-y-2">
          <Label>{f.label}</Label>
          <Select
            value={(data[f.key] as string) || ""}
            onValueChange={(v) => set(f.key, v as CourseData[typeof f.key])}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Seleccione ${f.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {f.options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}