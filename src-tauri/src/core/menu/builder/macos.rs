//! macOS specific menu items and configurations
//! Contains menu items that are only relevant for macOS

use crate::core::menu::types::{MenuItem, PredefinedType};

/// Get the macOS App menu items
pub fn get_app_menu_items() -> Vec<MenuItem> {
    vec![
        MenuItem::new("about", "About").with_enabled(true),
        MenuItem::separator(),
        MenuItem::new("check_update", "Check for Updates..."),
        MenuItem::separator(),
        MenuItem::new("settings", "Settings...").with_accelerator("CmdOrCtrl+,"),
        MenuItem::separator(),
        MenuItem::predefined(PredefinedType::Hide, None),
        MenuItem::predefined(PredefinedType::HideOthers, None),
        MenuItem::predefined(PredefinedType::ShowAll, None),
        MenuItem::separator(),
        MenuItem::predefined(PredefinedType::Quit, None),
    ]
}

/// Get the File menu for macOS
pub fn get_file_menu() -> MenuItem {
    MenuItem::submenu(
        "File",
        vec![
            // Add nested submenu for "New"
            super::common::get_new_submenu(),
            MenuItem::separator(),
            MenuItem::new("open_file", "Open...").with_accelerator("CmdOrCtrl+O"),
            MenuItem::new("open_workspace", "Open Workspace").with_accelerator("CmdOrCtrl+Alt+O"),
            MenuItem::separator(),
            MenuItem::new("save", "Save").with_accelerator("CmdOrCtrl+S"),
            MenuItem::new("save_as", "Save As...").with_accelerator("CmdOrCtrl+Shift+S"),
            MenuItem::new("save_all", "Save All").with_accelerator("CmdOrCtrl+Shift+A"),
            MenuItem::separator(),
            MenuItem::new("close_tab", "Close Tab").with_accelerator("CmdOrCtrl+W"),
            MenuItem::new("close_all_tabs", "Close All Tabs").with_accelerator("CmdOrCtrl+Shift+W"),
        ],
    )
}
