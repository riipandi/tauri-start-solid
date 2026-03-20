use super::{AppSettings, ThemeMode, UISettings, UpdateChannel, UpdateMode, UpdateSettings};

impl Default for UISettings {
    fn default() -> Self {
        Self {
            editor_font_family: "monospace".to_string(),
            editor_font_size: 13,
            enable_spell_check: true,
            theme_dark: "default-dark".to_string(),
            theme_light: "default-light".to_string(),
            theme_mode: ThemeMode::Auto,
            ui_font_family: "system-ui".to_string(),
            ui_font_size: 14,
        }
    }
}

impl Default for UpdateSettings {
    fn default() -> Self {
        Self {
            channel: UpdateChannel::Stable,
            mode: UpdateMode::Automatic,
            auto_download: false,
        }
    }
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            license_key: None,
            ui: UISettings::default(),
            update: UpdateSettings::default(),
        }
    }
}
