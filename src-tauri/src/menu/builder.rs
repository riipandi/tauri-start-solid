use tauri::menu::{AboutMetadata, Menu, PredefinedMenuItem};
use tauri::menu::{MenuBuilder, MenuItemBuilder, SubmenuBuilder};
use tauri::Runtime;

pub fn create_app_menu<R: Runtime>(app: &tauri::App<R>) -> tauri::Result<Menu<R>> {
    // Create settings menu item (custom menu item)
    let settings = MenuItemBuilder::new("Settings...")
        .id("settings")
        .accelerator("CmdOrCtrl+,")
        .build(app)?;

    // Create check for updates menu item (custom menu item)
    let check_update = MenuItemBuilder::new("Check for Updates...")
        .id("check_update")
        .build(app)?;

    // Create App menu (macOS only)
    #[cfg(target_os = "macos")]
    let app_menu = SubmenuBuilder::new(app, "App")
        .about(Some(AboutMetadata { ..Default::default() }))
        .separator()
        .item(&check_update)
        .separator()
        .item(&settings)
        .separator()
        .services()
        .separator()
        .hide()
        .hide_others()
        .show_all()
        .separator()
        .quit()
        .build()?;

    // Create File menu
    #[cfg(target_os = "macos")]
    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&PredefinedMenuItem::close_window(app, None)?)
        .build()?;

    #[cfg(not(target_os = "macos"))]
    let file_menu = SubmenuBuilder::new(app, "File")
        .item(&settings)
        .separator()
        .item(&PredefinedMenuItem::close_window(app, None)?)
        .build()?;

    // Create Edit menu
    let edit_menu = SubmenuBuilder::new(app, "Edit")
        .item(&PredefinedMenuItem::undo(app, None)?)
        .item(&PredefinedMenuItem::redo(app, None)?)
        .separator()
        .item(&PredefinedMenuItem::cut(app, None)?)
        .item(&PredefinedMenuItem::copy(app, None)?)
        .item(&PredefinedMenuItem::paste(app, None)?)
        .item(&PredefinedMenuItem::select_all(app, None)?)
        .build()?;

    // Create View menu
    let view_menu = SubmenuBuilder::new(app, "View")
        .item(&PredefinedMenuItem::fullscreen(app, None)?)
        .build()?;

    // Custom menu for Window menu
    let force_reload = MenuItemBuilder::new("Force Reload")
        .id("force_reload")
        .accelerator("CmdOrCtrl+Shift+R")
        .build(app)?;

    // Create Window menu
    let window_menu = SubmenuBuilder::new(app, "Window")
        .item(&PredefinedMenuItem::minimize(app, None)?)
        .item(&PredefinedMenuItem::close_window(app, None)?)
        .separator()
        .item(&force_reload)
        .build()?;

    // Custom menu for Help menu
    let open_devtool = MenuItemBuilder::new("Toggle Developer Tools")
        .id("devtool")
        .accelerator("CmdOrCtrl+Alt+I")
        .build(app)?;

    let documentation = MenuItemBuilder::new("Documentation").id("docs").build(app)?;
    let send_feedback = MenuItemBuilder::new("Send Feedback").id("feedback").build(app)?;
    let open_data_dir = MenuItemBuilder::new("Open Data Directory").id("data_dir").build(app)?;

    // Create Help menu
    let help_menu = SubmenuBuilder::new(app, "Help")
        .item(&documentation)
        .item(&send_feedback)
        .separator()
        .item(&open_devtool)
        .item(&open_data_dir)
        .build()?;

    // Build final menu with all submenus
    #[cfg(target_os = "macos")]
    let menu = MenuBuilder::new(app)
        .items(&[&app_menu, &file_menu, &edit_menu, &view_menu, &window_menu, &help_menu])
        .build()?;

    #[cfg(not(target_os = "macos"))]
    let menu = MenuBuilder::new(app)
        .items(&[&file_menu, &edit_menu, &view_menu, &window_menu, &help_menu])
        .build()?;

    Ok(menu)
}
