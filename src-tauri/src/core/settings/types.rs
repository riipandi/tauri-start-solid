use serde::{Deserialize, Serialize};

/// Theme mode options
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ThemeMode {
    Dark,
    Light,
    Auto,
}

/// Update channel options
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum UpdateChannel {
    Stable,
    Canary,
}

/// Update mode options
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum UpdateMode {
    Automatic,
    Manual,
}

/// UI-specific settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UISettings {
    pub theme_mode: ThemeMode,
    pub theme_light: String,
    pub theme_dark: String,
    pub enable_spell_check: bool,
}

/// Update settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdateSettings {
    #[serde(default = "default_channel")]
    pub channel: UpdateChannel,
    #[serde(default = "default_update_mode")]
    pub mode: UpdateMode,
    #[serde(default = "default_auto_download")]
    pub auto_download: bool,
}

/// Application settings
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license_key: Option<String>,
    pub ui: UISettings,
    #[serde(default = "default_update_settings")]
    pub update: UpdateSettings,
}

fn default_channel() -> UpdateChannel {
    UpdateChannel::Stable
}

fn default_update_mode() -> UpdateMode {
    UpdateMode::Automatic
}

fn default_auto_download() -> bool {
    false
}

fn default_update_settings() -> UpdateSettings {
    UpdateSettings {
        channel: default_channel(),
        mode: default_update_mode(),
        auto_download: default_auto_download(),
    }
}
