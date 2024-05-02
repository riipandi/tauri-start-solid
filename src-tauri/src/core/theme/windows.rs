use crate::{save_theme_value, Theme};
use tauri::{AppHandle, Runtime};

#[tauri::command]
pub fn set_theme<R: Runtime>(app: AppHandle<R>, theme: Theme) -> Result<(), &'static str> {
    save_theme_value(theme, app.clone());
    app.restart();
    Ok(())
}
