export type Theme = "light" | "dark";
export type EnterBehavior = "send" | "newline";

export interface AppSettings {
  theme: Theme;
  enterBehavior: EnterBehavior;
  hideSystemMessages: boolean;
  version: number;
}

export interface LegacySettings {
  theme?: Theme;
  enterBehavior?: EnterBehavior;
}

export interface SettingsContextType {
  settings: AppSettings;
  theme: Theme;
  enterBehavior: EnterBehavior;
  hideSystemMessages: boolean;
  toggleTheme: () => void;
  toggleEnterBehavior: () => void;
  toggleHideSystemMessages: () => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
}

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: "light",
  enterBehavior: "send",
  hideSystemMessages: false,
  version: 2,
};

// Current settings version for migration
export const CURRENT_SETTINGS_VERSION = 2;
