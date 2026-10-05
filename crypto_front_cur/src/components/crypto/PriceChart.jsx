import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "../../utils/format";

export default function PriceChart({ points }) {
  const data = (points || []).map((p) => ({
    time: p.time,
    price: Number(p.price),
  }));

  if (!data.length) {
    return <p className="py-16 text-center text-sm text-slate-400">No chart data available.</p>;
  }

  return (
    <div className="h-64 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C5CFF" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#7C5CFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
            formatter={(value) => [formatMoney(value), "Price"]}
            labelFormatter={(label) => new Date(label).toLocaleString()}
          />
          <Area type="monotone" dataKey="price" stroke="#8B7CFF" fill="url(#priceFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
