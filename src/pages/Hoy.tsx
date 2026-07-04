import TodayFoodCard from "../components/TodayFoodCard";
import TodayMetrics from "../components/TodayMetrics";
import { useTodayRecord } from "../hooks/useDayRecords";

export default function Hoy() {
    const today = {
        day: new Date().getDate(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    };

    const todayRecord = useTodayRecord();

    if (!todayRecord || todayRecord.comidas.length === 0) {
        return (
            <main className="flex flex-col gap-4 px-4 py-8 pb-28">
                <header>
                    <h1 className="text-2xl font-bold text-[#0B1F16]">Hoy</h1>
                    <p className="mt-1 text-sm text-[#4F5F5A]">
                        {today.day}/{today.month}/{today.year}
                    </p>
                </header>
                <p className="text-sm text-[#4F5F5A]">
                    No hay comidas registradas. Escanea tu primera comida en Home.
                </p>
            </main>
        );
    }

    return (
        <main className="flex flex-col gap-4 px-4 py-8 pb-28">
            <header>
                <h1 className="text-2xl font-bold text-[#0B1F16]">Hoy</h1>
                <p className="mt-1 text-sm text-[#4F5F5A]">
                    {today.day}/{today.month}/{today.year}
                </p>
            </header>

            <TodayMetrics metrics={todayRecord.totales} />

            <section className="flex flex-col gap-3">
                {todayRecord.comidas.map((dish) => (
                    <TodayFoodCard key={dish.id} food={dish} />
                ))}
            </section>
        </main>
    );
}
