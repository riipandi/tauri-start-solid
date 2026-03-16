//! Main application entry point
//!
//! This is the main entry point for the Tauri application.
//! It simply calls the run function from the lib.rs module.

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

/// Main function that starts the application
fn main() {
    myapp_lib::run()
}
