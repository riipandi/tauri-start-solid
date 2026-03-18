//! KV Store operations
//!
//! Implements CRUD operations for the key-value store.

use heed3::CompactionOption;
use std::path::Path;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use sysinfo::System;

use crate::database::kvstore::models::{KVItem, Namespace};
use crate::state::AppState;
use crate::utils::time::get_current_timestamp;

/// Set a value in the KV store
///
/// # Arguments
/// * `state` - The application state
/// * `key` - The key to set
/// * `value` - The value to store
/// * `namespace` - Optional namespace for the key
///
/// # Returns
/// * `Result<KVItem, Box<dyn std::error::Error + Send + Sync>>` - The created/updated item or an error
pub async fn set_value(
    state: &Arc<Mutex<AppState>>,
    key: &str,
    value: &str,
    namespace: Option<&str>,
) -> Result<KVItem, Box<dyn std::error::Error + Send + Sync>> {
    // Create namespaced key if namespace is provided
    let actual_key = match namespace {
        Some(ns) => Namespace::create_key(ns, key),
        None => key.to_string(),
    };

    log::debug!("Setting value for key {}: {}", actual_key, value);

    let current_time = get_current_timestamp();
    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a write transaction
    let mut wtxn = kv_env.write_txn()?;

    // Check if the key already exists
    let existing = kv_db.get(&wtxn, &actual_key)?;

    let item = if let Some(existing_item) = existing {
        // Update existing item (preserve created_at, update updated_at)
        KVItem {
            key: actual_key.to_string(),
            value: value.to_string(),
            created_at: existing_item.created_at,
            updated_at: current_time,
        }
    } else {
        log::debug!("Creating new item for key: {}", actual_key);
        // Create new item (set both created_at and updated_at)
        KVItem {
            key: actual_key.to_string(),
            value: value.to_string(),
            created_at: current_time.clone(),
            updated_at: current_time,
        }
    };

    // Put the item in the database
    kv_db.put(&mut wtxn, &actual_key, &item)?;

    // Commit the transaction
    wtxn.commit()?;

    Ok(item)
}

/// Get a value from the KV store
///
/// # Arguments
/// * `state` - The application state
/// * `key` - The key to retrieve
/// * `namespace` - Optional namespace for the key
///
/// # Returns
/// * `Result<Option<KVItem>, Box<dyn std::error::Error + Send + Sync>>` - The item if found or an error
pub async fn get_value(
    state: &Arc<Mutex<AppState>>,
    key: &str,
    namespace: Option<&str>,
) -> Result<Option<KVItem>, Box<dyn std::error::Error + Send + Sync>> {
    // Create namespaced key if namespace is provided
    let actual_key = match namespace {
        Some(ns) => Namespace::create_key(ns, key),
        None => key.to_string(),
    };

    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a read transaction
    let rtxn = kv_env.read_txn()?;

    // Get the item from the database
    let item = kv_db.get(&rtxn, &actual_key)?;

    Ok(item)
}

/// Delete a value from the KV store
///
/// # Arguments
/// * `state` - The application state
/// * `key` - The key to delete
/// * `namespace` - Optional namespace for the key
///
/// # Returns
/// * `Result<bool, Box<dyn std::error::Error + Send + Sync>>` - True if deleted, false if not found
#[allow(dead_code)]
pub async fn delete_value(
    state: &Arc<Mutex<AppState>>,
    key: &str,
    namespace: Option<&str>,
) -> Result<bool, Box<dyn std::error::Error + Send + Sync>> {
    // Create namespaced key if namespace is provided
    let actual_key = match namespace {
        Some(ns) => Namespace::create_key(ns, key),
        None => key.to_string(),
    };

    log::info!("Deleting value for key: {}", actual_key);

    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a write transaction
    let mut wtxn = kv_env.write_txn()?;

    // Check if the key exists
    let exists = kv_db.get(&wtxn, &actual_key)?.is_some();

    if exists {
        // Delete the key
        kv_db.delete(&mut wtxn, &actual_key)?;
        wtxn.commit()?;
        log::info!("Successfully deleted key: {}", actual_key);
        Ok(true)
    } else {
        wtxn.abort();
        log::info!("No item to delete for key: {}", actual_key);
        Ok(false)
    }
}

