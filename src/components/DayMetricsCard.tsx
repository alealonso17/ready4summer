import type { DailyMetrics } from "../types/metrics";
import {
    formatFecha,
    ringProgress,
    scoreColor,
    scoreLabel,
    secondaryMetrics,
} from "../utils/metricsDisplay";

type DayMetricsCardProps = {
    fecha: string;
    metrics: DailyMetrics;
};

export default function DayMetricsCard({ fecha, metrics }: DayMetricsCardProps) {
    const { retention_score } = metrics;
    const ringColor = scoreColor(retention_score);
    const radius = 36;
    const { circumference, progress } = ringProgress(retention_score, radius);

    return (
        <article className="w-full overflow-hidden rounded-xl border border-[#C9A800]/40 bg-gradient-to-br from-[#FFD700]/35 via-[#FFD700]/20 to-[#016D49]/10 p-3 shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold text-[#0B1F16]">{formatFecha(fecha)}</p>
                    <p className="text-[10px] font-medium" style={{ color: ringColor }}>
                        {scoreLabel(retention_score)}
                    </p>
                </div>

                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 88 88">
                        <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="none"
                            stroke="white"
                            strokeOpacity={0.5}
                            strokeWidth="7"
                        />
                        <circle
                            cx="44"
                            cy="44"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - progress}
                        />
                    </svg>

                    <div className="relative flex flex-col items-center text-center">
                        <span
                            className="text-2xl font-bold leading-none"
                            style={{ color: ringColor }}
                        >
                            {retention_score}
                        </span>
                        <span className="text-[8px] font-semibold text-[#0B1F16]">Score</span>
                    </div>
                </div>
            </div>

            <dl className="mt-2 grid grid-cols-4 gap-1.5">
                {secondaryMetrics.map(({ label, key, unit }) => (
                    <div
                        key={key}
                        className="rounded-lg bg-white/55 px-1.5 py-1.5 text-center backdrop-blur-sm"
                    >
                        <dt className="text-[8px] font-medium text-[#4F5F5A]">{label}</dt>
                        <dd className="mt-0.5 text-[11px] font-semibold text-[#0B1F16]">
                            {metrics[key]} {unit}
                        </dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}
