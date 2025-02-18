use crate::theme::Theme;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::time::{SystemTime, UNIX_EPOCH};

/// Update channel configuration for the application
#[derive(Debug, Serialize, Deserialize, Type)]
pub enum UpdateChannel {
    /// Stable release channel - recommended for production use
    Stable,
    /// Beta release channel - preview of upcoming features
    Beta,
}

/// Configuration settings for application updates
#[derive(Debug, Serialize, Deserialize, Type)]
pub struct UpdateConfig {
    /// Enable automatic update checks
    pub auto_check: bool,
    /// Enable automatic update downloads when available
    pub auto_download: bool,
    /// Selected update channel (Stable/Beta)
    pub channel: UpdateChannel,
    /// Unix timestamp of last update check
    pub last_check: u64,
}

impl Default for UpdateConfig {
    fn default() -> Self {
        Self {
            auto_check: true,
            auto_download: false,
            channel: UpdateChannel::Stable,
            last_check: SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs(),
        }
    }
}

/// Main application configuration structure
#[derive(Debug, Serialize, Deserialize, Type)]
pub struct AppConfig {
    /// UI theme setting
    pub theme: Theme,
    /// Update-related settings
    pub updates: UpdateConfig,
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            theme: Theme::default(),
            updates: UpdateConfig::default(),
        }
    }
}
