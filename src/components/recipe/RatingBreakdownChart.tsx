"use client";

import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Props as RechartsLabelProps } from "recharts/types/component/Label";
import type { RatingBreakdownEntry } from "@/lib/recipes-api";

const COLORS = {
  primary: "#e8623c",
  track: "#e8dfd3",
  label: "#6b655d",
};

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: RatingBreakdownEntry }[];
}) {
  if (!active || !payload?.length) return null;
  const { rating, count } = payload[0].payload;
  return (
    <div className="bg-white border border-border rounded-lg px-3 py-1.5 shadow-[0px_4px_20px_rgba(34,32,29,0.06)] text-caption font-medium text-charcoal">
      {count} {count === 1 ? "review" : "reviews"} at {rating} star{rating === 1 ? "" : "s"}
    </div>
  );
}

export function RatingBreakdownChart({ data }: { data: RatingBreakdownEntry[] }) {
  const total = data.reduce((sum, entry) => sum + entry.count, 0);

  const renderCountLabel = (props: RechartsLabelProps) => {
    const x = Number(props.x ?? 0);
    const y = Number(props.y ?? 0);
    const width = Number(props.width ?? 0);
    const height = Number(props.height ?? 0);
    const count = Number(Array.isArray(props.value) ? props.value[0] : (props.value ?? 0));
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
      <text
        x={x + width + 8}
        y={y + height / 2}
        dy={4}
        fontFamily="var(--font-body)"
        fontSize={12}
        fontWeight={500}
        fill={COLORS.label}
      >
        {count} ({percentage}%)
      </text>
    );
  };

  return (
    <div className="w-full min-w-0" style={{ height: 168 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 68, bottom: 0, left: 0 }}
          barCategoryGap={10}
        >
          <XAxis type="number" hide domain={[0, total > 0 ? "dataMax" : 1]} />
          <YAxis
            type="category"
            dataKey="rating"
            tickFormatter={(rating: number) => `${rating}★`}
            tickLine={false}
            axisLine={false}
            width={32}
            tick={{ fontFamily: "var(--font-body)", fontSize: 12, fill: COLORS.label }}
          />
          <Tooltip cursor={{ fill: "rgba(232, 98, 60, 0.06)" }} content={<ChartTooltip />} />
          <Bar dataKey="count" radius={[4, 4, 4, 4]} maxBarSize={14} background={{ fill: COLORS.track, radius: 4 }}>
            {data.map((entry) => (
              <Cell key={entry.rating} fill={COLORS.primary} />
            ))}
            <LabelList dataKey="count" content={renderCountLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
