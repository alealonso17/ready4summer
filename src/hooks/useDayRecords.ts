import { useEffect, useState } from "react";
import type { DayRecord } from "../types/dayRecord";
import {
    DAY_RECORDS_EVENT,
    getAllDayRecords,
    getTodayRecord,
} from "../utils/dayStorage";

export function useTodayRecord() {
    const [record, setRecord] = useState<DayRecord | null>(() => getTodayRecord());

    useEffect(() => {
        const load = () => setRecord(getTodayRecord());
        window.addEventListener(DAY_RECORDS_EVENT, load);
        return () => window.removeEventListener(DAY_RECORDS_EVENT, load);
    }, []);

    return record;
}

export function useDayRecords() {
    const [days, setDays] = useState<DayRecord[]>(() => getAllDayRecords());

    useEffect(() => {
        const load = () => setDays(getAllDayRecords());
        window.addEventListener(DAY_RECORDS_EVENT, load);
        return () => window.removeEventListener(DAY_RECORDS_EVENT, load);
    }, []);

    return days;
}
