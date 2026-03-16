//! Application hooks and lifecycle management
//!
//! This module contains hooks that are executed during the application lifecycle.

use crate::core;

use tauri::App;

/// Setup the application
///
/// This function is called during the application initialization process.
/// It sets up the database, initializes configurations, and starts background tasks.
pub fn setup_app<R: tauri::Runtime>(app: &mut App<R>) -> Result<(), Box<dyn std::error::Error>> {
    // TODO: Initialize database connection
    // TODO: Initialize configurations
    // TODO: Initialize font cache in a separate thread to avoid blocking the main thread
    // TODO: Use Tauri's async_runtime to run async database operations

    #[cfg(desktop)]
    {
        // Register the updater plugin with the app
        let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
    }

    // Setup the customized main window
    match core::setup_main_window(app) {
        Ok(_) => {
            // TODO: Setup menu after window is created
            Ok(())
        }
        Err(e) => {
            log::error!("Error setting up window: {}", e);
            Err(Box::<dyn std::error::Error>::from(format!("{}", e)))
        }
    }
}
