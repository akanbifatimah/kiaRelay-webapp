import { Line, LineChart, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data: number[];
  color?: string;
}

// Minimal trend line for a stat tile — no axes/grid/tooltip, unlike every
// other recharts usage in this app (ChartCard-based full charts).
export function Sparkline({ data, color = "var(--color-primary)" }: SparklineProps) {
  const points = data.map((value, index) => ({ index, value }));

  return (
    <div className="h-8 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
