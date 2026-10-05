import Button from "./Button";

export default function EmptyState({ title, description, actionLabel, onAction, icon }) {
  return (
    <div className="glass-card rounded-2xl p-8 text-center">
      {icon}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-2 text-sm text-slate-400">{description}</p> : null}
      {actionLabel && onAction ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
