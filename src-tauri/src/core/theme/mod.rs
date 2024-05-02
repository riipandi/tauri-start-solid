/*!
 * Portions of this file are based on code from `wyhaya/tauri-plugin-theme`.
 *
 * Credits to Alexandru Bereghici: https://github.com/wyhaya/tauri-plugin-theme
 */

#[cfg(target_os = "macos")]
mod macos;

#[cfg(target_os = "windows")]
mod windows;

#[cfg(target_os = "linux")]
mod linux;

#[cfg(target_os = "macos")]
pub use self::macos::*;

#[cfg(target_os = "windows")]
pub use self::windows::*;

#[cfg(target_os = "linux")]
pub use self::linux::*;

use native_db::Database;
use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::{AppHandle, Runtime};

#[tauri::command]
pub fn get_theme(db: tauri::State<Database>) -> tauri::Result<Theme> {
    Ok(saved_theme_value(db))
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, Type)]
#[serde(rename_all = "lowercase")]
pub enum Theme {
    Auto,
    Light,
    Dark,
}

impl From<String> for Theme {
    fn from(value: String) -> Self {
        match value.as_str() {
            "light" => Theme::Light,
            "dark" => Theme::Dark,
            _ => Theme::Auto,
        }
    }
}

impl ToString for Theme {
    fn to_string(&self) -> String {
        match self {
            Theme::Auto => "auto".into(),
            Theme::Light => "light".into(),
            Theme::Dark => "dark".into(),
        }
    }
}

pub fn saved_theme_value(db: tauri::State<Database>) -> Theme {
    let theme = super::state::get_app_settings(db).theme;
    log::debug!("saved theme: {:?}", theme);
    theme
}

pub fn save_theme_value<R: Runtime>(theme: Theme, app: AppHandle<R>) {
    let _ = super::state::save_setting("theme", &theme.to_string(), app);
}
