import type { DailyMetrics } from "../types/metrics";
import {
    ringProgress,
    scoreColor,
    scoreLabel,
    secondaryMetrics,
} from "../utils/metricsDisplay";

type TodayMetricsProps = {
    metrics: DailyMetrics;
};

export default function TodayMetrics({ metrics }: TodayMetricsProps) {
    const { retention_score } = metrics;
    const ringColor = scoreColor(retention_score);
    const radius = 54;
    const { circumference, progress } = ringProgress(retention_score, radius);

    return (
        <article className="w-full overflow-hidden rounded-2xl border border-[#C9A800]/40 bg-gradient-to-br from-[#FFD700]/35 via-[#FFD700]/20 to-[#016D49]/10 p-4 shadow-lg backdrop-blur-xl">
            <div className="flex flex-col items-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#4F5F5A]">
                    Resumen del día
                </p>

                <div className="relative mt-3 flex h-36 w-36 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 128 128">
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            fill="none"
                            stroke="white"
                            strokeOpacity={0.5}
                            strokeWidth="10"
                        />
                        <circle
                            cx="64"
                            cy="64"
                            r={radius}
                            fill="none"
                            stroke={ringColor}
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={circumference - progress}
                        />
                    </svg>

                    <div className="relative flex flex-col items-center text-center">
                        <span
                            className="text-4xl font-bold leading-none"
                            style={{ color: ringColor }}
                        >
                            {retention_score}
                        </span>
                        <span className="mt-1 text-[11px] font-semibold text-[#0B1F16]">
                            Retention Score
                        </span>
                        <span
                            className="mt-0.5 text-[10px] font-medium"
                            style={{ color: ringColor }}
                        >
                            {scoreLabel(retention_score)}
                        </span>
                    </div>
                </div>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-2">
                {secondaryMetrics.map(({ label, key, unit }) => (
                    <div
                        key={key}
                        className="rounded-xl bg-white/55 px-2.5 py-2 text-center backdrop-blur-sm"
                    >
                        <dt className="text-[10px] font-medium text-[#4F5F5A]">{label}</dt>
                        <dd className="mt-0.5 text-sm font-semibold text-[#0B1F16]">
                            {metrics[key]} {unit}
                        </dd>
                    </div>
                ))}
            </dl>
        </article>
    );
}
