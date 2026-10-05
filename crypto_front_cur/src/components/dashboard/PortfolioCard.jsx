import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { displayName, formatMoney } from "../../utils/format";

const COLORS = ["#7C5CFF", "#3B82F6", "#22C55E", "#F59E0B", "#EC4899", "#06B6D4"];

export default function PortfolioCard({ holdings, total }) {
  const data = (holdings || []).map((h) => ({
    name: displayName(h.coinId),
    value: Number(h.currentValue) || 0,
  }));

  if (!data.length) {
    return <p className="py-10 text-center text-sm text-slate-400">No allocation to chart yet.</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3}>
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatMoney(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-slate-400">Total {formatMoney(total)}</p>
        {data.slice(0, 6).map((item, i) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {item.name}
            </span>
            <span>{formatMoney(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
