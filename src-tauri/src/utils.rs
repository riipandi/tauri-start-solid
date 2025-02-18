use chrono::{DateTime, Local};
use serde::Serialize;
use specta::Type;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{Emitter, Runtime, WebviewWindow};
use tauri_plugin_updater::UpdaterExt;

/// Force reloads the given window by navigating to its current URL
///
/// # Arguments
/// * `window` - Mutable reference to the window that needs to be reloaded
///
/// # Returns
/// * `Result<(), String>` - Success or error message
pub fn force_reload<R: Runtime>(window: &mut WebviewWindow<R>) -> Result<(), String> {
    let current_url = window.url().map_err(|e| e.to_string())?;
    log::debug!("Force reloading page: {}", current_url.as_str());
    window.navigate(current_url).map_err(|e| e.to_string())
}

#[derive(Serialize, Clone, Type)]
pub struct UpdateStatus {
    status: String,
    progress: Option<f64>,
    error: Option<String>,
    timestamp: u128,
    formatted_time: String,
}

pub async fn update<R: Runtime>(app: tauri::AppHandle<R>) -> tauri_plugin_updater::Result<()> {
    let now = SystemTime::now();
    let timestamp = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
    let dt = DateTime::<Local>::from(now);
    let formatted_time = dt.format("%Y-%m-%d %H:%M:%S%.3f %Z").to_string();

    match app.updater()?.check().await {
        Ok(Some(update)) => {
            let mut downloaded = 0;
            log::info!("Update download started");
            app.emit(
                "app-updater",
                UpdateStatus {
                    status: "downloading".into(),
                    progress: Some(0.0),
                    error: None,
                    timestamp,
                    formatted_time: formatted_time.clone(),
                },
            )
            .unwrap();

            match update
                .download(
                    |chunk_length, content_length| {
                        downloaded += chunk_length;
                        let progress = (downloaded as f64 / content_length.unwrap_or(1) as f64) * 100.0;

                        let now = SystemTime::now();
                        let timestamp = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
                        let dt = DateTime::<Local>::from(now);
                        let formatted_time = dt.format("%Y-%m-%d %H:%M:%S%.3f %Z").to_string();

                        app.emit(
                            "app-updater",
                            UpdateStatus {
                                status: "downloading".into(),
                                progress: Some(progress),
                                error: None,
                                timestamp,
                                formatted_time,
                            },
                        )
                        .unwrap();
                    },
                    || {
                        let now = SystemTime::now();
                        let timestamp = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
                        let dt = DateTime::<Local>::from(now);
                        let formatted_time = dt.format("%Y-%m-%d %H:%M:%S%.3f %Z").to_string();
                        log::info!("Update download completed");
                        app.emit(
                            "app-updater",
                            UpdateStatus {
                                status: "ready".into(),
                                progress: Some(100.0),
                                error: None,
                                timestamp,
                                formatted_time,
                            },
                        )
                        .unwrap();
                    },
                )
                .await
            {
                Ok(_) => Ok(()),
                Err(e) => {
                    let error_msg = format!("Failed to download update: {}", e);
                    log::error!("{error_msg}");

                    app.emit(
                        "app-updater",
                        UpdateStatus {
                            status: "error".into(),
                            progress: None,
                            error: Some(error_msg),
                            timestamp,
                            formatted_time: formatted_time.clone(),
                        },
                    )
                    .unwrap();

                    Ok(())
                }
            }
        }
        Ok(None) => {
            log::info!("No updates available");
            app.emit(
                "app-updater",
                UpdateStatus {
                    status: "up-to-date".into(),
                    progress: None,
                    error: None,
                    timestamp,
                    formatted_time: formatted_time.clone(),
                },
            )
            .unwrap();
            Ok(())
        }
        Err(e) => {
            let error_msg = format!("Failed to check for updates: {}", e);
            log::error!("{error_msg}");
            app.emit(
                "app-updater",
                UpdateStatus {
                    status: "error".into(),
                    progress: None,
                    error: Some(error_msg),
                    timestamp,
                    formatted_time: formatted_time.clone(),
                },
            )
            .unwrap();
            Ok(())
        }
    }
}
