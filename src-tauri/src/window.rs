use anyhow::Result;
use tauri::utils::{config::WindowEffectsConfig, WindowEffect, WindowEffectState};
use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};

use crate::config::JS_INIT_SCRIPT;

// Setup main window. Set visible to false if you want to hide the main window on startup.
// This is useful for testing tray icon on desktop or you want show an onboarding screen first.
pub fn create_main_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("Tauri App")
        .min_inner_size(425.00, 550.00)
        .inner_size(800.0, 600.0)
        .resizable(true)
        .decorations(true)
        .transparent(true)
        .hidden_title(true)
        .fullscreen(false)
        .initialization_script(JS_INIT_SCRIPT)
        .visible(true)
        .center();

    #[cfg(target_os = "macos")]
    let win_builder = win_builder
        .title_bar_style(TitleBarStyle::Overlay)
        .effects(setup_window_effects());

    let window = win_builder.build()?;

    #[cfg(target_os = "macos")]
    {
        use cocoa::appkit::{NSColor, NSWindow};
        use cocoa::base::{id, nil};

        // Get the NSWindow object from the window handle and set the background color
        let ns_window = window.ns_window().unwrap_or_else(|_| panic!("Failed to get NSWindow")) as id;

        unsafe {
            let bg_color =
                NSColor::colorWithRed_green_blue_alpha_(nil, 50.0 / 255.0, 158.0 / 255.0, 163.5 / 255.0, 1.0);
            ns_window.setBackgroundColor_(bg_color);
        }
    }

    Ok(())
}

#[cfg(target_os = "macos")]
fn setup_window_effects() -> WindowEffectsConfig {
    WindowEffectsConfig {
        radius: Some(10.0),
        effects: vec![
            WindowEffect::ContentBackground,
            WindowEffect::FullScreenUI,
            WindowEffect::HeaderView,
            WindowEffect::HudWindow,
            WindowEffect::Menu,
            WindowEffect::Popover,
            WindowEffect::Selection,
            WindowEffect::Sheet,
            WindowEffect::Sidebar,
            WindowEffect::Titlebar,
            WindowEffect::Tooltip,
            WindowEffect::UnderPageBackground,
            WindowEffect::UnderWindowBackground,
            WindowEffect::WindowBackground,
        ],
        state: Some(WindowEffectState::FollowsWindowActiveState),
        color: None,
    }
}
