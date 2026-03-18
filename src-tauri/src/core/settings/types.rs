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

/// Application settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license_key: Option<String>,
    pub ui: UISettings,
}
