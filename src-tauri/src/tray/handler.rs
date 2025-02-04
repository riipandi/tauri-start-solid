use tauri::tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconEvent};
use tauri::{AppHandle, Manager, Runtime};

pub struct TrayEventHandler<R: Runtime> {
    app: AppHandle<R>,
}

impl<R: Runtime> TrayEventHandler<R> {
    pub fn new(app: &tauri::App<R>) -> Self {
        Self {
            app: app.handle().clone(),
        }
    }

    // Do something when the tray icon clicked. Currently, it just shows the window.
    pub fn handle_tray_event(&self) -> impl Fn(&TrayIcon<R>, TrayIconEvent) + Send + 'static {
        let app = self.app.clone();
        move |tray_handle, event| {
            // Tambahkan ini di awal function untuk handle posisi window
            tauri_plugin_positioner::on_tray_event(tray_handle.app_handle(), &event);

            match event {
                TrayIconEvent::Click {
                    button: MouseButton::Left,
                    button_state: MouseButtonState::Down,
                    ..
                } => {
                    if let Some(_window) = app.get_webview_window("main") {
                        let _ = tray_handle.set_show_menu_on_left_click(true);
                    }
                }
                TrayIconEvent::Click {
                    button: MouseButton::Right,
                    button_state: MouseButtonState::Down,
                    ..
                } => {} // Right click event
                _ => {} // Unhandled events
            }
        }
    }

    pub fn handle_menu_event(&self) -> impl Fn(AppHandle<R>, tauri::menu::MenuEvent) + Send + 'static {
        move |app, event| match event.id.as_ref() {
            "open" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "settings" => {
                if let Some(window) = app.get_webview_window("settings") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "about" => {
                if let Some(window) = app.get_webview_window("about") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {} // Unhandled events
        }
    }
}
