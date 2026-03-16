//! Database connection management
//!
//! Handles database connection initialization and management.

use crate::database::kvstore::KVItem;
use crate::state::AppState;
use heed3::types::{SerdeBincode, Str};
use heed3::{Database, EnvOpenOptions};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use tauri::AppHandle;
use tauri::Manager;

/// Get database directory path based on environment
///
/// # Arguments
/// * `app` - The Tauri application handle
///
/// # Returns
/// * `Result<PathBuf, Box<dyn std::error::Error + Send + Sync>>` - The database directory path or an error
pub fn get_kv_database_path<R: tauri::Runtime>(
    app: &AppHandle<R>,
) -> Result<PathBuf, Box<dyn std::error::Error + Send + Sync>> {
    // Get application config directory
    let data_dir = app.path().app_config_dir()?;
    std::fs::create_dir_all(&data_dir)?;

    // Get app name and convert to kebab-case if needed
    let app_name = app
        .config()
        .product_name
        .clone()
        .unwrap_or_else(|| "lmdb".to_string())
        .replace(" ", "-")
        .to_lowercase();

    // Directory name for storing database, separated based on environment
    let suffix = if cfg!(debug_assertions) { "-debug" } else { "" };
    let dir_name = format!("{}{}-db", app_name, suffix);

    // Setup database directory path
    let db_path = data_dir.join(dir_name);
    std::fs::create_dir_all(&db_path)?;

    Ok(db_path)
}

/// Setup database connection and initialize databases
///
/// # Arguments
/// * `state` - The application state
/// * `db_path` - The database directory path
///
/// # Returns
/// * `Result<(), Box<dyn std::error::Error + Send + Sync>>` - Success or error
pub async fn setup_kv_database(
    state: Arc<Mutex<AppState>>,
    db_path: PathBuf,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    // Setup the database for the app with the specified path
    let db_path_str = db_path.to_str().ok_or("Invalid database path")?;
    log::debug!("Using database at: {}", db_path_str);

    // Open the environment with a 10MB map size
    // Using unsafe here because Heed's EnvOpenOptions::open requires it as it:
    // 1. Interacts with LMDB's C API which can't be verified by Rust's safety guarantees
    // 2. Performs memory mapping operations that could lead to undefined behavior if misused
    // 3. Manages shared memory that might be accessed by multiple processes
    // The operation is safe as long as the database path is valid and we don't exceed system limits
    let kv_env = unsafe {
        EnvOpenOptions::new()
            // Increase map size to accommodate future growth
            // 50MB is a good balance for configuration data without excessive allocation
            .map_size(50 * 1024 * 1024) // 50MB
            // Increase max_readers for better concurrency in read operations
            // Desktop apps often have multiple components reading configuration simultaneously
            .max_readers(32)
            // Increase max_dbs to allow for future database organization
            // This allows separating different types of configuration into logical groups
            .max_dbs(10)
            // Add flags for better durability vs performance balance
            // NoSync improves performance but reduces durability guarantees
            // Only use if data loss during power failure is acceptable
            //.flags(heed3::EnvFlags::NO_SYNC)
            // Open the database at the specified path
            .open(db_path)?
    };

    // Create a write transaction to initialize databases
    let mut wtxn = kv_env.write_txn()?;

    // Create the KV store database
    let kv_db: Database<Str, SerdeBincode<KVItem>> = kv_env.create_database(&mut wtxn, Some("kvstore"))?;

    // Commit the transaction
    wtxn.commit()?;

    log::info!("LMDB environment and databases initialized");

    // Update state with newly created database connection
    {
        let mut state_guard = state.lock().unwrap();
        state_guard.kv_env = Some(kv_env);
        state_guard.kv_db = Some(kv_db);
    }

    Ok(())
}
