use anyhow::Result;
use tauri::menu::{Menu, MenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::Manager;

// Initialize and setup tray icon menu
pub fn setup_tray(app: &tauri::App) -> Result<()> {
    // Add some tray menu items
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_i])?;

    // Get the default window icon
    let default_window_icon = app
        .default_window_icon()
        .ok_or_else(|| anyhow::anyhow!("Failed to load default window icon"))?;

    // Register the tray icon
    let _tray = TrayIconBuilder::new()
        .icon(default_window_icon.clone())
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } => {
                println!("left click pressed and released");
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {} // do nothing for unhandled events
        })
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                println!("quit menu item was clicked");
                app.exit(0);
            }
            _ => {
                println!("menu item {:?} not handled", event.id);
            }
        })
        .build(app)?;

    Ok(())
}
