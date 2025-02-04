mod types;

use crate::store::KVStore;
use tauri::Manager;
pub use types::*;

/// File name for storing application configuration
const CONFIG_FILE_NAME: &str = "localstore.prs";
/// Key used to store app configuration in KVStore
const CONFIG_KEY: &str = "app_config";

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

    // Setup store file path
    let store_path = data_dir.join(CONFIG_FILE_NAME);
    let store_file = store_path.as_path();

    // Initialize configuration store
    let config_store: KVStore<String, AppConfig> = KVStore::new(store_file.to_str().unwrap())?;

    // Load existing config or create default
    if let Ok(Some(current_config)) = config_store.get(&CONFIG_KEY.to_string()) {
        println!("Current config: {:?}", current_config);
    } else {
        println!("Creating default config");
        config_store.insert(CONFIG_KEY.to_string(), &AppConfig::default())?;
    }

    // Debug logging in development mode
    #[cfg(debug_assertions)]
    {
        println!("Store size: {} entries", config_store.size()?);
        println!("Store keys: {:?}", config_store.keys()?);
        println!("Store values: {:?}", config_store.values()?);
        println!("Store pairs: {:?}", config_store.pairs()?);
    }

    // Register store in Tauri state management
    app.manage(config_store);
    Ok(())
}
