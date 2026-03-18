use super::{AppSettings, ThemeMode, UISettings};

impl Default for UISettings {
    fn default() -> Self {
        Self {
            theme_mode: ThemeMode::Auto,
            theme_light: "default-light".to_string(),
            theme_dark: "default-dark".to_string(),
            enable_spell_check: false,
        }
    }
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            license_key: None,
            ui: UISettings::default(),
        }
    }
}
