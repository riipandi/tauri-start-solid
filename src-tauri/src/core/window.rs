//! Window management module
//!
//! Handles window creation, configuration, and platform-specific customizations.

use tauri::{App, LogicalPosition, Manager, Runtime, TitleBarStyle};
use tauri::{WebviewUrl, WebviewWindow, WebviewWindowBuilder};

/// The name of the main window
pub const MAIN_WINDOW_ID: &str = "main";

// Main window dimensions
const MAIN_WINDOW_WIDTH: f64 = 430.; // 830.
const MAIN_WINDOW_HEIGHT: f64 = 320.; // 570.

/// Sets up the main application window with platform-specific configurations
///
/// # Arguments
/// * `app` - The Tauri application instance
///
/// # Returns
/// * `Result<WebviewWindow, Box<dyn std::error::Error>>` - The created window or an error
pub fn setup_main_window<R: Runtime>(app: &App<R>) -> Result<WebviewWindow<R>, Box<dyn std::error::Error>> {
    // Create a window builder with the default URL
    // - MacOS: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15"
    let mut win_builder = WebviewWindowBuilder::new(app, MAIN_WINDOW_ID, WebviewUrl::default())
        .title("Torao")
        .min_inner_size(MAIN_WINDOW_WIDTH, MAIN_WINDOW_HEIGHT)
        .inner_size(830.0, 570.0)
        .resizable(true);

    // Apply platform-specific configurations
    win_builder = apply_platform_config(win_builder);

    // Build the window and handle potential errors
    let window = win_builder.build()?;

    // OPTIONAL: Configure platform-specific window settings if needed

    Ok(window)
}

/// Apply platform-specific configurations to the window builder
///
/// # Arguments
/// * `win_builder` - The window builder to configure
///
/// # Returns
/// * `WebviewWindowBuilder` - The configured window builder
fn apply_platform_config<'a, R: Runtime, M: Manager<R>>(
    mut win_builder: WebviewWindowBuilder<'a, R, M>,
) -> WebviewWindowBuilder<'a, R, M> {
    // Platform-specific configurations
    #[cfg(target_os = "macos")]
    {
        // On macOS, use TitleBarStyle::Overlay with higher opacity
        // TitleBar height 38px: LogicalPosition::new(13., 21.5);
        // TitleBar height 42px: LogicalPosition::new(15., 23.);
        win_builder = win_builder
            .traffic_light_position(LogicalPosition::new(13., 21.5))
            .title_bar_style(TitleBarStyle::Overlay)
            .hidden_title(true)
            .decorations(true);
    }

    #[cfg(not(target_os = "macos"))]
    {
        // On Windows/Linux, disable decorations completely for custom titlebar
        win_builder = win_builder.decorations(false).shadow(true); // Enable shadow for better aesthetics
    }

    win_builder
}
