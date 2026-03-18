//! Tauri commands for settings management

use crate::core::settings::{AppSettings, SETTINGS_KEY, ThemeMode};
use crate::database::kvstore::{Namespace, get_value, set_value};
use crate::state::AppState;
use std::sync::{Arc, Mutex};
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

/// Get all settings from the database
///
/// Returns the current settings or default values if none exist
#[tauri::command]
pub async fn get_settings(state: tauri::State<'_, Arc<Mutex<AppState>>>) -> Result<AppSettings, String> {
    match get_value(&state, SETTINGS_KEY, Some(Namespace::CONFIG)).await {
        Ok(Some(item)) => match serde_json::from_str::<AppSettings>(&item.value) {
            Ok(settings) => Ok(settings),
            Err(e) => {
                log::error!("Failed to deserialize settings: {}", e);
                Ok(AppSettings::default())
            }
        },
        Ok(None) => {
            log::info!("No settings found, returning defaults");
            Ok(AppSettings::default())
        }
        Err(e) => {
            log::error!("Failed to get settings: {}", e);
            Err(format!("Failed to retrieve settings: {}", e))
        }
    }
}

/// Update settings in the database
///
/// Saves the new settings and emits an event to all windows
#[tauri::command]
pub async fn update_settings(
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
    app: tauri::AppHandle,
    mut settings: AppSettings,
) -> Result<AppSettings, String> {
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

    // Serialize settings to JSON
    let json_value = serde_json::to_string(&settings).map_err(|e| {
        log::error!("Failed to serialize settings: {}", e);
        format!("Failed to serialize settings: {}", e)
    })?;

    // Save to database
    match set_value(&state, SETTINGS_KEY, &json_value, Some(Namespace::CONFIG)).await {
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
/// Resets all settings to their defaults and saves to database
#[tauri::command]
pub async fn reset_settings(
    state: tauri::State<'_, Arc<Mutex<AppState>>>,
    app: tauri::AppHandle,
) -> Result<AppSettings, String> {
    log::info!("Resetting settings to defaults");

    let default_settings = AppSettings::default();

    log::debug!("Default settings structure: {:?}", default_settings);

    // Serialize defaults to JSON
    let json_value = serde_json::to_string(&default_settings).map_err(|e| {
        log::error!("Failed to serialize default settings: {}", e);
        format!("Failed to serialize default settings: {}", e)
    })?;

    log::debug!("Serialized settings JSON: {}", json_value);

    // Save to database
    match set_value(&state, SETTINGS_KEY, &json_value, Some(Namespace::CONFIG)).await {
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

/// Initialize default settings if they don't exist
///
/// This should be called during app initialization
pub async fn init_default_settings(state: &Arc<Mutex<AppState>>) -> Result<AppSettings, String> {
    log::debug!("Checking if default settings need to be initialized");

    match get_value(state, SETTINGS_KEY, Some(Namespace::CONFIG)).await {
        Ok(Some(_)) => {
            log::debug!("Settings already exist, skipping initialization");
            Ok(AppSettings::default())
        }
        Ok(None) => {
            log::info!("No settings found, creating defaults");
            let default_settings = AppSettings::default();
            let json_value = serde_json::to_string(&default_settings).map_err(|e| {
                log::error!("Failed to serialize default settings: {}", e);
                format!("Failed to serialize default settings: {}", e)
            })?;

            match set_value(state, SETTINGS_KEY, &json_value, Some(Namespace::CONFIG)).await {
                Ok(_) => Ok(default_settings),
                Err(e) => {
                    log::error!("Failed to save default settings: {}", e);
                    Err(format!("Failed to save default settings: {}", e))
                }
            }
        }
        Err(e) => {
            log::error!("Failed to check for existing settings: {}", e);
            Err(format!("Failed to check for existing settings: {}", e))
        }
    }
}
