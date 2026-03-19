//! Window management module
//!
//! Handles window creation, configuration, and platform-specific customizations.

use tauri::async_runtime;
use tauri::{App, LogicalPosition, Manager, Runtime, TitleBarStyle};
use tauri::{AppHandle, LogicalSize, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

/// Window name variables
pub const MAIN_WINDOW_ID: &str = "main";
pub const SETTINGS_WINDOW_ID: &str = "settings";

/// Sets up the main application window with platform-specific configurations
///
/// # Arguments
/// * `app` - The Tauri application instance
///
/// # Returns
/// * `Result<WebviewWindow, Box<dyn std::error::Error>>` - The created window or an error
pub fn setup_main_window<R: Runtime>(app: &App<R>) -> Result<WebviewWindow<R>, Box<dyn std::error::Error>> {
    // Check if window already exists (created by tauri.conf.json)
    if let Some(window) = app.get_webview_window(MAIN_WINDOW_ID) {
        log::debug!("Window '{}' already exists, returning existing window", MAIN_WINDOW_ID);
        return Ok(window);
    }

    // Create a window builder with the default URL
    // - MacOS: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15"
    let mut win_builder = WebviewWindowBuilder::new(app, MAIN_WINDOW_ID, WebviewUrl::default())
        .title(app.config().product_name.as_deref().unwrap_or("Tauri App"))
        .min_inner_size(430., 320.)
        .inner_size(830.0, 570.0)
        .resizable(true);

    // Apply platform-specific configurations to the window builder
    #[cfg(target_os = "macos")]
    {
        // On macOS, use TitleBarStyle::Overlay with higher opacity
        // TitleBar height 38px: LogicalPosition::new(13., 21.5);
        // TitleBar height 42px: LogicalPosition::new(15., 23.);
        win_builder = win_builder
            .traffic_light_position(LogicalPosition::new(13., 21.5))
            .title_bar_style(TitleBarStyle::Overlay)
            .hidden_title(true)
            .decorations(true)
            .transparent(false);
    }

    #[cfg(not(target_os = "macos"))]
    {
        // On Windows/Linux, disable decorations completely for custom titlebar
        win_builder = win_builder.decorations(false).shadow(true); // Enable shadow for better aesthetics
    }

    // Build the window and handle potential errors
    let window = win_builder.build()?;

    // OPTIONAL: Configure platform-specific window settings if needed

    Ok(window)
}

/// Creates or shows the settings window using AppHandle
///
/// # Arguments
/// * `app_handle` - The Tauri application handle
///
/// # Returns
/// * `Result<WebviewWindow<R>, Box<dyn std::error::Error>>` - The created window or an error
pub fn create_settings_window<R: Runtime>(
    app_handle: &AppHandle<R>,
) -> Result<WebviewWindow<R>, Box<dyn std::error::Error>> {
    // Check if the settings window already exists
    if let Some(settings_window) = app_handle.get_webview_window(SETTINGS_WINDOW_ID) {
        // If it exists, show it and bring it to focus
        settings_window.show()?;
        settings_window.set_focus()?;
        return Ok(settings_window);
    }

    // Get the main window to set as parent
    let main_window = app_handle
        .get_webview_window(crate::core::MAIN_WINDOW_ID)
        .ok_or_else(|| Box::<dyn std::error::Error>::from("Main window not found"))?;

    // Create a window builder with settings-specific configurations
    let settings_url = WebviewUrl::App("/settings/general".into());

    // Create a fixed-size window with exact dimensions
    let mut win_builder = WebviewWindowBuilder::new(app_handle, SETTINGS_WINDOW_ID, settings_url)
        .title("Settings")
        // Set exact size and disable resizing
        .inner_size(760., 630.)
        .min_inner_size(760., 630.)
        .max_inner_size(760., 630.)
        .resizable(false)
        .minimizable(false)
        .maximizable(false)
        .closable(true)
        .content_protected(false)
        .skip_taskbar(true)
        .accept_first_mouse(true)
        .decorations(true)
        .focused(true)
        .shadow(true);

    // Set parent window - this returns a Result so we need to handle it
    win_builder = win_builder.parent(&main_window)?;

    // Apply platform-specific configurations to the window builder
    #[cfg(target_os = "macos")]
    {
        // On macOS, use TitleBarStyle::Overlay with higher opacity
        win_builder = win_builder
            .traffic_light_position(LogicalPosition::new(11., 20.5))
            .title_bar_style(TitleBarStyle::Overlay)
            .hidden_title(true)
            .decorations(true)
            .transparent(false);
    }

    #[cfg(not(target_os = "macos"))]
    {
        // On Windows/Linux, disable decorations completely for custom titlebar
        win_builder = win_builder.decorations(false).shadow(true);
    }

    // Build the window and handle potential errors
    let window = win_builder.build()?;

    // OPTIONAL: Configure platform-specific window settings if needed

    // Fix: Force the window size after creation to ensure it's correct
    // Using Tauri's async_runtime instead of std::thread for better integration
    let window_clone = window.clone();
    async_runtime::spawn(async move {
        // Small delay to ensure window is fully created
        async_runtime::spawn_blocking(|| {
            std::thread::sleep(std::time::Duration::from_millis(100));
        })
        .await
        .unwrap();

        // Try to set the size again after a short delay
        if let Err(e) = window_clone.set_size(LogicalSize::new(760., 630.)) {
            log::error!("Failed to set settings window size: {}", e);
        }
    });

    Ok(window)
}
