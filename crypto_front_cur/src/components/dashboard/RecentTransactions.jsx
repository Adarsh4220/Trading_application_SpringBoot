import { useNavigate } from "react-router-dom";
import TransactionList from "../transactions/TransactionList";
import EmptyState from "../common/EmptyState";

export default function RecentTransactions({ transactions, error }) {
  const navigate = useNavigate();
  if (error) return <p className="text-sm text-red-300">{error}</p>;
  if (!transactions?.length) {
    return (
      <EmptyState
        title="No transactions yet."
        description="Fund your wallet to get started."
        actionLabel="Add Money"
        onAction={() => navigate("/wallet")}
      />
    );
  }
  return <TransactionList transactions={transactions.slice(0, 5)} compact />;
}
