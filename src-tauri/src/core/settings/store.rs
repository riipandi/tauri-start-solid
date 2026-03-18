//! Settings file storage module
//!
//! Provides JSON file-based storage for application settings.

use crate::core::settings::AppSettings;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use thiserror::Error;

/// Errors that can occur during settings file operations
#[derive(Debug, Error)]
pub enum SettingsError {
    #[error("Failed to get app data directory: {0}")]
    AppDataDir(String),

    #[error("Failed to create settings directory: {0}")]
    CreateDir(String),

    #[error("Failed to read settings file: {0}")]
    ReadFile(String),

    #[error("Failed to parse settings JSON: {0}")]
    ParseJson(String),

    #[error("Failed to write settings file: {0}")]
    WriteFile(String),

    #[error("Failed to serialize settings JSON: {0}")]
    SerializeJson(String),
}

/// Get the settings file path based on the environment
///
/// # Arguments
/// * `app` - The Tauri application handle
///
/// # Returns
/// * `Result<PathBuf, SettingsError>` - The settings file path or an error
///
/// # Note
/// Settings file is stored in $APPDATA directory (platform-specific app data folder):
/// - Windows: %APPDATA%\{app-name}\settings{-debug}.json
/// - macOS: ~/Library/Application Support/{app-name}/settings{-debug}.json
/// - Linux: ~/.local/share/{app-name}/settings{-debug}.json
///
/// The `-debug` suffix is added automatically in debug builds
pub fn get_settings_file_path<R: tauri::Runtime>(app: &AppHandle<R>) -> Result<PathBuf, SettingsError> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| SettingsError::AppDataDir(format!("{}", e)))?;

    std::fs::create_dir_all(&data_dir).map_err(|e| SettingsError::CreateDir(format!("{}", e)))?;

    let suffix = if cfg!(debug_assertions) { "-debug" } else { "" };
    let settings_filename = format!("settings{}.json", suffix);
    let settings_path = data_dir.join(settings_filename);

    Ok(settings_path)
}

/// Load settings from the JSON file
///
/// # Arguments
/// * `app` - The Tauri application handle
///
/// # Returns
/// * `Result<AppSettings, SettingsError>` - The loaded settings or defaults
///
/// If the settings file doesn't exist, creates it with default settings
pub fn load_settings<R: tauri::Runtime>(app: &AppHandle<R>) -> Result<AppSettings, SettingsError> {
    let settings_path = get_settings_file_path(app)?;

    if !settings_path.exists() {
        log::info!("Settings file not found at {:?}, creating with defaults", settings_path);
        let default_settings = AppSettings::default();
        save_settings(app, &default_settings)?;
        return Ok(default_settings);
    }

    let json_content = std::fs::read_to_string(&settings_path)
        .map_err(|e| SettingsError::ReadFile(format!("{}: {}", settings_path.display(), e)))?;

    serde_json::from_str::<AppSettings>(&json_content)
        .map_err(|e| SettingsError::ParseJson(format!("{}: {}", e, json_content)))
}

/// Save settings to the JSON file
///
/// # Arguments
/// * `app` - The Tauri application handle
/// * `settings` - The settings to save
///
/// # Returns
/// * `Result<(), SettingsError>` - Success or an error
pub fn save_settings<R: tauri::Runtime>(app: &AppHandle<R>, settings: &AppSettings) -> Result<(), SettingsError> {
    let settings_path = get_settings_file_path(app)?;

    let json_content =
        serde_json::to_string_pretty(settings).map_err(|e| SettingsError::SerializeJson(format!("{}", e)))?;

    std::fs::write(&settings_path, json_content)
        .map_err(|e| SettingsError::WriteFile(format!("{}: {}", settings_path.display(), e)))?;

    log::info!("Settings saved successfully to {:?}", settings_path);
    Ok(())
}
