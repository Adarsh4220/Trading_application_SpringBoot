import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cryptoService } from "../../services/cryptoService";
import PriceChart from "./PriceChart";
import Button from "../common/Button";
import ErrorState from "../common/ErrorState";
import { SkeletonChart, SkeletonPage } from "../common/Skeleton";
import {
  coinChangeFromDetails,
  coinHighFromDetails,
  coinImageFromDetails,
  coinLowFromDetails,
  coinMarketCapFromDetails,
  coinPriceFromDetails,
  formatMoney,
  formatPercent,
} from "../../utils/format";

const RANGES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

export default function CoinDetails() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [chart, setChart] = useState([]);
  const [days, setDays] = useState(1);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await cryptoService.getCoinDetails(coinId);
        if (active) setDetails(data);
      } catch (err) {
        if (active) setError(err.userMessage || "Unable to load coin details.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [coinId]);

  useEffect(() => {
    let active = true;
    async function loadChart() {
      setChartLoading(true);
      try {
        const points = await cryptoService.getCoinChart(coinId, days);
        if (active) setChart(Array.isArray(points) ? points : []);
      } catch {
        if (active) setChart([]);
      } finally {
        if (active) setChartLoading(false);
      }
    }
    loadChart();
    return () => {
      active = false;
    };
  }, [coinId, days]);

  if (loading) return <SkeletonPage />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!details) return <ErrorState message="Coin details were not returned." />;

  const price = coinPriceFromDetails(details);
  const change = coinChangeFromDetails(details);
  const up = Number(change) >= 0;
  const image = coinImageFromDetails(details);

  return (
    <div className="space-y-6 fade-in">
      <Button variant="ghost" onClick={() => navigate(-1)} className="px-2">
        <ArrowLeft size={16} /> Back
      </Button>

      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-wrap items-center gap-4">
          {image ? <img src={image} alt="" className="h-14 w-14 rounded-full" /> : null}
          <div>
            <h1 className="text-2xl font-bold">{details.name || details.id}</h1>
            <p className="text-sm uppercase text-slate-400">{details.symbol}</p>
          </div>
          {details.market_cap_rank ? (
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300">
              Rank #{details.market_cap_rank}
            </span>
          ) : null}
        </div>
        <div className="mt-5 flex flex-wrap items-end gap-4">
          <p className="text-3xl font-bold">{formatMoney(price)}</p>
          <p className={`font-medium ${up ? "text-emerald-400" : "text-red-400"}`}>
            {formatPercent(change)} <span className="sr-only">{up ? "up" : "down"}</span>
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Market cap" value={formatMoney(coinMarketCapFromDetails(details), { maximumFractionDigits: 0, minimumFractionDigits: 0 })} />
          <Stat label="24h high" value={formatMoney(coinHighFromDetails(details))} />
          <Stat label="24h low" value={formatMoney(coinLowFromDetails(details))} />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Chart range">
          {RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              className={`min-h-11 rounded-xl px-3 text-sm ${
                days === range.days ? "bg-gradient-to-r from-blue-600 to-violet-600" : "bg-[#151B2B]"
              }`}
              onClick={() => setDays(range.days)}
            >
              {range.label}
            </button>
          ))}
        </div>
        {chartLoading ? <SkeletonChart /> : <PriceChart points={chart} />}
      </div>

      <Button onClick={() => navigate("/trade", { state: { coinId: details.id } })}>Trade this coin</Button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-[#151B2B] p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}
