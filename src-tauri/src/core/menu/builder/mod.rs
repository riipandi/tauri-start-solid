//! Module for building application menus
//! Provides a modular approach to menu creation with platform-specific customizations

mod common;
mod manager;

#[cfg(target_os = "macos")]
mod macos;

// Public exports
pub use manager::create_app_menu;
