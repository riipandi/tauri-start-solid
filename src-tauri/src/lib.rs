mod commands;
mod core;
mod database;
mod hooks;
mod utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![commands::demo::greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
