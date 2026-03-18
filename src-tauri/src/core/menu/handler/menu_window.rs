use tauri::{AppHandle, Manager, Runtime};

use crate::core;

/// Handle force reload menu item
pub fn handle_menu_force_reload<R: Runtime>(app_handle: &AppHandle<R>) {
    let win_main = app_handle
        .get_webview_window(core::MAIN_WINDOW_ID)
        .expect("Failed to get main window");

    // Force reloads the window by navigating to its current URL
    let current_url = win_main.url().expect("Failed to get current URL");
    log::debug!("Force reloading page: {}", current_url.as_str());
    let _ = win_main.navigate(current_url).map_err(|e| e.to_string());
}
