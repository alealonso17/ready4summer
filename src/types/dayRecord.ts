import type { Food } from "./food";
import type { DailyMetrics } from "./metrics";

export type DayRecord = {
    fecha: string;
    comidas: Food[];
    totales: DailyMetrics;
};
