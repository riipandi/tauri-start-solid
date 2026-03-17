//! Settings management module
//!
//! Provides typed settings on top of the generic KV store

use serde::{Deserialize, Serialize};

/// Theme mode options
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ThemeMode {
    Dark,
    Light,
    Auto,
}

/// UI-specific settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UISettings {
    pub theme_mode: ThemeMode,
    pub theme_light: String,
    pub theme_dark: String,
    pub enable_spell_check: bool,
}

impl Default for UISettings {
    fn default() -> Self {
        Self {
            theme_mode: ThemeMode::Auto,
            theme_light: "defaultLight".to_string(),
            theme_dark: "defaultDark".to_string(),
            enable_spell_check: true,
        }
    }
}

/// Application settings (wrapper for future extensibility)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    pub ui: UISettings,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            ui: UISettings::default(),
        }
    }
}

/// Constants for settings storage
pub const SETTINGS_KEY: &str = "app_settings";
