//! Application state management
//!
//! This module defines the core application state and related structures
//! that are shared across the application.

use crate::database::kvstore::KVItem;
use heed3::types::{SerdeBincode, Str};
use heed3::{Database, Env};
use std::sync::{Arc, Mutex};
use tauri_plugin_updater::Update;

/// Application state to store database connection and other shared resources
pub struct AppState {
    /// The LMDB environment instance
    pub kv_env: Option<Env>,

    /// KV store database
    pub kv_db: Option<Database<Str, SerdeBincode<KVItem>>>,

    /// Pending update that has been checked but not installed
    #[allow(dead_code)]
    pub pending_update: Option<Update>,
}

/// Create a new AppState instance with empty database and connection
///
/// Returns an Arc<Mutex<AppState>> for thread-safe access across the application
pub fn create_app_state() -> Arc<Mutex<AppState>> {
    Arc::new(Mutex::new(AppState {
        kv_env: None,
        kv_db: None,
        pending_update: None,
    }))
}
