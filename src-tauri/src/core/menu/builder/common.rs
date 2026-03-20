//! Common menu building functions and menu definitions
//! Contains shared menu structures and utility functions for building menus

use crate::core::menu::types::{MenuItem, PredefinedType};
use tauri::Runtime;
use tauri::menu::PredefinedMenuItem;

/// Get all common menus (File, Edit, View, Window, Help)
pub fn get_common_menus() -> Vec<MenuItem> {
    let mut menus = Vec::new();

    // File menu - platform specific
    #[cfg(target_os = "macos")]
    menus.push(super::macos::get_file_menu());

    #[cfg(not(target_os = "macos"))]
    menus.push(get_file_menu_default());

    // Add other common menus
    menus.push(get_edit_menu());
    menus.push(get_view_menu());
    menus.push(get_window_menu());
    menus.push(get_help_menu());

    menus
}

/// Get the "New" submenu that's shared across platforms
pub fn get_new_submenu() -> MenuItem {
    MenuItem::submenu(
        "New",
        vec![
            MenuItem::new("new_file", "Create New File").with_accelerator("CmdOrCtrl+N"),
            MenuItem::new("new_project", "Create New Project").with_accelerator("CmdOrCtrl+Shift+N"),
        ],
    )
    .with_id("file_new_submenu")
}

/// Get the File menu for non-macOS platforms
#[cfg(not(target_os = "macos"))]
pub fn get_file_menu_default() -> MenuItem {
    MenuItem::submenu(
        "File",
        vec![
            // Add nested submenu for "New"
            get_new_submenu(),
            MenuItem::separator(),
            MenuItem::new("settings", "Settings...").with_accelerator("CmdOrCtrl+,"),
            MenuItem::separator(),
            MenuItem::new("check_update", "Check for Updates..."),
            MenuItem::separator(),
            MenuItem::new("close_tab", "Close Tab").with_accelerator("CmdOrCtrl+W"),
            MenuItem::new("close_all_tabs", "Close All Tabs").with_accelerator("CmdOrCtrl+Shift+W"),
            MenuItem::separator(),
            MenuItem::predefined(PredefinedType::Quit, None),
        ],
    )
}

/// Get the Edit menu
pub fn get_edit_menu() -> MenuItem {
    MenuItem::submenu(
        "Edit",
        vec![
            MenuItem::predefined(PredefinedType::Undo, None),
            MenuItem::predefined(PredefinedType::Redo, None),
            MenuItem::separator(),
            MenuItem::predefined(PredefinedType::Cut, None),
            MenuItem::predefined(PredefinedType::Copy, None),
            MenuItem::predefined(PredefinedType::Paste, None),
            MenuItem::predefined(PredefinedType::SelectAll, None),
        ],
    )
}

/// Get the View menu
pub fn get_view_menu() -> MenuItem {
    MenuItem::submenu(
        "View",
        vec![
            MenuItem::new("command_palette", "Command Palette").with_accelerator("CmdOrCtrl+Shift+P"),
            MenuItem::separator(),
            MenuItem::new("toggle_panel_left", "Toggle Left Panel").with_accelerator("CmdOrCtrl+Shift+K"),
            MenuItem::new("toggle_panel_right", "Toggle Right Panel").with_accelerator("CmdOrCtrl+Shift+L"),
            MenuItem::new("toggle_panel_bottom", "Toggle Bottom Panel").with_accelerator("CmdOrCtrl+Shift+J"),
        ],
    )
}

/// Get the Window menu
pub fn get_window_menu() -> MenuItem {
    MenuItem::submenu(
        "Window",
        vec![
            MenuItem::predefined(PredefinedType::Fullscreen, None),
            MenuItem::predefined(PredefinedType::Minimize, None),
            MenuItem::separator(),
            MenuItem::new("force_reload", "Force Reload").with_accelerator("CmdOrCtrl+Shift+R"),
        ],
    )
}

/// Get the Help menu
pub fn get_help_menu() -> MenuItem {
    MenuItem::submenu(
        "Help",
        vec![
            MenuItem::new("documentation", "Documentation"),
            MenuItem::new("send_feedback", "Send Feedback"),
            MenuItem::separator(),
            MenuItem::new("open_data_dir", "Open Data Directory"),
            MenuItem::new("open_log_file", "Open Application Log"),
            MenuItem::separator(),
            MenuItem::new("open_devtool", "Toggle Developer Tools").with_accelerator("CmdOrCtrl+Alt+I"),
            MenuItem::separator(),
            MenuItem::new("open_kv_explorer", "Open Key-Value Explorer").with_accelerator("CmdOrCtrl+Alt+K"),
        ],
    )
}

/// Create a predefined menu item based on its type
pub fn create_predefined_menu_item<R: Runtime>(
    app: &tauri::App<R>,
    predefined_type: &PredefinedType,
) -> tauri::Result<PredefinedMenuItem<R>> {
    match predefined_type {
        PredefinedType::Undo => PredefinedMenuItem::undo(app, None),
        PredefinedType::Redo => PredefinedMenuItem::redo(app, None),
        PredefinedType::Cut => PredefinedMenuItem::cut(app, None),
        PredefinedType::Copy => PredefinedMenuItem::copy(app, None),
        PredefinedType::Paste => PredefinedMenuItem::paste(app, None),
        PredefinedType::SelectAll => PredefinedMenuItem::select_all(app, None),
        PredefinedType::Quit => PredefinedMenuItem::quit(app, None),
        PredefinedType::Hide => PredefinedMenuItem::hide(app, None),
        PredefinedType::HideOthers => PredefinedMenuItem::hide_others(app, None),
        PredefinedType::ShowAll => PredefinedMenuItem::show_all(app, None),
        PredefinedType::Minimize => PredefinedMenuItem::minimize(app, None),
        PredefinedType::Fullscreen => PredefinedMenuItem::fullscreen(app, None),
    }
}
