//! Font management utilities
//!
//! This module provides font discovery and caching using fontconfig.

use rust_fontconfig::{FcFontCache, FcPattern, PatternMatch};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::fs;
use std::path::PathBuf;
use std::sync::{Arc, Mutex, RwLock};
use std::time::SystemTime;
use tauri::{AppHandle, Manager};

/// Font information structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontInfo {
    /// Font family name
    pub family: String,
    /// Font style (e.g., "Regular", "Bold", "Italic")
    pub style: String,
    /// Full font name
    pub full_name: String,
    /// Font file path
    pub path: String,
}

/// Font cache structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontCache {
    /// Cache timestamp
    pub timestamp: u64,
    /// UI fonts (sans-serif)
    pub ui_fonts: Vec<FontInfo>,
    /// Editor fonts (monospace)
    pub editor_fonts: Vec<FontInfo>,
}

impl FontCache {
    /// Check if cache is still valid (less than 24 hours old)
    pub fn is_valid(&self) -> bool {
        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs();
        now.saturating_sub(self.timestamp) < 86400 // 24 hours
    }
}

/// Font manager for system font discovery and caching
pub struct FontManager {
    cache: Arc<RwLock<Option<FontCache>>>,
}

impl FontManager {
    /// Create a new FontManager
    pub fn new() -> Result<Self, String> {
        Ok(Self {
            cache: Arc::new(RwLock::new(None)),
        })
    }

    /// Get the font cache file path using Tauri's app data directory
    fn get_cache_path<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Result<PathBuf, String> {
        let data_dir = app
            .path()
            .app_data_dir()
            .map_err(|e| format!("Failed to get app data dir: {}", e))?;

        // Ensure directory exists
        fs::create_dir_all(&data_dir).map_err(|e| format!("Failed to create cache directory: {}", e))?;

        Ok(data_dir.join(".font-cache.json"))
    }

    /// Load font cache from disk
    fn load_cache_from_disk<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Option<FontCache> {
        self.get_cache_path(app)
            .ok()
            .and_then(|path| fs::read_to_string(&path).ok())
            .and_then(|content| serde_json::from_str(&content).ok())
    }

    /// Save font cache to disk
    fn save_cache_to_disk<R: tauri::Runtime>(&self, app: &AppHandle<R>, cache: &FontCache) -> Result<(), String> {
        let cache_path = self.get_cache_path(app)?;
        let content = serde_json::to_string_pretty(cache).map_err(|e| format!("Failed to serialize cache: {}", e))?;
        fs::write(&cache_path, content).map_err(|e| format!("Failed to write cache: {}", e))?;
        Ok(())
    }

    /// Initialize or refresh the font cache
    pub fn initialize_cache<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Result<(), String> {
        let cached = self.load_cache_from_disk(app);

        if let Some(cache) = cached {
            if cache.is_valid() {
                log::debug!("Using valid font cache from disk");
                *self.cache.write().unwrap() = Some(cache);
                return Ok(());
            }
        }

        log::info!("Building font cache...");
        let cache = self.build_font_cache()?;
        self.save_cache_to_disk(app, &cache)?;
        *self.cache.write().unwrap() = Some(cache);
        Ok(())
    }

    /// Build font cache by scanning system fonts
    fn build_font_cache(&self) -> Result<FontCache, String> {
        let fc_cache = FcFontCache::build();
        let font_list = fc_cache.list();

        let mut ui_fonts = Vec::new();
        let mut editor_fonts = Vec::new();
        let mut seen_ui = HashSet::new();
        let mut seen_editor = HashSet::new();

        // Iterate through all fonts in the cache
        for (pattern, font_path) in font_list.iter() {
            // Get font name/family
            let family = pattern
                .name
                .as_ref()
                .or_else(|| pattern.family.as_ref())
                .cloned()
                .unwrap_or_else(|| "Unknown".to_string());

            // Skip if we've already seen this family (deduplicate)
            if seen_ui.contains(&family) && seen_editor.contains(&family) {
                continue;
            }

            // Build style string
            let style = Self::build_style_string(pattern);

            // Build full name
            let full_name = pattern.name.as_ref().cloned().unwrap_or_else(|| family.clone());

            // Get font path (FcFontPath wraps a font ID as u128)
            let path = format!("font-id-{}", font_path.0);

            // Check if it's a sans-serif font (for UI)
            if !seen_ui.contains(&family) && self.is_sans_serif_font(pattern) {
                seen_ui.insert(family.clone());
                ui_fonts.push(FontInfo {
                    family: family.clone(),
                    style: style.clone(),
                    full_name: full_name.clone(),
                    path: path.clone(),
                });
            }

            // Check if it's a monospace font (for editor)
            if !seen_editor.contains(&family) && self.is_monospace_font(pattern) {
                seen_editor.insert(family.clone());
                editor_fonts.push(FontInfo {
                    family,
                    style,
                    full_name,
                    path,
                });
            }
        }

        // Sort fonts alphabetically
        ui_fonts.sort_by(|a, b| a.family.cmp(&b.family));
        editor_fonts.sort_by(|a, b| a.family.cmp(&b.family));

        let timestamp = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .unwrap()
            .as_secs();

        Ok(FontCache {
            timestamp,
            ui_fonts,
            editor_fonts,
        })
    }

