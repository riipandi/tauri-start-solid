pub mod handler;
pub mod menu;

use anyhow::Result;
use tauri::Runtime;

use self::handler::TrayEventHandler;
use self::menu::create_tray_menu;

pub fn setup_tray<R: Runtime>(app: &tauri::App<R>) -> Result<()> {
    // Get the default window icon
    let default_window_icon = app
        .default_window_icon()
        .ok_or_else(|| anyhow::anyhow!("Failed to load default window icon"))?;

    // Create event handler
    let handler = TrayEventHandler::<R>::new(app);

    // Register the tray icon
    let _tray = tauri::tray::TrayIconBuilder::<R>::new()
        .icon(default_window_icon.clone())
        .menu(&create_tray_menu(app)?)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(handler.handle_tray_event())
        .on_menu_event(move |app_handle, event| handler.handle_menu_event()(app_handle.clone(), event))
        .build(app)?;

    Ok(())
}
