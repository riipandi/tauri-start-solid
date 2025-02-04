mod cmd;
mod config;
mod menu;
mod store;
mod tray;
mod utils;
mod window;

use cmd::example::greet;
use config::setup_config_store;
use menu::setup_menu;
use tray::setup_tray;
use window::create_main_window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    let tauri_ctx = tauri::generate_context!();

    // Register Tauri plugins
    let builder = builder
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_updater::Builder::new().build());

    // Setup the application properties
    let builder = builder.setup(|app| {
        setup_config_store(app)?;
        create_main_window(app)?;
        setup_tray(app)?;
        setup_menu(app)?;

        // Check for updates automatically
        let handle = app.handle().clone();
        tauri::async_runtime::spawn(async move {
            match utils::update(handle).await {
                Ok(_) => println!("Automatic update check completed successfully"),
                Err(e) => println!("Automatic update check failed: {}", e),
            }
        });

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
