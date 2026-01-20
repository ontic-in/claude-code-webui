import {
  SunIcon,
  MoonIcon,
  CommandLineIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useSettings } from "../../hooks/useSettings";

export function GeneralSettings() {
  const {
    theme,
    enterBehavior,
    hideSystemMessages,
    toggleTheme,
    toggleEnterBehavior,
    toggleHideSystemMessages,
  } = useSettings();

  return (
    <div className="space-y-6">
      {/* Live region for screen reader announcements */}
      <div aria-live="polite" className="sr-only" id="settings-announcements">
        {theme === "light" ? "Light mode enabled" : "Dark mode enabled"}.{" "}
        {enterBehavior === "send"
          ? "Enter key sends messages"
          : "Enter key creates newlines"}
        .
      </div>

      <div>
        <h3 className="text-lg font-medium text-foreground mb-4">
          General Settings
        </h3>

        {/* Theme Setting */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Theme
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-3 px-4 py-3 bg-muted border border-border rounded-lg hover:bg-accent transition-all duration-200 text-left flex-1"
                role="switch"
                aria-checked={theme === "dark"}
                aria-label={`Theme toggle. Currently set to ${theme} mode. Click to switch to ${theme === "light" ? "dark" : "light"} mode.`}
              >
                {theme === "light" ? (
                  <SunIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-[var(--brand-purple)]" />
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {theme === "light" ? "Light Mode" : "Dark Mode"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Click to switch to {theme === "light" ? "dark" : "light"}{" "}
                    mode
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Enter Behavior Setting */}
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Enter Key Behavior
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleEnterBehavior}
                className="flex items-center gap-3 px-4 py-3 bg-muted border border-border rounded-lg hover:bg-accent transition-all duration-200 text-left flex-1"
                role="switch"
                aria-checked={enterBehavior === "send"}
                aria-label={`Enter key behavior toggle. Currently set to ${enterBehavior === "send" ? "send message" : "newline"}. Click to switch behavior.`}
              >
                <CommandLineIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {enterBehavior === "send"
                      ? "Enter to Send"
                      : "Enter for Newline"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {enterBehavior === "send"
                      ? "Enter sends message, Shift+Enter for newline"
                      : "Enter adds newline, Shift+Enter sends message"}
                  </div>
                </div>
              </button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Controls how the Enter key behaves when typing messages in the
              chat input.
            </div>
          </div>

          {/* Hide System Messages Setting */}
          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Message Display
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleHideSystemMessages}
                className="flex items-center gap-3 px-4 py-3 bg-muted border border-border rounded-lg hover:bg-accent transition-all duration-200 text-left flex-1"
                role="switch"
                aria-checked={hideSystemMessages}
                aria-label={`Hide system messages toggle. Currently ${hideSystemMessages ? "hiding" : "showing"} system messages.`}
              >
                <EyeSlashIcon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {hideSystemMessages
                      ? "System Messages Hidden"
                      : "System Messages Visible"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {hideSystemMessages
                      ? "Click to show system and result messages"
                      : "Click to hide system and result messages"}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
