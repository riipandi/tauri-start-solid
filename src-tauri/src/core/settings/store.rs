//! Settings file storage module
//!
//! Provides JSON file-based storage for application settings.

use crate::core::settings::AppSettings;
use crate::utils::crypto::{CryptoError, is_encrypted, maybe_decrypt, maybe_encrypt};
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

    #[error("Crypto error: {0}")]
    Crypto(String),
}

impl From<CryptoError> for SettingsError {
    fn from(err: CryptoError) -> Self {
        SettingsError::Crypto(err.to_string())
    }
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

    let mut settings: AppSettings = serde_json::from_str::<AppSettings>(&json_content)
        .map_err(|e| SettingsError::ParseJson(format!("{}: {}", e, json_content)))?;

    if let Some(ref license_key) = settings.license_key {
        if is_encrypted(license_key) {
            match maybe_decrypt(license_key) {
                Ok(decrypted) => {
                    settings.license_key = Some(decrypted);
                    log::info!("Successfully decrypted license_key");
                }
                Err(e) => {
                    log::warn!("Failed to decrypt license_key: {}. Keeping as-is.", e);
                }
            }
        }
    }

    Ok(settings)
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
    let mut settings_to_save = settings.clone();

    if let Some(ref license_key) = settings.license_key {
        // Treat empty string as "clear this field"
        if license_key.is_empty() {
            settings_to_save.license_key = None;
        } else if !is_encrypted(license_key) {
            match maybe_encrypt(license_key) {
                Ok(encrypted) => {
                    settings_to_save.license_key = Some(encrypted);
                    log::info!("Successfully encrypted license_key before saving");
                }
                Err(e) => {
                    log::warn!("Failed to encrypt license_key: {}. Saving as-is.", e);
                }
            }
        }
    }

    let settings_path = get_settings_file_path(app)?;

    let json_content =
        serde_json::to_string_pretty(&settings_to_save).map_err(|e| SettingsError::SerializeJson(format!("{}", e)))?;

    std::fs::write(&settings_path, json_content)
        .map_err(|e| SettingsError::WriteFile(format!("{}: {}", settings_path.display(), e)))?;

    Ok(())
}
