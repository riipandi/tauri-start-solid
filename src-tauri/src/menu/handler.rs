use chrono::{DateTime, Local};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{menu::MenuId, AppHandle, Emitter, Manager, Runtime};

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
        move |app_handle, event| {
            let menu_id = event.id();
            match menu_id {
                id if id == &MenuId::from("settings") => {
                    println!("Open settings window triggered!");
                    if let Some(window) = app.get_webview_window("settings") {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
                id if id == &MenuId::from("check_update") => {
                    let timestamp = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_millis();

                    // Convert timestamp to readable format
                    let dt = DateTime::<Local>::from(SystemTime::now());
                    println!("Check update triggered at: {}", dt.format("%Y-%m-%d %H:%M:%S%.3f %Z"));

                    // Emit the event then listen for it in the frontend
                    let _ = app_handle.emit("check-update", timestamp);
                }
                id if id == &MenuId::from("toggle") => {
                    println!("toggle triggered!");
                }
                _ => {}
            }
        }
    }
}
