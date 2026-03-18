//! Application state management
//!
//! This module defines the core application state and related structures
//! that are shared across the application.

use std::sync::{Arc, Mutex};
use tauri_plugin_updater::Update;

/// Application state to store shared resources
pub struct AppState {
    /// Pending update that has been checked but not installed
    #[allow(dead_code)]
    pub pending_update: Option<Update>,
}

/// Create a new AppState instance
///
/// Returns an Arc<Mutex<AppState>> for thread-safe access across the application
pub fn create_app_state() -> Arc<Mutex<AppState>> {
    Arc::new(Mutex::new(AppState { pending_update: None }))
}
