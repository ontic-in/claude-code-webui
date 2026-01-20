import { ClockIcon } from "@heroicons/react/24/outline";

interface HistoryButtonProps {
  onClick: () => void;
}

export function HistoryButton({ onClick }: HistoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-xl bg-card/80 border border-border hover:bg-accent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
      aria-label="View conversation history"
      title="History"
    >
      <ClockIcon className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
