import type { Food } from "../types/food";
import { FiZap, FiActivity } from "react-icons/fi";
import { scoreColor } from "../utils/metricsDisplay";

type TodayFoodCardProps = {
    food: Food;
};

const nutrients = [
    { label: "Sodio", getValue: (f: Food) => `${f.sodio} mg` },
    { label: "Potasio", getValue: (f: Food) => `${f.potasio} mg` },
    { label: "Azúcares", getValue: (f: Food) => `${f.azucares} g` },
    { label: "Azúc. añadidos", getValue: (f: Food) => `${f.azucares_anadidos} g` },
    { label: "Carb. refinados", getValue: (f: Food) => `${f.carbohidratos_refinados} g` },
    { label: "Grasas sat.", getValue: (f: Food) => `${f.grasas_saturadas} g` },
] as const;

export default function TodayFoodCard({ food }: TodayFoodCardProps) {
    const retentionColor = scoreColor(food.retention_score);

    return (
        <article className="glass-card w-full rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold text-[#0B1F16]">{food.alimento}</h2>
                <div className="shrink-0 text-right">
                    <p className="text-[10px] font-medium text-[#4F5F5A]">Retención</p>
                    <p className="text-base font-bold" style={{ color: retentionColor }}>
                        {food.retention_score}
                    </p>
                </div>
            </div>

            <div className="mt-3 flex gap-3">
                <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#FFD700]/15 px-3 py-2.5">
                    <FiZap className="h-5 w-5 shrink-0 text-[#C9A800]" />
                    <div>
                        <p className="text-[11px] font-medium text-[#4F5F5A]">Calorías</p>
                        <p className="text-base font-bold text-[#0B1F16]">{food.calorias} kcal</p>
                    </div>
                </div>

                <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-[#016D49]/10 px-3 py-2.5">
                    <FiActivity className="h-5 w-5 shrink-0 text-[#016D49]" />
                    <div>
                        <p className="text-[11px] font-medium text-[#4F5F5A]">Proteína</p>
                        <p className="text-base font-bold text-[#016D49]">{food.proteina} g</p>
                    </div>
                </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2">
                {nutrients.map(({ label, getValue }) => (
                    <div
                        key={label}
                        className="rounded-xl bg-white/50 px-2.5 py-2 text-center"
                    >
                        <dt className="text-[10px] font-medium text-[#4F5F5A]">{label}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-[#0B1F16]">
                            {getValue(food)}
                        </dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}
