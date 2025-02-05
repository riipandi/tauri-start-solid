/*!
 * Portions of this file are based on code from `wyhaya/tauri-plugin-theme`.
 * Credits to wyhaya: https://github.com/wyhaya/tauri-plugin-theme
 */

#![allow(unused_variables)]

#[cfg(target_os = "linux")]
mod linux;
#[cfg(target_os = "macos")]
mod macos;
#[cfg(target_os = "windows")]
mod windows;

#[cfg(target_os = "macos")]
pub use macos::set_theme;

#[cfg(target_os = "linux")]
pub use linux::set_theme;

#[cfg(target_os = "windows")]
pub use windows::set_theme;

use crate::config::{AppConfig, CONFIG_KEY};
use crate::store::KVStore;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::sync::Mutex;
use tauri::{AppHandle, Manager, Runtime};

/// Theme options for the application UI
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Type)]
#[serde(rename_all = "lowercase")]
pub enum Theme {
    /// Light theme mode
    Light,
    /// Dark theme mode
    Dark,
    /// Follow system theme settings
    System,
}

impl Default for Theme {
    fn default() -> Self {
        Self::System
    }
}

impl From<String> for Theme {
    fn from(value: String) -> Self {
        match value.as_str() {
            "light" => Theme::Light,
            "dark" => Theme::Dark,
            _ => Theme::System,
        }
    }
}

impl std::fmt::Display for Theme {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Theme::System => write!(f, "system"),
            Theme::Light => write!(f, "light"),
            Theme::Dark => write!(f, "dark"),
        }
    }
}

fn save_theme_state<R: Runtime>(app: &AppHandle<R>, theme: Theme) -> Result<(), &'static str> {
    let state = app.state::<Mutex<KVStore<String, AppConfig>>>();
    let store = state.lock().map_err(|_| "Failed to lock store")?;

    // Get existing config
    let mut config = store
        .get(&CONFIG_KEY.to_string())
        .map_err(|_| "Failed to get config")?
        .unwrap_or_default();

    // Update theme
    config.theme = theme;

    // Save back to store
    store
        .insert(CONFIG_KEY.to_string(), &config)
        .map_err(|_| "Failed to save config")?;

    Ok(())
}

#[tauri::command]
#[specta::specta]
pub fn get_theme<R: Runtime>(app: AppHandle<R>) -> Result<Theme, ()> {
    let state = app.state::<Mutex<KVStore<String, AppConfig>>>();
    let store = state.lock().map_err(|_| ())?;
    let config = store.get(&CONFIG_KEY.to_string()).map_err(|_| ())?.unwrap_or_default();
    Ok(config.theme)
}
