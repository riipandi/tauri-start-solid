/**
 * When declaring arguments in Rust using snake_case, the arguments are converted to camelCase for JavaScript.
 * To use snake_case in JavaScript, you have to declare it in the tauri::command statement
 * @ref: https://tauri.app/v1/guides/features/command/#passing-arguments
 * @ref: https://github.com/tauri-apps/tauri/discussions/7737#discussioncomment-6912654
 */
use tauri::{AppHandle, Manager, WebviewWindow};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

use crate::{core::utils, meta};

#[tauri::command(rename_all = "snake_case")]
pub fn toggle_devtools(window: WebviewWindow) {
    if !window.is_devtools_open() {
        window.open_devtools()
    } else if window.is_devtools_open() {
        window.close_devtools()
    }
}

#[tauri::command(rename_all = "snake_case")]
pub fn open_settings_window(handle: AppHandle) {
    utils::handle_settings_window(&handle)
}

#[tauri::command(rename_all = "snake_case", async)]
pub async fn open_log_file(handle: AppHandle) {
    let log_file_path = handle
        .path()
        .resolve(meta::LOG_FILENAME, tauri::path::BaseDirectory::AppLog)
        .expect("failed to get log file path");

    let log_file_str = format!("{}.log", log_file_path.display());

    if !log_file_str.ends_with(".log") || !std::path::Path::new(&log_file_str).exists() {
        log::warn!("Log file not found: {}", log_file_str);
        handle
            .dialog()
            .message(format!("Log file not found: {}", log_file_str))
            .kind(MessageDialogKind::Error)
            .title("Cannot Open Log File")
            .blocking_show();
        return;
    }

    open_with_shell(&log_file_str);
}

#[tauri::command(rename_all = "snake_case", async)]
pub async fn open_log_directory(handle: AppHandle) {
    let log_file_path = handle
        .path()
        .resolve("", tauri::path::BaseDirectory::AppLog)
        .expect("failed to get log file path");

    let log_path_str = log_file_path.display().to_string();

    if !log_file_path.exists() {
        log::warn!("Log directory not found: {log_path_str}");
        let _ = handle
            .dialog()
            .message(format!("Directory {} not found!", log_path_str))
            .kind(MessageDialogKind::Error)
            .title("Cannot Open Log Directory")
            .blocking_show();
        return;
    }

    open_with_shell(log_path_str.as_str());
}

#[tauri::command(rename_all = "snake_case", async)]
pub async fn open_data_directory(handle: AppHandle) {
    let log_file_path = handle
        .path()
        .resolve("", tauri::path::BaseDirectory::AppData)
        .expect("failed to get log file path");

    let log_path_str = log_file_path.display().to_string();

    if !log_file_path.exists() {
        log::warn!("Log directory not found: {log_path_str}");
        let _ = handle
            .dialog()
            .message(format!("Directory {} not found!", log_path_str))
            .kind(MessageDialogKind::Error)
            .title("Cannot Open Log Directory")
            .blocking_show();
        return;
    }

    open_with_shell(log_path_str.as_str());
}

#[tauri::command(rename_all = "snake_case")]
pub fn open_with_shell(url: &str) {
    #[cfg(target_os = "linux")]
    {
        let _ = std::process::Command::new("xdg-open")
            .arg(url)
            .spawn()
            .expect("failed to open browser");
    }

    #[cfg(target_os = "windows")]
    {
        let _ = std::process::Command::new("cmd")
            .arg("/C")
            .arg("start")
            .arg(url)
            .spawn()
            .expect("failed to open browser");
    }

    #[cfg(target_os = "macos")]
    {
        let _ = std::process::Command::new("open")
            .arg(url)
            .spawn()
            .expect("failed to open browser");
    }
}
