//! Application hooks and lifecycle management
//!
//! This module contains hooks that are executed during the application lifecycle.

use crate::commands::settings::init_default_settings;
use crate::core;
use crate::database::kvstore::setup_kv_database;

use std::sync::Arc;
use std::sync::Mutex;
use tauri::{App, Manager};

/// Setup the application
///
/// This function is called during the application initialization process.
/// It sets up the database, initializes configurations, and starts background tasks.
pub fn setup_app<R: tauri::Runtime>(app: &mut App<R>) -> Result<(), Box<dyn std::error::Error>> {
    #[cfg(desktop)]
    {
        // Register the updater plugin with the app
        let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
    }

    // Initialize database connection
    let state = app.state::<Arc<Mutex<crate::state::AppState>>>();
    let state_clone = state.inner().clone();

    let db_path = match crate::database::kvstore::get_kv_database_path(app.handle()) {
        Ok(path) => path,
        Err(e) => {
            let err_msg = format!("Failed to get database path: {}", e);
            log::error!("{}", err_msg);
            return Err(err_msg.into());
        }
    };

    // Run async initialization in blocking context during setup
    tauri::async_runtime::block_on(async move {
        // CRITICAL: Setup database MUST succeed
        match setup_kv_database(state_clone.clone(), db_path.clone()).await {
            Ok(_) => {
                log::info!("Database initialized successfully at: {}", db_path.display());
            }
            Err(e) => {
                let err_msg = format!(
                    "CRITICAL: Failed to initialize database at {}: {}",
                    db_path.display(),
                    e
                );
                log::error!("{}", err_msg);
                panic!("Application cannot start without database: {}", err_msg);
            }
        }

        // CRITICAL: Initialize default settings MUST succeed
        match init_default_settings(&state_clone).await {
            Ok(_) => {}
            Err(e) => {
                let err_msg = format!("CRITICAL: Failed to initialize default settings: {}", e);
                log::error!("{}", err_msg);
                panic!("Application cannot start without settings: {}", err_msg);
            }
        }
    });

    log::info!("Application initialization completed successfully");

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
