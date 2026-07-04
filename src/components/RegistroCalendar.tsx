import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { DayRecord } from "../types/dayRecord";
import { calendarDayClasses } from "../utils/metricsDisplay";

type RegistroCalendarProps = {
    days: DayRecord[];
};

const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function toDateKey(year: number, month: number, day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function RegistroCalendar({ days }: RegistroCalendarProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(today.getFullYear());
    const [viewMonth, setViewMonth] = useState(today.getMonth());

    const scoreByDate = useMemo(() => {
        const map = new Map<string, number>();
        for (const day of days) {
            map.set(day.fecha, day.totales.retention_score);
        }
        return map;
    }, [days]);

    const calendarCells = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1);
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const startOffset = (firstDay.getDay() + 6) % 7;

        const cells: Array<{ day: number | null; dateKey: string | null }> = [];

        for (let i = 0; i < startOffset; i++) {
            cells.push({ day: null, dateKey: null });
        }

        for (let day = 1; day <= daysInMonth; day++) {
            cells.push({
                day,
                dateKey: toDateKey(viewYear, viewMonth, day),
            });
        }

        return cells;
    }, [viewYear, viewMonth]);

    function changeMonth(delta: number) {
        const next = new Date(viewYear, viewMonth + delta, 1);
        setViewYear(next.getFullYear());
        setViewMonth(next.getMonth());
    }

    return (
        <section className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => changeMonth(-1)}
                    className="rounded-lg p-2 text-[#4F5F5A] transition-colors hover:bg-white/60 hover:text-[#0B1F16]"
                    aria-label="Mes anterior"
                >
                    <FiChevronLeft className="h-5 w-5" />
                </button>

                <h2 className="text-base font-bold text-[#0B1F16]">
                    {MONTHS[viewMonth]} {viewYear}
                </h2>

                <button
                    type="button"
                    onClick={() => changeMonth(1)}
                    className="rounded-lg p-2 text-[#4F5F5A] transition-colors hover:bg-white/60 hover:text-[#0B1F16]"
                    aria-label="Mes siguiente"
                >
                    <FiChevronRight className="h-5 w-5" />
                </button>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((label) => (
                    <div
                        key={label}
                        className="py-1 text-center text-[11px] font-semibold text-[#4F5F5A]"
                    >
                        {label}
                    </div>
                ))}

                {calendarCells.map((cell, index) => {
                    if (cell.day === null || cell.dateKey === null) {
                        return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const score = scoreByDate.get(cell.dateKey);
                    const hasScore = score !== undefined;
                    const isToday =
                        cell.dateKey === toDateKey(
                            today.getFullYear(),
                            today.getMonth(),
                            today.getDate(),
                        );

                    return (
                        <div
                            key={cell.dateKey}
                            className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-semibold ${
                                hasScore
                                    ? calendarDayClasses(score)
                                    : "bg-white/40 text-[#4F5F5A]"
                            } ${isToday ? "ring-2 ring-[#0B1F16]/30 ring-offset-1" : ""}`}
                            title={hasScore ? `Score: ${score}` : undefined}
                        >
                            {cell.day}
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[11px] text-[#4F5F5A]">
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#016D49]" />
                    &le; 20
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#FFD700]" />
                    21–50
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-[#C45C26]" />
                    &gt; 50
                </span>
            </div>
        </section>
    );
}
