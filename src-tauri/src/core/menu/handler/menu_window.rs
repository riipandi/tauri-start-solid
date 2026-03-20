use crate::core;
use tauri::{AppHandle, Manager, Runtime};

/// Handle force reload menu item
pub fn handle_menu_force_reload<R: Runtime>(app_handle: &AppHandle<R>) {
    // // Try to get the focused window first
    // if let Some(focused_window) = app_handle.get_focused_window() {
    //     let window_label = focused_window.label().to_string();

    //     // Get the webview window for the focused window
    //     if let Some(webview_window) = app_handle.get_webview_window(&window_label) {
    //         if let Ok(current_url) = webview_window.url() {
    //             log::debug!("Force reloading active window: {}", current_url.as_str());
    //             let _ = webview_window.navigate(current_url).map_err(|e| e.to_string());
    //             return;
    //         }
    //     }
    // }

    // // Fallback to main window if no window is focused
    // if let Some(win_main) = app_handle.get_webview_window(core::MAIN_WINDOW_ID) {
    //     if let Ok(current_url) = win_main.url() {
    //         log::debug!("Force reloading main window (fallback): {}", current_url.as_str());
    //         let _ = win_main.navigate(current_url).map_err(|e| e.to_string());
    //     }
    // }

    let win_main = app_handle
        .get_webview_window(core::MAIN_WINDOW_ID)
        .expect("Failed to get main window");

    // Force reloads the window by navigating to its current URL
    let current_url = win_main.url().expect("Failed to get current URL");
    log::debug!("Force reloading page: {}", current_url.as_str());
    let _ = win_main.navigate(current_url).map_err(|e| e.to_string());
}
