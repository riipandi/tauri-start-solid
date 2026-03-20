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
    /// Check if cache is still valid
    ///
    /// With startup rebuild strategy, cache is always considered valid
    /// after it's been built. The timestamp is for reference/debugging.
    pub fn is_valid(&self) -> bool {
        true
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
    ///
    /// Loads font cache from disk if available, otherwise builds from system fonts.
    /// Cache is stored in-memory for the duration of the app session for instant access.
    /// Subsequent calls in the same session use the in-memory cache.
    pub fn initialize_cache<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Result<(), String> {
        // Step 1: Check if we already have cache in memory for this session
        if self.cache.read().unwrap().is_some() {
            log::debug!("Font cache already initialized in memory - using cached fonts");
            return Ok(());
        }

        // Step 2: Try to load from disk first
        match self.load_cache_from_disk(app) {
            Some(cached) => {
                // Cache file exists on disk → use it
                log::info!(
                    "Loading font cache from disk ({} UI fonts, {} editor fonts, cached: {})",
                    cached.ui_fonts.len(),
                    cached.editor_fonts.len(),
                    chrono::DateTime::from_timestamp(cached.timestamp as i64, 0)
                        .map(|dt| dt.format("%Y-%m-%d %H:%M:%S").to_string())
                        .unwrap_or_else(|| "unknown".to_string())
                );

                *self.cache.write().unwrap() = Some(cached);
                Ok(())
            }
            None => {
                // No cache file → build from system fonts
                log::info!("No font cache found on disk - building from system fonts...");
                let cache = self.build_font_cache()?;

                // Save to disk for next startup
                self.save_cache_to_disk(app, &cache)?;

                log::info!(
                    "Font cache built and saved: {} UI fonts, {} editor fonts",
                    cache.ui_fonts.len(),
                    cache.editor_fonts.len()
                );

                *self.cache.write().unwrap() = Some(cache);
                Ok(())
            }
        }
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

    /// Helper: Extract font name from pattern
    fn get_font_name(pattern: &FcPattern) -> String {
        pattern
            .name
            .as_ref()
            .or_else(|| pattern.family.as_ref())
            .cloned()
            .unwrap_or_else(|| String::new())
    }

    /// Check if font name contains non-Latin characters
    fn contains_non_latin_characters(&self, name: &str) -> bool {
        name.chars().any(|c| {
            let codepoint = c as u32;

            // CJK Unified Ideographs
            if (0x4E00..=0x9FFF).contains(&codepoint) {
                return true;
            }
            // Hiragana
            if (0x3040..=0x309F).contains(&codepoint) {
                return true;
            }
            // Katakana
            if (0x30A0..=0x30FF).contains(&codepoint) {
                return true;
            }
            // Hangul Syllables
            if (0xAC00..=0xD7AF).contains(&codepoint) {
                return true;
            }
            // Arabic
            if (0x0600..=0x06FF).contains(&codepoint) {
                return true;
            }
            // Hebrew
            if (0x0590..=0x05FF).contains(&codepoint) {
                return true;
            }
            // Thai
            if (0x0E00..=0x0E7F).contains(&codepoint) {
                return true;
            }

            // Indic Scripts (Indian subcontinent)
            // Devanagari (Hindi, Marathi, Nepali, Sanskrit)
            if (0x0900..=0x097F).contains(&codepoint) {
                return true;
            }
            // Bengali
            if (0x0980..=0x09FF).contains(&codepoint) {
                return true;
            }
            // Gurmukhi (Punjabi)
            if (0x0A00..=0x0A7F).contains(&codepoint) {
                return true;
            }
            // Gujarati
            if (0x0A80..=0x0AFF).contains(&codepoint) {
                return true;
            }
            // Oriya
            if (0x0B00..=0x0B7F).contains(&codepoint) {
                return true;
            }
            // Tamil
            if (0x0B80..=0x0BFF).contains(&codepoint) {
                return true;
            }
            // Telugu
            if (0x0C00..=0x0C7F).contains(&codepoint) {
                return true;
            }
            // Kannada
            if (0x0C80..=0x0CFF).contains(&codepoint) {
                return true;
            }
            // Malayalam
            if (0x0D00..=0x0D7F).contains(&codepoint) {
                return true;
            }
            // Sinhala (Sri Lanka)
            if (0x0D80..=0x0DFF).contains(&codepoint) {
                return true;
            }

            // Other Southeast Asian
            // Lao
            if (0x0E80..=0x0EFF).contains(&codepoint) {
                return true;
            }
            // Myanmar (Burmese)
            if (0x1000..=0x109F).contains(&codepoint) {
                return true;
            }
            // Khmer
            if (0x1780..=0x17FF).contains(&codepoint) {
                return true;
            }

            // Additional scripts to exclude
            // Armenian
            if (0x0530..=0x058F).contains(&codepoint) {
                return true;
            }
            // Georgian
            if (0x10A0..=0x10FF).contains(&codepoint) {
                return true;
            }
            // Cyrillic (exclude all for safe UI fonts)
            if (0x0400..=0x052F).contains(&codepoint) {
                return true;
            }
            // Greek (exclude all for safe UI fonts)
            if (0x0370..=0x03FF).contains(&codepoint) {
                return true;
            }

            false
        })
    }

    /// Check if font is serif based on name patterns
    fn is_serif_font(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        // Common serif patterns
        let serif_indicators = [
            "serif",
            "times",
            "georgia",
            "garamond",
            "baskerville",
            "palatino",
            "bookman",
            "cambria",
            "constantia",
            "didot",
            "bodoni",
            "walbaum",
            "rockwell",
            "minion",
            "trajan",
        ];

        serif_indicators.iter().any(|&keyword| name_lower.contains(keyword))
    }

    /// Check if font is script/calligraphy/handwriting
    fn is_script_font(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        let script_indicators = [
            "script",
            "calligraphy",
            "handwriting",
            "brush",
            "cursive",
            "hand",
            "marker",
            "signature",
            "dancing",
            "kunstler",
            "zapfino",
        ];

        script_indicators.iter().any(|&keyword| name_lower.contains(keyword))
    }

    /// Check if font is symbol/dingbat/decorative
    fn is_symbol_font(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        let symbol_indicators = [
            "symbol",
            "dingbat",
            "ornament",
            "emoji",
            "icon",
            "wingdings",
            "webdings",
            "fantasy",
            "decorative",
            "pi",
        ];

        symbol_indicators.iter().any(|&keyword| name_lower.contains(keyword))
    }

    /// Check if font is CJK-specific
    fn is_cjk_font(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        // CJK-specific naming patterns
        let cjk_patterns = [
            "mincho",   // Japanese Mincho
            "gyosho",   // Japanese Gyosho
            "myungjo",  // Korean Myungjo
            "songti",   // Chinese Songti
            "hei",      // Chinese Hei
            "kai",      // Chinese Kai
            "fangsong", // Chinese FangSong
            "batang",   // Korean Batang
            "dotum",    // Korean Dotum
            "gulim",    // Korean Gulim
            "mingliu",  // Traditional Chinese
            "pmingliu", // Traditional Chinese
            "simhei",   // Simplified Chinese
            "simsun",   // Simplified Chinese
        ];

        cjk_patterns.iter().any(|&pattern| name_lower.contains(pattern))
    }

    /// Check if font is unsafe for UI based on naming patterns
    /// This includes gothic, blackletter, display, and other non-standard fonts
    fn is_unsafe_font(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        // Unsafe patterns for modern UI
        let unsafe_patterns = [
            // Gothic & Blackletter (not suitable for modern UI)
            "gothic",
            "blackletter",
            "fraktur",
            // Display / Decorative / Title fonts
            "display",
            "poster",
            "title",
            "headline",
            "banner",
            // Old-style / Vintage fonts
            "old style",
            "oldstyle",
            "vintage",
            "retro",
            // Condensed / Expanded (can be problematic)
            "narrow",
            "condensed",
            "compressed",
            // Artistic / Novelty fonts
            "art",
            "novelty",
            "fun",
            "comic",
            "cartoon",
        ];

        unsafe_patterns.iter().any(|&pattern| name_lower.contains(pattern))
    }

    /// Check if font has sans-serif indicators in name
    fn has_sans_indicators(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        let sans_patterns = [
            "arial",
            "barlow",
            "calibri",
            "cantarell",
            "circular",
            "figtree",
            "geometric",
            "grotesque",
            "helvetica",
            "inter",
            "lato",
            "manrope",
            "neo",
            "nunito",
            "open sans",
            "plus jakarta sans",
            "poppins",
            "proxima",
            "quicksand",
            "roboto",
            "rubik",
            "sans",
            "segoe",
            "sf pro",
            "sofia",
            "source sans",
            "system",
            "tahoma",
            "trebuchet",
            "ubuntu",
            "ui",
            "verdana",
            "work sans",
        ];

        sans_patterns.iter().any(|&pattern| name_lower.contains(pattern))
    }

    /// Check if font has monospace indicators in name
    fn has_mono_indicators(&self, name: &str) -> bool {
        let name_lower = name.to_lowercase();

        let mono_patterns = [
            "andale mono",
            "cascadia code",
            "cascadia mono",
            "code",
            "consolas",
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
            "mono",
            "monospace",
            "pt mono",
            "source code pro",
            "ubuntu mono",
        ];

        mono_patterns.iter().any(|&pattern| name_lower.contains(pattern))
    }

    /// Check if a font pattern is sans-serif (suitable for UI)
    fn is_sans_serif_font(&self, pattern: &FcPattern) -> bool {
        let name = Self::get_font_name(pattern);

        // Step 1: Character filtering - exclude ALL non-Latin fonts
        if self.contains_non_latin_characters(&name) {
            return false;
        }

        // Step 2: Exclude unsafe fonts (gothic, display, poster, etc.)
        if self.is_unsafe_font(&name) {
            return false;
        }

        // Step 3: Exclude unwanted categories
        if self.is_serif_font(&name)
            || self.is_script_font(&name)
            || self.is_symbol_font(&name)
            || self.is_cjk_font(&name)
        {
            return false;
        }

        // Step 4: Validate slant - only Roman (non-italic/oblique) for UI
        if pattern.italic == PatternMatch::True || pattern.oblique == PatternMatch::True {
            return false;
        }

        // Step 5: Validate proportional fonts with sans-serif indicators
        if pattern.monospace == PatternMatch::False {
            // Proportional font - validate it's actually sans-serif
            return self.has_sans_indicators(&name);
        }

        // Step 6: If DontCare, be conservative with keyword matching
        if pattern.monospace == PatternMatch::DontCare {
            self.has_sans_indicators(&name)
        } else {
            // It's monospace → exclude from UI fonts
            false
        }
    }

    /// Check if a font pattern is monospace (suitable for editor)
    fn is_monospace_font(&self, pattern: &FcPattern) -> bool {
        let name = Self::get_font_name(pattern);

        // Step 1: Character filtering - exclude non-Latin fonts
        if self.contains_non_latin_characters(&name) {
            return false;
        }

        // Step 2: Exclude decorative/symbol fonts
        if self.is_symbol_font(&name) || self.is_script_font(&name) {
            return false;
        }

        // Step 3: Use fontconfig monospace property (primary check)
        if pattern.monospace == PatternMatch::True {
            // Additional validation: ensure it's not a CJK monospace
            return !self.is_cjk_font(&name);
        }

        // Step 4: Keyword matching as fallback
        self.has_mono_indicators(&name)
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
    ///
    /// Rebuilds the font cache regardless of whether it's already loaded.
    /// Use this when new fonts have been installed on the system.
    pub fn refresh_cache<R: tauri::Runtime>(&self, app: &AppHandle<R>) -> Result<FontCache, String> {
        log::info!("Force rebuilding font cache...");
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
