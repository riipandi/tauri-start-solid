use cocoa::appkit::{NSAppearance, NSAppearanceNameVibrantDark, NSAppearanceNameVibrantLight, NSWindow};
use cocoa::base::{id, nil};
use tauri::{AppHandle, Manager, Runtime};

use super::{save_theme_value, Theme};

#[tauri::command]
pub fn set_theme<R: Runtime>(theme: Theme, app: AppHandle<R>) -> Result<(), &'static str> {
    save_theme_value(theme, app.clone());

    for window in app.webview_windows().values() {
        let ptr = window.ns_window().map_err(|_| "Invalid window handle")?;
        unsafe {
            let val = match theme {
                Theme::Auto => nil,
                Theme::Light => NSAppearance(NSAppearanceNameVibrantLight),
                Theme::Dark => NSAppearance(NSAppearanceNameVibrantDark),
            };
            (ptr as id).setAppearance(val);
        }
    }

    Ok(())
}
