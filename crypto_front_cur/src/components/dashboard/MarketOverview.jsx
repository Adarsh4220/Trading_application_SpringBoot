import CoinCard from "../crypto/CoinCard";

export default function MarketOverview({ coins }) {
  return (
    <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-thin sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 xl:grid-cols-4">
      {(coins || []).slice(0, 4).map((coin) => (
        <div key={coin.id} className="min-w-[16rem] sm:min-w-0">
          <CoinCard coin={coin} />
        </div>
      ))}
    </div>
  );
}