    /// Build a style string from font pattern
    fn build_style_string(pattern: &FcPattern) -> String {
        let mut parts = Vec::new();

        if pattern.italic == PatternMatch::True {
            parts.push("Italic");
        }
        if pattern.oblique == PatternMatch::True {
            parts.push("Oblique");
        }
        if pattern.bold == PatternMatch::True {
            parts.push("Bold");
        }
        if pattern.condensed == PatternMatch::True {
            parts.push("Condensed");
        }

        if parts.is_empty() {
            "Regular".to_string()
        } else {
            parts.join(" ")
        }
    }

    /// Check if a font pattern is sans-serif (suitable for UI)
    fn is_sans_serif_font(&self, pattern: &FcPattern) -> bool {
        // Get the font name
        let name = pattern
            .name
            .as_ref()
            .or_else(|| pattern.family.as_ref())
            .map(|s| s.to_lowercase())
            .unwrap_or_else(|| String::new());

        // Direct name matching
        if name.contains("sans") || name.contains("sans-serif") {
            return true;
        }

        // Skip serif fonts
        if name.contains("serif") || name.contains("times") || name.contains("georgia") {
            return false;
        }

        // Check if it's explicitly NOT monospace (likely UI/proportional font)
        if pattern.monospace == PatternMatch::False {
            return true;
        }

        // If it's not marked as monospace, it might be a UI font
        // But be conservative and only include known sans-serif fonts
        if pattern.monospace == PatternMatch::DontCare {
            // Common sans-serif font names
            let sans_keywords = [
                "arial",
                "cantarell",
                "figtree",
                "frutiger",
                "futura",
                "geneva",
                "gill sans",
                "helvetica",
                "inter",
                "lucida",
                "nunito",
                "open sans",
                "optima",
                "poppins",
                "roboto",
                "sf pro display",
                "sf pro text",
                "sf pro",
                "source sans",
                "system ui",
                "tahoma",
                "trebuchet",
                "ubuntu",
                "verdana",
            ];

            for keyword in sans_keywords {
                if name.contains(keyword) {
                    return true;
                }
            }
        }

        false
    }

    /// Check if a font pattern is monospace (suitable for editor)
    fn is_monospace_font(&self, pattern: &FcPattern) -> bool {
        // Get the font name
        let name = pattern
            .name
            .as_ref()
            .or_else(|| pattern.family.as_ref())
            .map(|s| s.to_lowercase())
            .unwrap_or_else(|| String::new());

        // Check the monospace property first (most reliable)
        if pattern.monospace == PatternMatch::True {
            return true;
        }

        // Direct name matching
        if name.contains("mono") || name.contains("monospace") {
            return true;
        }

        // Common monospace font names
        let mono_keywords = [
            "andale mono",
            "bitstream vera sans mono",
            "cascadia code",
            "cascadia mono",
            "consolas",
            "courier new",
            "courier",
            "dejavu sans mono",
            "fira code",
            "hack",
            "ibm plex mono",
            "inconsolata",
            "jetbrains mono",
            "liberation mono",
            "lucida console",
            "menlo",
            "monaco",
            "monaco",
            "pt mono",
            "source code pro",
            "ubuntu mono",
            "vs code",
        ];

        for keyword in mono_keywords {
            if name.contains(keyword) {
                return true;
            }
        }

        false
    }

    /// Get UI fonts (sans-serif)
    pub fn get_ui_fonts(&self) -> Result<Vec<FontInfo>, String> {
        let cache = self.cache.read().unwrap();
        cache
            .as_ref()
            .map(|c| c.ui_fonts.clone())
            .ok_or_else(|| "Font cache not initialized".to_string())
    }

    /// Get editor fonts (monospace)
    pub fn get_editor_fonts(&self) -> Result<Vec<FontInfo>, String> {
        let cache = self.cache.read().unwrap();
        cache
            .as_ref()
            .map(|c| c.editor_fonts.clone())
            .ok_or_else(|| "Font cache not initialized".to_string())
    }

    /// Force refresh the font cache
    pub fn refresh_cache<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Result<FontCache, String> {
        log::info!("Forcing font cache refresh...");
        let cache = self.build_font_cache()?;
        self.save_cache_to_disk(app, &cache)?;
        *self.cache.write().unwrap() = Some(cache.clone());
        Ok(cache)
    }

    /// Get cache information
    pub fn get_cache_info(&self) -> Result<FontCacheInfo, String> {
        let cache = self.cache.read().unwrap();
        let cache = cache.as_ref().ok_or_else(|| "Font cache not initialized".to_string())?;

        let timestamp = cache.timestamp;
        let ui_count = cache.ui_fonts.len();
        let editor_count = cache.editor_fonts.len();
        let is_valid = cache.is_valid();

        Ok(FontCacheInfo {
            timestamp,
            ui_count,
            editor_count,
            is_valid,
        })
    }
}

/// Font cache metadata
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FontCacheInfo {
    /// Cache timestamp (Unix timestamp)
    pub timestamp: u64,
    /// Number of UI fonts cached
    pub ui_count: usize,
    /// Number of editor fonts cached
    pub editor_count: usize,
    /// Whether the cache is still valid
    pub is_valid: bool,
}

/// Lazy-initialized global font manager using Mutex for thread safety
static FONT_MANAGER: Mutex<Option<Arc<FontManager>>> = Mutex::new(None);

/// Get the global font manager instance
pub fn get_font_manager() -> Result<Arc<FontManager>, String> {
    let mut manager_guard = FONT_MANAGER.lock().unwrap();

    if manager_guard.is_none() {
        let manager = FontManager::new().map(Arc::new)?;
        *manager_guard = Some(manager);
    }

    Ok(manager_guard.as_ref().unwrap().clone())
}
