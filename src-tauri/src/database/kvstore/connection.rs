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
/// * `Result<PathBuf, Box<dyn std::error::Error + Send + Sync>>` - The database file path or an error
///
/// # Note
/// Database is stored in $APPDATA directory (platform-specific app data folder):
/// - Windows: %APPDATA%\{app-name}\
/// - macOS: ~/Library/Application Support/{app-name}/
/// - Linux: ~/.local/share/{app-name}/
pub fn get_kv_database_path<R: tauri::Runtime>(
    app: &AppHandle<R>,
) -> Result<PathBuf, Box<dyn std::error::Error + Send + Sync>> {
    // Get APPDATA directory (platform-specific app data folder)
    let data_dir = app.path().app_data_dir()?;

    // Create directory if it doesn't exist
    std::fs::create_dir_all(&data_dir).map_err(|e| format!("Failed to create app data directory: {}", e))?;

    // Get app name and convert to kebab-case if needed
    let app_name = app
        .config()
        .product_name
        .clone()
        .unwrap_or_else(|| "app".to_string())
        .replace(" ", "-")
        .to_lowercase();

    // Environment suffix for debug builds
    let suffix = if cfg!(debug_assertions) { "-debug" } else { "" };

    // Database file path (LMDB database file, not directory)
    let db_path = data_dir.join(format!("{}{}.mdb", app_name, suffix));

    log::debug!("Using database at: {}", db_path.display());

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
    log::debug!("Database file path: {}", db_path_str);

    // LMDB requires a DIRECTORY path, not a file path
    // Extract the parent directory from the database file path
    let db_dir = db_path.parent().ok_or("Invalid database path (no parent directory)")?;
    let db_dir_str = db_dir.to_str().ok_or("Invalid database directory path")?;
    log::debug!("Opening LMDB environment at directory: {}", db_dir_str);

    // CRITICAL: Ensure database directory exists before LMDB open()
    std::fs::create_dir_all(db_dir).map_err(|e| format!("Failed to create database directory: {}", e))?;
    log::debug!("Ensured database directory exists: {}", db_dir.display());

    // Open the environment with a 50MB map size
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
            // Open the LMDB environment at the specified DIRECTORY (not file!)
            .open(db_dir)?
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
