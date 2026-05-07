import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

export type AttendanceMark = "A" | "F" | "T" | "J";

export type Student = {
  id: string;
  fullName: string;
};

export type DailyAttendance = {
  date: string; // yyyy-mm-dd
  marks: Record<string, AttendanceMark>; // studentId -> mark
};

export type CourseData = {
  campus: string;
  programa: string;
  carrera: string;
  instructor: string;
  bloque: string;
  nrc: string;
  periodo: string;
  codigoBB: string;
  semestre?: string;
  nombre?: string;
};

export type Course = {
  id: string;
  codigo: string;
  nombre: string;
  bloque: string;
  estado: "ABIERTO" | "CERRADO";
  data: CourseData;
  students: Student[];
  attendance: DailyAttendance[];
};

type State = {
  isAuth: boolean;
  session: Session | null;
  courses: Course[];
  setSession: (session: Session | null) => void;
  login: (u: string, p: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addCourse: (c: Course) => void;
  updateCourse: (id: string, partial: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addStudent: (courseId: string, s: Student) => void;
  removeStudent: (courseId: string, studentId: string) => void;
  saveAttendance: (courseId: string, day: DailyAttendance) => void;
};

const seedCourses: Course[] = [
  {
    id: "c1",
    codigo: "202510",
    nombre: "Redes y Seguridad",
    bloque: "20B_RED",
    estado: "ABIERTO",
    data: {
      campus: "IND - ETI",
      programa: "PREGRADO",
      carrera: "Redes y Seguridad",
      instructor: "Prof. Juan Pérez",
      bloque: "20B_RED",
      nrc: "12345",
      periodo: "2025-1",
      codigoBB: "RED-202510",
      semestre: "2025-I",
      nombre: "Redes y Seguridad",
    },
    students: [
      { id: "123", fullName: "ALUMNO 1" },
      { id: "213", fullName: "ALUMNO 2" },
      { id: "321", fullName: "ALUMNO 3" },
    ],
    attendance: [
      {
        date: "2025-04-01",
        marks: { "123": "A", "213": "F", "321": "T" },
      },
      {
        date: "2025-04-02",
        marks: { "123": "A", "213": "A", "321": "J" },
      },
    ],
  },
  {
    id: "c2",
    codigo: "202520",
    nombre: "Desarrollo Web",
    bloque: "10A_INF",
    estado: "CERRADO",
    data: {
      campus: "SUR - ETI",
      programa: "PREGRADO",
      carrera: "Desarrollo Web",
      instructor: "Prof. María López",
      bloque: "10A_INF",
      nrc: "22210",
      periodo: "2025-1",
      codigoBB: "WEB-202520",
      semestre: "2025-I",
      nombre: "Desarrollo Web",
    },
    students: [
      { id: "501", fullName: "GARCIA RUIZ, ANA" },
      { id: "502", fullName: "MENDOZA TORRES, LUIS" },
    ],
    attendance: [],
  },
  {
    id: "c3",
    codigo: "202610",
    nombre: "Ing SW Intelig Artif (DUAL)",
    bloque: "60PIADS602",
    estado: "ABIERTO",
    data: {
      campus: "NORTE - ETI",
      programa: "POSGRADO",
      carrera: "Ing. Software",
      instructor: "Prof. Carlos Rivera",
      bloque: "60PIADS602",
      nrc: "60260",
      periodo: "2026-1",
      codigoBB: "IA-202610",
      semestre: "2026-I",
      nombre: "Ing SW Intelig Artif (DUAL)",
    },
    students: [],
    attendance: [],
  },
];

export const usePortalStore = create<State>((set, get) => ({
  isAuth: false,
  session: null,
  courses: seedCourses,
  setSession: (session) => set({ session, isAuth: !!session }),
  login: async (email, password) => {
    // Intentar login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Fallback para admin/admin123 solo para facilitar pruebas si no hay usuario en Supabase aún
      if (email === "admin" && password === "admin123") {
        set({ isAuth: true });
        return { success: true };
      }
      return { success: false, error: error.message };
    }

    set({ isAuth: true, session: data.session });
    return { success: true };
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuth: false, session: null });
  },
  addCourse: (c) => set({ courses: [...get().courses, c] }),
  updateCourse: (id, partial) =>
    set({
      courses: get().courses.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    }),
  deleteCourse: (id) => set({ courses: get().courses.filter((c) => c.id !== id) }),
  addStudent: (courseId, s) =>
    set({
      courses: get().courses.map((c) =>
        c.id === courseId ? { ...c, students: [...c.students, s] } : c,
      ),
    }),
  removeStudent: (courseId, studentId) =>
    set({
      courses: get().courses.map((c) =>
        c.id === courseId
          ? { ...c, students: c.students.filter((s) => s.id !== studentId) }
          : c,
      ),
    }),
  saveAttendance: (courseId, day) =>
    set({
      courses: get().courses.map((c) => {
        if (c.id !== courseId) return c;
        const existing = c.attendance.findIndex((a) => a.date === day.date);
        const next = [...c.attendance];
        if (existing >= 0) next[existing] = day;
        else next.push(day);
        next.sort((a, b) => a.date.localeCompare(b.date));
        return { ...c, attendance: next };
      }),
    }),
}));

export const MOCK_OPTIONS = {
  campus: ["IND - ETI", "SUR - ETI", "NORTE - ETI"],
  programa: ["DIPLOMADO", "PREGRADO", "POSGRADO"],
  carrera: ["Desarrollo Web", "Redes y Seguridad", "Ing. Software"],
  instructor: ["Prof. Juan Pérez", "Prof. María López", "Prof. Carlos Rivera"],
  bloque: ["10A_INF", "20B_RED", "60PIADS602"],
  nrc: ["12345", "22210", "60260"],
  periodo: ["2025-1", "2025-2", "2026-1"],
  codigoBB: ["RED-202510", "WEB-202520", "IA-202610"],
};