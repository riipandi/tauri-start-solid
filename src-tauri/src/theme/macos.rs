/*!
 * Portions of this file are based on code from `wyhaya/tauri-plugin-theme`.
 * Credits to wyhaya: https://github.com/wyhaya/tauri-plugin-theme
 */

use super::{save_theme_state, Theme};
use cocoa::appkit::{NSAppearance, NSAppearanceNameVibrantDark, NSAppearanceNameVibrantLight, NSWindow};
use cocoa::base::{id, nil};
use tauri::{AppHandle, Manager, Runtime};

#[tauri::command]
#[specta::specta]
pub fn set_theme<R: Runtime>(app: AppHandle<R>, theme: Theme) -> Result<(), &'static str> {
    save_theme_state(&app, theme)?;

    for window in app.webview_windows().values() {
        let ptr = window.ns_window().map_err(|_| "Invalid window handle")?;
        unsafe {
            let val = match theme {
                Theme::System => nil,
                Theme::Light => NSAppearance(NSAppearanceNameVibrantLight),
                Theme::Dark => NSAppearance(NSAppearanceNameVibrantDark),
            };
            (ptr as id).setAppearance(val);
        }
    }

    Ok(())
}
