use chrono::{DateTime, Local};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{menu::MenuId, AppHandle, Emitter, Manager, Runtime};

use crate::utils::force_reload;

pub struct MenuEventHandler<R: Runtime> {
    app: AppHandle<R>,
}

impl<R: Runtime> MenuEventHandler<R> {
    pub fn new(app: &tauri::App<R>) -> Self {
        Self {
            app: app.handle().clone(),
        }
    }

    pub fn handle_menu_event(&self) -> impl Fn(AppHandle<R>, tauri::menu::MenuEvent) + Send + 'static {
        let app = self.app.clone();

        move |app_handle, event| match event.id() {
            id if id == &MenuId::from("devtool") => {
                if let Some(window) = app.get_webview_window("main") {
                    if cfg!(debug_assertions) {
                        if window.is_devtools_open() {
                            window.close_devtools()
                        } else {
                            window.open_devtools()
                        }
                    }
                }
            }
            id if id == &MenuId::from("force_reload") => {
                let mut win_main = app.get_webview_window("main").expect("Failed to get main window");
                let _ = force_reload(&mut win_main);
            }
            id if id == &MenuId::from("settings") => {
                if let Some(window) = app.get_webview_window("settings") {
                    let _ = window.show().and_then(|_| window.set_focus());
                }
            }
            id if id == &MenuId::from("check_update") => {
                let now = SystemTime::now();
                let timestamp = now.duration_since(UNIX_EPOCH).unwrap().as_millis();
                let dt = DateTime::<Local>::from(now);

                println!("Check update triggered at: {}", dt.format("%Y-%m-%d %H:%M:%S%.3f %Z"));
                let _ = app_handle.emit("check-update", timestamp);
            }
            id if id == &MenuId::from("toggle") => {
                println!("Toggle triggered!");
            }
            _ => {} // Unhandled events
        }
    }
}
