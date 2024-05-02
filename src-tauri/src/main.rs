// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use native_db::Database;
use once_cell::sync::Lazy;
use tauri::utils::{config::WindowEffectsConfig, WindowEffect};
use tauri::{App, Manager, Runtime};
use tauri::{WebviewUrl, WebviewWindow, WebviewWindowBuilder};

use tauri_tray_app::{core::*, meta};

static DB: Lazy<native_db::DatabaseBuilder> = Lazy::new(|| {
    let mut builder = native_db::DatabaseBuilder::new();
    builder.define::<state::Settings>().expect("failed to define model");
    builder
});

#[tokio::main]
async fn main() {
    // Initialize Tauri context and builder
    let tauri_ctx = tauri::generate_context!();
    let builder = tauri::Builder::default();

    // TODO wait until stable release
    // // This should be called as early in the execution of the app as possible.
    // // Only enable devtools instrumentation in development mode.
    // #[cfg(debug_assertions)]
    // // let builder = builder.plugin(tauri_plugin_devtools::init());
    // let builder = builder.plugin(
    //     tauri_plugin_devtools::Builder::default()
    //         .port(2722)
    //         .host(std::net::IpAddr::V4(std::net::Ipv4Addr::UNSPECIFIED))
    //         .init(),
    // );

    // Register Tauri plugins. Plugin log should be called as early
    // in the execution of the app as possible.
    let builder = builder
        .plugin(logger().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_os::init())
        // @ref: https://github.com/tauri-apps/tauri/discussions/8540#discussioncomment-8222136
        // .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_window_state::Builder::default().build());

    // @ref: https://docs.rs/tauri/latest/tauri/struct.Builder.html#method.enable_macos_default_menu
    #[cfg(target_os = "macos")]
    let builder = builder.enable_macos_default_menu(true);

    // Setup Tauri application builder
    let builder = builder.setup(move |app| {
        setup_application_state(app);
        setup_main_window(app)?;

        #[cfg(target_os = "linux")]
        {
            let db_state: tauri::State<Database> = app.state();
            let theme = theme::saved_theme_value(db_state);
            let _ = theme::set_theme(theme, app.app_handle());
        }

        #[cfg(desktop)] // TODO wait until next release
        app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;

        Ok(())
    });

    // Configure window event handlers
    let builder = builder.on_window_event(|window, event| match event {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            if window.label() == meta::MAIN_WINDOW {
                // window.app_handle().runtime_handle.set_activation_policy(tauri::ActivationPolicy::Accessory);
                window.hide().expect("failed to hide window");
                api.prevent_close();
            }
        }
        _ => {}
    });

    // Build Tauri application
    let mut main_app = builder
        .invoke_handler(tauri::generate_handler![
            theme::get_theme,
            theme::set_theme,
            cmd::open_settings_window,
            cmd::open_with_shell,
            cmd::open_log_file,
            cmd::open_log_directory,
            cmd::open_data_directory,
            cmd::toggle_devtools,
            state::save_setting,
            state::get_setting,
            state::get_app_settings,
            state::get_settings_data,
        ])
        .build(tauri_ctx)
        .expect("error while running tauri application");

    // Set activation policy to `Accessory` to prevent the app icon from showing on the dock.
    #[cfg(target_os = "macos")]
    main_app.set_activation_policy(tauri::ActivationPolicy::Regular);

    // Finally, run the application
    main_app.run(|app, event| match event {
        tauri::RunEvent::Ready {} => {
            #[cfg(any(target_os = "macos", target_os = "windows"))]
            {
                let db_state: tauri::State<Database> = app.state();
                let theme = theme::saved_theme_value(db_state);
                let _ = theme::set_theme(theme, app.clone());
            }
        }
        tauri::RunEvent::ExitRequested { api, .. } => {
            log::debug!("Exit requested");
            api.prevent_exit();
        }
        _ => {}
    });
}

