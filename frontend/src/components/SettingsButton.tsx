import { CogIcon } from "@heroicons/react/24/outline";

interface SettingsButtonProps {
  onClick: () => void;
}

export function SettingsButton({ onClick }: SettingsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-3 rounded-xl bg-card/80 border border-border hover:bg-accent transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
      aria-label="Open settings"
      title="Settings"
    >
      <CogIcon className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}
