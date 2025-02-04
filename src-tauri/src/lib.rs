mod cmd;
mod tray;
mod window;

use tauri::menu::{AboutMetadata, MenuBuilder, MenuItemBuilder, SubmenuBuilder};

use cmd::example::greet;
use tray::setup_tray;
use window::create_main_window;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = tauri::Builder::default();
    let tauri_ctx = tauri::generate_context!();

    // Register Tauri plugins
    let builder = builder
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init());

    // Setup tray icon on desktop
    let builder = builder.setup(|app| {
        create_main_window(app)?;
        setup_tray(app)?;

        // Setup application menu
        // my custom settings menu item
        let settings = MenuItemBuilder::new("Settings...")
            .id("settings")
            .accelerator("CmdOrCtrl+,")
            .build(app)?;

        // my custom app submenu
        let app_submenu = SubmenuBuilder::new(app, "App")
            .about(Some(AboutMetadata { ..Default::default() }))
            .separator()
            .item(&settings)
            .separator()
            .services()
            .separator()
            .hide()
            .hide_others()
            .quit()
            .build()?;

        // ... any other submenus

        let menu = MenuBuilder::new(app)
            .items(&[
                &app_submenu,
                // ... include references to any other submenus
            ])
            .build()?;

        // set the menu
        app.set_menu(menu)?;

        // listen for menu item click events
        app.on_menu_event(move |_app, event| {
            if event.id() == settings.id() {
                println!("Open settings window triggered!");
            } else if event.id() == "toggle" {
                println!("toggle triggered!");
            }
        });

        Ok(())
    });

    // Finally, build and run the application
    builder
        .invoke_handler(tauri::generate_handler![greet])
        .build(tauri_ctx)
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            // RunEvent::ExitRequested { api, .. } => {
            //     api.prevent_exit();
            // }
            _ => {}
        });
}
