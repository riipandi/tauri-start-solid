mod script;
mod types;

use crate::store::KVStore;
use std::sync::Mutex;
use tauri::Manager;

pub use self::script::*;
pub use types::*;

/// Key used to store app configuration in KVStore
pub const CONFIG_KEY: &str = "app_config";

/// Sets up the configuration store for the application
///
/// # Arguments
/// * `app` - Reference to the Tauri application instance
///
/// # Returns
/// * `Result` indicating success or failure of store setup
pub fn setup_config_store<R: tauri::Runtime>(app: &tauri::App<R>) -> Result<(), Box<dyn std::error::Error>> {
    // Get application config directory
    let data_dir = app.path().app_config_dir().unwrap();
    std::fs::create_dir_all(&data_dir)?;

    // File name for storing application configuration, separated based on environment
    let file_name = format!("localstore{}.prs", if cfg!(debug_assertions) { "-debug" } else { "" });

    // Setup store file path
    let store_path = data_dir.join(file_name);
    let store_file = store_path.as_path();

    // Initialize configuration store
    let config_store: KVStore<String, AppConfig> = KVStore::new(store_file.to_str().unwrap())?;

    // Load existing config or create default
    if let Ok(Some(current_config)) = config_store.get(&CONFIG_KEY.to_string()) {
        log::debug!("Current config: {:?}", current_config);
    } else {
        log::debug!("Creating default config");
        config_store.insert(CONFIG_KEY.to_string(), &AppConfig::default())?;
    }

    // Debug logging in development mode
    #[cfg(debug_assertions)]
    {
        log::debug!("Store size: {} entries", config_store.size()?);
        log::debug!("Store keys: {:?}", config_store.keys()?);
        log::debug!("Store values: {:?}", config_store.values()?);
        log::debug!("Store pairs: {:?}", config_store.pairs()?);
    }

    // Register store in Tauri state management. We cannot directly mutate values
    // which are shared between multiple threads or when ownership is controlled
    // through a shared pointer.
    app.manage(Mutex::new(config_store));

    Ok(())
}
