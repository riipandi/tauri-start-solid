pub const MAIN_WINDOW: &'static str = "main";
pub const MAIN_WINDOW_WIDTH: f64 = 760.;
pub const MAIN_WINDOW_HEIGHT: f64 = 550.;

pub const SETTING_WINDOW: &'static str = "settings";
pub const SETTING_WINDOW_WIDTH: f64 = 640.;
pub const SETTING_WINDOW_HEIGHT: f64 = 550.;

pub const LOG_FILENAME: &'static str = if cfg!(debug_assertions) {
    "tauri_tray_app-debug"
} else {
    "tauri_tray_app"
};

pub const DB_FILENAME: &'static str = if cfg!(debug_assertions) {
    "tauri_tray_app-debug.db"
} else {
    "tauri_tray_app.db"
};

// Informational metadata for the application
pub const WEBSITE_URL: &'static str = "https://github.com/riipandi/tauri-tray-app";
pub const FEEDBACK_URL: &'static str = "https://github.com/riipandi/tauri-tray-app/issues";

// Disable webview native context menu, injected when webview loaded.
pub const JS_INIT_SCRIPT: &'static str = if cfg!(debug_assertions) {
    ""
} else {
    r#"(function() { document.addEventListener("contextmenu", (e) => { e.preventDefault(); return false; }, { capture: true }); })();"#
};
