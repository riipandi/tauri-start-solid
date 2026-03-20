use tauri::{AppHandle, Manager, Runtime};

use crate::core;

/// Handle open menu item - show and focus the main window
pub fn handle_menu_open<R: Runtime>(app_handle: &AppHandle<R>) {
    if let Some(window) = app_handle.get_webview_window(core::MAIN_WINDOW_ID) {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

/// Handle about menu item - show and focus the about window
pub fn handle_menu_about<R: Runtime>(app_handle: &AppHandle<R>) {
    if let Some(window) = app_handle.get_webview_window("about") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

/// Handle quit menu item - exit the application
pub fn handle_menu_quit<R: Runtime>(app_handle: &AppHandle<R>) {
    app_handle.exit(0);
}
