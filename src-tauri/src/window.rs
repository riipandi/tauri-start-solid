use anyhow::Result;
use tauri::utils::{config::WindowEffectsConfig, WindowEffect, WindowEffectState};
use tauri::{Manager, TitleBarStyle, WebviewUrl, WebviewWindow, WebviewWindowBuilder};

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
        .fullscreen(false)
        .initialization_script(JS_INIT_SCRIPT)
        .visible(true)
        .center();

    #[cfg(target_os = "macos")]
    let win_builder = win_builder
        .hidden_title(true)
        .transparent(true)
        .title_bar_style(TitleBarStyle::Overlay)
        .effects(setup_window_effects());

    let window = win_builder.build()?;

    #[cfg(target_os = "macos")]
    setup_window_border(&window);

    Ok(())
}

// Setup settings window. Set visible to false if you want to hide the settings window on startup.
// This is useful for testing tray icon on desktop or you want show an onboarding screen first.
pub fn create_settings_window(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.app_handle();
    let main_window = handle
        .get_webview_window("main")
        .ok_or_else(|| anyhow::anyhow!("Main window not found"))?;

    // Handle main window visibility
    if !main_window.is_visible()? {
        main_window.show()?;
        main_window.set_focus()?;
    }

    // Create or show settings window
    if handle.get_webview_window("settings").is_none() {
        let setting_window = WebviewWindowBuilder::new(handle, "settings", WebviewUrl::App("/settings".into()))
            .title("Settings")
            .initialization_script(JS_INIT_SCRIPT)
            .min_inner_size(600.0, 400.0)
            .max_inner_size(600.0, 400.0)
            .inner_size(600.0, 400.0)
            .resizable(false)
            .minimizable(false)
            .maximizable(false)
            .closable(true)
            .content_protected(false)
            .skip_taskbar(true)
            .accept_first_mouse(true)
            .decorations(true)
            .focused(true)
            .shadow(true)
            .visible(false)
            .parent(&main_window);

        #[cfg(target_os = "macos")]
        let setting_window = setting_window?
            .transparent(true)
            .hidden_title(true)
            .title_bar_style(TitleBarStyle::Overlay)
            .effects(setup_window_effects());

        let window = setting_window.build()?;

        #[cfg(target_os = "macos")]
        setup_window_border(&window);
    } else {
        let setting_window = handle
            .get_webview_window("settings")
            .ok_or_else(|| anyhow::anyhow!("Settings window not found"))?;

        setting_window.show()?;
        setting_window.set_focus()?;
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

#[cfg(target_os = "macos")]
fn setup_window_border(window: &WebviewWindow) {
    use cocoa::appkit::{NSColor, NSWindow};
    use cocoa::base::{id, nil};

    // Get the NSWindow object from the window handle and set the background color
    let ns_window = window.ns_window().unwrap_or_else(|_| panic!("Failed to get NSWindow")) as id;

    unsafe {
        let bg_color = NSColor::colorWithRed_green_blue_alpha_(nil, 50.0 / 255.0, 158.0 / 255.0, 163.5 / 255.0, 1.0);
        ns_window.setBackgroundColor_(bg_color);
    }
}
