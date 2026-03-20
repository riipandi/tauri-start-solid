//! Tauri commands for font management

use crate::utils::fonts::{self, FontCacheInfo, FontInfo};
use tauri::AppHandle;

/// Get available UI fonts (sans-serif fonts)
///
/// Returns a list of sans-serif fonts suitable for UI elements.
/// Fonts are loaded from cache if available, or built from system fonts
/// on first startup. Once loaded, fonts are cached in-memory for the duration
/// of the app session for instant access. Use refresh_font_cache() to rebuild
/// the cache after installing new fonts.
#[tauri::command]
pub async fn get_available_ui_fonts(app: AppHandle) -> Result<Vec<FontInfo>, String> {
    let manager = fonts::get_font_manager()?;
    manager.initialize_cache(&app)?;
    manager.get_ui_fonts()
}

/// Get available editor fonts (monospace fonts)
///
/// Returns a list of monospace fonts suitable for code editors.
/// Fonts are loaded from cache if available, or built from system fonts
/// on first startup. Once loaded, fonts are cached in-memory for the duration
/// of the app session for instant access. Use refresh_font_cache() to rebuild
/// the cache after installing new fonts.
#[tauri::command]
pub async fn get_available_editor_fonts(app: AppHandle) -> Result<Vec<FontInfo>, String> {
    let manager = fonts::get_font_manager()?;
    manager.initialize_cache(&app)?;
    manager.get_editor_fonts()
}

/// Refresh the font cache
///
/// Forces a rebuild of the font cache by re-scanning system fonts.
/// Use this command after installing new fonts on your system to make
/// them available in the font picker without restarting the application.
#[tauri::command]
pub async fn refresh_font_cache(app: AppHandle) -> Result<FontCacheInfo, String> {
    log::info!("Manual font cache refresh requested");

    let manager = fonts::get_font_manager()?;
    let cache = manager.refresh_cache(&app)?;

    Ok(FontCacheInfo {
        timestamp: cache.timestamp,
        ui_count: cache.ui_fonts.len(),
        editor_count: cache.editor_fonts.len(),
        is_valid: true,
    })
}

/// Get font cache information
///
/// Returns metadata about the current font cache including
/// timestamp, font counts, and validity status.
#[tauri::command]
pub async fn get_font_cache_info() -> Result<FontCacheInfo, String> {
    let manager = fonts::get_font_manager()?;
    manager.get_cache_info()
}
