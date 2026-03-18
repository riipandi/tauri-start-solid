use tauri::{AppHandle, Manager, Runtime};
use tauri_plugin_opener::OpenerExt;

use crate::core;

/// Handle open developer tools menu item
pub fn handle_menu_open_devtool<R: Runtime>(app_handle: &AppHandle<R>) {
    if let Some(window) = app_handle.get_webview_window(core::MAIN_WINDOW_ID) {
        let _ = window.show().and_then(|_| window.set_focus());
        if window.is_devtools_open() {
            window.close_devtools()
        } else {
            window.open_devtools()
        }
    }
}

/// Handle documentation menu item
pub fn handle_menu_documentation<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle
        .opener()
        .open_url("https://github.com/riipandi/tauri-start-solid", None::<&str>);
}

/// Handle send feedback menu item
pub fn handle_menu_send_feedback<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle
        .opener()
        .open_url("https://github.com/riipandi/tauri-start-solid/issues", None::<&str>);
}

/// Handle open data directory menu item
pub fn handle_menu_open_data_dir<R: Runtime>(app_handle: &AppHandle<R>) {
    if let Ok(app_dir) = app_handle.path().app_data_dir() {
        if let Some(path_str) = app_dir.to_str() {
            let _ = app_handle.opener().open_path(path_str, None::<&str>);
        }
    }
}

/// Handle open log file menu item
pub fn handle_menu_open_log_file<R: Runtime>(app_handle: &AppHandle<R>) {
    if let Ok(log_dir) = app_handle.path().app_log_dir() {
        let app_name = env!("CARGO_PKG_NAME").replace(" ", "-").to_lowercase();
        let suffix = if cfg!(debug_assertions) { "-debug" } else { "" };
        let log_file_name = format!("{}{}", app_name, suffix);
        let log_file_path = log_dir.join(format!("{}.log", log_file_name));

        if let Some(path_str) = log_file_path.to_str() {
            let _ = app_handle.opener().open_path(path_str, None::<&str>);
        } else {
            log::error!("Failed to convert log file path to string");
        }
    } else {
        log::error!("Failed to get app log directory");
    }
}

// /// Handle open key-value explorer menu item
// pub fn handle_menu_open_kv_explorer<R: Runtime>(app_handle: &AppHandle<R>) {
//     // Check if key-value explorer window exists
//     if let Some(window) = app_handle.get_webview_window(core::KV_EXPLORER_WINDOW_ID) {
//         // If it exists, show it and bring it to focus
//         let _ = window.show().and_then(|_| window.set_focus());
//     } else {
//         // If it doesn't exist, create a new one using our dedicated function
//         match core::create_kv_explorer_window(app_handle) {
//             Ok(_) => log::debug!("Key-Value Explorer window created successfully"),
//             Err(e) => log::error!("Failed to create key-value explorer window: {}", e),
//         }
//     }
// }
