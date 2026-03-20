//! Application hooks and lifecycle management
//!
//! This module contains hooks that are executed during the application lifecycle.

use crate::core;
use tauri::{App, Manager};

/// Setup the application
///
/// This function is called during the application initialization process.
/// It sets up configurations and initializes the main window.
pub fn setup_app<R: tauri::Runtime>(app: &mut App<R>) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(desktop)]
    {
        // Register the updater plugin with the app
        let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());

        // Start the update scheduler
        let manager = app.state::<core::updater::UpdateManager>().inner().clone();
        let handle = app.handle().clone();

        // Spawn the update scheduler in the background
        // Using Tauri's async_runtime instead of std::thread for better integration
        tauri::async_runtime::spawn(async move {
            core::updater::start_update_scheduler(handle, manager).await;
        });
    }

    // Setup the customized main window
    match core::create_main_window(app) {
        Ok(_) => {
            // Setup menu after window is created
            if let Err(e) = core::menu::setup_menu(app) {
                log::error!("Error setting up menu: {}", e);
                return Err(Box::<dyn std::error::Error>::from(format!("{}", e)));
            }

            // Setup tray menu (must be done after the state is initialized)
            if let Err(e) = core::tray::setup_tray_menu(app) {
                log::error!("Error setting up tray menu: {}", e);
                return Err(Box::<dyn std::error::Error>::from(format!("{}", e)));
            }

            Ok(())
        }
        Err(e) => {
            log::error!("Error setting up window: {}", e);
            Err(Box::<dyn std::error::Error>::from(format!("{}", e)))
        }
    }
}
