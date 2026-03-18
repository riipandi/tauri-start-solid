use tauri::{AppHandle, Runtime};

mod menu_app;
mod menu_file;
mod menu_help;
mod menu_view;
mod menu_window;

pub struct MenuEventHandler<R: Runtime> {
    // Stores the application handle that can be cloned and used across different threads
    #[allow(dead_code)]
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
        // No need to clone app handle since it's not used in the closure

        // app_handle: Provided by Tauri runtime for each menu event
        // event: Contains menu event information including the triggered menu item ID
        move |app_handle, event| {
            // Get the ID of the triggered menu item as a string
            let event_id = event.id().as_ref();

            // Determine which menu the event belongs to and route to the appropriate handler
            log::debug!("Menu event received with ID: {}", event_id);

            match event_id {
                // App menu items
                "settings" => menu_app::handle_menu_settings(&app_handle),
                // "check_update" => menu_app::handle_menu_check_update(&app_handle),
                // File menu items
                "new_file" => menu_file::handle_menu_new_file(&app_handle),
                "new_project" => menu_file::handle_menu_new_project(&app_handle),
                "close_tab" => menu_file::handle_menu_close_tab(&app_handle),
                // View menu items
                "command_palette" => menu_view::handle_menu_command_palette(&app_handle),
                "toggle_panel_left" => menu_view::handle_menu_toggle_panel_left(&app_handle),
                "toggle_panel_right" => menu_view::handle_menu_toggle_panel_right(&app_handle),
                "toggle_panel_bottom" => menu_view::handle_menu_toggle_panel_bottom(&app_handle),
                // Window menu items
                "force_reload" => menu_window::handle_menu_force_reload(&app_handle),
                // Help menu items
                "open_devtool" => menu_help::handle_menu_open_devtool(&app_handle),
                "documentation" => menu_help::handle_menu_documentation(&app_handle),
                "send_feedback" => menu_help::handle_menu_send_feedback(&app_handle),
                "open_data_dir" => menu_help::handle_menu_open_data_dir(&app_handle),
                "open_log_file" => menu_help::handle_menu_open_log_file(&app_handle),
                // "open_kv_explorer" => menu_help::handle_menu_open_kv_explorer(&app_handle),
                _ => {
                    log::debug!("Unhandled menu event: {}", event_id);
                }
            }
        }
    }
}
