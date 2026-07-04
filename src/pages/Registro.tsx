import { useState } from "react";
import { FiCalendar, FiList } from "react-icons/fi";
import DayMetricsCard from "../components/DayMetricsCard";
import RegistroCalendar from "../components/RegistroCalendar";
import { useDayRecords } from "../hooks/useDayRecords";

type ViewMode = "list" | "calendar";

export default function Registro() {
    const [view, setView] = useState<ViewMode>("list");
    const days = useDayRecords();

    return (
        <main className="flex flex-col gap-4 px-4 py-8 pb-28">
            <header className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F16]">Registro</h1>
                    <p className="mt-1 text-sm text-[#4F5F5A]">Historial de métricas diarias</p>
                </div>

                <button
                    type="button"
                    onClick={() => setView((v) => (v === "list" ? "calendar" : "list"))}
                    className="flex shrink-0 items-center gap-2 rounded-xl border border-[#C9A800]/40 bg-[#FFD700]/25 px-3 py-2 text-sm font-semibold text-[#0B1F16] shadow-sm backdrop-blur-sm transition-colors hover:bg-[#FFD700]/40"
                >
                    {view === "list" ? (
                        <>
                            <FiCalendar className="h-4 w-4" />
                            Calendario
                        </>
                    ) : (
                        <>
                            <FiList className="h-4 w-4" />
                            Lista
                        </>
                    )}
                </button>
            </header>

            {days.length === 0 ? (
                <p className="text-sm text-[#4F5F5A]">
                    Aún no hay días registrados. Escanea comidas en Home para empezar.
                </p>
            ) : view === "calendar" ? (
                <RegistroCalendar days={days} />
            ) : (
                <section className="flex flex-col gap-2.5">
                    {days.map((day) => (
                        <DayMetricsCard
                            key={day.fecha}
                            fecha={day.fecha}
                            metrics={day.totales}
                        />
                    ))}
                </section>
            )}
        </main>
    );
}
