use tauri::menu::{Menu, PredefinedMenuItem, Submenu};
use tauri::{AppHandle, Runtime};

pub fn init<R: Runtime>(handle: &AppHandle<R>) -> tauri::Result<Menu<R>> {
    let menu_bar = Menu::new(handle)?;

    let app_menu = Submenu::new(handle, "App", true)?;
    app_menu.append_items(&[
        &PredefinedMenuItem::about(handle, None, None)?,
        &PredefinedMenuItem::separator(handle)?,
        &PredefinedMenuItem::services(handle, None)?,
        &PredefinedMenuItem::separator(handle)?,
        &PredefinedMenuItem::hide(handle, None)?,
        &PredefinedMenuItem::hide_others(handle, None)?,
        &PredefinedMenuItem::show_all(handle, None)?,
        &PredefinedMenuItem::separator(handle)?,
        &PredefinedMenuItem::quit(handle, None)?,
    ])?;

    menu_bar.append(&app_menu)?;

    let file_m = Submenu::new(handle, "&File", true)?;
    menu_bar.append_items(&[&file_m])?;

    Ok(menu_bar)
}
