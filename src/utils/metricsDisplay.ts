import type { DailyMetrics } from "../types/metrics";

export const secondaryMetrics = [
    { label: "Sodio", key: "sodio" as const, unit: "mg" },
    { label: "Potasio", key: "potasio" as const, unit: "mg" },
    { label: "Azúcares", key: "azucares" as const, unit: "g" },
    { label: "Azúc. añadidos", key: "azucares_anadidos" as const, unit: "g" },
    { label: "Carb. refinados", key: "carbohidratos_refinados" as const, unit: "g" },
    { label: "Grasas sat.", key: "grasas_saturadas" as const, unit: "g" },
    { label: "Proteína", key: "proteina" as const, unit: "g" },
] as const;

export function scoreColor(retentionScore: number) {
    if (retentionScore <= 20) return "#016D49";
    if (retentionScore <= 50) return "#C9A800";
    return "#C45C26";
}

export function scoreLabel(retentionScore: number) {
    if (retentionScore <= 20) return "Bajo riesgo";
    if (retentionScore <= 50) return "Moderado";
    return "Alto riesgo";
}

export function calendarDayClasses(retentionScore: number) {
    if (retentionScore <= 20) return "bg-[#016D49] text-white";
    if (retentionScore <= 50) return "bg-[#FFD700] text-[#0B1F16]";
    return "bg-[#C45C26] text-white";
}

export function formatFecha(fecha: string) {
    const [year, month, day] = fecha.split("-").map(Number);
    return `${day}/${month}/${year}`;
}

export function ringProgress(retentionScore: number, radius: number) {
    const wellness = 100 - retentionScore;
    const circumference = 2 * Math.PI * radius;
    return { circumference, progress: (wellness / 100) * circumference };
}

export type MetricsProps = { metrics: DailyMetrics };
