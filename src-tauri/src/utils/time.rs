//! Time utility functions
//!
//! Provides functions for working with time and timestamps.

use chrono::{DateTime, Local, Utc};
use std::time::{SystemTime, UNIX_EPOCH};

/// Get current timestamp as ISO 8601 / RFC 3339 formatted string
///
/// # Returns
/// * `String` - Formatted timestamp in RFC 3339 format
pub fn get_current_timestamp() -> String {
    Utc::now().to_rfc3339()
}

/// Get a formatted timestamp for the current time
///
/// # Returns
/// * `String` - Formatted timestamp string with milliseconds
pub fn get_formatted_timestamp() -> String {
    let now = SystemTime::now();
    let dt = DateTime::<Local>::from(now);
    dt.format("%Y-%m-%d %H:%M:%S%.3f %Z").to_string()
}

/// Get current timestamp in milliseconds since UNIX epoch
///
/// # Returns
/// * `u128` - Timestamp in milliseconds
pub fn get_timestamp_ms() -> u128 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis()
}

/// Get current timestamp in seconds since UNIX epoch
///
/// # Returns
/// * `u64` - Timestamp in seconds
#[allow(dead_code)]
pub fn get_timestamp_sec() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

/// Format a timestamp in milliseconds to a human-readable string
///
/// # Arguments
/// * `timestamp_ms` - Timestamp in milliseconds
///
/// # Returns
/// * `String` - Formatted timestamp string
#[allow(dead_code)]
pub fn format_timestamp_ms(timestamp_ms: u128) -> String {
    let secs = (timestamp_ms / 1000) as i64;
    let nanos = ((timestamp_ms % 1000) * 1_000_000) as u32;

    if let Some(dt) = DateTime::from_timestamp(secs, nanos) {
        dt.format("%Y-%m-%d %H:%M:%S%.3f %Z").to_string()
    } else {
        "Invalid timestamp".to_string()
    }
}
