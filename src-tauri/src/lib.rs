mod commands;
mod core;
mod hooks;
mod state;
mod utils;

use tauri::{Manager, RunEvent};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

/// Run the application
///
/// This is the main entry point for the application.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Create application state
    let app_state = state::create_app_state();

    // Create update manager
    let update_manager = core::updater::UpdateManager::new();

    let mut builder = tauri::Builder::default();
    let tauri_ctx = tauri::generate_context!();

    // Register Tauri plugins
    builder = builder
        .plugin(core::setup_plugin_log().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init());

    #[cfg(desktop)]
    {
        // By default, when you initiate a new instance while the application is
        // already running, no action is taken. To focus the window of the running
        // instance when user tries to open a new instance, alter the callback closure.
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            let _ = app
                .get_webview_window(core::MAIN_WINDOW_ID)
                .expect("no main window")
                .set_focus();
        }));

        // Plugin positioner requred by tray menu
        builder = builder.plugin(tauri_plugin_positioner::init());

        // Save window positions and sizes and restore them when the app is reopened.
        builder = builder.plugin(
            tauri_plugin_window_state::Builder::default()
                .with_filter(|label| label == core::MAIN_WINDOW_ID)
                .build(),
        );
    }

    // Setup application hooks to load database and other resources
    builder = builder
        .manage(app_state.clone())
        .manage(update_manager)
        .setup(hooks::setup_app);

    // Handle the window events
    builder = builder.on_window_event(|window, event| {
        if let tauri::WindowEvent::CloseRequested { api, .. } = event {
            // Prevent the app from exiting unless the user explicitly closes it
            if window.label() == core::MAIN_WINDOW_ID {
                log::debug!("Showing confirmation dialog before closing");
                api.prevent_close();

                // Show confirmation dialog
                let app_handle = window.app_handle().clone();
                app_handle
                    .dialog()
                    .message("Do you want to terminate and close current session?")
                    .kind(MessageDialogKind::Warning)
                    .title("Confirmation")
                    .buttons(MessageDialogButtons::YesNo)
                    .show(move |result| {
                        if result {
                            // User confirmed, exit the application completely
                            log::info!("Exiting application");
                            std::process::exit(0);
                        } else {
                            // User canceled, do nothing
                            log::debug!("User canceled closing the application");
                        }
                    });
            }
        }
    });

    // Finally, build and run the application
    builder
        .invoke_handler(tauri::generate_handler![
            commands::settings::get_settings,
            commands::settings::open_settings_window,
            commands::settings::reset_settings,
            commands::settings::update_settings,
            commands::updater::check_for_updates,
            commands::updater::download_update,
            commands::updater::install_update,
            commands::updater::get_update_state,
        ])
        .build(tauri_ctx)
        .expect("error while running tauri application")
        .run(|_, event| {
            if let RunEvent::ExitRequested { api, .. } = event {
                api.prevent_exit();
            }
        });
}
