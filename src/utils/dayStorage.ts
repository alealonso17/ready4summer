import type { DayRecord } from "../types/dayRecord";
import type { Food, FoodInput } from "../types/food";
import type { DailyMetrics } from "../types/metrics";

const STORAGE_PREFIX = "day_";
export const DAY_RECORDS_EVENT = "day-records-updated";

const SUM_KEYS = [
    "sodio",
    "azucares",
    "azucares_anadidos",
    "carbohidratos_refinados",
    "alcohol",
    "grasas_saturadas",
    "proteina",
    "calorias",
    "potasio",
    "agua",
] as const satisfies readonly (keyof DailyMetrics)[];

export function todayKey(): string {
    return new Date().toISOString().split("T")[0];
}

function storageKey(fecha: string) {
    return `${STORAGE_PREFIX}${fecha}`;
}

function emptyDayRecord(fecha: string): DayRecord {
    return { fecha, comidas: [], totales: computeTotales([]) };
}

export function computeTotales(comidas: Food[]): DailyMetrics {
    const totales = {} as DailyMetrics;

    for (const key of SUM_KEYS) {
        totales[key] = comidas.reduce((sum, meal) => sum + (meal[key] ?? 0), 0);
    }

    totales.retention_score =
        comidas.length === 0
            ? 0
            : Math.round(
                  comidas.reduce((sum, meal) => sum + meal.retention_score, 0) /
                      comidas.length,
              );

    return totales;
}

export function getDayRecord(fecha: string): DayRecord | null {
    const raw = localStorage.getItem(storageKey(fecha));
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw) as DayRecord;
        return {
            fecha: parsed.fecha,
            comidas: parsed.comidas ?? [],
            totales: computeTotales(parsed.comidas ?? []),
        };
    } catch {
        return null;
    }
}

export function getTodayRecord(): DayRecord | null {
    return getDayRecord(todayKey());
}

export function getAllDayRecords(): DayRecord[] {
    const records: DayRecord[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key?.startsWith(STORAGE_PREFIX)) continue;

        const fecha = key.slice(STORAGE_PREFIX.length);
        const record = getDayRecord(fecha);
        if (record && record.comidas.length > 0) {
            records.push(record);
        }
    }

    return records.sort((a, b) => b.fecha.localeCompare(a.fecha));
}

export function saveDayRecord(record: DayRecord) {
    localStorage.setItem(storageKey(record.fecha), JSON.stringify(record));
}

export function addMealToDay(fecha: string, meal: FoodInput): DayRecord {
    const day = getDayRecord(fecha) ?? emptyDayRecord(fecha);
    const newMeal: Food = {
        id: day.comidas.length > 0 ? Math.max(...day.comidas.map((m) => m.id)) + 1 : 1,
        ...meal,
    };

    const updated: DayRecord = {
        fecha,
        comidas: [...day.comidas, newMeal],
        totales: computeTotales([...day.comidas, newMeal]),
    };

    saveDayRecord(updated);
    return updated;
}

export function addMealToToday(meal: FoodInput): DayRecord {
    return addMealToDay(todayKey(), meal);
}

export function notifyDayRecordsUpdated() {
    window.dispatchEvent(new Event(DAY_RECORDS_EVENT));
}

export function parseMealFromApi(raw: Record<string, unknown>): FoodInput {
    const num = (key: string) => Number(raw[key]) || 0;

    return {
        alimento: String(raw.alimento ?? "Comida"),
        sodio: num("sodio"),
        azucares: num("azucares"),
        azucares_anadidos: num("azucares_anadidos"),
        carbohidratos_refinados: num("carbohidratos_refinados"),
        alcohol: num("alcohol"),
        grasas_saturadas: num("grasas_saturadas"),
        proteina: num("proteina"),
        calorias: num("calorias"),
        potasio: num("potasio"),
        agua: num("agua"),
        retention_score: num("retention_score"),
    };
}
