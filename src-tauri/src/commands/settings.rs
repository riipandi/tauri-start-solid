//! Tauri commands for settings management

use crate::core::settings::{AppSettings, ThemeMode};
use crate::core::settings::{load_settings, save_settings};
use tauri::{AppHandle, Emitter};

/// Open settings window
///
/// # Arguments
/// * `app` - The Tauri application handle
///
/// # Returns
/// * `Result<(), String>` - Success or error message
#[tauri::command]
pub async fn open_settings_window(app: AppHandle) -> Result<(), String> {
    match crate::core::create_settings_window(&app) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to open settings window: {}", e)),
    }
}

/// Get all settings from the JSON file
///
/// Returns the current settings or default values if none exist
#[tauri::command]
pub async fn get_settings(app: AppHandle) -> Result<AppSettings, String> {
    match load_settings(&app) {
        Ok(settings) => Ok(settings),
        Err(e) => {
            log::error!("Failed to load settings: {}", e);
            Ok(AppSettings::default())
        }
    }
}

/// Update settings in the JSON file
///
/// Saves the new settings and emits an event to all windows
#[tauri::command]
pub async fn update_settings(app: AppHandle, mut settings: AppSettings) -> Result<AppSettings, String> {
    // Validate theme fields based on theme_mode
    match settings.ui.theme_mode {
        ThemeMode::Dark => {
            if settings.ui.theme_dark.is_empty() {
                settings.ui.theme_dark = "default-dark".to_string();
            }
        }
        ThemeMode::Light => {
            if settings.ui.theme_light.is_empty() {
                settings.ui.theme_light = "default-light".to_string();
            }
        }
        ThemeMode::Auto => {
            if settings.ui.theme_dark.is_empty() {
                settings.ui.theme_dark = "default-dark".to_string();
            }
            if settings.ui.theme_light.is_empty() {
                settings.ui.theme_light = "default-light".to_string();
            }
        }
    }

    log::debug!(
        "Validated settings: theme_mode={:?}, theme_dark={}, theme_light={}",
        settings.ui.theme_mode,
        settings.ui.theme_dark,
        settings.ui.theme_light
    );

    // Save to JSON file
    match save_settings(&app, &settings) {
        Ok(_) => {
            log::info!("Settings updated successfully");

            // Emit event to all windows
            if let Err(e) = app.emit("settings://updated", settings.clone()) {
                log::error!("Failed to emit settings update event: {}", e);
            }

            Ok(settings)
        }
        Err(e) => {
            log::error!("Failed to save settings: {}", e);
            Err(format!("Failed to save settings: {}", e))
        }
    }
}

/// Reset settings to default values
///
/// Resets all settings to their defaults and saves to JSON file
#[tauri::command]
pub async fn reset_settings(app: AppHandle) -> Result<AppSettings, String> {
    log::info!("Resetting settings to defaults");

    let default_settings = AppSettings::default();

    log::debug!("Default settings structure: {:?}", default_settings);

    // Save to JSON file
    match save_settings(&app, &default_settings) {
        Ok(_) => {
            log::info!("Settings reset successfully");

            // Log the event we're about to emit
            log::debug!(
                "Preparing to emit 'settings://updated' event with default_settings: {:?}",
                default_settings
            );

            // Emit event to all windows
            if let Err(e) = app.emit("settings://updated", default_settings.clone()) {
                log::error!("Failed to emit settings reset event: {}", e);
            } else {
                log::info!("✅ Successfully emitted 'settings://updated' event to all windows");
            }

            Ok(default_settings)
        }
        Err(e) => {
            log::error!("Failed to save default settings: {}", e);
            Err(format!("Failed to save default settings: {}", e))
        }
    }
}