/// Delete all values from the KV store
///
/// # Arguments
/// * `state` - The application state
///
/// # Returns
/// * `Result<u64, Box<dyn std::error::Error + Send + Sync>>` - Number of items deleted
#[allow(dead_code)]
pub async fn delete_all(state: &Arc<Mutex<AppState>>) -> Result<u64, Box<dyn std::error::Error + Send + Sync>> {
    log::info!("Deleting all values from KV store");

    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a write transaction
    let mut wtxn = kv_env.write_txn()?;

    // Count items before deletion
    let mut count = 0;
    for result in kv_db.iter(&wtxn)? {
        let (_, _) = result?;
        count += 1;
    }

    // Clear the database
    kv_db.clear(&mut wtxn)?;

    // Commit the transaction
    wtxn.commit()?;

    log::info!("Successfully deleted {} items from KV store", count);
    Ok(count)
}

/// List all key-value pairs
///
/// # Arguments
/// * `state` - The application state
///
/// # Returns
/// * `Result<Vec<KVItem>, Box<dyn std::error::Error + Send + Sync>>` - List of all items
#[allow(dead_code)]
pub async fn list_all(state: &Arc<Mutex<AppState>>) -> Result<Vec<KVItem>, Box<dyn std::error::Error + Send + Sync>> {
    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a read transaction
    let rtxn = kv_env.read_txn()?;

    // Collect all items
    let mut items = Vec::new();
    for result in kv_db.iter(&rtxn)? {
        let (_, item) = result?;
        items.push(item);
    }

    log::debug!("Successfully listed {} items from KV store", items.len());

    Ok(items)
}

/// List all key-value pairs in a specific namespace
///
/// # Arguments
/// * `state` - The application state
/// * `namespace` - The namespace to list items from
///
/// # Returns
/// * `Result<Vec<KVItem>, Box<dyn std::error::Error + Send + Sync>>` - List of all items in the namespace
#[allow(dead_code)]
pub async fn list_namespace(
    state: &Arc<Mutex<AppState>>,
    namespace: &str,
) -> Result<Vec<KVItem>, Box<dyn std::error::Error + Send + Sync>> {
    log::info!("Listing all values from namespace: {}", namespace);

    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a read transaction
    let rtxn = kv_env.read_txn()?;

    // Prefix for namespace
    let prefix = format!("{}:", namespace);

    // Collect all items in the namespace
    let mut items = Vec::new();
    for result in kv_db.iter(&rtxn)? {
        let (key_bytes, item) = result?;
        if let Ok(key) = std::str::from_utf8(key_bytes.as_bytes()) {
            if key.starts_with(&prefix) {
                items.push(item);
            }
        }
    }

    log::info!(
        "Successfully listed {} items from namespace: {}",
        items.len(),
        namespace
    );
    Ok(items)
}

