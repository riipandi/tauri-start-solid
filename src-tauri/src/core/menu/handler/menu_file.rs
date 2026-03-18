use tauri::{AppHandle, Emitter, Manager, Runtime};

use crate::core;

/// Handle create new file menu item
pub fn handle_menu_new_file<R: Runtime>(app_handle: &AppHandle<R>) {
    log::debug!("Creating new file");
    // Emit an event to the frontend to create a new file
    let _ = app_handle.emit("menu:new-file", ());
}

/// Handle create new project menu item
pub fn handle_menu_new_project<R: Runtime>(app_handle: &AppHandle<R>) {
    log::debug!("Creating new project");
    // Emit an event to the frontend to create a new project
    let _ = app_handle.emit("menu:new-project", ());
}

/// Handle close window menu item
pub fn handle_menu_close_tab<R: Runtime>(app_handle: &AppHandle<R>) {
    // // UNSTABLE: Prevent closing the main window via menu or shortcut
    // if let Some(window) = app_handle.get_focused_window() {
    //     if window.label() != core::MAIN_WINDOW_ID {
    //         let _ = window.close();
    //     }
    // }

    // This is current workaround to prevent closing the main window via menu or shortcut.
    // In the future, we should use the `get_focused_window` method to get the focused window.
    // Try to close any active window except the main window.
    for (label, window) in app_handle.webview_windows() {
        // Check if the window is focused and not the main window
        if label != core::MAIN_WINDOW_ID && window.is_focused().unwrap_or(false) {
            log::debug!("Closing application window: {}", label);
            let _ = window.close();
            break;
        }
    }
}
