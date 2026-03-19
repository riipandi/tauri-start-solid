//! Tauri commands for updater management

use tauri::{AppHandle, ipc::Channel};

use crate::core::updater::{DownloadEvent, UpdateInfo, UpdateManager};

/// Check for updates manually
///
/// This command forces an update check regardless of the last check time
#[tauri::command]
pub async fn check_for_updates(
    app: AppHandle,
    manager: tauri::State<'_, UpdateManager>,
) -> Result<Option<UpdateInfo>, String> {
    manager.check_for_updates(app).await
}

/// Download and install update with progress events
///
/// This command downloads and installs an available update
#[tauri::command]
pub async fn download_update(
    app: AppHandle,
    manager: tauri::State<'_, UpdateManager>,
    on_event: Channel<DownloadEvent>,
) -> Result<(), String> {
    manager
        .download_and_install(app, move |event| {
            let _ = on_event.send(event);
        })
        .await
}

/// Install pending update
///
/// This command installs a previously downloaded update
#[tauri::command]
pub async fn install_update(app: AppHandle, manager: tauri::State<'_, UpdateManager>) -> Result<(), String> {
    manager.install_pending(app).await
}

/// Get current update state
///
/// Returns the current update state including last check time and pending updates
#[tauri::command]
pub async fn get_update_state(
    manager: tauri::State<'_, UpdateManager>,
) -> Result<crate::core::updater::state::UpdateState, String> {
    Ok(manager.get_state())
}
