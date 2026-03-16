//! KV Store data models
//!
//! Defines data structures for the key-value store.

use serde::{Deserialize, Serialize};

/// KV store item structure
#[derive(Debug, Serialize, Deserialize)]
pub struct KVItem {
    /// The unique key identifier
    pub key: String,

    /// The stored value
    pub value: String,

    /// Timestamp when the item was created
    pub created_at: String,

    /// Timestamp when the item was last updated
    pub updated_at: String,
}

/// Namespace constants for organizing key-value data
pub struct Namespace;

impl Namespace {
    /// Namespace for application configuration
    pub const CONFIG: &'static str = "config";

    /// Namespace for update-related data
    pub const UPDATE: &'static str = "update";

    /// Create a namespaced key by adding a prefix
    ///
    /// # Arguments
    /// * `namespace` - The namespace to use
    /// * `key` - The original key
    ///
    /// # Returns
    /// * String - The namespaced key
    pub fn create_key(namespace: &str, key: &str) -> String {
        format!("{}:{}", namespace, key)
    }

    /// Extract the original key from a namespaced key
    ///
    /// # Arguments
    /// * `namespaced_key` - The namespaced key
    ///
    /// # Returns
    /// * Option<(&str, &str)> - Tuple of (namespace, original_key) if valid
    #[allow(dead_code)]
    pub fn extract_key(namespaced_key: &str) -> Option<(&str, &str)> {
        namespaced_key.split_once(':')
    }
}

/// Error type for KV store operations
#[allow(dead_code)]
#[derive(Debug, Serialize)]
pub struct KVError {
    /// Error message
    pub message: String,
}

impl std::fmt::Display for KVError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.message)
    }
}

// Implement Send and Sync for KVError to make it thread-safe
impl std::error::Error for KVError {}
unsafe impl Send for KVError {}
unsafe impl Sync for KVError {}
