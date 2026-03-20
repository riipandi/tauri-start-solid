//! UI module
//!
//! Handles user interface components like windows and menus.

pub mod menu;
pub mod settings;
pub mod tray;
pub mod updater;

mod logger;
pub use self::logger::*;

mod window;
pub use self::window::*;
