#[cfg(desktop)]
mod builder;
#[cfg(desktop)]
mod handler;

use anyhow::Result;
use tauri::Runtime;

#[cfg(desktop)]
use self::builder::create_app_menu;
#[cfg(desktop)]
use self::handler::MenuEventHandler;

#[cfg(desktop)]
pub fn setup_menu<R: Runtime>(app: &tauri::App<R>) -> Result<()> {
    // Create event handler
    let handler = MenuEventHandler::<R>::new(app);

    // Create and set menu
    let menu = create_app_menu(app)?;
    app.set_menu(menu)?;

    // Register menu event handler
    app.on_menu_event(move |app_handle, event| handler.handle_menu_event()(app_handle.clone(), event));

    Ok(())
}

#[cfg(not(desktop))]
pub fn setup_menu<R: Runtime>(_app: &tauri::App<R>) -> Result<()> {
    Ok(())
}