fn logger() -> tauri_plugin_log::Builder {
    use tauri_plugin_log::fern::colors::ColoredLevelConfig;
    use tauri_plugin_log::WEBVIEW_TARGET;
    use tauri_plugin_log::{Target, TargetKind, TimezoneStrategy};

    let mut log_plugin_builder = tauri_plugin_log::Builder::new()
        .level_for("tauri", log::LevelFilter::Error)
        .level_for("hyper", log::LevelFilter::Off)
        .level_for("tao", log::LevelFilter::Off)
        .level_for("wry", log::LevelFilter::Off)
        .level_for("tracing::span", log::LevelFilter::Off)
        .level_for("reqwest::connect", log::LevelFilter::Off)
        .timezone_strategy(TimezoneStrategy::UseLocal)
        .rotation_strategy(tauri_plugin_log::RotationStrategy::KeepOne)
        .with_colors(ColoredLevelConfig::default());

    let target_stdout = Target::new(TargetKind::Stdout);
    let target_logdir = Target::new(TargetKind::LogDir {
        file_name: Some(String::from(meta::LOG_FILENAME)),
    });
    let target_webview = Target::new(TargetKind::Webview).filter(|metadata| metadata.target() == WEBVIEW_TARGET);

    let log_level = if cfg!(debug_assertions) {
        log::LevelFilter::Debug
    } else {
        log::LevelFilter::Info
    };

    log_plugin_builder = log_plugin_builder
        .targets([target_stdout, target_logdir, target_webview])
        .level(log_level);

    log_plugin_builder
}

fn setup_application_state<R: Runtime>(app: &App<R>) {
    log::debug!("Setting up global state");

    let db_file_path = app
        .path()
        .resolve(meta::DB_FILENAME, tauri::path::BaseDirectory::AppConfig)
        .expect("failed to get db file path");

    // Create directory if it doesn't exist
    let config_dir = db_file_path.parent().expect("failed to get config directory");

    // Create directory if it doesn't exist
    if !config_dir.exists() {
        std::fs::create_dir_all(config_dir).expect("failed to create config directory");
    }

    #[cfg(debug_assertions)]
    log::debug!("Config path: {}", db_file_path.display());

    // Create with a file path to persist the database
    let db = DB.create(db_file_path).expect("failed to create database");

    // You can migrate the database here, that can be time consuming.
    log::debug!("Running app config migration");
    let tx = db.rw_transaction().expect("failed to create transaction");

    tx.migrate::<state::Settings>().expect("failed to migrate");
    tx.commit().expect("failed to commit migration");

    log::debug!("App config migration succeed");

    // Add the database to the application state
    app.handle().manage(db);
}

fn setup_main_window<R: Runtime>(app: &App<R>) -> tauri::Result<WebviewWindow<R>> {
    let mut wb = WebviewWindowBuilder::new(app, meta::MAIN_WINDOW, WebviewUrl::default());

    #[cfg(all(desktop, not(test)))]
    {
        let app_title = &app.package_info().name;
        let user_agent = utils::get_app_user_agent(app.handle());

        wb = wb
            .title(app_title)
            .initialization_script(meta::JS_INIT_SCRIPT)
            .user_agent(&user_agent)
            .min_inner_size(meta::MAIN_WINDOW_WIDTH, meta::MAIN_WINDOW_HEIGHT)
            .accept_first_mouse(true)
            .content_protected(false)
            .enable_clipboard_access()
            .resizable(true)
            .focused(true)
            .shadow(true);
    }

    #[cfg(target_os = "macos")]
    {
        let app_menu = tauri_tray_app::core::menu::init(app.app_handle())?;
        let effects = WindowEffectsConfig {
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
            state: None,
            color: None,
        };

        wb = wb
            .decorations(true)
            .transparent(true)
            .title_bar_style(tauri::TitleBarStyle::Overlay)
            .hidden_title(true)
            .effects(effects)
            .menu(app_menu);
    }

    #[cfg(target_os = "windows")]
    {
        // @ref: https://github.com/tauri-apps/tauri/discussions/5988#discussioncomment-8579762
        let browser_args = "--enable-features=OverlayScrollbar,msOverlayScrollbarWinStyle";

        let effects = WindowEffectsConfig {
            radius: Some(10.0),
            effects: vec![
                WindowEffect::Mica,
                WindowEffect::MicaDark,
                WindowEffect::MicaLight,
                WindowEffect::Tabbed,
                WindowEffect::TabbedDark,
                WindowEffect::TabbedLight,
                // WindowEffect::Blur, // Bad performance when resizing/dragging the window on Windows 11 build 22621.
                // WindowEffect::Acrylic, // Bad performance when resizing/dragging the window on Windows 10 v1903+ and Windows 11 build 22000.
            ],
            state: None,
            color: None,
        };

        wb = wb
            .decorations(true)
            .effects(effects)
            .additional_browser_args(browser_args);
    }

    // Finally, build the webview
    wb.build()
}
