use tauri::{AppHandle, Emitter, Runtime};

/// Handle command palette menu item
pub fn handle_menu_command_palette<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle.emit("menu:command-palette", ());
}

/// Handle toggle left panel menu item
pub fn handle_menu_toggle_panel_left<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle.emit("menu:toggle-panel-left", ());
}

/// Handle toggle right panel menu item
pub fn handle_menu_toggle_panel_right<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle.emit("menu:toggle-panel-right", ());
}

/// Handle toggle bottom panel menu item
pub fn handle_menu_toggle_panel_bottom<R: Runtime>(app_handle: &AppHandle<R>) {
    let _ = app_handle.emit("menu:toggle-panel-bottom", ());
}
