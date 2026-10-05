import Button from "./Button";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="glass-card rounded-2xl p-6 text-center">
      <p className="text-sm text-red-300">{message || "Unable to load this section."}</p>
      {onRetry ? (
        <Button className="mt-4" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
