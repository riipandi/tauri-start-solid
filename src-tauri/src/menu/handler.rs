use tauri::{menu::MenuId, AppHandle, Manager, Runtime};

use crate::utils::{force_reload, update};

pub struct MenuEventHandler<R: Runtime> {
    // Stores the application handle that can be cloned and used across different threads
    app: AppHandle<R>,
}

impl<R: Runtime> MenuEventHandler<R> {
    // Creates a new MenuEventHandler instance with a cloneable app handle
    pub fn new(app: &tauri::App<R>) -> Self {
        Self {
            app: app.handle().clone(),
        }
    }

    pub fn handle_menu_event(&self) -> impl Fn(AppHandle<R>, tauri::menu::MenuEvent) + Send + 'static {
        // Clone the app handle to move it into the event handler closure
        let app = self.app.clone();

        // app_handle: Provided by Tauri runtime for each menu event
        // event: Contains menu event information including the triggered menu item ID
        move |app_handle, event| match event.id() {
            id if id == &MenuId::from("devtool") => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show().and_then(|_| window.set_focus());
                    if window.is_devtools_open() {
                        window.close_devtools()
                    } else {
                        window.open_devtools()
                    }
                }
            }
            id if id == &MenuId::from("settings") => {
                if let Some(window) = app.get_webview_window("settings") {
                    let _ = window.show().and_then(|_| window.set_focus());
                }
            }
            id if id == &MenuId::from("force_reload") => {
                let mut win_main = app.get_webview_window("main").expect("Failed to get main window");
                let _ = force_reload(&mut win_main);
            }
            id if id == &MenuId::from("check_update") => {
                tauri::async_runtime::spawn(async move {
                    let _ = update(app_handle).await;
                });
            }
            _ => {} // Unhandled events
        }
    }
}
