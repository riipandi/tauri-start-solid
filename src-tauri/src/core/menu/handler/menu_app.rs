// use std::sync::{Arc, Mutex};
// use tauri::async_runtime;
use tauri::{AppHandle, Manager, Runtime};

use crate::core;
// use crate::core::updater;
// use crate::state::AppState;

/// Handle settings menu item
pub fn handle_menu_settings<R: Runtime>(app_handle: &AppHandle<R>) {
    // Check if settings window exists
    if let Some(window) = app_handle.get_webview_window(core::SETTINGS_WINDOW_ID) {
        // If it exists, show it and bring it to focus
        let _ = window.show().and_then(|_| window.set_focus());
    } else {
        // If it doesn't exist, create a new one using our dedicated function
        match core::create_settings_window(app_handle) {
            Ok(_) => {}
            Err(e) => log::error!("Failed to create settings window: {}", e),
        }
    }
}

// /// Handle check for updates menu item
// pub fn handle_menu_check_update<R: Runtime>(app_handle: &AppHandle<R>) {
//     // Clone app_handle to use in async task
//     let app_handle_clone = app_handle.clone();

//     async_runtime::spawn(async move {
//         log::debug!("Checking for updates from menu");

//         // Get the application state - clone it to extend its lifetime
//         let state = app_handle_clone.state::<Arc<Mutex<AppState>>>().inner().clone();

//         // Get the saved update channel or use default (stable)
//         let update_channel = match updater::load_update_channel(&state).await {
//             Ok(channel) => channel,
//             Err(e) => {
//                 log::warn!("Failed to load update channel, using default: {}", e);
//                 updater::UpdateChannel::default()
//             }
//         };

//         // Check for updates with force=true to bypass time since last check
//         let force_update = true; // Always force when manually triggered

//         // Check for updates and handle the result with UI interactions
//         let _ = updater::update_check_handler(
//             &app_handle_clone,
//             &state,
//             updater::check_for_updates(&app_handle_clone, &state, update_channel, force_update).await,
//         )
//         .await;
//     });
// }
