//! Application hooks and lifecycle management
//!
//! This module contains hooks that are executed during the application lifecycle.

use crate::core;

use tauri::App;

/// Setup the application
///
/// This function is called during the application initialization process.
/// It sets up configurations and initializes the main window.
pub fn setup_app<R: tauri::Runtime>(app: &mut App<R>) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(desktop)]
    {
        // Register the updater plugin with the app
        let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
    }

    // Setup the customized main window
    match core::setup_main_window(app) {
        Ok(_) => {
            // Setup menu after window is created
            if let Err(e) = core::menu::setup_menu(app) {
                log::error!("Error setting up menu: {}", e);
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
