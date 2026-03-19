use super::{AppSettings, ThemeMode, UISettings, UpdateChannel, UpdateMode, UpdateSettings};

impl Default for UISettings {
    fn default() -> Self {
        Self {
            theme_mode: ThemeMode::Auto,
            theme_light: "default-light".to_string(),
            theme_dark: "default-dark".to_string(),
            enable_spell_check: true,
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
