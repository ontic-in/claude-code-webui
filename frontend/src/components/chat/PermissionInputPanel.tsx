import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import type { JSX } from "react";
import { useState, useEffect, useCallback } from "react";

// Helper function to extract command name from pattern like "Bash(ls:*)" -> "ls"
function extractCommandName(pattern: string): string {
  if (!pattern) return "Unknown";
  const match = pattern.match(/Bash\(([^:]+):/);
  return match ? match[1] : pattern;
}

// Helper function to render permission content based on patterns
function renderPermissionContent(patterns: string[]): JSX.Element {
  // Handle empty patterns array
  if (patterns.length === 0) {
    return (
      <p className="text-foreground/80 mb-3">
        Claude wants to use bash commands, but the specific commands could not
        be determined.
      </p>
    );
  }

  const isMultipleCommands = patterns.length > 1;

  if (isMultipleCommands) {
    // Extract command names from patterns like "Bash(ls:*)" -> "ls"
    const commandNames = patterns.map(extractCommandName);

    return (
      <>
        <p className="text-foreground/80 mb-2">
          Claude wants to use the following commands:
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {commandNames.map((cmd, index) => (
            <span
              key={index}
              className="font-mono bg-muted px-2 py-1 rounded text-sm"
            >
              {cmd}
            </span>
          ))}
        </div>
      </>
    );
  } else {
    const commandName = extractCommandName(patterns[0]);
    return (
      <p className="text-foreground/80 mb-3">
        Claude wants to use the{" "}
        <span className="font-mono bg-muted px-2 py-1 rounded text-sm">
          {commandName}
        </span>{" "}
        command.
      </p>
    );
  }
}

// Helper function to render button text for permanent permission
function renderPermanentButtonText(patterns: string[]): string {
  // Handle empty patterns array
  if (patterns.length === 0) {
    return "Yes, and don't ask again for bash commands";
  }

  const isMultipleCommands = patterns.length > 1;
  const commandNames = patterns.map(extractCommandName);

  if (isMultipleCommands) {
    return `Yes, and don't ask again for ${commandNames.join(" and ")} commands`;
  } else {
    return `Yes, and don't ask again for ${commandNames[0]} command`;
  }
}

interface PermissionInputPanelProps {
  patterns: string[];
  onAllow: () => void;
  onAllowPermanent: () => void;
  onDeny: () => void;
  // Optional extension point for custom button styling (e.g., demo effects)
  getButtonClassName?: (
    buttonType: "allow" | "allowPermanent" | "deny",
    defaultClassName: string,
  ) => string;
  // Optional callback for demo automation to control selection state
  onSelectionChange?: (selection: "allow" | "allowPermanent" | "deny") => void;
  // Optional external control for demo automation (overrides internal state)
  externalSelectedOption?: "allow" | "allowPermanent" | "deny" | null;
}

export function PermissionInputPanel({
  patterns,
  onAllow,
  onAllowPermanent,
  onDeny,
  getButtonClassName = (_, defaultClassName) => defaultClassName, // Default: no modification
  onSelectionChange, // Optional callback for demo automation
  externalSelectedOption, // Optional external control for demo automation
}: PermissionInputPanelProps) {
  const [selectedOption, setSelectedOption] = useState<
    "allow" | "allowPermanent" | "deny" | null
  >("allow");

  // Check if component is externally controlled (for demo mode)
  const isExternallyControlled = externalSelectedOption !== undefined;

  // Use external selection if provided (for demo), otherwise use internal state
  const effectiveSelectedOption = externalSelectedOption ?? selectedOption;

  // Update selection state based on external changes (for demo automation)
  const updateSelectedOption = useCallback(
    (option: "allow" | "allowPermanent" | "deny") => {
      // Only update internal state if not controlled externally
      if (externalSelectedOption === undefined) {
        setSelectedOption(option);
      }
      onSelectionChange?.(option);
    },
    [onSelectionChange, externalSelectedOption],
  );

  // Handle keyboard navigation
  useEffect(() => {
    // Skip keyboard navigation if controlled externally (demo mode)
    if (externalSelectedOption !== undefined) return;

    // Define options array inside useEffect to avoid unnecessary re-renders
    const options = ["allow", "allowPermanent", "deny"] as const;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = options.indexOf(effectiveSelectedOption!);
        const nextIndex = (currentIndex + 1) % options.length;
        updateSelectedOption(options[nextIndex]);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = options.indexOf(effectiveSelectedOption!);
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        updateSelectedOption(options[prevIndex]);
      } else if (e.key === "Enter" && effectiveSelectedOption) {
        e.preventDefault();
        // Execute the currently selected option
        if (effectiveSelectedOption === "allow") {
          onAllow();
        } else if (effectiveSelectedOption === "allowPermanent") {
          onAllowPermanent();
        } else if (effectiveSelectedOption === "deny") {
          onDeny();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onDeny(); // "Deny" option when ESC is pressed
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    effectiveSelectedOption,
    onAllow,
    onAllowPermanent,
    onDeny,
    updateSelectedOption,
    externalSelectedOption,
  ]);

  return (
    <div className="flex-shrink-0 px-4 py-4 bg-card/80 border border-border rounded-xl backdrop-blur-sm shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--status-warning-bg)] rounded-lg">
          <ExclamationTriangleIcon className="w-5 h-5 text-[var(--status-warning-text)]" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Permission Required
        </h3>
      </div>

      {/* Content */}
      <div className="mb-4">
        {renderPermissionContent(patterns)}
        <p className="text-sm text-muted-foreground">
          Do you want to proceed? (Press ESC to deny)
        </p>
      </div>

      {/* Direct-click permission options with selection state */}
      <div className="space-y-2">
        <button
          onClick={() => {
            updateSelectedOption("allow");
            onAllow();
          }}
          onFocus={() => updateSelectedOption("allow")}
          onBlur={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          onMouseEnter={() => updateSelectedOption("allow")}
          onMouseLeave={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          className={getButtonClassName(
            "allow",
            `w-full p-3 rounded-lg cursor-pointer transition-all duration-200 text-left focus:outline-none ${
              effectiveSelectedOption === "allow"
                ? "bg-[var(--brand-purple)]/10 border-2 border-[var(--brand-purple)] shadow-sm"
                : "border-2 border-transparent"
            }`,
          )}
        >
          <span
            className={`text-sm font-medium ${
              effectiveSelectedOption === "allow"
                ? "text-[var(--brand-purple)]"
                : "text-foreground/80"
            }`}
          >
            Yes
          </span>
        </button>

        <button
          onClick={() => {
            updateSelectedOption("allowPermanent");
            onAllowPermanent();
          }}
          onFocus={() => updateSelectedOption("allowPermanent")}
          onBlur={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          onMouseEnter={() => updateSelectedOption("allowPermanent")}
          onMouseLeave={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          className={getButtonClassName(
            "allowPermanent",
            `w-full p-3 rounded-lg cursor-pointer transition-all duration-200 text-left focus:outline-none ${
              effectiveSelectedOption === "allowPermanent"
                ? "bg-[var(--status-success-bg)] border-2 border-[var(--status-success-text)] shadow-sm"
                : "border-2 border-transparent"
            }`,
          )}
        >
          <span
            className={`text-sm font-medium ${
              effectiveSelectedOption === "allowPermanent"
                ? "text-[var(--status-success-text)]"
                : "text-foreground/80"
            }`}
          >
            {renderPermanentButtonText(patterns)}
          </span>
        </button>

        <button
          onClick={() => {
            updateSelectedOption("deny");
            onDeny();
          }}
          onFocus={() => updateSelectedOption("deny")}
          onBlur={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          onMouseEnter={() => updateSelectedOption("deny")}
          onMouseLeave={() => {
            if (!isExternallyControlled) {
              setSelectedOption(null);
            }
          }}
          className={getButtonClassName(
            "deny",
            `w-full p-3 rounded-lg cursor-pointer transition-all duration-200 text-left focus:outline-none ${
              effectiveSelectedOption === "deny"
                ? "bg-muted border-2 border-border shadow-sm"
                : "border-2 border-transparent"
            }`,
          )}
        >
          <span
            className={`text-sm font-medium ${
              effectiveSelectedOption === "deny"
                ? "text-foreground"
                : "text-foreground/80"
            }`}
          >
            No
          </span>
        </button>
      </div>
    </div>
  );
}