/// Delete all values in a specific namespace
///
/// # Arguments
/// * `state` - The application state
/// * `namespace` - The namespace to clear
///
/// # Returns
/// * `Result<u64, Box<dyn std::error::Error + Send + Sync>>` - Number of items deleted
#[allow(dead_code)]
pub async fn delete_namespace(
    state: &Arc<Mutex<AppState>>,
    namespace: &str,
) -> Result<u64, Box<dyn std::error::Error + Send + Sync>> {
    log::info!("Deleting all values from namespace: {}", namespace);

    let state_guard = state.lock().map_err(|e| {
        let err_msg = format!("Failed to lock state: {}", e);
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_env = state_guard.kv_env.as_ref().ok_or_else(|| {
        let err_msg = "Database environment not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    let kv_db = state_guard.kv_db.as_ref().ok_or_else(|| {
        let err_msg = "KV database not initialized";
        log::error!("{}", err_msg);
        err_msg
    })?;

    // Start a write transaction
    let mut wtxn = kv_env.write_txn()?;

    // Prefix for namespace
    let prefix = format!("{}:", namespace);

    // Collect keys to delete
    let mut keys_to_delete = Vec::new();
    for result in kv_db.iter(&wtxn)? {
        let (key_bytes, _) = result?;
        if let Ok(key) = std::str::from_utf8(key_bytes.as_bytes()) {
            if key.starts_with(&prefix) {
                keys_to_delete.push(key.to_string());
            }
        }
    }

    // Delete collected keys
    let count = keys_to_delete.len() as u64;
    for key in keys_to_delete {
        kv_db.delete(&mut wtxn, &key)?;
    }

    // Commit the transaction
    wtxn.commit()?;

    log::info!("Successfully deleted {} items from namespace: {}", count, namespace);
    Ok(count)
}

/// Monitor database usage and log statistics
///
/// # Arguments
/// * `state` - The application state
///
/// # Returns
/// * `Result<(), Box<dyn std::error::Error + Send + Sync>>` - Success or error
#[allow(dead_code)]
pub async fn monitor_database_usage(
    state: &Arc<Mutex<AppState>>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let state_guard = state.lock().map_err(|e| format!("Failed to lock state: {}", e))?;

    let kv_env = state_guard
        .kv_env
        .as_ref()
        .ok_or("Database environment not initialized")?;

    // Get environment info
    let env_info = kv_env.info();

    // Use sysinfo to get system information
    let mut system = System::new_all();
    system.refresh_all();

    // Use default page size (typically 4KB on most systems)
    // We could potentially get this from sysinfo but it doesn't expose page size directly
    const DEFAULT_PAGE_SIZE: usize = 4096; // Changed to usize to match last_page_number

    // Calculate usage
    let used_bytes = env_info.last_page_number * DEFAULT_PAGE_SIZE;
    let total_bytes = env_info.map_size;

    // Calculate percentage
    let usage_percent = if total_bytes > 0 {
        (used_bytes * 100) / total_bytes
    } else {
        0
    };

    // Convert to MB for display
    let used_mb = (used_bytes as f64) / (1024.0 * 1024.0);
    let total_mb = (total_bytes as f64) / (1024.0 * 1024.0);

    // Get system memory info for context
    let total_system_memory_kb = system.total_memory();
    let used_system_memory_kb = system.used_memory();
    let system_memory_usage_percent = if total_system_memory_kb > 0 {
        (used_system_memory_kb * 100) / total_system_memory_kb
    } else {
        0
    };

    // Log database statistics with system context
    log::info!(
        "LMDB Statistics: Map Size: {:.2} MB, Used: {:.2} MB ({:.1}%), Pages: {}",
        total_mb,
        used_mb,
        usage_percent as f64,
        env_info.last_page_number
    );

    // Log system memory statistics for context
    log::info!(
        "System Memory: Total: {} KB, Used: {} KB ({}%)",
        total_system_memory_kb,
        used_system_memory_kb,
        system_memory_usage_percent
    );

    // Warning if usage is high
    if usage_percent > 80 {
        log::warn!(
            "LMDB database usage is high ({}%). Consider increasing map size.",
            usage_percent
        );
    }

    // Check for stale readers
    let stale_readers = kv_env.clear_stale_readers()?;
    if stale_readers > 0 {
        log::info!("Cleared {} stale readers from LMDB environment", stale_readers);
    }

    Ok(())
}

/// Backup the database to a file
///
/// TODO: add database restore for automatic recovery
///
/// # Arguments
/// * `state` - The application state
/// * `backup_dir` - Directory to store backups
///
/// # Returns
/// * `Result<String, Box<dyn std::error::Error + Send + Sync>>` - Backup file path or error
#[allow(dead_code)]
pub async fn backup_database(
    state: &Arc<Mutex<AppState>>,
    backup_dir: &Path,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let state_guard = state.lock().map_err(|e| format!("Failed to lock state: {}", e))?;

    let kv_env = state_guard
        .kv_env
        .as_ref()
        .ok_or("Database environment not initialized")?;

    // Create backup directory if it doesn't exist
    std::fs::create_dir_all(backup_dir)?;

    // Generate timestamp for backup filename
    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH)?.as_secs();

    // Create backup filename with timestamp
    let suffix = if cfg!(debug_assertions) { "debug_" } else { "" };
    let backup_filename = format!("kvstore_db_{}{}.mdb", suffix, timestamp);
    let backup_path = backup_dir.join(&backup_filename);

    // Perform the backup with compaction
    log::info!("Starting database backup to {}", backup_path.display());

    kv_env.copy_to_path(&backup_path, CompactionOption::Enabled)?;

    log::info!("Database backup completed successfully");

    Ok(backup_filename)
}
