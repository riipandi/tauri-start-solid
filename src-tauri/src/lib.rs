mod cmd;
mod tray;

use cmd::example::greet;
use tauri::Manager;
use tray::setup_tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    let tauri_ctx = tauri::generate_context!();

    // Register Tauri plugins
    let builder = builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init());

    // Setup tray icon on desktop
    let builder = builder.setup(|app| {
        // Setup main window
        if let Some(main_window) = app.get_webview_window("main") {
            main_window.show().unwrap();
        }

        // Setup tray icon
        setup_tray(app)?;
        Ok(())
    });

    // Finally, build and run the application
    builder
        .invoke_handler(tauri::generate_handler![greet])
        .build(tauri_ctx)
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            // RunEvent::ExitRequested { api, .. } => {
            //     api.prevent_exit();
            // }
            _ => {}
        });
}
