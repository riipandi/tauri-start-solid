mod cmd;
mod config;
mod menu;
mod store;
mod theme;
mod tray;
mod utils;
mod window;

use tauri::RunEvent;

use cmd::example::greet;
use config::setup_config_store;
use menu::setup_menu;
use theme::{get_theme, set_theme};
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

        #[cfg(target_os = "windows")]
        {
            use config::{AppConfig, CONFIG_KEY};
            use std::sync::Mutex;
            use store::KVStore;

            let state = app.state::<Mutex<KVStore<String, AppConfig>>>();
            if let Ok(store) = state.lock() {
                if let Ok(Some(config)) = store.get(&CONFIG_KEY.to_string()) {
                    let theme = config.theme;
                    for window in &mut app.webview_windows() {
                        match theme {
                            theme::Theme::System => window.theme = None,
                            theme::Theme::Light => window.theme = Some(tauri::Theme::Light),
                            theme::Theme::Dark => window.theme = Some(tauri::Theme::Dark),
                        }
                    }
                }
            }
        }

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
        .invoke_handler(tauri::generate_handler![get_theme, set_theme, greet])
        .build(tauri_ctx)
        .expect("error while building tauri application")
        .run(|app_handle, event| match event {
            RunEvent::Ready { .. } => {
                if let Ok(theme) = get_theme(app_handle.clone()) {
                    if let Err(err) = set_theme(app_handle.clone(), theme) {
                        eprintln!("Failed to set theme: {}", err);
                    }
                }
            }

            // Prevent the app from exiting unless the user explicitly closes it
            RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        });
}
