use crate::core::{self, menu::handler::MenuEventHandler};

use anyhow::Result;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconEvent};
use tauri::{AppHandle, Manager, Runtime};

pub fn setup_tray_menu<R: Runtime>(app: &tauri::App<R>) -> Result<()> {
    // Get the default window icon
    let default_window_icon = app
        .default_window_icon()
        .ok_or_else(|| anyhow::anyhow!("Failed to load default window icon"))?;

    // Create event handler
    let handler = MenuEventHandler::<R>::new(app);
    let app_handle = app.handle().clone();

    // Register the tray icon
    let _tray = tauri::tray::TrayIconBuilder::<R>::new()
        .icon(default_window_icon.clone())
        .menu(&create_tray_menu(app)?)
        .show_menu_on_left_click(false)
        .on_tray_icon_event(handle_tray_icon_event(app_handle))
        .on_menu_event(move |app_handle, event| handler.handle_menu_event()(app_handle.clone(), event))
        .build(app)?;

    Ok(())
}

fn create_tray_menu<R: Runtime>(app: &tauri::App<R>) -> tauri::Result<Menu<R>> {
    // Add tray menu items
    let open = MenuItem::with_id(app, "open", "Open Tauri App", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Settings", true, Some("CmdOrCtrl+,"))?;
    let about = MenuItem::with_id(app, "about", "About", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app.handle())?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, Some("CmdOrCtrl+,"))?;

    // Create menu with items
    Menu::with_items(app, &[&open, &separator, &settings, &about, &separator, &quit])
}

fn handle_tray_icon_event<R: Runtime>(app: AppHandle<R>) -> impl Fn(&TrayIcon<R>, TrayIconEvent) + Send + 'static {
    move |tray_handle, event| {
        tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);

        match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Down,
                ..
            } => {
                if let Some(_window) = app.get_webview_window(core::MAIN_WINDOW_ID) {
                    let _ = tray_handle.set_show_menu_on_left_click(true);
                }
            }
            TrayIconEvent::Click {
                button: MouseButton::Right,
                button_state: MouseButtonState::Down,
                ..
            } => {}
            _ => {}
        }
    }
}
